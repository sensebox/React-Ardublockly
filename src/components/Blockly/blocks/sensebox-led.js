import * as Blockly from "blockly";
import { getColour } from "@/components/Blockly/helpers/colour";
import { selectedBoard } from "@/components/Blockly/helpers/board";
import * as Types from "@/components/Blockly/helpers/types";
import { FieldSlider } from "@blockly/field-slider";
import {
  registerFieldMultilineInput,
  FieldMultilineInput,
} from "@blockly/field-multilineinput";
import MatrixBitmapField from "@/components/Blockly/fields/MatrixBitmapField";
import MatrixBitmapPreview from "@/components/Blockly/fields/MatrixBitmapPreview";
import { registerFieldColour } from "@blockly/field-colour";

registerFieldMultilineInput();
registerFieldColour();

Blockly.Blocks["sensebox_led"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_led)
      .appendField("Pin:")
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPinsLED),
        "PIN",
      )
      .appendField(Blockly.Msg.senseBox_basic_state)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_on, "HIGH"],
          [Blockly.Msg.senseBox_off, "LOW"],
        ]),
        "STAT",
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_led_tooltip);
  },
};

Blockly.Blocks["sensebox_rgb_led"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_rgb_led)
      .appendField("Pin:")
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPins),
        "PIN",
      );

    this.appendValueInput("COLOR", "Number")
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
  },
};

Blockly.Blocks["sensebox_ws2818_led_init"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(
      Blockly.Msg.senseBox_ws2818_rgb_led_init,
    );
    this.appendDummyInput()
      .appendField("Port:")
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPinsRGB),
        "Port",
      );
    this.appendValueInput("BRIGHTNESS", "brightness").appendField(
      Blockly.Msg.senseBox_ws2818_rgb_led_brightness,
    );
    this.appendValueInput("NUMBER", "number").appendField(
      Blockly.Msg.senseBox_ws2818_rgb_led_number,
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_ws2818_rgb_led_init_tooltip);
  },
};

Blockly.Blocks["sensebox_ws2818_led"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_ws2818_rgb_led);
    this.appendDummyInput()
      .appendField("Port:")
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPinsRGB),
        "Port",
      );
    this.appendValueInput("POSITION", "position").appendField(
      Blockly.Msg.senseBox_ws2818_rgb_led_position,
    );
    this.appendValueInput("COLOR", "Number")
      .appendField(Blockly.Msg.senseBox_ws2818_rgb_led_color)
      .setCheck("Colour");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_ws2818_rgb_led_tooltip);
    if (selectedBoard().title === "MCU-S2") {
      this.setHelpUrl(Blockly.Msg.senseBox_ws2818_rgb_led_helpurl);
    } else {
      this.setHelpUrl(Blockly.Msg.senseBox_ws2818_rgb_led_helpurl_2);
    }
  },
};

