// src/components/Blockly/toolbox/toolboxBasicPseudo.js
import * as Blockly from "blockly/core";
import { getColour } from "@/helpers/colour";

export const toolboxBasicObject = {
  kind: "flyoutToolbox",
  contents: [
    // { kind: "block", type: "bme_basic" },
    // { kind: "block", type: "bme_tmp" },
    // { kind: "block", type: "bme_humi" },
    { kind: "block", type: "display_print_basic" },
    { kind: "block", type: "text" },
    { kind: "block", type: "basic_red" },
    { kind: "block", type: "basic_blue" },
    { kind: "block", type: "basic_yellow" },
    { kind: "block", type: "basic_off" },
    { kind: "block", type: "time_delay_1s" },
    { kind: "block", type: "time_delay_2s" },
    { kind: "block", type: "time_delay_5s" },
  ],
};
