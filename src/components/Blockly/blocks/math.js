import * as Blockly from "blockly/core";
import { getColour } from "../helpers/colour";
import * as Types from "../helpers/types";

/*
 * NOTE/TODO:
 * Updating the tooltips in multiple of the following blocks should be done using the setTooltip()
 * function with an update function as parameter as discripted in these docs
 * https://developers.google.com/blockly/reference/js/blockly.field_class.settooltip_1_method?hl=de
 *
 * This does not work as described in this issue
 * https://github.com/sensebox/React-Ardublockly/issues/381
 *
 * Therefore the update is done for know in the generator functions as a workaround.
 */

Blockly.Blocks["math_number"] = {
  /**
   * Block for numeric value.
   * @this Blockly.Block
   */
  init: function () {
    this.setHelpUrl(Blockly.Msg.MATH_NUMBER_HELPURL);
    this.setColour(getColour().math);
    this.appendDummyInput().appendField(
      new Blockly.FieldTextInput("0", Blockly.FieldTextInput.numberValidator),
      "NUM",
    );
    this.setOutput(true, Types.NUMBER.typeName);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP); //update in generator
  },
};

Blockly.Blocks["math_arithmetic"] = {
  /**
   * Block for basic arithmetic operator.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 %3",
      args0: [
        {
          type: "input_value",
          name: "A",
          check: Types.getCompatibleTypes("int"),
        },
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            [Blockly.Msg.MATH_ADDITION_SYMBOL, "ADD"],
            [Blockly.Msg.MATH_SUBTRACTION_SYMBOL, "MINUS"],
            [Blockly.Msg.MATH_MULTIPLICATION_SYMBOL, "MULTIPLY"],
            [Blockly.Msg.MATH_DIVISION_SYMBOL, "DIVIDE"],
            [Blockly.Msg.MATH_POWER_SYMBOL, "POWER"],
          ],
        },
        {
          type: "input_value",
          name: "B",
          check: Types.getCompatibleTypes("int"),
        },
      ],
      inputsInline: true,
      output: Types.NUMBER.typeName,
      colour: getColour().math,
      helpUrl: Blockly.Msg.MATH_ARITHMETIC_HELPURL,
    });
    this.setTooltip(Blockly.Msg.MATH_ARITHMETIC_TOOLTIP); //update in generator
  },
  //TODO: a getBlockType based on the two input types following C++ rules
};

Blockly.Blocks["math_negative"] = {
  /**
   * Block for single minus sign
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "- %1",
      args0: [
        {
          type: "input_value",
          name: "NUM",
          check: Types.getCompatibleTypes("float"),
        },
      ],
      output: Types.DECIMAL.typeName,
      colour: getColour().math,
      helpUrl: Blockly.Msg.MATH_SINGLE_HELPURL,
      tooltip: Blockly.Msg.MATH_SINGLE_TOOLTIP_NEG,
    });
  },
};

Blockly.Blocks["math_single"] = {
  /**
   * Block for advanced math operators with single operand.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            [Blockly.Msg.MATH_SINGLE_OP_ROOT, "ROOT"],
            [Blockly.Msg.MATH_SINGLE_OP_ABSOLUTE, "ABS"],
            ["ln", "LN"],
            ["log10", "LOG10"],
            ["e^", "EXP"],
            ["10^", "POW10"],
          ],
        },
        {
          type: "input_value",
          name: "NUM",
          check: Types.getCompatibleTypes("float"),
        },
      ],
      output: Types.DECIMAL.typeName,
      colour: getColour().math,
      helpUrl: Blockly.Msg.MATH_SINGLE_HELPURL,
      tooltip: Blockly.Msg.MATH_SINGLE_TOOLTIP, // update in generator
    });
  },
};

Blockly.Blocks["math_trig"] = {
  /**
   * Block for trigonometry operators.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            [Blockly.Msg.MATH_TRIG_SIN, "SIN"],
            [Blockly.Msg.MATH_TRIG_COS, "COS"],
            [Blockly.Msg.MATH_TRIG_TAN, "TAN"],
            [Blockly.Msg.MATH_TRIG_ASIN, "ASIN"],
            [Blockly.Msg.MATH_TRIG_ACOS, "ACOS"],
            [Blockly.Msg.MATH_TRIG_ATAN, "ATAN"],
          ],
        },
        {
          type: "input_value",
          name: "NUM",
          check: Types.getCompatibleTypes("float"),
        },
      ],
      output: Types.DECIMAL.typeName,
      colour: getColour().math,
      helpUrl: Blockly.Msg.MATH_TRIG_HELPURL,
      tooltip: Blockly.Msg.MATH_TRIG_TOOLTIP, // update in generator
    });
  },
};

Blockly.Blocks["math_constant"] = {
  /**
   * Block for constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "CONSTANT",
          options: [
            ["\u03c0", "PI"],
            ["e", "E"],
            ["\u03c6", "GOLDEN_RATIO"],
            ["sqrt(2)", "SQRT2"],
            ["sqrt(\u00bd)", "SQRT1_2"],
            ["\u221e", "INFINITY"],
          ],
        },
      ],
      output: Types.DECIMAL.typeName,
      colour: getColour().math,
      tooltip: Blockly.Msg.MATH_CONSTANT_TOOLTIP,
      helpUrl: Blockly.Msg.MATH_CONSTANT_HELPURL,
    });
  },
};

Blockly.Blocks["math_number_property"] = {
  /**
   * Block for checking if a number is even, odd, prime, whole, positive,
   * negative or if it is divisible by certain number.
   * @this Blockly.Block
   */
  init: function () {
    var PROPERTIES = [
      [Blockly.Msg.MATH_IS_EVEN, "EVEN"],
      [Blockly.Msg.MATH_IS_ODD, "ODD"],
      [Blockly.Msg.MATH_IS_PRIME, "PRIME"],
      [Blockly.Msg.MATH_IS_WHOLE, "WHOLE"],
      [Blockly.Msg.MATH_IS_POSITIVE, "POSITIVE"],
      [Blockly.Msg.MATH_IS_NEGATIVE, "NEGATIVE"],
      [Blockly.Msg.MATH_IS_DIVISIBLE_BY, "DIVISIBLE_BY"],
    ];
    this.setColour(getColour().math);
    this.appendValueInput("NUMBER_TO_CHECK").setCheck(
      Types.getCompatibleTypes("int"),
    );
    var dropdown = new Blockly.FieldDropdown(PROPERTIES, function (option) {
      var divisorInput = option === "DIVISIBLE_BY";
      this.sourceBlock_.updateShape_(divisorInput);
    });
    this.appendDummyInput().appendField(dropdown, "PROPERTY");
    this.setInputsInline(true);
    this.setOutput(true, Types.BOOLEAN.typeName);
    this.setTooltip(Blockly.Msg.MATH_IS_TOOLTIP);
  },

  /**
   * Create XML to represent whether the 'divisorInput' should be present.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    var container = document.createElement("mutation");
    var divisorInput = this.getFieldValue("PROPERTY") === "DIVISIBLE_BY";
    container.setAttribute("divisor_input", divisorInput);
    return container;
  },
  /**
   * Parse XML to restore the 'divisorInput'.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    var divisorInput = xmlElement.getAttribute("divisor_input") === "true";
    this.updateShape_(divisorInput);
  },
  /**
   * Modify this block to have (or not have) an input for 'is divisible by'.
   * @param {boolean} divisorInput True if this block has a divisor input.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function (divisorInput) {
    // Add or remove a Value Input.
    var inputExists = this.getInput("DIVISOR");
    if (divisorInput) {
      if (!inputExists) {
        this.appendValueInput("DIVISOR").setCheck(
          Types.getCompatibleTypes("int"),
        );
      }
    } else if (inputExists) {
      this.removeInput("DIVISOR");
    }
  },
};

Blockly.Blocks["math_change"] = {
  /**
   * Block for adding or subtracting to a variable in place.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.MATH_CHANGE_TITLE,
      args0: [
        {
          type: "field_dropdown",
          name: "DIRECTION",
          options: [
            [Blockly.Msg.MATH_CHANGE_INCREASE, "+="],
            [Blockly.Msg.MATH_CHANGE_DECREASE, "-="],
          ],
        },
        {
          type: "field_variable",
          name: "VAR",
          defaultType: Types.NUMBER.typeName,
          variable: null,
        },
        {
          type: "input_value",
          name: "DELTA",
          check: Types.getCompatibleTypes("int"),
          align: "RIGHT",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: getColour().math,
      helpUrl: Blockly.Msg.MATH_CHANGE_HELPURL,
    });
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(Blockly.Msg.MATH_CHANGE_TOOLTIP); // update in generator
  },
};

Blockly.Blocks["math_round"] = {
  /**
   * Block for rounding functions.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            [Blockly.Msg.MATH_ROUND_OPERATOR_ROUND, "ROUND"],
            [Blockly.Msg.MATH_ROUND_OPERATOR_ROUNDUP, "ROUNDUP"],
            [Blockly.Msg.MATH_ROUND_OPERATOR_ROUNDDOWN, "ROUNDDOWN"],
          ],
        },
        {
          type: "input_value",
          name: "NUM",
          check: Types.getCompatibleTypes("float"),
        },
      ],
      output: Types.DECIMAL.typeName,
      colour: getColour().math,
      tooltip: Blockly.Msg.MATH_ROUND_TOOLTIP,
      helpUrl: Blockly.Msg.MATH_ROUND_HELPURL,
    });
  },
};

Blockly.Blocks["math_on_list"] = {
  /**
   * Block for evaluating a list of numbers to return sum, average, min, max,
   * etc.  Some functions also work on text (min, max, mode, median).
   * @this Blockly.Block
   */
  init: function () {
    var OPERATORS = [
      [Blockly.Msg.MATH_ONLIST_OPERATOR_SUM, "SUM"],
      [Blockly.Msg.MATH_ONLIST_OPERATOR_MIN, "MIN"],
      [Blockly.Msg.MATH_ONLIST_OPERATOR_MAX, "MAX"],
      [Blockly.Msg.MATH_ONLIST_OPERATOR_AVERAGE, "AVERAGE"],
      [Blockly.Msg.MATH_ONLIST_OPERATOR_MEDIAN, "MEDIAN"],
      [Blockly.Msg.MATH_ONLIST_OPERATOR_MODE, "MODE"],
      [Blockly.Msg.MATH_ONLIST_OPERATOR_STD_DEV, "STD_DEV"],
      [Blockly.Msg.MATH_ONLIST_OPERATOR_RANDOM, "RANDOM"],
    ];
    // Assign 'this' to a variable for use in the closures below.
    var thisBlock = this;
    this.setHelpUrl(Blockly.Msg.MATH_ONLIST_HELPURL);
    this.setColour(getColour().math);
    this.setOutput(true, Types.NUMBER.typeName);
    var dropdown = new Blockly.FieldDropdown(OPERATORS, function (newOp) {
      thisBlock.updateType_(newOp);
    });
    this.appendValueInput("LIST")
      .setCheck(Types.getCompatibleTypes("array"))
      .appendField(dropdown, "OP");
    this.setTooltip(function () {
      //TODO: move to generator and add a generic tooltip here when implementing in toolbox
      var mode = thisBlock.getFieldValue("OP");
      var TOOLTIPS = {
        SUM: Blockly.Msg.MATH_ONLIST_TOOLTIP_SUM,
        MIN: Blockly.Msg.MATH_ONLIST_TOOLTIP_MIN,
        MAX: Blockly.Msg.MATH_ONLIST_TOOLTIP_MAX,
        AVERAGE: Blockly.Msg.MATH_ONLIST_TOOLTIP_AVERAGE,
        MEDIAN: Blockly.Msg.MATH_ONLIST_TOOLTIP_MEDIAN,
        MODE: Blockly.Msg.MATH_ONLIST_TOOLTIP_MODE,
        STD_DEV: Blockly.Msg.MATH_ONLIST_TOOLTIP_STD_DEV,
        RANDOM: Blockly.Msg.MATH_ONLIST_TOOLTIP_RANDOM,
      };
      return TOOLTIPS[mode];
    });
  },
  /**
   * Modify this block to have the correct output type.
   * @param {string} newOp Either 'MODE' or some op than returns a number.
   * @private
   * @this Blockly.Block
   */
  updateType_: function (newOp) {
    if (newOp === "MODE") {
      this.outputConnection.setCheck(Types.getCompatibleTypes("array"));
    } else {
      this.outputConnection.setCheck(Types.getCompatibleTypes("int"));
    }
  },
  /**
   * Create XML to represent the output type.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    var container = document.createElement("mutation");
    container.setAttribute("op", this.getFieldValue("OP"));
    return container;
  },
  /**
   * Parse XML to restore the output type.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    this.updateType_(xmlElement.getAttribute("op"));
  },
  //TODO: a getBlockType once the list code is finished.
};

Blockly.Blocks["math_modulo"] = {
  /**
   * Block for remainder of a division.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.MATH_MODULO_TITLE,
      args0: [
        {
          type: "input_value",
          name: "DIVIDEND",
          check: Types.getCompatibleTypes("int"),
        },
        {
          type: "input_value",
          name: "DIVISOR",
          check: Types.getCompatibleTypes("int"),
        },
      ],
      inputsInline: true,
      output: Types.NUMBER.typeName,
      colour: getColour().math,
      tooltip: Blockly.Msg.MATH_MODULO_TOOLTIP,
      helpUrl: Blockly.Msg.MATH_MODULO_HELPURL,
    });
  },
};

Blockly.Blocks["math_constrain"] = {
  /**
   * Block for constraining a number between two limits.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.MATH_CONSTRAIN_TITLE,
      args0: [
        {
          type: "input_value",
          name: "VALUE",
          check: Types.getCompatibleTypes("int"),
        },
        {
          type: "input_value",
          name: "LOW",
          check: Types.getCompatibleTypes("int"),
        },
        {
          type: "input_value",
          name: "HIGH",
          check: Types.getCompatibleTypes("int"),
        },
      ],
      inputsInline: true,
      output: Types.NUMBER.typeName,
      colour: getColour().math,
      tooltip: Blockly.Msg.MATH_CONSTRAIN_TOOLTIP,
      helpUrl: Blockly.Msg.MATH_CONSTRAIN_HELPURL,
    });
  },
  //TODO: a getBlockType of the same type as the inputs.
};

Blockly.Blocks["math_random_int"] = {
  /**
   * Block for random integer between [X] and [Y].
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.MATH_RANDOM_INT_TITLE,
      args0: [
        {
          type: "input_value",
          name: "FROM",
          check: Types.getCompatibleTypes("int"),
        },
        {
          type: "input_value",
          name: "TO",
          check: Types.getCompatibleTypes("int"),
        },
      ],
      inputsInline: true,
      output: Types.NUMBER.typeName,
      colour: getColour().math,
      tooltip: Blockly.Msg.MATH_RANDOM_INT_TOOLTIP,
      helpUrl: Blockly.Msg.MATH_RANDOM_INT_HELPURL,
    });
  },
};

Blockly.Blocks["math_random_float"] = {
  /**
   * Block for random fraction between 0 and 1.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.MATH_RANDOM_FLOAT_TITLE_RANDOM,
      output: Types.DECIMAL.typeName,
      colour: getColour().math,
      tooltip: Blockly.Msg.MATH_RANDOM_FLOAT_TOOLTIP,
      helpUrl: Blockly.Msg.MATH_RANDOM_FLOAT_HELPURL,
    });
  },
};
