import * as Blockly from "blockly";
import { getColour } from "../helpers/colour";
import { selectedBoard } from "../helpers/board";
import * as Types from "../helpers/types";

Blockly.Blocks["sensebox_phyphox_init"] = {
  init: function () {
    this.setColour(getColour().phyphox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_phyphox_init)
      .appendField(new Blockly.FieldTextInput("Geräte Name"), "devicename");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_led_tooltip);
  },
};

Blockly.Blocks["sensebox_phyphox_experiment"] = {
  init: function () {
    this.setColour(getColour().phyphox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_phyphox_createExperiment)
      .appendField(
        new Blockly.FieldTextInput("Experiment Name"),
        "exeperimentname"
      );
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_phyphox_experimentTitle)
      .appendField(new Blockly.FieldTextInput("Experiment Title"), "title");
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_phyphox_experimentCategory)
      .appendField(
        new Blockly.FieldTextInput("senseBox Experiments"),
        "category"
      );
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_phyphox_experimentDescription)
      .appendField(
        new Blockly.FieldTextInput("Experiment Beschreibung"),
        "description"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_led_tooltip);
  },
};

Blockly.Blocks["sensebox_phyphox_experiment_send"] = {
  init: function () {
    this.setColour(getColour().phyphox);
    this.appendDummyInput().appendField(
      Blockly.Msg.sensebox_phyphox_writeValues
    );

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_led_tooltip);
  },
};
