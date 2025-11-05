// src/components/Blockly/toolbox/toolboxBasicPseudo.js
import * as Blockly from "blockly/core";
import { getColour } from "@/helpers/colour";

export const toolboxBasicObject = {
  kind: "flyoutToolbox",
  contents: [
    // 🟢 Sensoren
    {
      kind: "label",
      text: "Sensoren",
    },
    { kind: "block", type: "sensebox_sensor_temp_hum" },

    // 🟦 Display
    { kind: "sep", gap: "10" },
    {
      kind: "label",
      text: "Display",
    },
    { kind: "block", type: "display_print_basic" },
    { kind: "block", type: "text" },

    // 🟡 LED
    { kind: "sep", gap: "10" },
    {
      kind: "label",
      text: "LED",
    },
    { kind: "block", type: "basic_red" },
    { kind: "block", type: "basic_blue" },
    { kind: "block", type: "basic_yellow" },
    { kind: "block", type: "basic_off" },

    // 🕒 Zeit
    { kind: "sep", gap: "10" },
    {
      kind: "label",
      text: "Zeit",
    },
    { kind: "block", type: "time_delay_1s" },
    { kind: "block", type: "time_delay_2s" },
    { kind: "block", type: "time_delay_5s" },
  ],
};
