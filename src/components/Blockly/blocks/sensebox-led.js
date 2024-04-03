import * as Blockly from 'blockly';
import { getColour } from '../helpers/colour'
import { selectedBoard } from '../helpers/board'
import * as Types from '../helpers/types'
import { FieldSlider } from "@blockly/field-slider";


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
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_ws2818_rgb_led_init)
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
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_ws2818_rgb_led)
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



/**
 * LED-Matrix Blocks
 * 
 * 
 */


Blockly.Blocks['sensebox_ws2812_matrix_init'] = {
    init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_init)
            .appendField("Port:")
            .appendField(new Blockly.FieldDropdown(selectedBoard().digitalPinsRGBMatrix), "Port")
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_brightness)
            .appendField(new FieldSlider(20, 0, 255), "BRIGHTNESS");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_ws2812_rgb_matrix_init_tooltip);
    }
};

Blockly.Blocks['sensebox_ws2812_matrix_text'] = {
    init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_print)
            .appendField("Port:")
            .appendField(new Blockly.FieldDropdown(selectedBoard().digitalPinsRGBMatrix), "Port")
        this.appendDummyInput("scroll")
            .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_autoscroll)
            .appendField(new Blockly.FieldCheckbox("TRUE"), "AUTOSCROLL");
        this.appendValueInput("COLOR", 'Number')
            .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_color)
            .setCheck("Colour");
        this.appendValueInput("input")
            .setCheck([Types.TEXT.typeName, Types.NUMBER.typeName, Types.DECIMAL.typeName])
            .appendField((Blockly.Msg.senseBox_ws2812_rgb_matrix_text));

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_ws2812_rgb_matrix_print_tooltip);
    }
};

Blockly.Blocks['sensebox_ws2812_matrix_drawPixel'] = {
    init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_draw_pixel)
            .appendField("Port:")
            .appendField(new Blockly.FieldDropdown(selectedBoard().digitalPinsRGBMatrix), "Port")
        this.appendValueInput("X", "Number")
            .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_x);
        this.appendValueInput("Y", "Number")
            .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_y);
        this.appendValueInput("COLOR", 'Number')
            .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_color)
            .setCheck("Colour");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_ws2812_rgb_matrix_draw_pixel_tooltip);
    }
};

Blockly.Blocks['sensebox_ws2812_matrix_clear'] = {
    init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_clear)
            .appendField("Port:")
            .appendField(new Blockly.FieldDropdown(selectedBoard().digitalPinsRGBMatrix), "Port")
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_ws2812_rgb_matrix_clear_tooltip);
    }
};

Blockly.Blocks['sensebox_ws2812_matrix_showBitmap'] = {
    init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_show_bitmap)
            .appendField("Port:")
            .appendField(new Blockly.FieldDropdown(selectedBoard().digitalPinsRGBMatrix), "Port")
        this.appendValueInput("input")
            .setCheck("Bitmap")
            .appendField((Blockly.Msg.senseBox_ws2812_rgb_matrix_bitmap));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_ws2812_rgb_matrix_show_bitmap_tooltip);
    }
};

Blockly.Blocks['sensebox_ws2812_matrix_bitmap'] = {
    init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_bitmap)
            .appendField(new Blockly.FieldDropdown([
                ["happy", "happy"],
                ["sad", "sad"],
                ["angry", "angry"],
                ["neutral", "neutral"],
                ["hat", "hat"],
                ["island", "island"],
                ["knight", "knight"],
                ["random", "random"]
            ]), "BITMAP");
        this.setOutput(true, "Bitmap");
        this.setTooltip(Blockly.Msg.senseBox_ws2812_rgb_matrix_bitmap_tooltip);
    }
};

Blockly.Blocks['sensebox_ws2812_matrix_custom_bitmap'] = {
    init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput("BITMAP")
            .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_custom_bitmap)
            .appendField(new Blockly.FieldMultilineInput(Blockly.Msg.senseBox_ws2812_rgb_matrix_custom_bitmap_example),
                'FIELDNAME');
        this.setOutput(true, "Bitmap");
        this.setTooltip(Blockly.Msg.senseBox_ws2812_rgb_matrix_custom_bitmap_tooltip);
    }
};

