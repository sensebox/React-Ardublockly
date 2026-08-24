import * as Blockly from "blockly/core";
import * as Types from "@/components/Blockly/helpers/types";
import { getColour } from "../../helpers/colour";
import "@/components/Blockly/fields/ToggleColourField";

const FONT_SIZE_CONFIG = {
  s: { size: 6, lineHeight: 8, maxLines: 6 },
  m: { size: 8, lineHeight: 10, maxLines: 5 },
  l: { size: 12, lineHeight: 14, maxLines: 3 },
};

function svgToDataUri(svg) {
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

function generateDisplaySvg(text = "", fontSize = "s") {
  const config = FONT_SIZE_CONFIG[fontSize] || FONT_SIZE_CONFIG.s;
  const lines = text.split("\n").map((line) => line.substring(0, 20));
  const displayLines = lines.slice(0, config.maxLines);
  const startY = config.lineHeight + 12;

  const textElements = displayLines
    .map((line, index) => {
      const yPosition = startY + index * config.lineHeight;
      return `<text class="display-text" x="15" y="${yPosition}" font-size="${config.size}px">${line}</text>`;
    })
    .join("\n      ");

  const svgTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Ebene_2" data-name="Ebene 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.56 70.87">
  <defs>
    <style>
      .cls-1 {
        fill: #063;
      }

      .cls-2 {
        fill: #1d1d1b;
      }
      .display-text {
        fill: #ffffff;
        font-family: Arial, sans-serif;
        font-weight: bold;
      }
    </style>
  </defs>
  <g id="Ebene_1-2" data-name="Ebene 1">
    <g id="OLED">
      <path class="cls-1" d="M119.06,0H8.5C3.81,0,0,3.81,0,8.5v53.86c0,4.7,3.81,8.5,8.5,8.5h110.55c4.7,0,8.5-3.81,8.5-8.5V8.5c0-4.7-3.81-8.5-8.5-8.5ZM7.09,68.03c-2.35,0-4.25-1.9-4.25-4.25s1.9-4.25,4.25-4.25,4.25,1.9,4.25,4.25-1.9,4.25-4.25,4.25ZM7.09,11.34c-2.35,0-4.25-1.9-4.25-4.25s1.9-4.25,4.25-4.25,4.25,1.9,4.25,4.25-1.9,4.25-4.25,4.25ZM120.47,68.03c-2.35,0-4.25-1.9-4.25-4.25s1.9-4.25,4.25-4.25,4.25,1.9,4.25,4.25-1.9,4.25-4.25,4.25ZM120.47,11.34c-2.35,0-4.25-1.9-4.25-4.25s1.9-4.25,4.25-4.25,4.25,1.9,4.25,4.25-1.9,4.25-4.25,4.25Z"/>
      <polygon class="cls-2" points="14.17 11.34 14.17 55.98 32.03 64.91 43.94 64.91 43.94 70.87 83.62 70.87 83.62 64.91 95.53 64.91 113.39 55.98 113.39 11.34 14.17 11.34"/>
      ${textElements}
    </g>
  </g>
</svg>`;

  return svgToDataUri(svgTemplate);
}

function generateMeasurementDisplaySvg(value = "0", title = "", unit = "") {
  const displayValue = value.toString().substring(0, 10);
  const displayTitle = title.toString().substring(0, 15);
  const displayUnit = unit.toString().replace(/°/g, "&#176;").substring(0, 8);

  const svgTemplate = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   id="Ebene_2"
   data-name="Ebene 2"
   viewBox="0 0 127.56 70.87"
   version="1.1"
   xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .cls-1 {
        fill: #063;
      }
      .cls-2 {
        fill: #1d1d1b;
      }
      .display-text {
        fill: #ffffff;
        font-family: Arial, sans-serif;
        font-weight: bold;
      }
      .display-value {
        fill: #ffffff;
        font-family: Arial, sans-serif;
        font-weight: bold;
        font-size: 20px;
      }
      .display-unit {
        fill: #ffffff;
        font-family: Arial, sans-serif;
        font-weight: normal;
        font-size: 10px;
      }
      .display-title {
        fill: #ffffff;
        font-family: Arial, sans-serif;
        font-weight: normal;
        font-size: 8px;
      }
    </style>
  </defs>
  <g id="Ebene_1-2" data-name="Ebene 1">
    <g>
      <path class="cls-1" d="M119.06,0H8.5C3.81,0,0,3.81,0,8.5v53.86c0,4.7,3.81,8.5,8.5,8.5h110.55c4.7,0,8.5-3.81,8.5-8.5V8.5c0-4.7-3.81-8.5-8.5-8.5ZM7.09,68.03c-2.35,0-4.25-1.9-4.25-4.25s1.9-4.25,4.25-4.25,4.25,1.9,4.25,4.25-1.9,4.25-4.25,4.25ZM7.09,11.34c-2.35,0-4.25-1.9-4.25-4.25s1.9-4.25,4.25-4.25,4.25,1.9,4.25,4.25-1.9,4.25-4.25,4.25ZM120.47,68.03c-2.35,0-4.25-1.9-4.25-4.25s1.9-4.25,4.25-4.25,4.25,1.9,4.25,4.25-1.9,4.25-4.25,4.25ZM120.47,11.34c-2.35,0-4.25-1.9-4.25-4.25s1.9-4.25,4.25-4.25,4.25,1.9,4.25,4.25-1.9,4.25-4.25,4.25Z"/>
      <polygon class="cls-2" points="14.17 11.34 14.17 55.98 32.03 64.91 43.94 64.91 43.94 70.87 83.62 70.87 83.62 64.91 95.53 64.91 113.39 55.98 113.39 11.34 14.17 11.34"/>
      <text class="display-value" x="30" y="37">${displayValue}</text>
      <text class="display-unit" x="85" y="35">${displayUnit}</text>
      <text class="display-title" x="30" y="50">${displayTitle}</text>
    </g>
  </g>
</svg>`;

  return svgToDataUri(svgTemplate);
}

Blockly.defineBlocksWithJsonArray([
  {
    type: "display_clear_basic",
    message0: "Display löschen",
    previousStatement: null,
    nextStatement: null,
    colour: "#62A044  ",
    tooltip: "Löscht alle Inhalte auf dem Display",
    helpUrl: "",
  },
]);

Blockly.Blocks["display_print_basic"] = {
  init: function () {
    this.appendDummyInput("ZEIGE").appendField(
      new Blockly.FieldLabel("Zeige :", undefined, { bold: true }),
    );

    this.appendValueInput("TEXT").appendField(
      new Blockly.FieldImage(generateDisplaySvg("", "s"), 160, 90, "*"),
      "DISPLAY_ICON",
    );

    this.appendDummyInput("CLEAR_OPTION")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "CLEAR")
      .appendField("Display vor Anzeige löschen");

    this.appendDummyInput("FONT_SIZE")
      .appendField("Größe:")
      .appendField(
        new Blockly.FieldDropdown([
          ["Klein", "s"],
          ["Mittel", "m"],
          ["Groß", "l"],
        ]),
        "SIZE",
      );

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#62A044");
    this.setTooltip("Zeigt einen Text auf dem Display an");
    this.setHelpUrl("");

    this.setOnChange(this.onChange_.bind(this));
  },

  onChange_: function (event) {
    if (!this.workspace || this.isInFlyout) return;

    if (
      event &&
      (event.type === Blockly.Events.BLOCK_CHANGE ||
        event.type === Blockly.Events.BLOCK_MOVE)
    ) {
      this.updateDisplay();
    }
  },

  updateDisplay: function () {
    const fontSize = this.getFieldValue("SIZE") || "s";
    const allTexts = [];
    let currentBlock = this;

    while (currentBlock) {
      if (currentBlock.type === "display_print_basic") {
        const textInput = currentBlock.getInputTargetBlock("TEXT");
        if (textInput) {
          const textField = textInput.getFieldValue("TEXT");
          if (textField !== null && textField !== undefined) {
            allTexts.unshift(textField);
          }
        }

        try {
          const isClear =
            currentBlock.getFieldValue &&
            currentBlock.getFieldValue("CLEAR") === "TRUE";
          if (isClear) {
            break;
          }
        } catch (e) {
          // ignore if field missing
        }
      }

      const previousConnection = currentBlock.previousConnection;
      if (previousConnection && previousConnection.targetConnection) {
        currentBlock = previousConnection.targetConnection.getSourceBlock();
      } else {
        break;
      }
    }

    const combinedText = allTexts.join("\n");
    const displayField = this.getField("DISPLAY_ICON");
    if (displayField) {
      displayField.setValue(generateDisplaySvg(combinedText, fontSize));
    }

    this.updateFollowingDisplays();
  },

  updateFollowingDisplays: function () {
    let nextBlock = this.nextConnection?.targetBlock();
    while (nextBlock) {
      if (nextBlock.type === "display_print_basic" && nextBlock.updateDisplay) {
        nextBlock.updateDisplay();
      }
      nextBlock = nextBlock.nextConnection?.targetBlock();
    }
  },
};

