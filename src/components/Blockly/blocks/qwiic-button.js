import * as Blockly from "blockly";
import { getColour } from "../helpers/colour.js";
import * as Types from "../helpers/types.js";
import {
  QWIIC_STATUS,
  QWIIC_VALUES,
  QWIIC_BUTTONS,
  QWIIC_SETTINGS,
} from "../helpers/qwiicButton.js";

function base(block, tooltip) {
  block.setColour(getColour().sparkfun);
  block.setHelpUrl(
    "https://github.com/sparkfun/SparkFun_Qwiic_Button_Arduino_Library",
  );
  block.setTooltip(Blockly.Msg[tooltip]);
  block
    .appendDummyInput()
    .appendField("Qwiic Button")
    .appendField(new Blockly.FieldDropdown(QWIIC_BUTTONS), "BUTTON");
}
function statement(block) {
  block.setPreviousStatement(true);
  block.setNextStatement(true);
}
function ledOptions() {
  return ["OFF", "ON", "BREATHE"].map((mode) => [
    Blockly.Msg[`qwiic_led_${mode}`],
    mode,
  ]);
}

Blockly.Blocks.sensebox_qwiic_button_init = {
  init() {
    base(this, "qwiic_init_tooltip");
    this.appendDummyInput().appendField(Blockly.Msg.qwiic_initialize);
    QWIIC_SETTINGS.forEach(([name, label, value, min, max]) => {
      this.appendDummyInput()
        .appendField(Blockly.Msg[label])
        .appendField(new Blockly.FieldNumber(value, min, max, 1), name);
    });
    this.appendDummyInput()
      .appendField(Blockly.Msg.qwiic_initial_led)
      .appendField(new Blockly.FieldDropdown(ledOptions()), "LED_MODE");
    this.appendDummyInput()
      .appendField(Blockly.Msg.qwiic_interrupts)
      .appendField(
        new Blockly.FieldDropdown(
          ["NONE", "PRESS", "CLICK", "BOTH"].map((mode) => [
            Blockly.Msg[`qwiic_interrupt_${mode}`],
            mode,
          ]),
        ),
        "INTERRUPTS",
      );
    statement(this);
  },
};
for (const [suffix, methods, output] of [
  ["status", QWIIC_STATUS, Types.BOOLEAN.typeName],
  ["value", QWIIC_VALUES, Types.LARGE_NUMBER.typeName],
]) {
  Blockly.Blocks[`sensebox_qwiic_button_${suffix}`] = {
    init() {
      base(this, `qwiic_${suffix}_tooltip`);
      this.appendDummyInput().appendField(
        new Blockly.FieldDropdown(
          methods.map((method) => [Blockly.Msg[`qwiic_${method}`], method]),
        ),
        "METHOD",
      );
      this.setOutput(true, output);
    },
  };
}
Blockly.Blocks.sensebox_qwiic_button_led = {
  init() {
    base(this, "qwiic_loop_led_tooltip");
    this.appendDummyInput()
      .appendField("LED")
      .appendField(new Blockly.FieldDropdown(ledOptions()), "MODE");
    statement(this);
  },
};
Blockly.Blocks.sensebox_qwiic_button_action = {
  init() {
    base(this, "qwiic_clear_tooltip");
    this.appendDummyInput().appendField(Blockly.Msg.qwiic_clearEventBits);
    statement(this);
  },
};
