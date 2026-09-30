import * as Blockly from "blockly/core";
import { getColour } from "@/components/Blockly/helpers/colour";

function svgToDataUri(svg) {
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

function generateStackedButtonsSvg(unit) {
  const svgTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 65">
  <defs>
    <style>
      .btn-plus-bg { fill: #62A044; cursor: pointer; }
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
    <text class="btn-text" x="25" y="20">+1${unit}</text>
  </g>
  <g class="minus-button">
    <rect class="btn-minus-bg" x="1" y="34" width="48" height="28" rx="5" stroke="#a02020" stroke-width="2"/>
    <text class="btn-text" x="25" y="53">-1${unit}</text>
  </g>
</svg>`;
  return svgToDataUri(svgTemplate);
}

function buildTimerSvg(displayText, fontSize, arcPath) {
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
      <text class="timer-text" x="28.35" y="48">${displayText}</text>
    </g>
  </g>
</svg>`;

  return svgToDataUri(svgTemplate);
}

function buildArc(value, max) {
  const centerX = 28.35;
  const centerY = 40.79;
  const radius = 19.84;
  const angle = (value / max) * 360;

  if (value <= 0) {
    return "";
  }

  if (angle >= 360) {
    return `M ${centerX},${centerY} m ${-radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 ${-radius * 2},0`;
  }

  const startAngle = -90;
  const endAngle = startAngle + angle;
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const startX = centerX + radius * Math.cos(startRad);
  const startY = centerY + radius * Math.sin(startRad);
  const endX = centerX + radius * Math.cos(endRad);
  const endY = centerY + radius * Math.sin(endRad);
  const largeArc = angle > 180 ? 1 : 0;

  return `M ${centerX},${centerY} L ${startX},${startY} A ${radius},${radius} 0 ${largeArc},1 ${endX},${endY} Z`;
}

function getFontSize(displayText) {
  if (displayText.length > 3) return 14;
  if (displayText.length > 2) return 18;
  return 24;
}

function generateTimerSvg(seconds) {
  const sec = Math.max(0, Math.min(30, parseInt(seconds) || 1));
  const displayText = `${sec}s`;
  return buildTimerSvg(
    displayText,
    getFontSize(String(sec)),
    buildArc(sec, 10),
  );
}

function generateTimerSvgMinutes(minutes) {
  const min = Math.max(0, Math.min(60, parseInt(minutes) || 1));
  const displayText = `${min}m`;
  return buildTimerSvg(
    displayText,
    getFontSize(String(min)),
    buildArc(min, 60),
  );
}

function generateTimerSvgHours(hours) {
  const hrs = Math.max(0, Math.min(24, parseInt(hours) || 1));
  const displayText = `${hrs}h`;
  return buildTimerSvg(
    displayText,
    getFontSize(String(hrs)),
    buildArc(hrs, 24),
  );
}

Blockly.defineBlocksWithJsonArray([
  {
    type: "time_delay_1s",
    message0: "%1",
    args0: [
      {
        type: "field_image",
        src: "/media/hardware/icons/Icon_Timer_1s.svg",
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
        src: "/media/hardware/icons/Icon_Timer_2s.svg",
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
        src: "/media/hardware/icons/Icon_Timer_5s.svg",
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
    type: "time_delay_1min",
    message0: "%1 Minute",
    args0: [
      {
        type: "field_label",
        text: "1",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: getColour().time,
    helpUrl: "http://arduino.cc/en/Reference/Delay",
  },
  {
    type: "time_delay_5min",
    message0: "%1 Minuten",
    args0: [
      {
        type: "field_label",
        text: "5",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: getColour().time,
    helpUrl: "http://arduino.cc/en/Reference/Delay",
  },
  {
    type: "time_delay_10min",
    message0: "%1 Minuten",
    args0: [
      {
        type: "field_label",
        text: "10",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: getColour().time,
    helpUrl: "http://arduino.cc/en/Reference/Delay",
  },
  {
    type: "time_delay_1h",
    message0: "%1 Stunde",
    args0: [
      {
        type: "field_label",
        text: "1",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: getColour().time,
    helpUrl: "http://arduino.cc/en/Reference/Delay",
  },
  {
    type: "time_delay_5h",
    message0: "%1 Stunden",
    args0: [
      {
        type: "field_label",
        text: "5",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: getColour().time,
    helpUrl: "http://arduino.cc/en/Reference/Delay",
  },
]);

Blockly.Blocks["basic_delay"] = {
  init: function () {
    const buttonsField = new Blockly.FieldImage(
      generateStackedButtonsSvg("s"),
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
    this.setTooltip("Warte eine bestimmte Anzahl von Sekunden");
    this.setColour("#5ba574");
    this.setHelpUrl("");

    this.setOnChange(this.onSecondsChange.bind(this));
  },

  handleButtonClick: function () {
    const clickEvent = window.event;
    if (!clickEvent) return;

    const rect = clickEvent.target.getBoundingClientRect();
    const y = clickEvent.clientY - rect.top;

    if (y < 32) {
      this.increaseSeconds();
    } else {
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
      const newValue = Math.max(1, currentValue - 1);
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

Blockly.Blocks["basic_delay_minutes"] = {
  init: function () {
    const buttonsField = new Blockly.FieldImage(
      generateStackedButtonsSvg("m"),
      50,
      65,
      "buttons",
      this.handleButtonClick.bind(this),
    );

    this.appendDummyInput("TIMER_IMAGE")
      .appendField(
        new Blockly.FieldImage(generateTimerSvgMinutes(1), 60, 60, "*"),
        "TIMER_ICON",
      )
      .appendField(buttonsField);

    this.appendDummyInput().appendField("Warte");

    this.appendValueInput("MINUTES").setCheck("String").appendField("Minuten:");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Warte eine bestimmte Anzahl von Minuten");
    this.setColour("#5ba574");
    this.setHelpUrl("");

    this.setOnChange(this.onMinutesChange.bind(this));
  },

  handleButtonClick: function () {
    const clickEvent = window.event;
    if (!clickEvent) return;

    const rect = clickEvent.target.getBoundingClientRect();
    const y = clickEvent.clientY - rect.top;

    if (y < 32) {
      this.increaseMinutes();
    } else {
      this.decreaseMinutes();
    }
  },

  increaseMinutes: function () {
    const minutesInput = this.getInputTargetBlock("MINUTES");

    if (minutesInput && minutesInput.type === "basic_number") {
      const currentValue = parseInt(minutesInput.getFieldValue("NUM")) || 0;
      const newValue = currentValue + 1;
      minutesInput.setFieldValue(newValue, "NUM");
      this.updateTimerImage(newValue);
    }
  },

  decreaseMinutes: function () {
    const minutesInput = this.getInputTargetBlock("MINUTES");

    if (minutesInput && minutesInput.type === "basic_number") {
      const currentValue = parseInt(minutesInput.getFieldValue("NUM")) || 0;
      const newValue = Math.max(1, currentValue - 1);
      minutesInput.setFieldValue(newValue, "NUM");
      this.updateTimerImage(newValue);
    }
  },

  onMinutesChange: function (changeEvent) {
    if (!this.workspace || this.isInFlyout) return;

    if (
      changeEvent.type === Blockly.Events.BLOCK_CHANGE ||
      changeEvent.type === Blockly.Events.BLOCK_MOVE
    ) {
      const minutesInput = this.getInputTargetBlock("MINUTES");

      if (minutesInput && minutesInput.type === "basic_number") {
        const minutes = minutesInput.getFieldValue("NUM");
        if (minutes !== null && minutes !== undefined) {
          this.updateTimerImage(minutes);
        }
      }
    }
  },

  updateTimerImage: function (minutes) {
    const timerImageInput = this.getInput("TIMER_IMAGE");
    if (timerImageInput) {
      const field = this.getField("TIMER_ICON");
      if (field) {
        field.setValue(generateTimerSvgMinutes(minutes));
      }
    }
  },
};

Blockly.Blocks["basic_delay_hours"] = {
  init: function () {
    const buttonsField = new Blockly.FieldImage(
      generateStackedButtonsSvg("h"),
      50,
      65,
      "buttons",
      this.handleButtonClick.bind(this),
    );

    this.appendDummyInput("TIMER_IMAGE")
      .appendField(
        new Blockly.FieldImage(generateTimerSvgHours(1), 60, 60, "*"),
        "TIMER_ICON",
      )
      .appendField(buttonsField);

    this.appendDummyInput().appendField("Warte");

    this.appendValueInput("HOURS").setCheck("String").appendField("Stunden:");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Warte eine bestimmte Anzahl von Stunden");
    this.setColour("#5ba574");
    this.setHelpUrl("");

    this.setOnChange(this.onHoursChange.bind(this));
  },

  handleButtonClick: function () {
    const clickEvent = window.event;
    if (!clickEvent) return;

    const rect = clickEvent.target.getBoundingClientRect();
    const y = clickEvent.clientY - rect.top;

    if (y < 32) {
      this.increaseHours();
    } else {
      this.decreaseHours();
    }
  },

  increaseHours: function () {
    const hoursInput = this.getInputTargetBlock("HOURS");

    if (hoursInput && hoursInput.type === "basic_number") {
      const currentValue = parseInt(hoursInput.getFieldValue("NUM")) || 0;
      const newValue = currentValue + 1;
      hoursInput.setFieldValue(newValue, "NUM");
      this.updateTimerImage(newValue);
    }
  },

  decreaseHours: function () {
    const hoursInput = this.getInputTargetBlock("HOURS");

    if (hoursInput && hoursInput.type === "basic_number") {
      const currentValue = parseInt(hoursInput.getFieldValue("NUM")) || 0;
      const newValue = Math.max(1, currentValue - 1);
      hoursInput.setFieldValue(newValue, "NUM");
      this.updateTimerImage(newValue);
    }
  },

  onHoursChange: function (changeEvent) {
    if (!this.workspace || this.isInFlyout) return;

    if (
      changeEvent.type === Blockly.Events.BLOCK_CHANGE ||
      changeEvent.type === Blockly.Events.BLOCK_MOVE
    ) {
      const hoursInput = this.getInputTargetBlock("HOURS");

      if (hoursInput && hoursInput.type === "basic_number") {
        const hours = hoursInput.getFieldValue("NUM");
        if (hours !== null && hours !== undefined) {
          this.updateTimerImage(hours);
        }
      }
    }
  },

  updateTimerImage: function (hours) {
    const timerImageInput = this.getInput("TIMER_IMAGE");
    if (timerImageInput) {
      const field = this.getField("TIMER_ICON");
      if (field) {
        field.setValue(generateTimerSvgHours(hours));
      }
    }
  },
};
