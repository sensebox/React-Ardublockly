import Interpreter from "js-interpreter";

export default function initDom(interpreter, globalObject) {
  // Given a native Node or Element, create a pseudo version.
  function nativeToPseudoDom_(native) {
    if (native === null) {
      return null;
    }
    if (nativeToPseudoDom_.cache_.has(native)) {
      return nativeToPseudoDom_.cache_.get(native);
    }
    var pseudoClass;
    if (native instanceof Element) {
      pseudoClass = pseudoElementClass;
    } else if (native instanceof Node) {
      pseudoClass = pseudoNodeClass;
    } else {
      throw Error("Only Node and Element are supported.");
    }
    var pseudo = interpreter.createObject(pseudoClass);
    // Link this pseudo DOM object to the native DOM object.
    pseudo.nativeNode = native;
    nativeToPseudoDom_.cache_.set(native, pseudo);
    return pseudo;
  }
  // Cache pseudo DOM objects so that there are no duplicates.
  nativeToPseudoDom_.cache_ = new WeakMap();

  // Create 'Node' class.  Constructable, but not with 'new'.
  var wrapper = function Node() {
    throw TypeError("Illegal constructor.");
  };
  var pseudoNodeClass = interpreter.createNativeFunction(wrapper, true);
  interpreter.setProperty(globalObject, "Node", pseudoNodeClass);
  var pseudoNodeProto = interpreter.getProperty(pseudoNodeClass, "prototype");

  // Create 'Element' class.  Constructable, but not with 'new'.
  var wrapper = function Element() {
    throw TypeError("Illegal constructor.");
  };
  var pseudoElementClass = interpreter.createNativeFunction(wrapper, true);
  interpreter.setProperty(globalObject, "Element", pseudoElementClass);
  var pseudoElementProto = interpreter.createObject(pseudoNodeClass);
  interpreter.setProperty(pseudoElementClass, "prototype", pseudoElementProto);

  // Define 'Node.hasChildNodes' function.
  var wrapper = function hasChildNodes() {
    return this.nativeNode.hasChildNodes();
  };
  interpreter.setProperty(
    pseudoNodeProto,
    "hasChildNodes",
    interpreter.createNativeFunction(wrapper),
  );

  // Define 'Node.removeChild' function.
  var wrapper = function removeChild(childNode) {
    return nativeToPseudoDom_(
      this.nativeNode.removeChild(childNode.nativeNode),
    );
  };
  interpreter.setProperty(
    pseudoNodeProto,
    "removeChild",
    interpreter.createNativeFunction(wrapper),
  );

  // Define 'Node.firstChild' property.  It uses a getter (no setter).
  var getterWrapper = function () {
    return this.nativeNode.firstChild;
  };
  var firstChildGetter = interpreter.createNativeFunction(getterWrapper, false);
  interpreter.setProperty(
    pseudoNodeProto,
    "firstChild",
    Interpreter.VALUE_IN_DESCRIPTOR,
    { get: firstChildGetter },
  );

  // Define 'Node.lastChild' property.  It uses a getter (no setter).
  var getterWrapper = function () {
    return nativeToPseudoDom_(this.nativeNode.lastChild);
  };
  var firstChildGetter = interpreter.createNativeFunction(getterWrapper, false);
  interpreter.setProperty(
    pseudoNodeProto,
    "lastChild",
    Interpreter.VALUE_IN_DESCRIPTOR,
    { get: firstChildGetter },
  );

  // Define 'Node.parentNode' property.  It uses a getter (no setter).
  var getterWrapper = function () {
    return nativeToPseudoDom_(this.nativeNode.parentNode);
  };
  var parentNodeGetter = interpreter.createNativeFunction(getterWrapper, false);
  interpreter.setProperty(
    pseudoNodeProto,
    "parentNode",
    Interpreter.VALUE_IN_DESCRIPTOR,
    { get: parentNodeGetter },
  );

  // Define 'Element.innerHTML' property.  It uses a getter and setter.
  var getterWrapper = function () {
    return this.nativeNode.innerHTML;
  };
  var innerHTMLGetter = interpreter.createNativeFunction(getterWrapper, false);
  var setterWrapper = function (text) {
    this.nativeNode.innerHTML = text;
  };
  var innerHTMLSetter = interpreter.createNativeFunction(setterWrapper, false);
  interpreter.setProperty(
    pseudoElementProto,
    "innerHTML",
    Interpreter.VALUE_IN_DESCRIPTOR,
    { get: innerHTMLGetter, set: innerHTMLSetter },
  );

  // Define 'Element.appendChild' function.
  var wrapper = function appendChild(pseudoChild) {
    this.nativeNode.appendChild(pseudoChild.nativeNode);
    return pseudoChild;
  };
  interpreter.setProperty(
    pseudoElementProto,
    "appendChild",
    interpreter.createNativeFunction(wrapper),
  );

  // Create 'document' global object.
  var pseudoDocument = interpreter.nativeToPseudo({});
  interpreter.setProperty(globalObject, "document", pseudoDocument);

  // Define 'document.getElementById' function.
  var wrapper = function getElementById(id) {
    return nativeToPseudoDom_(document.getElementById(id));
  };
  interpreter.setProperty(
    pseudoDocument,
    "getElementById",
    interpreter.createNativeFunction(wrapper),
  );

  // Define 'document.createElement' function.
  var wrapper = function createElement(tagName) {
    return nativeToPseudoDom_(document.createElement(tagName));
  };
  interpreter.setProperty(
    pseudoDocument,
    "createElement",
    interpreter.createNativeFunction(wrapper),
  );

  // Define 'document.createTextNode' function.
  var wrapper = function createTextNode(text) {
    return nativeToPseudoDom_(document.createTextNode(text));
  };
  interpreter.setProperty(
    pseudoDocument,
    "createTextNode",
    interpreter.createNativeFunction(wrapper),
  );
}
