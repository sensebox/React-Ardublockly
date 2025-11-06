import * as Blockly from "blockly/core";
import { getColour } from "@/helpers/colour";

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
    previousStatement: null,
    nextStatement: null,
    colour: getColour().sensebox,
  },
]);

Blockly.defineBlocksWithJsonArray([
  {
    type: "basic_red",
    message0: "%1",
    args0: [
      {
        type: "field_image",
        src: "./media/blockly/led_red.png",
        width: 90,
        height: 90,
        alt: "*",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: getColour().sensebox,
  },
  {
    type: "basic_yellow",
    message0: "%1",
    args0: [
      {
        type: "field_image",
        src: "./media/blockly/led_yellow.png",
        width: 90,
        height: 90,
        alt: "*",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: getColour().sensebox,
  },
  {
    type: "basic_blue",
    message0: "%1",
    args0: [
      {
        type: "field_image",
        src: "./media/blockly/led_blue.png",
        width: 90,
        height: 90,
        alt: "*",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: getColour().sensebox,
  },
  {
    type: "basic_off",
    message0: "%1",
    args0: [
      {
        type: "field_image",
        src: "./media/blockly/led_off.png",
        width: 90,
        height: 90,
        alt: "*",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: getColour().sensebox,
  },
]);

Blockly.defineBlocksWithJsonArray([
  {
    type: "time_delay_1s",
    message0: "%1 %2",
    args0: [
      {
        type: "field_image",
        src: "https://cdn-icons-png.flaticon.com/512/31/31048.png",
        width: 60,
        height: 60,
      },
      {
        type: "field_label",
        name: "DELAY_TIME_1S",
        text: "1",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: getColour().time,
    helpUrl: "http://arduino.cc/en/Reference/Delay",
  },
  {
    type: "time_delay_2s",
    message0: "%1 %2",
    args0: [
      {
        type: "field_image",
        src: "https://cdn-icons-png.flaticon.com/512/31/31048.png",
        width: 60,
        height: 60,
      },
      {
        type: "field_label",
        name: "DELAY_TIME_2S",
        text: "2",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: getColour().time,
    helpUrl: "http://arduino.cc/en/Reference/Delay",
  },
  {
    type: "time_delay_5s",
    message0: "%1 %2",
    args0: [
      {
        type: "field_image",
        src: "https://cdn-icons-png.flaticon.com/512/31/31048.png",
        width: 60,
        height: 60,
      },
      {
        type: "field_label",
        name: "DELAY_TIME_5S",
        text: "5",
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
    message0: "%1 %2",
    args0: [
      {
        type: "field_image",
        src: "/media/hardware/icons/Icon_OLED-Display.svg",
        width: 90,
        height: 90,
      },
      {
        type: "input_value",
        name: "inside",
        check: null,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: getColour().sensebox,
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
    colour: 240,
    tooltip: "Startpunkt deines Programms",
    helpUrl: "",
  },
]);
