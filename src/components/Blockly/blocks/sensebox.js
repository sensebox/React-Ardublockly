import Blockly from 'blockly';

Blockly.Blocks["sensebox_telegram"] = {
    init: function () {
        this.setColour(120);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_telegram_init);
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField("telegram")
            .appendField(new Blockly.FieldTextInput("token"), "telegram_token");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

