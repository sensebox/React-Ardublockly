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
    var blocks;
    if(originalBlocks.length > userBlocks.length){
      blocks = originalBlocks.length-userBlocks.length;
      return {text: `Es wurde${blocks === 1 ? '' : 'n'} ${blocks} Bl${blocks === 1 ? 'ock' : 'öcke'} zu wenig verwendet.`, type: 'error'};
    }
    else {
      blocks = userBlocks.length-originalBlocks.length;
      return {text: `Es wurde${blocks === 1 ? '' : 'n'} ${blocks} Bl${blocks === 1 ? 'ock' : 'öcke'} zu viel verwendet.`, type: 'error'};
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
  if(userBlock.attributes['disabled']){
    // user-block is not connected
    return {text: `Der Block mit dem Typen '${userBlock.attributes['type'].value}' hat keine Verbindung zu einem anderen Block.`, type: 'error'};
  }
  else if(originalBlock.parentNode.parentNode && originalBlock.parentNode.parentNode.attributes && originalBlock.parentNode.parentNode.attributes['type']){
    var type = compareBlockType(originalBlock.parentNode.parentNode, userBlock.parentNode.parentNode, index);
    if(type){
      return {text: `Der Block an Position ${index+1} ist falsch eingeordnet. Tipp: Block an Position ${index+1} einem vorherigen Block unterordnen.`, type: 'error'};
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

  return {text: 'Super, alles richtig! Kompiliere nun die benutzen Blöcke, um eine BIN-Datei zu erhalten und damit das Programm auf die senseBox zu spielen und ausführen zu können.', type: 'success'};
};
