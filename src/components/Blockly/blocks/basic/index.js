import * as Blockly from "blockly/core";
import { getColour } from "@/components/Blockly/helpers/colour";
import * as Types from "@/components/Blockly/helpers/types";

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
    colour: "#5ba55b",
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
    colour: "#5ba55b",
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
    colour: "#5ba55b",
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
    colour: "#5ba55b",
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

// Helper function to generate dynamic display SVG with text
function generateDisplaySvg(text = "") {
  const displayText = text.substring(0, 20); // Limit to 20 characters

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
        font-size: 8px;
        font-weight: bold;
      }
    </style>
  </defs>
  <g id="Ebene_1-2" data-name="Ebene 1">
    <g>
      <path
         class="cls-1"
         d="M119.06,0H8.5C3.81,0,0,3.81,0,8.5v53.86c0,4.7,3.81,8.5,8.5,8.5h110.55c4.7,0,8.5-3.81,8.5-8.5V8.5c0-4.7-3.81-8.5-8.5-8.5ZM7.09,68.03c-2.35,0-4.25-1.9-4.25-4.25s1.9-4.25,4.25-4.25,4.25,1.9,4.25,4.25-1.9,4.25-4.25,4.25ZM7.09,11.34c-2.35,0-4.25-1.9-4.25-4.25s1.9-4.25,4.25-4.25,4.25,1.9,4.25,4.25-1.9,4.25-4.25,4.25ZM120.47,68.03c-2.35,0-4.25-1.9-4.25-4.25s1.9-4.25,4.25-4.25,4.25,1.9,4.25,4.25-1.9,4.25-4.25,4.25ZM120.47,11.34c-2.35,0-4.25-1.9-4.25-4.25s1.9-4.25,4.25-4.25,4.25,1.9,4.25,4.25-1.9,4.25-4.25,4.25Z" />
      <polygon
         class="cls-2"
         points="41.1,65.2 49.61,65.2 49.61,70.87 77.95,70.87 77.95,65.2 86.46,65.2 99.21,56.69 99.21,14.17 28.35,14.17 28.35,56.69 "
         transform="matrix(1.50884,0,0,1.0616933,-30.839346,-4.3722025)"
         style="fill:#1d1d1b;fill-opacity:1" />
      <text class="display-text" x="15" y="25">${displayText}</text>
    </g>
  </g>
