import * as Blockly from "blockly/core";
import { getColour } from "../helpers/colour";

import store from "../../../store";

var boxes = store.getState().auth.user
  ? store.getState().auth.user.boxes
  : null;
store.subscribe(() => {
  boxes = store.getState().auth.user ? store.getState().auth.user.boxes : null;
});
var selectedBox = "";

Blockly.Blocks["sensebox_osem_connection"] = {
  init: function () {
    var ssl = "TRUE";
    var workspace = Blockly.getMainWorkspace();
    if (workspace.getBlocksByType("sensebox_ethernet").length > 0) {
      ssl = "FALSE";
      console.log("ethernet");
    }
    this.setTooltip(Blockly.Msg.senseBox_osem_connection_tip);
    this.setHelpUrl("");
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_osem_connection)
      .appendField("SSL")
      .appendField(new Blockly.FieldCheckbox(ssl), "SSL");
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Blockly.Msg.senseBox_osem_exposure)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_osem_stationary, "Stationary"],
          [Blockly.Msg.senseBox_osem_mobile, "Mobile"],
        ]),
        "type"
      );
    if (!boxes) {
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField("senseBox ID")
        .appendField(new Blockly.FieldTextInput("senseBox ID"), "BoxID");
    } else {
      var dropdown = [];
      for (var i = 0; i < boxes.length; i++) {
        dropdown.push([boxes[i].name, boxes[i]._id]);
      }
      this.appendDummyInput()
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField("senseBox ID")
        .appendField(new Blockly.FieldDropdown(dropdown), "BoxID");
    }
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Blockly.Msg.senseBox_osem_access_token)
      .appendField(new Blockly.FieldTextInput("access_token"), "access_token");
    this.appendStatementInput("DO")
      .appendField(Blockly.Msg.senseBox_sensor)
      .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.getField("type").setValidator(
      function (val) {
        this.updateShape_(val === "Mobile");
      }.bind(this)
    );
  },
  onchange: function (e) {
    var legal = false;
    // Is the block nested in a loop?
    var block = this;
    do {
      if (this.LOOP_TYPES.indexOf(block.type) !== -1) {
        legal = true;
        break;
      }
      block = block.getSurroundParent();
    } while (block);
    if (legal) {
      this.setWarningText(null);
    } else {
      this.setWarningText(Blockly.Msg.CONTROLS_FLOW_STATEMENTS_WARNING);
    }

    /**
     * List of block types that are loops and thus do not need warnings.
     * To add a new loop type add this to your code:
     * Blockly.Blocks['controls_flow_statements'].LOOP_TYPES.push('custom_loop');
     */
    selectedBox = this.getFieldValue("BoxID");
    if (selectedBox !== "" && boxes) {
      var accessToken = boxes.find(
        (element) => element._id === selectedBox
      ).access_token;
      if (accessToken !== undefined) {
        this.getField("access_token").setValue(accessToken);
      } else {
        this.getField("access_token").setValue("access_token");
      }
    }
  },
  updateShape_(isMobile) {
    if (isMobile) {
      if (this.getInput("lat") == null) {
        this.appendValueInput("lat", "Number").appendField(
          Blockly.Msg.senseBox_gps_lat,
          "gps"
        );
        this.appendValueInput("lng", "Number").appendField(
          Blockly.Msg.senseBox_gps_lng
        );
        this.appendValueInput("altitude", "Number").appendField(
          Blockly.Msg.senseBox_gps_alt
        );
        this.appendValueInput("timeStamp", "Number").appendField(
          Blockly.Msg.senseBox_gps_timeStamp
        );
      }
    } else {
      this.removeInput("lat", true);
      this.removeInput("lng", true);
      this.removeInput("altitude", true);
      this.removeInput("timeStamp", true);
    }
  },
  LOOP_TYPES: ["sensebox_interval_timer"],
};
Blockly.Blocks["sensebox_send_to_osem"] = {
  init: function () {
    this.setTooltip(Blockly.Msg.senseBox_send_to_osem_tip);
    this.setHelpUrl("");
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_send_to_osem);
    if (boxes) {
      this.appendValueInput("Value")
        .appendField("Phänomen")
        .appendField(
          new Blockly.FieldDropdown(this.generateOptions),
          "SensorID"
        );
    } else {
      this.appendValueInput("Value")
        .setAlign(Blockly.ALIGN_LEFT)
        .appendField("Phänomen")
        .appendField(new Blockly.FieldTextInput("sensorID"), "SensorID");
    }

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },

  generateOptions: function () {
    var dropdown = [["", ""]];
    var boxID = selectedBox;
    if (boxID !== "" && boxes) {
      let box = boxes.find((el) => el._id === boxID);
      if (box !== undefined) {
        for (var i = 0; i < box.sensors.length; i++) {
          dropdown.push([box.sensors[i].title, box.sensors[i]._id]);
        }
      }
      if (dropdown.length > 1) {
        var options = dropdown.slice(1);
        return options;
      } else {
        return dropdown;
      }
    }
    return dropdown;
  },
  /**
   * Called whenever anything on the workspace changes.
   * Add warning if block is not nested inside a the correct loop.
   * @param {!Blockly.Events.Abstract} e Change event.
   * @this Blockly.Block
   */
  onchange: function () {
    var legal = false;
    // Is the block nested in a loop?
    var block = this;
    do {
      if (this.LOOP_TYPES.indexOf(block.type) !== -1) {
        legal = true;
        break;
      }
      block = block.getSurroundParent();
    } while (block);
    if (legal) {
      this.setWarningText(null);
    } else {
      this.setWarningText(Blockly.Msg.CONTROLS_FLOW_STATEMENTS_WARNING);
    }
  },
  /**
   * List of block types that are loops and thus do not need warnings.
   * To add a new loop type add this to your code:
   * Blockly.Blocks['controls_flow_statements'].LOOP_TYPES.push('custom_loop');
   */
  LOOP_TYPES: ["sensebox_osem_connection"],
};
