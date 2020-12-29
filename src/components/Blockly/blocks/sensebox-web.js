import Blockly from 'blockly';
import { getColour } from '../helpers/colour'

Blockly.Blocks['sensebox_wifi'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_wifi_tooltip);
        this.setHelpUrl('');
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_wifi_connect);
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_wifi_ssid)
            .appendField(new Blockly.FieldTextInput("SSID"), "SSID");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_output_password)
            .appendField(new Blockly.FieldTextInput("Password"), "Password");
        this.setHelpUrl(Blockly.Msg.senseBox_wifi_helpurl)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },
    onchange: function (e) {
        var legal = false;
        // Is the block nested in a loop?
        var block = this;
        do {
            if (this.LOOP_TYPES.indexOf(block.type) !== -1) {
                legal = true;
                break;
            }
            block = block.getSurroundParent();
        } while (block);
        if (legal) {
            this.setWarningText(null);

        } else {
            this.setWarningText(Blockly.Msg.CONTROLS_FLOW_STATEMENTS_WARNING);

        }
    },
    LOOP_TYPES: ['arduino_functions'],
};

Blockly.Blocks['sensebox_startap'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_wifi_startap_tooltip);
        this.setHelpUrl('');
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_wifi_startap);
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_wifi_ssid)
            .appendField(new Blockly.FieldTextInput("SSID"), "SSID");
        this.setHelpUrl(Blockly.Msg.senseBox_wifi_helpurl)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};