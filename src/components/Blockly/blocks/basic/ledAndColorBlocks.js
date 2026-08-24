import * as Blockly from "blockly/core";

function svgToDataUri(svg) {
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

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

  return svgToDataUri(svgTemplate);
}

function generateRGBSvg(r, g, b) {
  const red = Math.max(0, Math.min(255, parseInt(r) || 0));
  const green = Math.max(0, Math.min(255, parseInt(g) || 0));
  const blue = Math.max(0, Math.min(255, parseInt(b) || 0));

  const hexColor = `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;

  const svgTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
  <defs>
    <style>
      .rgb-color-fill { fill: ${hexColor}; }
      .rgb-border { fill: none; stroke: #1d1d1b; stroke-width: 2; }
      .rgb-text {
        fill: #1d1d1b;
        font-family: Arial, sans-serif;
        font-size: 8px;
        font-weight: bold;
        text-anchor: middle;
      }
    </style>
  </defs>
  <rect class="rgb-color-fill" x="5" y="5" width="70" height="50" rx="5"/>
  <rect class="rgb-border" x="5" y="5" width="70" height="50" rx="5"/>
  <text class="rgb-text" x="40" y="68">R:${red} G:${green} B:${blue}</text>
</svg>`;

  return "data:image/svg+xml;base64," + btoa(svgTemplate);
}

Blockly.defineBlocksWithJsonArray([
  {
    type: "basic_red",
    message0: "%1 \n %2",
    args0: [
      {
        type: "field_image",
        src: "/media/hardware/icons/Icon_LED_Rot.svg",
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
        src: "/media/hardware/icons/Icon_LED_Gelb.svg",
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
        src: "/media/hardware/icons/Icon_LED_Blau.svg",
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
    colour: "#62A044",
  },
  {
    type: "basic_off",
    message0: "%2 \n %1",
    args0: [
      {
        type: "field_image",
        src: "/media/hardware/icons/Icon_LED_OFF.svg",
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
    colour: "#62A044",
  },
  {
    type: "basic_random_color",
    message0: "%2 \n %1",
    args0: [
      {
        type: "field_image",
        src: "/media/hardware/icons/Icon_LED_zufaellig.svg",
        width: 90,
        height: 90,
        alt: "*",
      },
      {
        type: "field_label",
        text: "Zufällige Farbe",
        bold: true,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: "#62A044",
    tooltip: "Schaltet die LED auf eine zufällige Farbe",
    helpUrl: "",
  },
  {
    type: "colour_picker_basic",
    message0: "%1",
    args0: [
      {
        type: "field_colour",
        name: "COLOUR",
        colour: "#ff595e",
        colourOptions: [
          "#ff595e",
          "#ff924c",
          "#ffca3a",
          "#8ac926",
          "#52b788",
          "#1982c4",
          "#4267ac",
          "#6a4c93",
          "#ffffff",
        ],
        colourTitles: [
          "Rot",
          "Orange",
          "Gelb",
          "Grün",
          "Türkis",
          "Blau",
          "Indigo",
          "Violett",
          "Weiß",
        ],
        columns: 1,
      },
    ],
    output: "Colour",
    colour: "#62A044",
    tooltip: "Wähle eine Farbe aus der Palette",
  },
]);

Blockly.Blocks["basic_led_control"] = {
  init: function () {
    this.appendDummyInput().appendField("LED einschalten");

    this.appendDummyInput("LED_IMAGE").appendField(
      new Blockly.FieldImage(generateLEDSvg("#ff0000"), 90, 90, "*"),
      "LED_ICON",
    );

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

    if (
      changeEvent.type === Blockly.Events.BLOCK_CHANGE ||
      changeEvent.type === Blockly.Events.BLOCK_MOVE
    ) {
      const colorInput = this.getInputTargetBlock("COLOR");

      if (colorInput) {
        if (
          colorInput.type === "colour_picker" ||
          colorInput.type === "colour_picker_basic"
        ) {
          const color = colorInput.getFieldValue("COLOUR");
          if (color) {
            this.updateLEDImage(color);
          }
        } else if (colorInput.type === "basic_rgb_color") {
          const rBlock = colorInput.getInputTargetBlock("R");
          const gBlock = colorInput.getInputTargetBlock("G");
          const bBlock = colorInput.getInputTargetBlock("B");

          if (rBlock && gBlock && bBlock) {
            const r = Math.max(
              0,
              Math.min(255, parseInt(rBlock.getFieldValue("NUM")) || 0),
            );
            const g = Math.max(
              0,
              Math.min(255, parseInt(gBlock.getFieldValue("NUM")) || 0),
            );
            const b = Math.max(
              0,
              Math.min(255, parseInt(bBlock.getFieldValue("NUM")) || 0),
            );

            const hexColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
            this.updateLEDImage(hexColor);
          }
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

Blockly.Blocks["basic_rgb_color"] = {
  init: function () {
    this.appendDummyInput().appendField("RGB Farbe");

    this.appendDummyInput("RGB_IMAGE").appendField(
      new Blockly.FieldImage(generateRGBSvg(255, 0, 0), 80, 80, "*"),
      "RGB_ICON",
    );

    this.appendValueInput("R").setCheck("RGB_RED").appendField("Rot:");
    this.appendValueInput("G").setCheck("RGB_GREEN").appendField("Grün:");
    this.appendValueInput("B").setCheck("RGB_BLUE").appendField("Blau:");

    this.setOutput(true, "Colour");
    this.setColour("#62A044");
    this.setTooltip("Mische eine Farbe aus Rot, Grün und Blau Werten (0-255)");
    this.setHelpUrl("");

    this.setOnChange(this.onRGBChange.bind(this));
  },

  onRGBChange: function (changeEvent) {
    if (!this.workspace || this.isInFlyout) return;

    if (
      changeEvent.type === Blockly.Events.BLOCK_CHANGE ||
      changeEvent.type === Blockly.Events.BLOCK_MOVE
    ) {
      const rInput = this.getInputTargetBlock("R");
      const gInput = this.getInputTargetBlock("G");
      const bInput = this.getInputTargetBlock("B");

      const validRTypes = [
        "basic_number",
        "basic_number_slider",
        "basic_number_slider_red",
      ];
      const validGTypes = [
        "basic_number",
        "basic_number_slider",
        "basic_number_slider_green",
      ];
      const validBTypes = [
        "basic_number",
        "basic_number_slider",
        "basic_number_slider_blue",
      ];

      if (
        rInput &&
        validRTypes.includes(rInput.type) &&
        gInput &&
        validGTypes.includes(gInput.type) &&
        bInput &&
        validBTypes.includes(bInput.type)
      ) {
        const r = rInput.getFieldValue("NUM");
        const g = gInput.getFieldValue("NUM");
        const b = bInput.getFieldValue("NUM");

        if (r !== null && g !== null && b !== null) {
          this.updateRGBImage(r, g, b);
        }
      }
    }
  },

  updateRGBImage: function (r, g, b) {
    const rgbImageInput = this.getInput("RGB_IMAGE");
    if (rgbImageInput) {
      const field = this.getField("RGB_ICON");
      if (field) {
        field.setValue(generateRGBSvg(r, g, b));
      }
    }
  },
};