</svg>`;

  return "data:image/svg+xml;base64," + btoa(svgTemplate);
}

Blockly.Blocks["display_print_basic"] = {
  init: function () {
    this.appendDummyInput("DISPLAY_IMAGE").appendField(
      new Blockly.FieldImage(generateDisplaySvg(""), 160, 90, "*"),
      "DISPLAY_ICON",
    );

    this.appendValueInput("TEXT")
      .setCheck("String")
      .appendField(
        new Blockly.FieldLabel("Zeige :", undefined, { bold: true }),
      );

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#5ba55b");
    this.setTooltip("Zeigt einen Text auf dem Display an");
    this.setHelpUrl("");

    this.setOnChange(this.onTextChange.bind(this));
  },

  onTextChange: function (changeEvent) {
    if (!this.workspace || this.isInFlyout) return;

    if (
      changeEvent.type === Blockly.Events.BLOCK_CHANGE ||
      changeEvent.type === Blockly.Events.BLOCK_MOVE
    ) {
      const textInput = this.getInputTargetBlock("TEXT");

      if (textInput) {
        let displayText = "";

        if (textInput.type === "text") {
          displayText = textInput.getFieldValue("TEXT") || "";
        } else if (textInput.type === "basic_number") {
          displayText = textInput.getFieldValue("NUM") || "";
        }

        this.updateDisplayImage(displayText);
      } else {
        this.updateDisplayImage("");
      }
    }
  },

  updateDisplayImage: function (text) {
    const displayImageInput = this.getInput("DISPLAY_IMAGE");
    if (displayImageInput) {
      const field = this.getField("DISPLAY_ICON");
      if (field) {
        field.setValue(generateDisplaySvg(text));
      }
    }
  },
};

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

// Number block with configurable color via toolbox data attribute
Blockly.Blocks["basic_number"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldNumber(0, null, null, 1),
      "NUM",
    );
    this.setOutput(true, "String");
    this.setColour("#6b75a6"); // default color
    this.setTooltip("Zahl");
    this.setHelpUrl("");

    // Apply custom color from toolbox data if provided
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
    output: "String",
    colour: "#a5675b",
    inputsInline: true,
    tooltip: "Vergleicht zwei Werte",
    helpUrl: "",
  },
]);

Blockly.Blocks["basic_if_else"] = {
  /**
   * Block for if/elseif/else condition.
   * @this Blockly.Block
   */
  init: function () {
    this.appendValueInput("IF0").setCheck("String").appendField("wenn");
    this.appendStatementInput("DO0").appendField("mache");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#a5675b");
    this.setTooltip("Wenn / sonst Verzweigung");
    this.setInputsInline(false);

    this.setMutator(
      new Blockly.icons.MutatorIcon(["basic_if_elseif", "basic_else"], this),
    );
    this.elseifCount_ = 0;
    this.elseCount_ = 0;
  },
  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    if (!this.elseifCount_ && !this.elseCount_) {
      return null;
    }
    var container = document.createElement("mutation");
    if (this.elseifCount_) {
      container.setAttribute("elseif", this.elseifCount_);
    }
    if (this.elseCount_) {
      container.setAttribute("else", 1);
    }
    return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    this.elseifCount_ = parseInt(xmlElement.getAttribute("elseif"), 10) || 0;
    this.elseCount_ = parseInt(xmlElement.getAttribute("else"), 10) || 0;
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function (workspace) {
    var containerBlock = workspace.newBlock("basic_if_if");
    containerBlock.initSvg();
    var connection = containerBlock.nextConnection;
    for (var i = 1; i <= this.elseifCount_; i++) {
      var elseifBlock = workspace.newBlock("basic_if_elseif");
      elseifBlock.initSvg();
      connection.connect(elseifBlock.previousConnection);
      connection = elseifBlock.nextConnection;
    }
    if (this.elseCount_) {
      var elseBlock = workspace.newBlock("basic_else");
      elseBlock.initSvg();
      connection.connect(elseBlock.previousConnection);
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function (containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    // Count number of inputs.
    this.elseifCount_ = 0;
    this.elseCount_ = 0;
    var valueConnections = [null];
    var statementConnections = [null];
    var elseStatementConnection = null;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case "basic_if_elseif":
          this.elseifCount_++;
          valueConnections.push(clauseBlock.valueConnection_);
          statementConnections.push(clauseBlock.statementConnection_);
          break;
        case "basic_else":
          this.elseCount_++;
          elseStatementConnection = clauseBlock.statementConnection_;
          break;
        default:
          throw new Error("Unknown block type.");
      }
      clauseBlock =
        clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
    }
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 1; i <= this.elseifCount_; i++) {
      if (valueConnections[i]) {
        valueConnections[i].reconnect(this, "IF" + i);
      }
      if (statementConnections[i]) {
        statementConnections[i].reconnect(this, "DO" + i);
      }
    }
    if (elseStatementConnection) {
      elseStatementConnection.reconnect(this, "ELSE");
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function (containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    var i = 1;
    var inputDo;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case "basic_if_elseif":
          var inputIf = this.getInput("IF" + i);
          inputDo = this.getInput("DO" + i);
          clauseBlock.valueConnection_ =
            inputIf && inputIf.connection.targetConnection;
          clauseBlock.statementConnection_ =
            inputDo && inputDo.connection.targetConnection;
          i++;
          break;
        case "basic_else":
          inputDo = this.getInput("ELSE");
          clauseBlock.statementConnection_ =
            inputDo && inputDo.connection.targetConnection;
          break;
        default:
          throw new Error("Unknown block type.");
      }
      clauseBlock =
        clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function () {
    // Delete everything.
    if (this.getInput("ELSE")) {
      this.removeInput("ELSE");
    }
    var j = 1;
    while (this.getInput("IF" + j)) {
      this.removeInput("IF" + j);
      this.removeInput("DO" + j);
      j++;
    }
    // Rebuild block.
    for (var i = 1; i <= this.elseifCount_; i++) {
      this.appendValueInput("IF" + i)
        .setCheck("String")
        .appendField("sonst wenn");
      this.appendStatementInput("DO" + i).appendField("mache");
    }
    if (this.elseCount_) {
      this.appendStatementInput("ELSE").appendField("sonst");
    }
  },
};

Blockly.Blocks["basic_if_if"] = {
  init: function () {
    this.setColour("#5C81A6");
    this.appendDummyInput().appendField("wenn");
    this.setNextStatement(true);
    this.setTooltip("Wenn-Block");
    this.contextMenu = false;
  },
};

Blockly.Blocks["basic_if_elseif"] = {
  init: function () {
    this.setColour("#5C81A6");
    this.appendDummyInput().appendField("sonst wenn");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Sonst-wenn Bedingung");
    this.contextMenu = false;
  },
};

Blockly.Blocks["basic_else"] = {
  init: function () {
    this.setColour("#5C81A6");
    this.appendDummyInput().appendField("sonst");
    this.setPreviousStatement(true);
    this.setTooltip("Sonst-Bedingung");
    this.contextMenu = false;
  },
};

Blockly.Blocks["basic_if_else2"] = {
  init: function () {
    this.appendValueInput("COND").setCheck("String").appendField("Wenn");

    this.appendStatementInput("DO").appendField("mache");

    this.appendStatementInput("ELSE").appendField("sonst");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#5C81A6");
    this.setTooltip("Wenn / sonst Verzweigung");
    this.setInputsInline(false);

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
    message0: "Wiederhole %1 mal %2",
    args0: [
      {
        type: "input_value",
        name: "TIMES",
        check: "String",
      },
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: "#a5675b",
    tooltip: "Wiederholt die enthaltenen Blöcke eine bestimmte Anzahl an Malen",
    helpUrl: "",
  },
]);

// Helper function to generate dynamic timer SVG with seconds display
function generateTimerSvg(seconds) {
  const sec = Math.max(0, Math.min(30, parseInt(seconds) || 1));
  const displayText = sec.toString();

  // Calculate font size based on number of digits (adjust for better fit)
  let fontSize = 24;
  if (displayText.length > 2) {
    fontSize = 18;
  } else if (displayText.length > 3) {
    fontSize = 14;
  }

  // Generate arc path based on seconds (0-30s maps to 0-360 degrees)
  // Center: (28.35, 40.79), Radius: 19.84
  const centerX = 28.35;
  const centerY = 40.79;
  const radius = 19.84;

  // Calculate angle (0 seconds = 0°, 30 seconds = 360°)
  const angle = (sec / 10) * 360;

  // Generate arc path for the filled portion
  let arcPath = "";
  if (sec > 0) {
    if (angle >= 360) {
      // Full circle
      arcPath = `M ${centerX},${centerY} m ${-radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 ${-radius * 2},0`;
    } else {
      // Start from top (12 o'clock = -90 degrees)
      const startAngle = -90;
      const endAngle = startAngle + angle;

      // Convert to radians
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      // Calculate start and end points
      const startX = centerX + radius * Math.cos(startRad);
      const startY = centerY + radius * Math.sin(startRad);
      const endX = centerX + radius * Math.cos(endRad);
      const endY = centerY + radius * Math.sin(endRad);

      // Large arc flag: 1 if angle > 180°, 0 otherwise
      const largeArc = angle > 180 ? 1 : 0;

      // Create path: move to center, line to start, arc to end, close path
      arcPath = `M ${centerX},${centerY} L ${startX},${startY} A ${radius},${radius} 0 ${largeArc},1 ${endX},${endY} Z`;
    }
  }

  const svgTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Ebene_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56.69 69.14">
  <defs>
    <style>
      .cls-1 { fill: none; }
      .cls-2 { fill: #1d1d1b; }
      .cls-3 { fill: #c6c6c6; }
      .timer-text { 
        fill: #1d1d1b; 
        font-family: Arial, sans-serif; 
        font-size: ${fontSize}px; 
        font-weight: bold;
        text-anchor: middle;
      }
    </style>
  </defs>
  <g id="Ebene_1-2">
    <g id="Timer">
      <path class="cls-2" d="M50.81,23.52l4.05-4.05c.55-.55.55-1.45,0-2l-3.19-3.19c-.55-.55-1.45-.55-2,0l-4.05,4.05c-3.9-3-8.6-5.01-13.73-5.65v-5.59h2.83c.78,0,1.42-.63,1.42-1.42V1.42c0-.78-.63-1.42-1.42-1.42h-12.76c-.78,0-1.42.63-1.42,1.42v4.25c0,.78.63,1.42,1.42,1.42h2.83v5.59C10.82,14.42,0,26.34,0,40.79c0,15.65,12.69,28.35,28.35,28.35s28.35-12.69,28.35-28.35c0-6.5-2.2-12.49-5.88-17.28ZM28.35,64.18c-12.92,0-23.39-10.47-23.39-23.39s10.47-23.39,23.39-23.39,23.39,10.47,23.39,23.39-10.47,23.39-23.39,23.39Z"/>
      ${arcPath ? `<path class="cls-3" d="${arcPath}"/>` : ""}
      <text class="timer-text" x="28.35" y="48">${displayText}s</text>
    </g>
  </g>
</svg>`;

  return "data:image/svg+xml;base64," + btoa(svgTemplate);
}

