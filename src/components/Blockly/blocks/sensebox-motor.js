import * as Blockly from "blockly/core";
import { getColour } from "../helpers/colour";
import * as Types from "../helpers/types";
import { selectedBoard } from "../helpers/board";
import { FieldSlider } from "@blockly/field-slider";

/**
 * Stepper Motor
 * 
 */
Blockly.Blocks["sensebox_motors_beginStepperMotor"] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.sensebox_motors_beginStepperMotor);
        this.appendDummyInput()
            .appendField(Blockly.Msg.sensebox_motors_beginStepperMotor_pins);
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldDropdown(selectedBoard().digitalPins), "in1")
            .appendField(new Blockly.FieldDropdown(selectedBoard().digitalPins), "in2")
            .appendField(new Blockly.FieldDropdown(selectedBoard().digitalPins), "in3")
            .appendField(new Blockly.FieldDropdown(selectedBoard().digitalPins), "in4");
        this.setFieldValue("1", "in1");
        this.setFieldValue("2", "in2");
        this.setFieldValue("3", "in3");
        this.setFieldValue("4", "in4");
        this.appendDummyInput()
            .appendField(Blockly.Msg.sensebox_motors_beginStepperMotor_rpm)
            .appendField(new FieldSlider(10, 1, 15), "rpm");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(getColour().sensebox);
        this.setTooltip(Blockly.Msg.sensebox_motors_beginStepperMotor_tooltip);
        this.setHelpUrl(Blockly.Msg.sensebox_motors_beginStepperMotor_helpurl);
    },
};

Blockly.Blocks["sensebox_motors_moveStepperMotor"] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.sensebox_motors_moveStepperMotor);
        this.appendDummyInput()
            .appendField(Blockly.Msg.sensebox_motors_moveStepperMotor_step)
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldNumber(2048), "steps");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(getColour().sensebox);
        this.setTooltip(Blockly.Msg.sensebox_motors_moveStepperMotor_tooltip);
        this.setHelpUrl(Blockly.Msg.sensebox_motors_moveStepperMotor_helpurl);
    },
};

/**
 * Servo Motor
 * 
 */


/**
 * DC Motor
 * 
 */

