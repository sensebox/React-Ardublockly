export const detectWhitespacesAndReturnReadableResult = (word) => {
  var readableResult = '';
  var space = false;
  for(var i = 0; i < word.length; i++){
    var letter = word[i];
    if(/\s/g.test(letter)){
      space = true;
    }
    else {
      readableResult += space ? letter.toUpperCase() : letter;
      space = false;
    }
  }
  return readableResult;
};