// Helper function to generate a simple button SVG
function generateButtonSvg(text, color = "#5ba55b") {
  const svgTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30">
  <defs>
    <style>
      .btn-bg { fill: ${color}; cursor: pointer; }
      .btn-text { 
        fill: #ffffff; 
        font-family: Arial, sans-serif; 
        font-size: 14px; 
        font-weight: bold;
        text-anchor: middle;
      }
    </style>
  </defs>
  <rect class="btn-bg" x="1" y="1" width="48" height="28" rx="5" stroke="#4a8a4a" stroke-width="2"/>
  <text class="btn-text" x="25" y="20">${text}</text>
</svg>`;
  return "data:image/svg+xml;base64," + btoa(svgTemplate);
}

// Helper function to generate stacked buttons SVG (plus and minus)
function generateStackedButtonsSvg() {
  const svgTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 65">
  <defs>
    <style>
      .btn-plus-bg { fill: #5ba55b; cursor: pointer; }
      .btn-minus-bg { fill: #c93939; cursor: pointer; }
      .btn-text { 
        fill: #ffffff; 
        font-family: Arial, sans-serif; 
        font-size: 14px; 
        font-weight: bold;
        text-anchor: middle;
      }
    </style>
  </defs>
  <g class="plus-button">
    <rect class="btn-plus-bg" x="1" y="1" width="48" height="28" rx="5" stroke="#4a8a4a" stroke-width="2"/>
    <text class="btn-text" x="25" y="20">+1s</text>
  </g>
  <g class="minus-button">
    <rect class="btn-minus-bg" x="1" y="34" width="48" height="28" rx="5" stroke="#a02020" stroke-width="2"/>
    <text class="btn-text" x="25" y="53">-1s</text>
  </g>
</svg>`;
  return "data:image/svg+xml;base64," + btoa(svgTemplate);
}

