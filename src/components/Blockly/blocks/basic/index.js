import * as Blockly from "blockly/core";
import { getColour } from "@/components/Blockly/helpers/colour";

Blockly.defineBlocksWithJsonArray([
  {
    type: "bme_basic",
    message0: "%1",
    args0: [
      {
        type: "field_image",
        src: "/media/hardware/icons/Icon_BME680.svg",
        width: 90,
        height: 90,
        alt: "*",
      },
    ],
    output: "String",
    colour: getColour().sensebox,
  },
  {
    type: "bme_tmp",
    message0: "%1 \n %2",
    args0: [
      {
        type: "field_image",
        src: "/media/hardware/icons/Icon_Temperatur.svg",
        width: 90,
        height: 90,
        alt: "*",
      },
      {
        type: "field_label",
        text: "Temperatur",
        bold: true,
      },
    ],
    output: "String",
    colour: "#62A044  ",
  },
  {
    type: "bme_humi",
    message0: "%1 \n %2",
    args0: [
      {
        type: "field_image",
        src: "/media/hardware/icons/Icon_Luftfeuchtigkeit.svg",
        width: 90,
        height: 90,
        alt: "*",
      },
      {
        type: "field_label",
        text: "Luftfeuchte",
        bold: true,
      },
    ],
    output: "String",
    colour: "#62A044  ",
  },
  {
    type: "bme_pressure",
    message0: "%1 \n %2",
    args0: [
      {
        type: "field_image",
        src: "/media/hardware/icons/Icon_BME680.svg",
        width: 90,
        height: 90,
        alt: "*",
      },
      {
        type: "field_label",
        text: "Luftdruck",
        bold: true,
      },
    ],
    output: "String",
    colour: "#62A044  ",
  },
  {
    type: "hdc_humi",
    message0: "%1 \n %2",
    args0: [
      {
        type: "field_image",
        src: "/media/hardware/icons/Icon_Luftfeuchtigkeit.svg",
        width: 90,
        height: 90,
        alt: "*",
      },
      {
        type: "field_label",
        text: "Luftfeuchtigkeit",
        bold: true,
      },
    ],
    output: "String",
    colour: "#62A044  ",
  },
  {
    type: "hdc_tmp",
    message0: "%1 \n %2",
    args0: [
      {
        type: "field_image",
        src: "/media/hardware/icons/Icon_Temperatur.svg",
        width: 90,
        height: 90,
        alt: "*",
      },
      {
        type: "field_label",
        text: "Temperatur",
        bold: true,
      },
    ],
    output: "String",
    colour: "#62A044  ",
  },
]);

