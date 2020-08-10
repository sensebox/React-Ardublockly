import Blockly from 'blockly';


/* Wifi connection and openSenseMap Blocks*/
Blockly.Arduino.sensebox_wifi = function (block) {
    var pw = this.getFieldValue('Password');
    var ssid = this.getFieldValue('SSID');
    Blockly.Arduino.libraries_['library_senseBoxMCU'] = '#include "SenseBoxMCU.h"';
    Blockly.Arduino.definitions_['define_network'] = 'Bee* b = new Bee();';
    if (pw === "") {
        Blockly.Arduino.setupCode_['sensebox_network'] = 'b->connectToWifi("' + ssid + '");\ndelay(1000);';
    } else
        Blockly.Arduino.setupCode_['sensebox_network'] = 'b->connectToWifi("' + ssid + '","' + pw + '");\ndelay(1000);';
    var code = '';
    return code;
};

Blockly.Arduino.sensebox_startap = function (block) {
    var ssid = this.getFieldValue('SSID');
    Blockly.Arduino.libraries_['library_senseBoxMCU'] = '#include "SenseBoxMCU.h"';
    Blockly.Arduino.definitions_['define_network'] = 'Bee* b = new Bee();';
    Blockly.Arduino.setupCode_['sensebox_network'] = 'b->startAP("' + ssid + '");'
    var code = '';
    return code;
};