Blockly.Blocks["basic_delay"] = {
  init: function () {
    const buttonsField = new Blockly.FieldImage(
      generateStackedButtonsSvg(),
      50,
      65,
      "buttons",
      this.handleButtonClick.bind(this),
    );

    this.appendDummyInput("TIMER_IMAGE")
      .appendField(
        new Blockly.FieldImage(generateTimerSvg(1), 60, 60, "*"),
        "TIMER_ICON",
      )
      .appendField(buttonsField);

    this.appendDummyInput().appendField("Warte");

    this.appendValueInput("SECONDS")
      .setCheck("String")
      .appendField("Sekunden:");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#a5675b");
    this.setTooltip("Warte eine bestimmte Anzahl von Sekunden");
    this.setHelpUrl("");

    this.setOnChange(this.onSecondsChange.bind(this));
  },

  handleButtonClick: function (field) {
    // Get click position relative to the image
    const clickEvent = window.event;
    if (!clickEvent) return;

    const rect = clickEvent.target.getBoundingClientRect();
    const y = clickEvent.clientY - rect.top;

    // Determine which button was clicked based on Y position
    if (y < 32) {
      // Plus button (top half)
      this.increaseSeconds();
    } else {
      // Minus button (bottom half)
      this.decreaseSeconds();
    }
  },

  increaseSeconds: function () {
    const secondsInput = this.getInputTargetBlock("SECONDS");

    if (secondsInput && secondsInput.type === "basic_number") {
      const currentValue = parseInt(secondsInput.getFieldValue("NUM")) || 0;
      const newValue = currentValue + 1;
      secondsInput.setFieldValue(newValue, "NUM");
      this.updateTimerImage(newValue);
    }
  },

  decreaseSeconds: function () {
    const secondsInput = this.getInputTargetBlock("SECONDS");

    if (secondsInput && secondsInput.type === "basic_number") {
      const currentValue = parseInt(secondsInput.getFieldValue("NUM")) || 0;
      const newValue = Math.max(0, currentValue - 1);
      secondsInput.setFieldValue(newValue, "NUM");
      this.updateTimerImage(newValue);
    }
  },

  onSecondsChange: function (changeEvent) {
    if (!this.workspace || this.isInFlyout) return;

    if (
      changeEvent.type === Blockly.Events.BLOCK_CHANGE ||
      changeEvent.type === Blockly.Events.BLOCK_MOVE
    ) {
      const secondsInput = this.getInputTargetBlock("SECONDS");

      if (secondsInput && secondsInput.type === "basic_number") {
        const seconds = secondsInput.getFieldValue("NUM");
        if (seconds !== null && seconds !== undefined) {
          this.updateTimerImage(seconds);
        }
      }
    }
  },

  updateTimerImage: function (seconds) {
    const timerImageInput = this.getInput("TIMER_IMAGE");
    if (timerImageInput) {
      const field = this.getField("TIMER_ICON");
      if (field) {
        field.setValue(generateTimerSvg(seconds));
      }
    }
  },
};

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
    this.setColour("#5ba55b");
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

      if (colorInput) {
        if (colorInput.type === "colour_picker") {
          const color = colorInput.getFieldValue("COLOUR");
          if (color) {
            this.updateLEDImage(color);
          }
        } else if (colorInput.type === "basic_rgb_color") {
          // Get RGB values from connected number blocks
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

// Helper function to generate RGB color preview SVG
function generateRGBSvg(r, g, b) {
  // Clamp values between 0 and 255
  const red = Math.max(0, Math.min(255, parseInt(r) || 0));
  const green = Math.max(0, Math.min(255, parseInt(g) || 0));
  const blue = Math.max(0, Math.min(255, parseInt(b) || 0));

  // Convert to hex color
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

Blockly.Blocks["basic_rgb_color"] = {
  init: function () {
    this.appendDummyInput("RGB_IMAGE").appendField(
      new Blockly.FieldImage(generateRGBSvg(255, 0, 0), 80, 80, "*"),
      "RGB_ICON",
    );

    this.appendDummyInput().appendField("RGB Farbe");
    this.appendValueInput("R").setCheck("String").appendField("Rot:");

    this.appendValueInput("G").setCheck("String").appendField("Grün:");

    this.appendValueInput("B").setCheck("String").appendField("Blau:");

    this.setOutput(true, "Colour");
    this.setColour("#5ba55b");
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

      if (
        rInput &&
        rInput.type === "basic_number" &&
        gInput &&
        gInput.type === "basic_number" &&
        bInput &&
        bInput.type === "basic_number"
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

Blockly.defineBlocksWithJsonArray([
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
    colour: "#5CA65C",
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
    colour: "#5CA65C",
    inputsInline: true,
    tooltip: "Erzeugt eine Zufallszahl in einem Bereich",
    helpUrl: "",
  },
]);

// Icon paths for basic blocks
const BUTTON_ICON = "media/basic/finger-click-svgrepo-com.svg";
const SHAKE_ICON = "media/basic/hand-shake-svgrepo-com.svg";
const AIR_QUALITY_ICON =
  "media/basic/smoke-industrial-polution-pollute-svgrepo-com.svg";
const BRIGHTNESS_ICON = "media/basic/brightness-svgrepo-com.svg";

Blockly.defineBlocksWithJsonArray([
  {
    type: "basic_button_pressed",
    message0: "%1 %2",
    args0: [
      {
        type: "field_image",
        src: BUTTON_ICON,
        width: 60,
        height: 60,
        alt: "*",
      },
      {
        type: "field_label",
        text: "Knopf gedrückt?",
      },
    ],
    output: "String",
    colour: "#5C81A6",
    tooltip: "Überprüft ob der Knopf gedrückt wurde",
    helpUrl: "",
  },
  {
    type: "basic_box_shaken",
    message0: "%1 %2",
    args0: [
      {
        type: "field_image",
        src: SHAKE_ICON,
        width: 60,
        height: 60,
        alt: "*",
      },
      {
        type: "field_label",
        text: "senseBox geschüttelt?",
      },
    ],
    output: "String",
    colour: "#5C81A6",
    tooltip: "Überprüft ob die senseBox geschüttelt wurde",
    helpUrl: "",
  },
  {
    type: "basic_air_quality",
    message0: "%1 \n %2",
    args0: [
      {
        type: "field_image",
        src: AIR_QUALITY_ICON,
        width: 90,
        height: 90,
        alt: "*",
      },
      {
        type: "field_label",
        text: "Luftqualität",
        bold: true,
      },
    ],
    output: "String",
    colour: "#62A044  ",
  },
  {
    type: "basic_brightness",
    message0: "%1 \n %2",
    args0: [
      {
        type: "field_image",
        src: BRIGHTNESS_ICON,
        width: 90,
        height: 90,
        alt: "*",
      },
      {
        type: "field_label",
        text: "Helligkeit",
        bold: true,
      },
    ],
    output: "String",
    colour: "#62A044  ",
  },
]);
