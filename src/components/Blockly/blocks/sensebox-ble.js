import * as Blockly from "blockly";
import { getColour } from "../helpers/colour";

Blockly.Blocks["sensebox_phyphox_init"] = {
  init: function () {
    this.setColour(getColour().phyphox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_phyphox_init)
      .appendField(new Blockly.FieldTextInput("Geräte Name"), "devicename");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.sensebox_phyphox_init_tooltip);
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
      .appendField(Blockly.Msg.sensebox_phyphox_experimentDescription)
      .appendField(
        new Blockly.FieldTextInput(
          Blockly.Msg.sensebox_phyphox_experiment_description
        ),
        "description"
      );
    this.appendStatementInput("view").appendField(
      Blockly.Msg.sensebox_phyphox_createView
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.sensebox_phyphox_experiment_tooltip);
  },
};

Blockly.Blocks["sensebox_phyphox_graph"] = {
  init: function () {
    this.setColour(getColour().phyphox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_phyphox_createGraph)
      .appendField(Blockly.Msg.sensebox_phyphox_graphLabel)
      .appendField(new Blockly.FieldTextInput("Label"), "label");
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_phyphox_unitx)
      .appendField(new Blockly.FieldTextInput("Unit X"), "unitx");
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_phyphox_unity)
      .appendField(new Blockly.FieldTextInput("Unit Y"), "unity");
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_phyphox_labelx)
      .appendField(new Blockly.FieldTextInput("Label X"), "labelx");
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_phyphox_labely)
      .appendField(new Blockly.FieldTextInput("Label Y"), "labely");
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_phyphox_graphStyle)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.sensebox_phyphox_style_dots, "dots"],
          [Blockly.Msg.sensebox_phyphox_style_line, "line"],
        ]),
        "style"
      );
    this.appendValueInput("channel0").appendField(
      Blockly.Msg.sensebox_phyphox_channel0
    );
    this.appendValueInput("channel1").appendField(
      Blockly.Msg.sensebox_phyphox_channel1
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.sensebox_phyphox_graph_tooltip);
  },
};

Blockly.Blocks["sensebox_phyphox_timestamp"] = {
  init: function () {
    this.setColour(getColour().phyphox);
    this.appendDummyInput().appendField(Blockly.Msg.sensebox_phyphox_timestamp);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.senseBox_led_tooltip);
  },
};

Blockly.Blocks["sensebox_phyphox_channel"] = {
  init: function () {
    this.setColour(getColour().phyphox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_phyphox_channel)
      .appendField(
        new Blockly.FieldDropdown([
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"],
          ["5", "5"],
        ]),
        "channel"
      );

    this.setOutput(true);
    this.setTooltip(Blockly.Msg.sensebox_phyphox_timestamp_tooltip);
  },
};

Blockly.Blocks["sensebox_phyphox_sendchannel"] = {
  init: function () {
    this.setColour(getColour().phyphox);
    this.appendValueInput("value")
      .appendField(Blockly.Msg.sensebox_phyphox_sendchannel)
      .appendField(
        new Blockly.FieldDropdown([
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"],
          ["5", "5"],
        ]),
        "channel"
      );

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.sensebox_phyphox_sendchannel_tooltip);
  },
};

Blockly.Blocks["sensebox_phyphox_experiment_send"] = {
  init: function () {
    this.setColour(getColour().phyphox);
    this.appendStatementInput("sendValues").appendField(
      Blockly.Msg.sensebox_phyphox_writeValues
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.sensebox_phyphox_experiment_send_tooltip);
  },
};