Blockly.defineBlocksWithJsonArray([
  // BEGIN JSON EXTRACT
  // Block for colour picker.
  {
    type: "colour_picker",
    message0: "%1",
    args0: [
      {
        type: "field_colour",
        name: "COLOUR",
        colour: "#ff0000",
        colourOptions: [
          "#ff0000",
          "#ff924c",
          "#ffca3a",
          "#00ff00",
          "#52b788",
          "#0000ff",
          "#4267ac",
          "#6a4c93",
          "#ffffff",
          "#000000",
        ],
        colourTitles: [
          "red",
          "orange",
          "yellow",
          "green",
          "teal",
          "blue",
          "indigo",
          "violet",
          "white",
          "black",
        ],
        columns: 1,
      },
    ],
    output: "Colour",
    helpUrl: "%{BKY_COLOUR_PICKER_HELPURL}",
    colour: getColour().sensebox,
    tooltip: "%{BKY_COLOUR_PICKER_TOOLTIP}",
    extensions: ["parent_tooltip_when_inline"],
  },

  // Block for random colour.
  {
    type: "colour_random",
    message0: "%{BKY_COLOUR_RANDOM_TITLE}",
    output: "Colour",
    helpUrl: "%{BKY_COLOUR_RANDOM_HELPURL}",
    colour: getColour().sensebox,
    tooltip: "%{BKY_COLOUR_RANDOM_TOOLTIP}",
  },

  // Block for composing a colour from RGB components.
  {
    type: "colour_rgb",
    message0:
      "%{BKY_COLOUR_RGB_TITLE} %{BKY_COLOUR_RGB_RED} %1 %{BKY_COLOUR_RGB_GREEN} %2 %{BKY_COLOUR_RGB_BLUE} %3",
    args0: [
      {
        type: "input_value",
        name: "RED",
        check: Types.getCompatibleTypes("int"),
        align: "RIGHT",
      },
      {
        type: "input_value",
        name: "GREEN",
        check: Types.getCompatibleTypes("int"),
        align: "RIGHT",
      },
      {
        type: "input_value",
        name: "BLUE",
        check: Types.getCompatibleTypes("int"),
        align: "RIGHT",
      },
    ],
    output: "Colour",
    helpUrl: "%{BKY_COLOUR_RGB_HELPURL}",
    colour: getColour().sensebox,
    tooltip: "%{BKY_COLOUR_RGB_TOOLTIP}",
  },

  // Block for blending two colours together.
  {
    type: "colour_blend",
    message0:
      "%{BKY_COLOUR_BLEND_TITLE} %{BKY_COLOUR_BLEND_COLOUR1} " +
      "%1 %{BKY_COLOUR_BLEND_COLOUR2} %2 %{BKY_COLOUR_BLEND_RATIO} %3",
    args0: [
      {
        type: "input_value",
        name: "COLOUR1",
        check: "Colour",
        align: "RIGHT",
      },
      {
        type: "input_value",
        name: "COLOUR2",
        check: "Colour",
        align: "RIGHT",
      },
      {
        type: "input_value",
        name: "RATIO",
        check: "Number",
        align: "RIGHT",
      },
    ],
    output: "Colour",
    helpUrl: "%{BKY_COLOUR_BLEND_HELPURL}",
    style: "colour_blocks",
    tooltip: "%{BKY_COLOUR_BLEND_TOOLTIP}",
  },
]); // END JSON EXTRACT (Do not delete this comment.)

/**
 * LED-Matrix Blocks
 *
 *
 */

Blockly.Blocks["sensebox_ws2812_matrix_init"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_init)
      .appendField("Port:")
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPinsRGBMatrix),
        "Port",
      );
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_brightness)
      .appendField(new FieldSlider(20, 0, 40), "BRIGHTNESS");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_ws2812_rgb_matrix_init_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_ws2812_rgb_matrix_helpurl);
  },
};

Blockly.Blocks["sensebox_ws2812_matrix_text"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_print)
      .appendField("Port:")
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPinsRGBMatrix),
        "Port",
      );
    this.appendDummyInput("scroll")
      .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_autoscroll)
      .appendField(new Blockly.FieldCheckbox("TRUE"), "AUTOSCROLL");
    this.appendValueInput("COLOR", "Number")
      .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_color)
      .setCheck("Colour");
    this.appendValueInput("input")
      .setCheck([
        Types.TEXT.typeName,
        Types.NUMBER.typeName,
        Types.DECIMAL.typeName,
      ])
      .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_text);

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_ws2812_rgb_matrix_print_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_ws2812_rgb_matrix_helpurl);
  },
};

Blockly.Blocks["sensebox_ws2812_matrix_drawPixel"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_draw_pixel)
      .appendField("Port:")
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPinsRGBMatrix),
        "Port",
      );
    this.appendDummyInput("show")
      .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_show)
      .appendField(new Blockly.FieldCheckbox("TRUE"), "SHOW");
    this.appendValueInput("X", "Number").appendField(
      Blockly.Msg.senseBox_ws2812_rgb_matrix_x,
    );
    this.appendValueInput("Y", "Number").appendField(
      Blockly.Msg.senseBox_ws2812_rgb_matrix_y,
    );
    this.appendValueInput("COLOR", "Number")
      .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_color)
      .setCheck("Colour");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_ws2812_rgb_matrix_draw_pixel_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_ws2812_rgb_matrix_helpurl);
  },
};

