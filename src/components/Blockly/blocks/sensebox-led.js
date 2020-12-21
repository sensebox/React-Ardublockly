import * as Blockly from 'blockly';
import { getColour } from '../helpers/colour'
import { selectedBoard } from '../helpers/board'



Blockly.Blocks['sensebox_led'] = {
    init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_led)
            .appendField("Pin:")
            .appendField(new Blockly.FieldDropdown(selectedBoard().digitalPinsLED), "PIN")
            .appendField(Blockly.Msg.senseBox_basic_state)
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg.senseBox_on, "HIGH"], [Blockly.Msg.senseBox_off, "LOW"]]), "STAT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_led_tip);
    }
};

Blockly.Blocks['sensebox_rgb_led'] = {
    init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_rgb_led)
            .appendField("Pin:")
            .appendField(new Blockly.FieldDropdown(selectedBoard().digitalPins), "PIN");
        this.appendValueInput("RED", 'Number')
            .appendField(Blockly.Msg.COLOUR_RGB_RED);//Blockly.Msg.senseBox_basic_red
        this.appendValueInput("GREEN", 'Number')
            .appendField(Blockly.Msg.COLOUR_RGB_GREEN);//Blockly.Msg.senseBox_basic_green
        this.appendValueInput("BLUE", 'Number')
            .appendField(Blockly.Msg.COLOUR_RGB_BLUE);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_rgb_led_tip);
        this.setHelpUrl('https://sensebox.de/books');
    }
};


Blockly.Blocks['sensebox_ws2818_led'] = {
    init: function () {

        var dropdownOptions = [[Blockly.Msg.senseBox_ultrasonic_port_A, '1'],
        [Blockly.Msg.senseBox_ultrasonic_port_B, '3'], [Blockly.Msg.senseBox_ultrasonic_port_C, '5']];

        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_ws2818_rgb_led)
            .appendField("Port:")
            .appendField(new Blockly.FieldDropdown(dropdownOptions), "Port")
        this.appendValueInput("BRIGHTNESS", "brightness")
            .appendField((Blockly.Msg.senseBox_ws2818_rgb_led_brightness));
        this.appendValueInput("POSITION", "position")
            .appendField((Blockly.Msg.senseBox_ws2818_rgb_led_position));
        this.appendValueInput("RED", 'Number')
            .appendField(Blockly.Msg.COLOUR_RGB_RED);//Blockly.Msg.senseBox_basic_red
        this.appendValueInput("GREEN", 'Number')
            .appendField(Blockly.Msg.COLOUR_RGB_GREEN);//Blockly.Msg.senseBox_basic_green
        this.appendValueInput("BLUE", 'Number')
            .appendField(Blockly.Msg.COLOUR_RGB_BLUE);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_rgb_led_tip);
        this.setHelpUrl('https://sensebox.de/books');
    }
};