Blockly.Blocks["display_show_measurement"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldLabel("Zeige Messwert", undefined),
    );

    this.appendValueInput("VALUE")
      .setCheck(null)
      .appendField(
        new Blockly.FieldImage(
          generateMeasurementDisplaySvg("0", "", ""),
          160,
          90,
          "*",
        ),
        "DISPLAY_ICON",
      );

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#62A044");
    this.setTooltip(
      "Zeigt einen Messwert mit Titel und Einheit formatiert auf dem Display an",
    );
    this.setHelpUrl("");

    this.setOnChange(this.onInputChange.bind(this));
  },

  onInputChange: function (event) {
    if (!this.workspace || this.isInFlyout) return;

    if (
      event &&
      (event.type === Blockly.Events.BLOCK_CHANGE ||
        event.type === Blockly.Events.BLOCK_MOVE)
    ) {
      const allowedSensors = [
        "hdc_tmp",
        "bme_tmp",
        "hdc_humi",
        "bme_humi",
        "bme_pressure",
        "bme_air_quality",
        "basic_brightness",
      ];

      const valueBlock = this.getInputTargetBlock("VALUE");

      if (valueBlock) {
        if (valueBlock.type === "basic_number") {
          this.setWarningText(null);
        } else if (!allowedSensors.includes(valueBlock.type)) {
          const input = this.getInput("VALUE");
          if (input && input.connection && input.connection.targetConnection) {
            input.connection.disconnect();
          }
          this.setWarningText("Nur Sensorblöcke dürfen hier verbunden werden.");
        } else {
          this.setWarningText(null);
        }
      } else {
        this.setWarningText(null);
      }

      this.updateDisplay();
    }
  },

  updateDisplay: function () {
    let value = "0";
    let title = "";
    let unit = "";

    const valueInput = this.getInputTargetBlock("VALUE");

    if (valueInput) {
      const sensorMetadata = {
        hdc_tmp: { title: "Temperatur", unit: "°C", sample: "??.?" },
        bme_tmp: { title: "Temperatur", unit: "°C", sample: "??.?" },
        hdc_humi: { title: "Luftfeuchtigkeit", unit: "%", sample: "??" },
        bme_humi: { title: "Luftfeuchtigkeit", unit: "%", sample: "??" },
        bme_pressure: { title: "Luftdruck", unit: "hPa", sample: "????" },
        bme_air_quality: { title: "Luftqualitaet", unit: "", sample: "??" },
        basic_brightness: { title: "Helligkeit", unit: "lx", sample: "200" },
      };

      const metadata = sensorMetadata[valueInput.type];
      if (metadata) {
        value = metadata.sample;
        title = metadata.title;
        unit = metadata.unit;
      } else if (valueInput.type === "basic_number") {
        value = valueInput.getFieldValue("NUM") || "0";
      }
    }

    const displayField = this.getField("DISPLAY_ICON");
    if (displayField) {
      displayField.setValue(generateMeasurementDisplaySvg(value, title, unit));
    }
  },
};

