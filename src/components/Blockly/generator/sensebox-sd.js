import Blockly from 'blockly';


/* SD-Card Blocks using the Standard SD Library*/
/**
 * Code generator for variable (X) getter.
 * Arduino code: loop { X }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */

Blockly.Arduino.sensebox_sd_create_file = function (block) {
    var filename = this.getFieldValue('Filename');
    var res = filename.slice(0, 4);
    Blockly.Arduino.libraries_['library_spi'] = '#include <SPI.h>';
    Blockly.Arduino.libraries_['library_sd'] = '#include <SD.h>';
    Blockly.Arduino.definitions_['define_' + filename] = 'File dataFile' + res + ';';
    Blockly.Arduino.setupCode_['sensebox_sd'] = 'SD.begin(28);';
    Blockly.Arduino.setupCode_['sensebox_sd' + filename] = 'dataFile' + res + ' = SD.open("' + filename + '", FILE_WRITE);\ndataFile' + res + '.close();\n';
    var code = '';
    return code;
};

Blockly.Arduino.sensebox_sd_open_file = function (block) {
    var filename = this.getFieldValue('Filename');
    var res = filename.slice(0, 4);
    var branch = Blockly.Arduino.statementToCode(block, 'SD');
    var code = 'dataFile' + res + ' = SD.open("' + filename + '", FILE_WRITE);\n'
    code += branch;
    code += 'dataFile' + res + '.close();\n'
    return code;
};

Blockly.Arduino.sensebox_sd_write_file = function (block) {
    var res = filename.slice(0, 4);
    if (this.parentBlock_ != null) {
        var filename = this.getSurroundParent().getFieldValue('Filename');
    }
    var text = Blockly.Arduino.valueToCode(this, 'DATA', Blockly.Arduino.ORDER_ATOMIC) || '"Keine Eingabe"';
    var linebreak = this.getFieldValue('linebreak');
    if (linebreak == "TRUE") {
        linebreak = "ln";
    } else {
        linebreak = "";
    }
    if (text == "gps.getLongitude()" || text == "gps.getLatitude()") {
        var code = 'dataFile' + res + '.print' + linebreak + '(' + text + ',5);\n'
    }
    else {
        var code = 'dataFile' + res + '.print' + linebreak + '(' + text + ');\n'
    }
    return code;
};
