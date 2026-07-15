const beforeStartCategory = {
  kind: "category",
  name: "Vor dem Start",
  colour: "#995ba5",
  contents: [{ kind: "block", type: "basic_setup" }],
};

const variablesCategory = {
  kind: "category",
  name: "Variablen",
  colour: "#a55b99",
  custom: "VARIABLE",
};

const sensorsCategory = {
  kind: "category",
  name: "Sensoren",
  colour: "#5ba55b",
  contents: [
    { kind: "block", type: "bme_tmp" },
    { kind: "block", type: "bme_humi" },
    { kind: "block", type: "bme_air_quality" },
    { kind: "block", type: "basic_brightness" },
    { kind: "block", type: "basic_button_pressed" },
    { kind: "block", type: "basic_box_shaken" },
  ],
};

const displayCategory = {
  kind: "category",
  name: "Display / Anzeige",
  colour: "#5ba55b",
  categorystyle: undefined,
  cssconfig: undefined,
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
      type: "text_join",
      tooltip: "Vereinige mehrere Texte zusammen.",
    },
  ],
};

const ledsCategory = {
  kind: "category",
  name: "LEDs",
  colour: "#5C81A6",
  contents: [
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
  ],
};

const conditionsCategory = {
  kind: "category",
  name: "Bedingungen",
  colour: "#5C81A6",
  contents: [
    {
      kind: "block",
      type: "basic_if_else",
      inputs: {
        IF: {
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
    { kind: "block", type: "basic_if_else" },
    { kind: "block", type: "basic_if" },
  ],
};

const numbersCategory = {
  kind: "category",
  name: "Zahlen",
  colour: "#5b67a5",
  contents: [
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
    { kind: "block", type: "basic_math" },
    { kind: "block", type: "math_number" },
  ],
};

const timeAndRepeatCategory = {
  kind: "category",
  name: "Zeit / Wiederholung",
  colour: "#5C81A6",
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
      type: "basic_delay_minutes",
      inputs: {
        MINUTES: {
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
      type: "basic_delay_hours",
      inputs: {
        HOURS: {
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
    {
      kind: "block",
      type: "basic_repeat_until",
      inputs: {
        CONDITION: {
          block: {
            type: "basic_compare",
          },
        },
      },
    },
  ],
};

const dataSendCategory = {
  kind: "category",
  name: "Daten senden",
  colour: "#5ba55b",
  contents: [
    { kind: "block", type: "basic_ble_send" },
    { kind: "block", type: "basic_serial_send" },
  ],
};

const showAllBlocksCategory = false;

const toolboxCategories = [
  ...(showAllBlocksCategory ? [allBlocksCategory] : []),
  beforeStartCategory,
  variablesCategory,
  sensorsCategory,
  displayCategory,
  ledsCategory,
  conditionsCategory,
  numbersCategory,
  timeAndRepeatCategory,
  dataSendCategory,
];

export const toolboxBasicObject = {
  kind: "categoryToolbox",
  contents: toolboxCategories,
};