Blockly.defineBlocksWithJsonArray([
  {
    type: "display_draw_bitmap_basic",
    message0:
      "Paint a custom Bitmap %1 %2 %3 %4 %5 %6 %7 %8 %9 %10 %11 %12 %13 %14 %15 %16 %17 %18 %19 %20 %21 %22 %23 %24 %25 %26 %27 %28 %29 %30 %31 %32 %33 %34 %35 %36 %37 %38 %39 %40 %41 %42 %43 %44 %45 %46 %47 %48 %49 %50 %51 %52 %53 %54 %55 %56 %57 %58 %59 %60 %61 %62 %63 %64 %65 %66 %67 %68 %69 %70 %71 %72",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "field_toggle_colour",
        name: "1,1",
      },
      {
        type: "field_toggle_colour",
        name: "1,2",
      },
      {
        type: "field_toggle_colour",
        name: "1,3",
      },
      {
        type: "field_toggle_colour",
        name: "1,4",
      },
      {
        type: "field_toggle_colour",
        name: "1,5",
      },
      {
        type: "field_toggle_colour",
        name: "1,6",
      },
      {
        type: "field_toggle_colour",
        name: "1,7",
      },
      {
        type: "field_toggle_colour",
        name: "1,8",
      },
      {
        type: "input_dummy",
      },
      {
        name: "2,1",
        type: "field_toggle_colour",
      },
      {
        type: "field_toggle_colour",
        name: "2,2",
      },
      {
        type: "field_toggle_colour",
        name: "2,3",
      },
      {
        type: "field_toggle_colour",
        name: "2,4",
      },
      {
        type: "field_toggle_colour",
        name: "2,5",
      },
      {
        type: "field_toggle_colour",
        name: "2,6",
      },
      {
        type: "field_toggle_colour",
        name: "2,7",
      },
      {
        type: "field_toggle_colour",
        name: "2,8",
      },
      {
        type: "input_dummy",
      },
      {
        type: "field_toggle_colour",
        name: "3,1",
      },
      {
        type: "field_toggle_colour",
        name: "3,2",
      },
      {
        type: "field_toggle_colour",
        name: "3,3",
      },
      {
        type: "field_toggle_colour",
        name: "3,4",
      },
      {
        type: "field_toggle_colour",
        name: "3,5",
      },
      {
        type: "field_toggle_colour",
        name: "3,6",
      },
      {
        type: "field_toggle_colour",
        name: "3,7",
      },
      {
        type: "field_toggle_colour",
        name: "3,8",
      },
      {
        type: "input_dummy",
      },
      {
        type: "field_toggle_colour",
        name: "4,1",
      },
      {
        type: "field_toggle_colour",
        name: "4,2",
      },
      {
        type: "field_toggle_colour",
        name: "4,3",
      },
      {
        type: "field_toggle_colour",
        name: "4,4",
      },
      {
        type: "field_toggle_colour",
        name: "4,5",
      },
      {
        type: "field_toggle_colour",
        name: "4,6",
      },
      {
        type: "field_toggle_colour",
        name: "4,7",
      },
      {
        type: "field_toggle_colour",
        name: "4,8",
      },
      {
        type: "input_dummy",
      },
      {
        type: "field_toggle_colour",
        name: "5,1",
      },
      {
        type: "field_toggle_colour",
        name: "5,2",
      },
      {
        type: "field_toggle_colour",
        name: "5,3",
      },
      {
        type: "field_toggle_colour",
        name: "5,4",
      },
      {
        type: "field_toggle_colour",
        name: "5,5",
      },
      {
        type: "field_toggle_colour",
        name: "5,6",
      },
      {
        type: "field_toggle_colour",
        name: "5,7",
      },
      {
        type: "field_toggle_colour",
        name: "5,8",
      },
      {
        type: "input_dummy",
      },
      {
        type: "field_toggle_colour",
        name: "6,1",
      },
      {
        type: "field_toggle_colour",
        name: "6,2",
      },
      {
        type: "field_toggle_colour",
        name: "6,3",
      },
      {
        type: "field_toggle_colour",
        name: "6,4",
      },
      {
        type: "field_toggle_colour",
        name: "6,5",
      },
      {
        type: "field_toggle_colour",
        name: "6,6",
      },
      {
        type: "field_toggle_colour",
        name: "6,7",
      },
      {
        type: "field_toggle_colour",
        name: "6,8",
      },
      {
        type: "input_dummy",
      },
      {
        type: "field_toggle_colour",
        name: "7,1",
      },
      {
        type: "field_toggle_colour",
        name: "7,2",
      },
      {
        type: "field_toggle_colour",
        name: "7,3",
      },
      {
        type: "field_toggle_colour",
        name: "7,4",
      },
      {
        type: "field_toggle_colour",
        name: "7,5",
      },
      {
        type: "field_toggle_colour",
        name: "7,6",
      },
      {
        type: "field_toggle_colour",
        name: "7,7",
      },
      {
        type: "field_toggle_colour",
        name: "7,8",
      },
      {
        type: "input_dummy",
      },
      {
        type: "field_toggle_colour",
        name: "8,1",
      },
      {
        type: "field_toggle_colour",
        name: "8,2",
      },
      {
        type: "field_toggle_colour",
        name: "8,3",
      },
      {
        type: "field_toggle_colour",
        name: "8,4",
      },
      {
        type: "field_toggle_colour",
        name: "8,5",
      },
      {
        type: "field_toggle_colour",
        name: "8,6",
      },
      {
        type: "field_toggle_colour",
        name: "8,7",
      },
      {
        type: "field_toggle_colour",
        name: "8,8",
      },
    ],
    nextStatement: null,
    previousStatement: null,
    colour: getColour().sensebox,
    tooltip: Blockly.Msg.senseBox_ws2812_rgb_matrix_draw_bitmap_tooltip,
    helpUrl: Blockly.Msg.senseBox_ws2812_rgb_matrix_helpurl,
  },
]);
