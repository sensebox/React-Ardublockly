// src/components/Blockly/toolbox/toolboxBasicPseudo.js

export const toolboxBasicObject = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Sensoren",
      colour: "#5ba55b",
      contents: [
        { kind: "block", type: "hdc_tmp" },
        { kind: "block", type: "hdc_humi" },
        { kind: "block", type: "basic_air_quality" },
        { kind: "block", type: "basic_brightness" },
      ],
    },
    {
      kind: "category",
      name: "Ausgabe",
      colour: "#5ba55b",
      contents: [
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
          type: "basic_rgb_color",
          inputs: {
            R: {
              block: {
                type: "basic_number",
                data: "#cc3333",
                fields: {
                  NUM: 255,
                },
              },
            },
            G: {
              block: {
                type: "basic_number",
                data: "#33cc33",
                fields: {
                  NUM: 0,
                },
              },
            },
            B: {
              block: {
                type: "basic_number",
                data: "#3333cc",
                fields: {
                  NUM: 0,
                },
              },
            },
          },
        },
      ],
    },
    {
      kind: "category",
      name: "Zustände",
      colour: "#5C81A6",
      contents: [
        { kind: "block", type: "basic_button_pressed" },
        { kind: "block", type: "basic_box_shaken" },
      ],
    },
    {
      kind: "category",
      name: "Mathematik",
      colour: "#5CA65C",
      contents: [
        { kind: "block", type: "basic_number" },
        {
          kind: "block",
          type: "basic_math",
          inputs: {
            LEFT: {
              block: {
                type: "basic_number",
                fields: {
                  NUM: 6,
                },
              },
            },
            RIGHT: {
              block: {
                type: "basic_number",
                fields: {
                  NUM: 7,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "basic_random",
          inputs: {
            FROM: {
              block: {
                type: "basic_number",
                fields: {
                  NUM: 1,
                },
              },
            },
            TO: {
              block: {
                type: "basic_number",
                fields: {
                  NUM: 100,
                },
              },
            },
          },
        },
      ],
    },
    {
      kind: "category",
      name: "Kontrolle",
      colour: "#a5675b",
      contents: [
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
        { kind: "block", type: "basic_compare" },
      ],
    },
  ],
};
