import * as Blockly from 'blockly';
import { getColour } from '../helpers/colour'
import { selectedBoard } from '../helpers/board'
import * as Types from '../helpers/types'


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
        this.setTooltip(Blockly.Msg.senseBox_led_tooltip);
    }
};

Blockly.Blocks['sensebox_rgb_led'] = {
    init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_rgb_led)
            .appendField("Pin:")
            .appendField(new Blockly.FieldDropdown(selectedBoard().digitalPins), "PIN");

        this.appendValueInput("COLOR", 'Number')
            .appendField(Blockly.Msg.senseBox_ws2818_rgb_led_color)
            .setCheck("Colour");
        // this.appendValueInput("RED", 'Number')
        //     .appendField(Blockly.Msg.COLOUR_RGB_RED);//Blockly.Msg.senseBox_basic_red
        // this.appendValueInput("GREEN", 'Number')
        //     .appendField(Blockly.Msg.COLOUR_RGB_GREEN);//Blockly.Msg.senseBox_basic_green
        // this.appendValueInput("BLUE", 'Number')
        //     .appendField(Blockly.Msg.COLOUR_RGB_BLUE);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_rgb_led_tip);
    }
};


Blockly.Blocks['sensebox_ws2818_led_init'] = {
    init: function () {

        var dropdownOptions = [[Blockly.Msg.senseBox_ultrasonic_port_A, '1'],
        [Blockly.Msg.senseBox_ultrasonic_port_B, '3'], [Blockly.Msg.senseBox_ultrasonic_port_C, '5']];

        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_ws2818_rgb_led_init)
            .appendField("Port:")
            .appendField(new Blockly.FieldDropdown(dropdownOptions), "Port")
        this.appendValueInput("BRIGHTNESS", "brightness")
            .appendField((Blockly.Msg.senseBox_ws2818_rgb_led_brightness));
        this.appendValueInput("NUMBER", "number")
            .appendField((Blockly.Msg.senseBox_ws2818_rgb_led_number));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_ws2818_rgb_led_init_tooltip);
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
        this.appendValueInput("POSITION", "position")
            .appendField((Blockly.Msg.senseBox_ws2818_rgb_led_position));
        this.appendValueInput("COLOR", 'Number')
            .appendField(Blockly.Msg.senseBox_ws2818_rgb_led_color)
            .setCheck("Colour");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_ws2818_rgb_led_tooltip);
    }
};


Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
    // Block for colour picker.
    {
        "type": "colour_picker",
        "message0": "%1",
        "args0": [
            {
                "type": "field_colour",
                "name": "COLOUR",
                "colour": "#ff0000"
            }
        ],
        "output": "Colour",
        "helpUrl": "%{BKY_COLOUR_PICKER_HELPURL}",
        "colour": getColour().sensebox,
        "tooltip": "%{BKY_COLOUR_PICKER_TOOLTIP}",
        "extensions": ["parent_tooltip_when_inline"]
    },

    // Block for random colour.
    {
        "type": "colour_random",
        "message0": "%{BKY_COLOUR_RANDOM_TITLE}",
        "output": "Colour",
        "helpUrl": "%{BKY_COLOUR_RANDOM_HELPURL}",
        "colour": getColour().sensebox,
        "tooltip": "%{BKY_COLOUR_RANDOM_TOOLTIP}"
    },

    // Block for composing a colour from RGB components.
    {
        "type": "colour_rgb",
        "message0": "%{BKY_COLOUR_RGB_TITLE} %{BKY_COLOUR_RGB_RED} %1 %{BKY_COLOUR_RGB_GREEN} %2 %{BKY_COLOUR_RGB_BLUE} %3",
        "args0": [
            {
                "type": "input_value",
                "name": "RED",
                "check": Types.getCompatibleTypes('int'),
                "align": "RIGHT"
            },
            {
                "type": "input_value",
                "name": "GREEN",
                "check": Types.getCompatibleTypes('int'),
                "align": "RIGHT"
            },
            {
                "type": "input_value",
                "name": "BLUE",
                "check": Types.getCompatibleTypes('int'),
                "align": "RIGHT"
            }
        ],
        "output": "Colour",
        "helpUrl": "%{BKY_COLOUR_RGB_HELPURL}",
        "colour": getColour().sensebox,
        "tooltip": "%{BKY_COLOUR_RGB_TOOLTIP}"
    },

    // Block for blending two colours together.
    {
        "type": "colour_blend",
        "message0": "%{BKY_COLOUR_BLEND_TITLE} %{BKY_COLOUR_BLEND_COLOUR1} " +
            "%1 %{BKY_COLOUR_BLEND_COLOUR2} %2 %{BKY_COLOUR_BLEND_RATIO} %3",
        "args0": [
            {
                "type": "input_value",
                "name": "COLOUR1",
                "check": "Colour",
                "align": "RIGHT"
            },
            {
                "type": "input_value",
                "name": "COLOUR2",
                "check": "Colour",
                "align": "RIGHT"
            },
            {
                "type": "input_value",
                "name": "RATIO",
                "check": "Number",
                "align": "RIGHT"
            }
        ],
        "output": "Colour",
        "helpUrl": "%{BKY_COLOUR_BLEND_HELPURL}",
        "style": "colour_blocks",
        "tooltip": "%{BKY_COLOUR_BLEND_TOOLTIP}"
    }
]);  // END JSON EXTRACT (Do not delete this comment.)

