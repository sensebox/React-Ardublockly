import * as Blockly from 'blockly/core';
import { getColour } from '../helpers/colour';
import * as Types from '../helpers/types'

/**
 * MQTT Blocks
 */

Blockly.Blocks["sensebox_mqtt_setup"] = {
    init: function () {

        //this.setTooltip(Blockly.Msg.senseBox_wifi_);
        this.setHelpUrl('');
        this.setColour(getColour().mqtt);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_mqtt_init);
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_mqtt_server)
            .appendField(new Blockly.FieldTextInput("Server"), "server");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_mqtt_port)
            .appendField(new Blockly.FieldTextInput("Port"), "port");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_mqtt_username)
            .appendField(new Blockly.FieldTextInput("Username"), "username");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_mqtt_password)
            .appendField(new Blockly.FieldTextInput("Password"), "password");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};


Blockly.Blocks["sensebox_mqtt_publish"] = {
    init: function () {
        this.setColour(getColour().mqtt);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_mqtt_publish);
        this.appendValueInput('value')
            .setCheck(null)
            .appendField('Feed')
            .appendField(new Blockly.FieldTextInput('Feedname'), 'publishfeed');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.Blocks["sensebox_mqtt_subscribe"] = {
    init: function () {
        this.setColour(getColour().mqtt);
        this.appendDummyInput()
            .appendField(Blockly.Msg.sensebox_mqtt_subscribe);
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput('Feedname'), 'subscribefeed');
        this.setOutput(true, null);
    }
};
