import * as Blockly from 'blockly/core';
import { getColour } from '../helpers/colour';

/**
 * MQTT Blocks
 */

Blockly.Blocks["sensebox_mqtt_setup"] = {
    init: function () {

        //this.setTooltip(Blockly.Msg.senseBox_wifi_);
        this.setHelpUrl('');
        this.setColour(getColour().mqtt);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_mqtt_init)
            .appendField(new Blockly.FieldDropdown([["Adafruit IO", 'adafruitio'], ["DIOTY", 'dioty'], ["Other Service", 'custom']]), "service");
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
            .appendField(Blockly.Msg.senseBox_mqtt_password, "passwordmsg")
            .appendField(new Blockly.FieldTextInput("Password"), "password");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_mqtt_init_tooltip);
    },
    onchange: function (e) {
        let service = this.getFieldValue('service');
        switch (service) {
            case 'adafruitio':
                this.getField('server').setValue("io.adafruit.com");
                this.getField('port').setValue("1883");
                this.getField('passwordmsg').setValue("Adafruit IO Key");
                break;
            case 'dioty':
                this.getField('server').setValue("mqtt.dioty.co");
                this.getField('port').setValue("1883");
                this.getField('passwordmsg').setValue(Blockly.Msg.senseBox_mqtt_password);
                break;

            case "custom":
                break;
            default:

                break;
        }
    }
};


Blockly.Blocks["sensebox_mqtt_publish"] = {
    init: function () {
        this.setColour(getColour().mqtt);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_mqtt_publish);
        this.appendValueInput('value')
            .setCheck(null)
            .appendField('Feed/Topic')
            .appendField(new Blockly.FieldTextInput('Name'), 'publishfeed');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_mqtt_publish_tooltip);
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

