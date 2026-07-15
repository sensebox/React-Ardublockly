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
    colour: "#62A044",
    data: {
      unit: "%",
      title: "Luftfeuchtigkeit",
    },
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
    colour: "#62A044",
    data: {
      unit: "°C",
      title: "Temperatur",
    },
  },
]);

const BUTTON_ICON = "/media/hardware/icons/Icon_Button.svg";
const SHAKE_ICON = "/media/hardware/icons/Icon_Schuetteln.svg";
const AIR_QUALITY_ICON = "/media/hardware/icons/Icon_Luftqualitaet.svg";
const BRIGHTNESS_ICON = "/media/hardware/icons/Icon_Helligkeit.svg";

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
    output: "Boolean",
    colour: "#62A044",
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
    output: "Boolean",
    colour: "#62A044",
    tooltip: "Überprüft ob die senseBox geschüttelt wurde",
    helpUrl: "",
  },
  {
    type: "bme_air_quality",
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
    colour: "#62A044",
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
