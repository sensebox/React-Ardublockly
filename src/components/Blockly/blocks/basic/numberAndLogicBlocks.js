import * as Blockly from "blockly/core";
import { FieldSlider } from "@blockly/field-slider";

Blockly.Blocks["basic_number"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldNumber(0, null, null, 1),
      "NUM",
    );
    this.setOutput(true, "String");
    this.setColour("#6b75a6");
    this.setTooltip("Zahl");
    this.setHelpUrl("");

    this.colorApplied_ = false;
    this.setOnChange(this.applyCustomColor_.bind(this));
  },

  applyCustomColor_: function () {
    if (
      !this.colorApplied_ &&
      this.data &&
      /^#[0-9A-Fa-f]{6}$/.test(this.data)
    ) {
      this.setColour(this.data);
      this.colorApplied_ = true;
    }
  },
};

Blockly.Blocks["basic_number_slider"] = {
  init: function () {
    this.appendDummyInput().appendField(new FieldSlider(0, 0, 255), "NUM");
    this.setOutput(true, "String");
    this.setColour("#6b75a6");
    this.setTooltip("Zahl (0-255)");
    this.setHelpUrl("");

    this.colorApplied_ = false;
    this.setOnChange(this.applyCustomColor_.bind(this));
  },

  applyCustomColor_: function () {
    if (
      !this.colorApplied_ &&
      this.data &&
      /^#[0-9A-Fa-f]{6}$/.test(this.data)
    ) {
      this.setColour(this.data);
      this.colorApplied_ = true;
    }
  },
};

Blockly.Blocks["basic_number_slider_red"] = {
  init: function () {
    const slider = new FieldSlider(0, 0, 255);
    this.appendDummyInput().appendField(slider, "NUM");
    this.setOutput(true, "RGB_RED");
    this.setColour("#cc3333");
    this.setTooltip("Rot-Wert (0-255)");
    this.setHelpUrl("");

    this.setOnChange(this.updateParentRGB_.bind(this));
  },

  updateParentRGB_: function () {
    if (!this.workspace || this.isInFlyout) return;

    const parentConnection = this.outputConnection?.targetConnection;
    if (parentConnection) {
      const parentBlock = parentConnection.getSourceBlock();
      if (parentBlock && parentBlock.type === "basic_rgb_color") {
        const rInput = parentBlock.getInputTargetBlock("R");
        const gInput = parentBlock.getInputTargetBlock("G");
        const bInput = parentBlock.getInputTargetBlock("B");

        if (rInput && gInput && bInput) {
          const r = rInput.getFieldValue("NUM");
          const g = gInput.getFieldValue("NUM");
          const b = bInput.getFieldValue("NUM");

          if (r !== null && g !== null && b !== null) {
            parentBlock.updateRGBImage(r, g, b);
          }
        }
      }
    }
  },
};

Blockly.Blocks["basic_number_slider_green"] = {
  init: function () {
    const slider = new FieldSlider(0, 0, 255);
    this.appendDummyInput().appendField(slider, "NUM");
    this.setOutput(true, "RGB_GREEN");
    this.setColour("#33cc33");
    this.setTooltip("Grün-Wert (0-255)");
    this.setHelpUrl("");

    this.setOnChange(this.updateParentRGB_.bind(this));
  },

  updateParentRGB_: function () {
    if (!this.workspace || this.isInFlyout) return;

    const parentConnection = this.outputConnection?.targetConnection;
    if (parentConnection) {
      const parentBlock = parentConnection.getSourceBlock();
      if (parentBlock && parentBlock.type === "basic_rgb_color") {
        const rInput = parentBlock.getInputTargetBlock("R");
        const gInput = parentBlock.getInputTargetBlock("G");
        const bInput = parentBlock.getInputTargetBlock("B");

        if (rInput && gInput && bInput) {
          const r = rInput.getFieldValue("NUM");
          const g = gInput.getFieldValue("NUM");
          const b = bInput.getFieldValue("NUM");

          if (r !== null && g !== null && b !== null) {
            parentBlock.updateRGBImage(r, g, b);
          }
        }
      }
    }
  },
};

Blockly.Blocks["basic_number_slider_blue"] = {
  init: function () {
    const slider = new FieldSlider(0, 0, 255);
    this.appendDummyInput().appendField(slider, "NUM");
    this.setOutput(true, "RGB_BLUE");
    this.setColour("#3333cc");
    this.setTooltip("Blau-Wert (0-255)");
    this.setHelpUrl("");

    this.setOnChange(this.updateParentRGB_.bind(this));
  },

  updateParentRGB_: function () {
    if (!this.workspace || this.isInFlyout) return;

    const parentConnection = this.outputConnection?.targetConnection;
    if (parentConnection) {
      const parentBlock = parentConnection.getSourceBlock();
      if (parentBlock && parentBlock.type === "basic_rgb_color") {
        const rInput = parentBlock.getInputTargetBlock("R");
        const gInput = parentBlock.getInputTargetBlock("G");
        const bInput = parentBlock.getInputTargetBlock("B");

        if (rInput && gInput && bInput) {
          const r = rInput.getFieldValue("NUM");
          const g = gInput.getFieldValue("NUM");
          const b = bInput.getFieldValue("NUM");

          if (r !== null && g !== null && b !== null) {
            parentBlock.updateRGBImage(r, g, b);
          }
        }
      }
    }
  },
};

Blockly.defineBlocksWithJsonArray([
  {
    type: "basic_compare",
    message0: "%1 %2 %3",
    args0: [
      {
        type: "input_value",
        name: "LEFT",
        check: "String",
      },
      {
        type: "field_dropdown",
        name: "OP",
        options: [
          ["=", "=="],
          ["\u2260", "!="],
          ["<", "<"],
          ["\u2264", "<="],
          [">", ">"],
          ["\u2265", ">="],
        ],
      },
      {
        type: "input_value",
        name: "RIGHT",
        check: "String",
      },
    ],
    output: "Boolean",
    colour: "#5b67a5",
    inputsInline: true,
    tooltip: "Vergleicht zwei Werte",
    helpUrl: "",
  },
  {
    type: "basic_math",
    message0: "%1 %2 %3",
    args0: [
      {
        type: "input_value",
        name: "LEFT",
        check: "String",
      },
      {
        type: "field_dropdown",
        name: "OP",
        options: [
          ["+", "+"],
          ["−", "-"],
          ["×", "*"],
          ["÷", "/"],
        ],
      },
      {
        type: "input_value",
        name: "RIGHT",
        check: "String",
      },
    ],
    output: "String",
    colour: "#5b67a5",
    inputsInline: true,
    tooltip: "Rechne mit zwei Zahlen",
    helpUrl: "",
  },
  {
    type: "basic_random",
    message0: "Zufallszahl von %1 bis %2",
    args0: [
      {
        type: "input_value",
        name: "FROM",
        check: "String",
      },
      {
        type: "input_value",
        name: "TO",
        check: "String",
      },
    ],
    output: "String",
    colour: "#5b67a5",
    inputsInline: true,
    tooltip: "Erzeugt eine Zufallszahl in einem Bereich",
    helpUrl: "",
  },
]);
