// src/components/Blockly/toolbox/toolboxBasicPseudo.js

// --- Compose all blocks for the "All" category ---
const allBlocks = [
  // Sensoren
  { kind: "block", type: "bme_tmp" },
  { kind: "block", type: "bme_humi" },
  { kind: "block", type: "bme_air_quality" },
  { kind: "block", type: "basic_brightness" },
  // Ausgabe
  { kind: "block", type: "display_print_basic" },
  { kind: "block", type: "display_clear_basic" },
  { kind: "block", type: "display_show_measurement" },
  {
    kind: "block",
    type: "text",
    tooltip: "Use this block to add text to your display.",
  },
  {
    kind: "block",
    type: "basic_led_control",
    inputs: {
      COLOR: {
        block: {
          type: "colour_picker_basic",
          args0: [],
          fields: {
            COLOUR: "#ff0000",
          },
        },
      },
    },
  },
  { kind: "block", type: "basic_off" },
  { kind: "block", type: "basic_random_color" },
  {
    kind: "block",
    type: "basic_rgb_color",
    inputs: {
      R: {
        block: {
          type: "basic_number_slider_red",
          fields: {
            NUM: 255,
          },
        },
      },
      G: {
        block: {
          type: "basic_number_slider_green",
          fields: {
            NUM: 0,
          },
        },
      },
      B: {
        block: {
          type: "basic_number_slider_blue",
          fields: {
            NUM: 0,
          },
        },
      },
    },
  },
  // Zustände
  {
    kind: "block",
    type: "basic_if_else2",
  },
  {
    kind: "block",
    type: "basic_if_else",
    inputs: {
      IF0: {
        block: {
          type: "basic_button_pressed",
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
          type: "basic_box_shaken",
        },
      },
    },
  },
  // Mathematik
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
  // Kontrolle
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
];

export const toolboxBasicObject = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Alle Blöcke",
      colour: "#5ba55b",
      contents: allBlocks,
    },
    // ...existing categories...
    {
      kind: "category",
      name: "Sensoren",
      colour: "#5ba55b",
      contents: [
        { kind: "block", type: "bme_tmp" },
        { kind: "block", type: "bme_humi" },
        { kind: "block", type: "bme_air_quality" },
        { kind: "block", type: "basic_brightness" },
      ],
    },
    {
      kind: "category",
      name: "Ausgabe",
      colour: "#5ba55b",
      categorystyle: undefined,
      cssconfig: undefined,
      // Simple red LED SVG icon as data URI
      icon: {
        src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><circle cx='12' cy='12' r='10' fill='%23ff3333' stroke='%23900' stroke-width='2'/></svg>",
        width: 24,
        height: 24,
      },
      contents: [
        { kind: "block", type: "display_print_basic" },
        { kind: "block", type: "display_clear_basic" },
        {
          kind: "block",
          type: "display_show_measurement",
        },
        {
          kind: "block",
          type: "text",
          tooltip: "Use this block to add text to your display.",
        },
        {
          kind: "block",
          type: "basic_led_control",
          inputs: {
            COLOR: {
              block: {
                type: "colour_picker_basic",
                args0: [],
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
                type: "basic_number_slider_red",
                fields: {
                  NUM: 255,
                },
              },
            },
            G: {
              block: {
                type: "basic_number_slider_green",
                fields: {
                  NUM: 0,
                },
              },
            },
            B: {
              block: {
                type: "basic_number_slider_blue",
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
        {
          kind: "block",
          type: "basic_if_else",
          inputs: {
            IF0: {
              block: {
                type: "basic_button_pressed",
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
                type: "basic_box_shaken",
              },
            },
          },
        },
        {
          kind: "block",
          type: "basic_if_else",
        },
        {
          kind: "block",
          type: "basic_if_else2",
        },
      ],
    },
    {
      kind: "category",
      name: "Mathematik",
      colour: "#5b67a5",
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
      colour: "#5ba574",
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
          type: "basic_if_else2",
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
