import * as Blockly from "blockly/core";
import { getColour } from "@/components/Blockly/helpers/colour";
import { selectedBoard } from "@/components/Blockly/helpers/board";
import { FieldSlider } from "@blockly/field-slider";

/**
 * Servo Motor
 *
 */
Blockly.Blocks["sensebox_motors_beginServoMotor"] = {
  init: function () {
    this.appendDummyInput().appendField(
      Blockly.Msg.sensebox_motors_beginServoMotor,
    );
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_motors_beginServoMotor_pin)
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPins),
        "pin",
      )
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().motors);
    this.setTooltip(Blockly.Msg.sensebox_motors_beginServoMotor_tooltip);
    this.setHelpUrl(Blockly.Msg.sensebox_motors_beginServoMotor_helpurl);
  },
};

Blockly.Blocks["sensebox_motors_moveServoMotor"] = {
  init: function () {
    this.appendDummyInput().appendField(
      Blockly.Msg.sensebox_motors_moveServoMotor,
    );
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_motors_moveServoMotor_pin)
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPins),
        "pin",
      )
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.appendValueInput("degrees", "Number")
      .appendField(Blockly.Msg.sensebox_motors_moveServoMotor_degrees)
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().motors);
    this.setTooltip(Blockly.Msg.sensebox_motors_moveServoMotor_tooltip);
    this.setHelpUrl(Blockly.Msg.sensebox_motors_moveServoMotor_helpurl);
  },
};

/**
 * I2C Motor Board
 *
 */
Blockly.Blocks["sensebox_motors_I2CMotorBoard_begin"] = {
  init: function () {
    this.appendDummyInput().appendField(
      Blockly.Msg.sensebox_motors_I2CMotorBoard_begin,
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().motors);
    this.setTooltip(Blockly.Msg.sensebox_motors_I2CMotorBoard_begin_tooltip);
    this.setHelpUrl(Blockly.Msg.sensebox_motors_I2CMotorBoard_begin_helpurl);
  },
};

Blockly.Blocks["sensebox_motors_I2CMotorBoard_moveDCMotor"] = {
  init: function () {
    var dropdownOptions = [
      [Blockly.Msg.sensebox_motors_I2CMotorBoard_moveDCMotor_left, "1"],
      [Blockly.Msg.sensebox_motors_I2CMotorBoard_moveDCMotor_right, "2"],
    ];

    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_motors_I2CMotorBoard_moveDCMotor)
      .appendField(new Blockly.FieldDropdown(dropdownOptions), "motor")
      .appendField(Blockly.Msg.sensebox_motors_I2CMotorBoard_moveDCMotor_motor);
    this.appendValueInput("speed", "Number")
      .appendField(Blockly.Msg.sensebox_motors_I2CMotorBoard_moveDCMotor_speed)
      .setAlign(Blockly.inputs.Align.RIGHT);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().motors);
    this.setTooltip(
      Blockly.Msg.sensebox_motors_I2CMotorBoard_moveDCMotor_tooltip,
    );
    this.setHelpUrl(
      Blockly.Msg.sensebox_motors_I2CMotorBoard_moveDCMotor_helpurl,
    );
  },
};

Blockly.Blocks["sensebox_motors_I2CMotorBoard_stopDCMotor"] = {
  init: function () {
    var dropdownOptions = [
      [Blockly.Msg.sensebox_motors_I2CMotorBoard_stopDCMotor_left, "1"],
      [Blockly.Msg.sensebox_motors_I2CMotorBoard_stopDCMotor_right, "2"],
    ];

    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_motors_I2CMotorBoard_stopDCMotor)
      .appendField(new Blockly.FieldDropdown(dropdownOptions), "motor")
      .appendField(Blockly.Msg.sensebox_motors_I2CMotorBoard_stopDCMotor_motor);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().motors);
    this.setTooltip(
      Blockly.Msg.sensebox_motors_I2CMotorBoard_stopDCMotor_tooltip,
    );
    this.setHelpUrl(
      Blockly.Msg.sensebox_motors_I2CMotorBoard_stopDCMotor_helpurl,
    );
  },
};

/**
 * Stepper Motor
 *
 */
Blockly.Blocks["sensebox_motors_beginStepperMotor"] = {
  init: function () {
    this.appendDummyInput().appendField(
      Blockly.Msg.sensebox_motors_beginStepperMotor,
    );
    this.appendDummyInput().appendField(
      Blockly.Msg.sensebox_motors_beginStepperMotor_pins,
    );
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPins),
        "in1",
      )
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPins),
        "in2",
      )
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPins),
        "in3",
      )
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().digitalPins),
        "in4",
      );
    this.setFieldValue("1", "in1");
    this.setFieldValue("2", "in2");
    this.setFieldValue("3", "in3");
    this.setFieldValue("4", "in4");
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_motors_beginStepperMotor_rpm)
      .appendField(new FieldSlider(3, 1, 3), "rpm");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().motors);
    this.setTooltip(Blockly.Msg.sensebox_motors_beginStepperMotor_tooltip);
    this.setHelpUrl(Blockly.Msg.sensebox_motors_beginStepperMotor_helpurl);
  },
};

Blockly.Blocks["sensebox_motors_moveStepperMotor"] = {
  init: function () {
    this.appendDummyInput().appendField(
      Blockly.Msg.sensebox_motors_moveStepperMotor,
    );
    this.appendValueInput("steps", "Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(Blockly.Msg.sensebox_motors_moveStepperMotor_step);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().motors);
    this.setTooltip(Blockly.Msg.sensebox_motors_moveStepperMotor_tooltip);
    this.setHelpUrl(Blockly.Msg.sensebox_motors_moveStepperMotor_helpurl);
  },
};
