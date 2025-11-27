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
        text: "Display",
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
