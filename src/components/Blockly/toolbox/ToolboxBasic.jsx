// src/components/Blockly/toolbox/toolboxBasicPseudo.js

import { inputs } from "blockly";

export const toolboxBasicObject = {
  kind: "flyoutToolbox",
  contents: [
    // { kind: "block", type: "bme_basic" },
    // { kind: "block", type: "bme_tmp" },
    { kind: "block", type: "hdc_tmp" },
    { kind: "block", type: "hdc_humi" },
    { kind: "block", type: "display_print_basic" },
    { kind: "block", type: "text" },
    {
      kind: "block",
      type: "basic_led_control",
      inputs: {
        COLOR: {
          block: {
            type: "colour_picker",
            fields: {
              COLOUR: "#ff0000",
            },
          },
        },
      },
    },
    { kind: "block", type: "basic_off" },
    {
      kind: "block",
      type: "basic_delay",
      inputs: {
        SECONDS: {
          block: {
            type: "basic_number",
            fields: {
              NUM: 1,
            },
          },
        },
      },
    },
    {
      kind: "block",
      type: "basic_if_else",
      inputs: {
        IF0: {
          block: {
            type: "basic_compare",
            fields: {
              OP: "==",
            },
            inputs: {
              LEFT: {
                block: {
                  type: "basic_number",
                  fields: {
                    NUM: 0,
                  },
                },
              },
              RIGHT: {
                block: {
                  type: "basic_number",
                  fields: {
                    NUM: 1,
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      kind: "block",
      type: "basic_repeat_times",
      inputs: {
        TIMES: {
          block: {
            type: "basic_number",
            fields: {
              NUM: 10,
            },
          },
        },
      },
    },
    { kind: "block", type: "basic_number" },
  ],
};