Blockly.defineBlocksWithJsonArray([
  {
    type: "basic_red",
    message0: "%1 \n %2",
    args0: [
      {
        type: "field_image",
        src: "./media/hardware/icons/Icon_LED_Rot.svg",
        width: 90,
        height: 90,
        alt: "*",
      },
      {
        type: "field_label",
        text: "LED Rot",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: "#62A044  ",
  },
  {
    type: "basic_yellow",
    message0: "%1 \n %2",
    args0: [
      {
        type: "field_image",
        src: "./media/hardware/icons/Icon_LED_Gelb.svg",
        width: 90,
        height: 90,
        alt: "*",
      },
      {
        type: "field_label",
        text: "LED Gelb",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: "#62A044  ",
  },
  {
    type: "basic_blue",
    message0: "%1 \n %2",
    args0: [
      {
        type: "field_image",
        src: "./media/hardware/icons/Icon_LED_Blau.svg",
        width: 90,
        height: 90,
        alt: "*",
      },
      {
        type: "field_label",
        text: "LED Blau",
        bold: true,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: "#62A044  ",
  },
  {
    type: "basic_off",
    message0: "%1 \n %2",
    args0: [
      {
        type: "field_image",
        src: "./media/hardware/icons/Icon_LED_OFF.svg",
        width: 90,
        height: 90,
        alt: "*",
      },
      {
        type: "field_label",
        text: "LED Aus",
        bold: true,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: "#62A044  ",
  },
]);

Blockly.defineBlocksWithJsonArray([
  {
    type: "time_delay_1s",
    message0: "%1",
    args0: [
      {
        type: "field_image",
        src: "media/hardware/icons/Icon_Timer_1s.svg",
        width: 60,
        height: 60,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: getColour().time,
    helpUrl: "http://arduino.cc/en/Reference/Delay",
  },
  {
    type: "time_delay_2s",
    message0: "%1",
    args0: [
      {
        type: "field_image",
        src: "media/hardware/icons/Icon_Timer_2s.svg",
        width: 60,
        height: 60,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: getColour().time,
    helpUrl: "http://arduino.cc/en/Reference/Delay",
  },
  {
    type: "time_delay_5s",
    message0: "%1",
    args0: [
      {
        type: "field_image",
        src: "media/hardware/icons/Icon_Timer_5s.svg",
        width: 60,
        height: 60,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: getColour().time,
    helpUrl: "http://arduino.cc/en/Reference/Delay",
  },
]);

Blockly.defineBlocksWithJsonArray([
  {
    type: "display_print_basic",
    message0: "%1 \n %2", // Icon und Label untereinander
    args0: [
      {
        type: "field_image",
        src: "/media/hardware/icons/Icon_OLED-Display.svg",
        width: 160,
        height: 90,
      },
      {
        type: "field_label",
        text: "Zeige : ",
        bold: true,
      },
    ],
    message1: "%1", // Text-Eingang auf der rechten Seite
    args1: [
      {
        type: "input_value",
        name: "TEXT", // Name des Eingangs
        check: "String", // akzeptiert nur Textblöcke
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: "#62A044  ",
    tooltip: "Zeigt einen Text auf dem Display an",
    helpUrl: "",
  },
]);

Blockly.defineBlocksWithJsonArray([
  {
    type: "sensebox_start",
    message0: "Füge hier deine Blöcke ein %1 → Aktionen %2",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    colour: "#995ba5",
    tooltip: "Startpunkt deines Programms",
    helpUrl: "",
  },
]);

Blockly.defineBlocksWithJsonArray([
  {
    type: "basic_number",
    message0: "%1",
    args0: [
      {
        type: "field_number",
        name: "NUM",
        value: 0,
        precision: 1,
      },
    ],
    output: "String",
    colour: "#A6745C",
    tooltip: "Zahl",
    helpUrl: "",
  },
]);
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
          ["größer als", ">"],
          ["kleiner als", "<"],
          ["größer oder gleich", ">="],
          ["kleiner oder gleich", "<="],
          ["gleich", "=="],
          ["ungleich", "!="],
        ],
      },
      {
        type: "input_value",
        name: "RIGHT",
        check: "String",
      },
    ],
    output: "String",
    colour: "#5C81A6",
    tooltip: "Vergleicht zwei Werte",
    helpUrl: "",
  },
]);

Blockly.Blocks["basic_if_else"] = {
  init: function () {
    this.appendValueInput("COND").setCheck("String").appendField("wenn");

    this.appendStatementInput("DO").appendField("dann");

    this.appendStatementInput("ELSE").appendField("sonst");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#5C81A6");
    this.setTooltip("Wenn / sonst Verzweigung");

    // ⚠️ NUR initial füllen, wenn COND noch leer ist
    this.setOnChange(function () {
      if (!this.workspace || this.isInFlyout) return;

      const input = this.getInput("COND");
      if (!input || input.connection.targetBlock()) return;

      // Compare erzeugen
      const compare = this.workspace.newBlock("basic_compare");
      compare.initSvg();
      compare.render();

      const left = this.workspace.newBlock("basic_number");
      left.setFieldValue(0, "NUM");
      left.initSvg();
      left.render();

      const right = this.workspace.newBlock("basic_number");
      right.setFieldValue(1, "NUM");
      right.initSvg();
      right.render();

      compare.getInput("LEFT").connection.connect(left.outputConnection);
      compare.getInput("RIGHT").connection.connect(right.outputConnection);

      input.connection.connect(compare.outputConnection);
    });
  },
};

Blockly.defineBlocksWithJsonArray([
  {
    type: "basic_repeat_times",
    message0: "mache %1 mal",
    args0: [
      {
        type: "field_number",
        name: "TIMES",
        value: 2,
        min: 0,
        precision: 1,
      },
    ],
    message1: " %1",
    args1: [
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: "#5CA65C",
    tooltip: "Wiederholt die enthaltenen Blöcke eine bestimmte Anzahl an Malen",
    helpUrl: "",
  },
]);

// Helper function to generate LED SVG with custom color
function generateLEDSvg(color) {
  const svgTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Ebene_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88.04 105.95">
  <defs>
    <style>
      .cls-1 { fill: #fff; }
      .cls-2 { fill: #1d1d1b; }
      .led-fill { fill: ${color}; }
    </style>
  </defs>
  <g id="Ebene_1-2">
    <g id="LED">
      <path class="led-fill" d="M62.44,63.86h-1.51v-18.22c0-10.29-7.61-18.63-17.01-18.63s-17.01,8.34-17.01,18.63v18.22h-1.32c-1.57,0-2.83,1.27-2.83,2.83v4.25c0,1.57,1.27,2.83,2.83,2.83h36.85c1.57,0,2.83-1.27,2.83-2.83v-4.25c0-1.57-1.27-2.83-2.83-2.83Z"/>
      <path class="cls-2" d="M62.44,62.61h-.26v-18.59c0-10.07-8.19-18.26-18.26-18.26s-18.26,8.19-18.26,18.26v18.59h-.07c-2.25,0-4.08,1.83-4.08,4.08v4.25c0,2.25,1.83,4.08,4.08,4.08h8.23v20.92c0,.83.67,1.5,1.5,1.5s1.5-.67,1.5-1.5v-20.92h14.01v29.42c0,.83.67,1.5,1.5,1.5s1.5-.67,1.5-1.5v-29.42h8.62c2.25,0,4.08-1.83,4.08-4.08v-4.25c0-2.25-1.83-4.08-4.08-4.08ZM28.17,44.02c0-8.69,7.07-15.76,15.76-15.76s15.76,7.07,15.76,15.76v18.59h-31.52v-18.59ZM64.03,70.95c0,.87-.71,1.58-1.58,1.58H25.59c-.87,0-1.58-.71-1.58-1.58v-4.25c0-.87.71-1.58,1.58-1.58h36.85c.87,0,1.58.71,1.58,1.58v4.25Z"/>
      <g>
        <path class="cls-2" d="M44.02,17.17c-.83,0-1.5-.67-1.5-1.5V1.5c0-.83.67-1.5,1.5-1.5s1.5.67,1.5,1.5v14.17c0,.83-.67,1.5-1.5,1.5Z"/>
        <path class="cls-2" d="M15.67,45.52H1.5c-.83,0-1.5-.67-1.5-1.5s.67-1.5,1.5-1.5h14.17c.83,0,1.5.67,1.5,1.5s-.67,1.5-1.5,1.5Z"/>
        <path class="cls-2" d="M86.54,45.52h-14.17c-.83,0-1.5-.67-1.5-1.5s.67-1.5,1.5-1.5h14.17c.83,0,1.5.67,1.5,1.5s-.67,1.5-1.5,1.5Z"/>
        <path class="cls-2" d="M23.98,25.48c-.38,0-.77-.15-1.06-.44l-10.02-10.02c-.59-.59-.59-1.54,0-2.12.59-.59,1.54-.59,2.12,0l10.02,10.02c.59.59.59,1.54,0,2.12-.29.29-.68.44-1.06.44Z"/>
        <path class="cls-2" d="M64.06,25.48c-.38,0-.77-.15-1.06-.44-.59-.59-.59-1.54,0-2.12l10.02-10.02c.59-.59,1.54-.59,2.12,0,.59.59.59,1.54,0,2.12l-10.02,10.02c-.29.29-.68.44-1.06.44Z"/>
      </g>
      <ellipse class="cls-1" cx="36.07" cy="38.12" rx="6.38" ry="2.13" transform="translate(-15.84 45.8) rotate(-55)"/>
    </g>
  </g>
</svg>`;

  return "data:image/svg+xml;base64," + btoa(svgTemplate);
}

Blockly.Blocks["basic_led_control"] = {
  init: function () {
    this.appendDummyInput("LED_IMAGE").appendField(
      new Blockly.FieldImage(generateLEDSvg("#ff0000"), 90, 90, "*"),
      "LED_ICON",
    );

    this.appendDummyInput().appendField("LED einschalten");

    this.appendValueInput("COLOR").setCheck("Colour").appendField("Farbe:");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#62A044");
    this.setTooltip("Schalte die LED mit der gewählten Farbe ein");
    this.setHelpUrl("");

    this.setOnChange(this.onColorChange.bind(this));
  },

  onColorChange: function (changeEvent) {
    if (!this.workspace || this.isInFlyout) return;

    // Only react to changes on connected blocks
    if (
      changeEvent.type === Blockly.Events.BLOCK_CHANGE ||
      changeEvent.type === Blockly.Events.BLOCK_MOVE
    ) {
      const colorInput = this.getInputTargetBlock("COLOR");

      if (colorInput && colorInput.type === "colour_picker") {
        const color = colorInput.getFieldValue("COLOUR");
        if (color) {
          this.updateLEDImage(color);
        }
      }
    }
  },

  updateLEDImage: function (color) {
    const ledImageInput = this.getInput("LED_IMAGE");
    if (ledImageInput) {
      const field = this.getField("LED_ICON");
      if (field) {
        field.setValue(generateLEDSvg(color));
      }
    }
  },
};
