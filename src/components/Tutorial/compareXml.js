export const checkXml = (originalXmlString, userXmlString) => {
  var originalXml = parseXml(originalXmlString);
  var userXml = parseXml(userXmlString);
  return compareXml(originalXml, userXml);
};

const parseXml = (xmlString) => {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlString, "text/xml");
  return xmlDoc;
};

const compareNumberOfBlocks = (originalBlocks, userBlocks) => {
  if(originalBlocks.length !== userBlocks.length){
    if(originalBlocks.length > userBlocks.length){
      return {text: 'Es wurden zu wenig Blöcke verwendet.', type: 'error'};
    }
    else {
      return {text: 'Es wurden zu viele Blöcke verwendet.', type: 'error'};
    }
  }
};

const compareBlockType = (originalBlock, userBlock, index) => {
  if(originalBlock.attributes['type'].value !== userBlock.attributes['type'].value){
    return {text: `Es wurde ein falscher Blocktyp an Position ${index+1} verwendet`, type: 'error'};
  }
};

const compareParentBlock = (originalBlock, userBlock, index) => {
  // using parentNode instead of parenElement
  // see https://stackoverflow.com/questions/8685739/difference-between-dom-parentnode-and-parentelement
  if(originalBlock.parentNode.attributes['name']){
    if(userBlock.parentNode.attributes['name']){
      // do the blocks have the same name-properties?
      if(originalBlock.parentNode.attributes['name'].value !== userBlock.parentNode.attributes['name'].value){
        if(userBlock.parentNode.attributes['name'].value === 'LOOP_FUNC' || userBlock.parentNode.attributes['name'].value === 'SETUP_FUNC'){
          return {text: `Der Block mit dem Typen '${userBlock.attributes['type'].value}' wurde irrtümlicherweise in die ${userBlock.parentNode.attributes['name'].value === 'SETUP_FUNC' ? 'Setup' : 'Endlosschleifen'}-Funktion geschrieben.
                        Verschiebe den gesamten Block (und alle dazugehörigen Blöcke) in die ${userBlock.parentNode.attributes['name'].value !== 'SETUP_FUNC' ? 'Setup' : 'Endlosschleifen'}-Funktion.`, type: 'error'};
        }
        // TODO: has a block two name-properties?
        return {text: `Der Block mit dem Typen '${userBlock.attributes['type'].value}' hat ein falsches 'name'-Attribut`, type: 'error'};
      }
    }
    // user-block has not a name-attribute
    else {
      // do the user-block has a xmlns-attribute -> user-block is not connected
      if(userBlock.parentNode.attributes['xmlns']){
        return {text: `Der Block mit dem Typen '${userBlock.attributes['type'].value}' hat keine Verbindung zu einem anderen Block.`, type: 'error'};
      }
      // user-block has not a xmlns- AND name-attribute
      else {
          return {text: `Der Block an Position ${index+1} ist falsch eingeordnet. Tipp: Block an Position ${index+1} einem vorherigen Block unterordnen.`, type: 'error'};
      }
    }
  }
};

const compareXml = (originalXml, userXml) => {
  var originalItemList = originalXml.getElementsByTagName("block");
  var userItemList = userXml.getElementsByTagName("block");

  // compare number of blocks
  var number = compareNumberOfBlocks(originalItemList, userItemList);
  if(number){return number;}

  for(var i=0; i < originalItemList.length; i++){
    // compare type
    var type = compareBlockType(originalItemList[i], userItemList[i], i);
    if(type){return type;}

    // compare name
    var parent = compareParentBlock(originalItemList[i], userItemList[i], i);
    if(parent){return parent;}
  }

  return {text: 'Super. Alles richtig!', type: 'success'};
};
