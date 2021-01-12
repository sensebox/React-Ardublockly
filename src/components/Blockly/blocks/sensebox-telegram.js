import Blockly from 'blockly';
import { getColour } from '../helpers/colour'


Blockly.Blocks["sensebox_telegram"] = {
    init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_telegram_init);
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField("telegram")
            .appendField(new Blockly.FieldTextInput("token"), "telegram_token");
        this.setPreviousStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_telegram_init_tooltip);
        this.setNextStatement(true, null);
    }
};


Blockly.Blocks["sensebox_telegram_do"] = {
    init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput().appendField(Blockly.Msg.senseBox_telegram_do);
        this.appendStatementInput("telegram_do");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_telegram_do_tooltip)
    }
};

Blockly.Blocks["sensebox_telegram_do_on_message"] = {
    init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput().appendField(Blockly.Msg.senseBox_telegram_do_on_message);
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_telegram_message)
            .appendField(new Blockly.FieldTextInput("/message"), 'telegram_message');
        this.appendStatementInput("telegram_do_on_message").setCheck(null);
        this.setTooltip(Blockly.Msg.senseBox_telegram_message_tooltip)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.Blocks["sensebox_telegram_send"] = {
    init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput().appendField(Blockly.Msg.senseBox_telegram_send);
        this.appendValueInput("telegram_text_to_send").setCheck(null);
        this.setTooltip(Blockly.Msg.senseBox_telegram_send_tooltip)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

    },
    LOOP_TYPES: ["sensebox_telegram_do_on_message"]
};