Blockly.defineBlocksWithJsonArray([
    {
        type: "sensebox_ws2812_matrix_draw_custom_bitmap_example",
        message0:
        Blockly.Msg.senseBox_ws2812_rgb_matrix_draw_bitmap + " %1 %2 %3 %4 %5 %6 %7 %8 %9 %10 %11 %12 %13 %14 %15 %16 %17 %18 %19 %20 %21 %22 %23 %24 %25 %26 %27 %28 %29 %30 %31 %32 %33 %34 %35 %36 %37 %38 %39 %40 %41 %42 %43 %44 %45 %46 %47 %48 %49 %50 %51 %52 %53 %54 %55 %56 %57 %58 %59 %60 %61 %62 %63 %64 %65 %66 %67 %68 %69 %70 %71 %72 %73 %74 %75 %76 %77 %78 %79 %80 %81 %82 %83 %84 %85 %86 %87 %88 %89 %90 %91 %92 %93 %94 %95 %96 %97 %98 %99 %100 %101 %102 %103 %104",
        args0: [
            {
                type: "input_dummy",
            },
            {
                type: "field_colour",
                name: "1,1",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "1,2",
                colour: "#ff0000",
            },
            {
                type: "field_colour",
                name: "1,3",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "1,4",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "1,5",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "1,6",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "1,7",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "1,8",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "1,9",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "1,10",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "1,11",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "1,12",
                colour: "#000000",
            },
            {
                type: "input_dummy",
            },
            {
                type: "field_colour",
                name: "2,1",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "2,2",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "2,3",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "2,4",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "2,5",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "2,6",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "2,7",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "2,8",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "2,9",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "2,10",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "2,11",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "2,12",
                colour: "#000000",
            },
            {
                type: "input_dummy",
            },
            {
                type: "field_colour",
                name: "3,1",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "3,2",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "3,3",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "3,4",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "3,5",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "3,6",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "3,7",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "3,8",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "3,9",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "3,10",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "3,11",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "3,12",
                colour: "#000000",
            },
            {
                type: "input_dummy",
            },
            {
                type: "field_colour",
                name: "4,1",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "4,2",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "4,3",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "4,4",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "4,5",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "4,6",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "4,7",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "4,8",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "4,9",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "4,10",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "4,11",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "4,12",
                colour: "#000000",
            },
            {
                type: "input_dummy",
            },
            {
                type: "field_colour",
                name: "5,1",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "5,2",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "5,3",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "5,4",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "5,5",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "5,6",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "5,7",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "5,8",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "5,9",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "5,10",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "5,11",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "5,12",
                colour: "#000000",
            },
            {
                type: "input_dummy",
            },
            {
                type: "field_colour",
                name: "6,1",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "6,2",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "6,3",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "6,4",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "6,5",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "6,6",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "6,7",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "6,8",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "6,9",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "6,10",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "6,11",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "6,12",
                colour: "#000000",
            },
            {
                type: "input_dummy",
            },
            {
                type: "field_colour",
                name: "7,1",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "7,2",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "7,3",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "7,4",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "7,5",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "7,6",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "7,7",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "7,8",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "7,9",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "7,10",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "7,11",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "7,12",
                colour: "#000000",
            },
            {
                type: "input_dummy",
            },
            {
                type: "field_colour",
                name: "8,1",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "8,2",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "8,3",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "8,4",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "8,5",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "8,6",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "8,7",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "8,8",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "8,9",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "8,10",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "8,11",
                colour: "#000000",
            },
            {
                type: "field_colour",
                name: "8,12",
                colour: "#000000",
            },
        ],
        output: "Bitmap",
        colour: getColour().sensebox,
        tooltip: Blockly.Msg.senseBox_ws2812_rgb_matrix_draw_bitmap_tooltip,
        helpUrl: "",
    },
]);
