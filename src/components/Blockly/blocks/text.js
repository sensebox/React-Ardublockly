import * as Blockly from "blockly/core";
import { getColour } from "@/components/Blockly/helpers/colour";
import * as Types from "../helpers/types";

Blockly.defineBlocksWithJsonArray([
  // BEGIN JSON EXTRACT
  // Block for text value
  {
    type: "text",
    message0: "%1",
    args0: [
      {
        type: "field_input",
        name: "TEXT",
        text: "",
      },
    ],
    output: Types.TEXT.typeName,
    style: "text_blocks",
    helpUrl: "%{BKY_TEXT_TEXT_HELPURL}",
    tooltip: "%{BKY_TEXT_TEXT_TOOLTIP}",
    extensions: ["text_quotes", "parent_tooltip_when_inline"],
  },
  {
    type: "text_multiline",
    message0: "%1 %2",
    args0: [
      {
        type: "field_image",
        src:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAARCAYAAADpP" +
          "U2iAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAdhgAAHYYBXaITgQAAABh0RVh0" +
          "U29mdHdhcmUAcGFpbnQubmV0IDQuMS42/U4J6AAAAP1JREFUOE+Vks0KQUEYhjm" +
          "RIja4ABtZ2dm5A3t3Ia6AUm7CylYuQRaUhZSlLZJiQbFAyRnPN33y01HOW08z88" +
          "73zpwzM4F3GWOCruvGIE4/rLaV+Nq1hVGMBqzhqlxgCys4wJA65xnogMHsQ5luj" +
          "nYHTejBBCK2mE4abjCgMGhNxHgDFWjDSG07kdfVa2pZMf4ZyMAdWmpZMfYOsLiD" +
          "MYMjlMB+K613QISRhTnITnsYg5yUd0DETmEoMlkFOeIT/A58iyK5E18BuTBfgYX" +
          "fwNJv4P9/oEBerLylOnRhygmGdPpTTBZAPkde61lbQe4moWUvYUZYLfUNftIY4z" +
          "wA5X2Z9AYnQrEAAAAASUVORK5CYII=",
        width: 12,
        height: 17,
        alt: "\u00B6",
      },
      {
        type: "field_multilinetext",
        name: "TEXT",
        text: "",
      },
    ],
    output: Types.TEXT.typeName,
    style: "text_blocks",
    helpUrl: "%{BKY_TEXT_TEXT_HELPURL}",
    tooltip: "%{BKY_TEXT_TEXT_TOOLTIP}",
    extensions: ["parent_tooltip_when_inline"],
  },
  {
    type: "text_join",
    message0: "",
    output: Types.TEXT.typeName,
    style: "text_blocks",
    helpUrl: "%{BKY_TEXT_JOIN_HELPURL}",
    tooltip: "%{BKY_TEXT_JOIN_TOOLTIP}",
    mutator: "text_join_mutator",
  },
  {
    type: "text_create_join_container",
    message0: "%{BKY_TEXT_CREATE_JOIN_TITLE_JOIN} %1 %2",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "STACK",
      },
    ],
    style: "text_blocks",
    tooltip: "%{BKY_TEXT_CREATE_JOIN_TOOLTIP}",
    enableContextMenu: false,
  },
  {
    type: "text_create_join_item",
    message0: "%{BKY_TEXT_CREATE_JOIN_ITEM_TITLE_ITEM}",
    previousStatement: null,
    nextStatement: null,
    style: getColour().text,
    tooltip: "%{BKY_TEXT_CREATE_JOIN_ITEM_TOOLTIP}",
    enableContextMenu: false,
  },
  {
    type: "text_append",
    message0: "%{BKY_TEXT_APPEND_TITLE}",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: "%{BKY_TEXT_APPEND_VARIABLE}",
      },
      {
        type: "input_value",
        name: "TEXT",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "text_blocks",
    extensions: ["text_append_tooltip"],
  },
  {
    type: "text_length",
    message0: "%{BKY_TEXT_LENGTH_TITLE}",
    args0: [
      {
        type: "input_value",
        name: "VALUE",
        check: ["String", "Array"],
      },
    ],
    output: Types.NUMBER.typeName,
    style: "text_blocks",
    tooltip: "%{BKY_TEXT_LENGTH_TOOLTIP}",
    helpUrl: "%{BKY_TEXT_LENGTH_HELPURL}",
  },
  {
    type: "text_isEmpty",
    message0: "%{BKY_TEXT_ISEMPTY_TITLE}",
    args0: [
      {
        type: "input_value",
        name: "VALUE",
        check: ["String", "Array"],
      },
    ],
    output: Types.BOOLEAN.typeName,
    style: "text_blocks",
    tooltip: "%{BKY_TEXT_ISEMPTY_TOOLTIP}",
    helpUrl: "%{BKY_TEXT_ISEMPTY_HELPURL}",
  },
  {
    type: "text_indexOf",
    message0: "%{BKY_TEXT_INDEXOF_TITLE}",
    args0: [
      {
        type: "input_value",
        name: "VALUE",
        check: "String",
      },
      {
        type: "field_dropdown",
        name: "END",
        options: [
          ["%{BKY_TEXT_INDEXOF_OPERATOR_FIRST}", "FIRST"],
          ["%{BKY_TEXT_INDEXOF_OPERATOR_LAST}", "LAST"],
        ],
      },
      {
        type: "input_value",
        name: "FIND",
        check: "String",
      },
    ],
    output: Types.NUMBER.typeName,
    style: "text_blocks",
    helpUrl: "%{BKY_TEXT_INDEXOF_HELPURL}",
    inputsInline: true,
    extensions: ["text_indexOf_tooltip"],
  },
  {
    type: "text_charAt",
    message0: "%{BKY_TEXT_CHARAT_TITLE}", // "in text %1 %2"
    args0: [
      {
        type: "input_value",
        name: "VALUE",
        check: "String",
      },
      {
        type: "field_dropdown",
        name: "WHERE",
        options: [
          ["%{BKY_TEXT_CHARAT_FROM_START}", "FROM_START"],
          ["%{BKY_TEXT_CHARAT_FROM_END}", "FROM_END"],
          ["%{BKY_TEXT_CHARAT_FIRST}", "FIRST"],
          ["%{BKY_TEXT_CHARAT_LAST}", "LAST"],
          ["%{BKY_TEXT_CHARAT_RANDOM}", "RANDOM"],
        ],
      },
    ],
    output: Types.TEXT.typeName,
    style: "text_blocks",
    helpUrl: "%{BKY_TEXT_CHARAT_HELPURL}",
    inputsInline: true,
    mutator: "text_charAt_mutator",
  },
  {
    type: "text8",
    message0: "%1",
    args0: [
      {
        type: "field_input",
        name: "TEXT",
        text: "Data",
        spellcheck: false,
        // Validator sorgt für max. 8 Zeichen
        validator: function (newValue) {
          return newValue.substring(0, 8);
        },
      },
    ],
    output: Types.TEXT.typeName,
    style: "text_blocks",
    tooltip: "Text mit maximal 8 Zeichen",
    helpUrl: "",
    extensions: ["text_quotes", "parent_tooltip_when_inline"],
  },
]); // END JSON EXTRACT (Do not delete this comment.)