Blockly.Blocks["sensebox_ws2812_matrix_clear"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_clear)
      .appendField("Port:")
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPinsRGBMatrix),
        "Port",
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_ws2812_rgb_matrix_clear_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_ws2812_rgb_matrix_helpurl);
  },
};

Blockly.Blocks["sensebox_ws2812_matrix_showBitmap"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_show_bitmap)
      .appendField("Port:")
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPinsRGBMatrix),
        "Port",
      );
    this.appendValueInput("input")
      .setCheck(Types.BITMAP.typeName)
      .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_bitmap);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_ws2812_rgb_matrix_show_bitmap_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_ws2812_rgb_matrix_helpurl);
  },
};

Blockly.Blocks["sensebox_ws2812_matrix_bitmap"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_bitmap)
      .appendField(
        new Blockly.FieldDropdown([
          ["happy", "happy"],
          ["sad", "sad"],
          ["angry", "angry"],
          ["neutral", "neutral"],
          ["hat", "hat"],
          ["island", "island"],
          ["knight", "knight"],
          ["random", "random"],
        ]),
        "BITMAP",
      );

    this.setOutput(true, Types.BITMAP.typeName);
    this.setTooltip(Blockly.Msg.senseBox_ws2812_rgb_matrix_bitmap_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_ws2812_rgb_matrix_helpurl);
  },
};

Blockly.Blocks["sensebox_ws2812_matrix_custom_bitmap"] = {
  init: function () {
    this.setHelpUrl(Blockly.Msg.senseBox_ws2812_rgb_matrix_helpurl);
    this.setColour(getColour().sensebox);
    this.appendDummyInput("input")
      .appendField("{")
      .appendField(
        new FieldMultilineInput(
          Blockly.Msg.senseBox_ws2812_rgb_matrix_custom_bitmap_example,
        ),
        "input",
      )
      .appendField("}");
    this.setOutput(true, Types.BITMAP.typeName);
    this.setTooltip(
      Blockly.Msg.senseBox_ws2812_rgb_matrix_custom_bitmap_tooltip,
    );
  },
};

Blockly.Blocks["sensebox_ws2812_matrix_draw_custom_bitmap_example"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_led_custom_bitmap)
      .appendField(new Blockly.FieldTextInput("custom_bitmap1"), "name");
    this.appendDummyInput().appendField(new MatrixBitmapField(), "EDITOR");
    this.appendDummyInput().appendField(new MatrixBitmapPreview(), "PREVIEW");
    // Keep the original field names for existing XML/JSON projects and the
    // RGB565 generator. The modal edits these fields as one undoable action.
    const pixels = this.appendDummyInput("PIXELS");
    for (let row = 1; row <= 8; row++) {
      for (let column = 1; column <= 12; column++) {
        pixels.appendField(
          new Blockly.FieldTextInput("#000000"),
          `${row},${column}`,
        );
      }
    }
    pixels.setVisible(false);
    this.setOnChange((event) => {
      if (
        (event.type === Blockly.Events.BLOCK_CHANGE &&
          event.blockId === this.id &&
          event.element === "field" &&
          /^[1-8],(?:[1-9]|1[0-2])$/.test(event.name)) ||
        (event.type === Blockly.Events.BLOCK_CREATE &&
          event.ids.includes(this.id)) ||
        event.type === Blockly.Events.FINISHED_LOADING
      ) {
        this.getField("PREVIEW").refresh();
      }
    });
    this.setOutput(true, Types.BITMAP.typeName);
    this.setTooltip(Blockly.Msg.senseBox_ws2812_rgb_matrix_draw_bitmap_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_ws2812_rgb_matrix_helpurl);
  },
};

Blockly.Blocks["sensebox_ws2812_matrix_fullcolor"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_fullcolor)
      .appendField("Port:")
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPinsRGBMatrix),
        "Port",
      );
    this.appendValueInput("COLOR", "Number")
      .appendField(Blockly.Msg.senseBox_ws2812_rgb_matrix_color)
      .setCheck("Colour");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_ws2812_rgb_matrix_fullcolor_tooltip);
  },
};
