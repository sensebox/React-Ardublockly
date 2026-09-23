import * as Blockly from "blockly/core";
import { getColour } from "@/components/Blockly/helpers/colour";
import store from "@/store";

var boxes = store.getState().auth.user
  ? store.getState().auth.user.boxes
  : null;
store.subscribe(() => {
  boxes = store.getState().auth.user ? store.getState().auth.user.boxes : null;
});
var selectedBox = "";

// Account box/sensor suggestions belong to production. Staging IDs are entered manually.
function updateEnvironmentField(block, name, manual, options, placeholder) {
  const field = block.getField(name);
  if (
    !field ||
    (manual && field instanceof Blockly.FieldTextInput) ||
    (!manual && field instanceof Blockly.FieldDropdown)
  )
    return;
  const input = block.inputList.find((input) => input.fieldRow.includes(field));
  input.removeField(name);
  input.appendField(
    manual
      ? new Blockly.FieldTextInput(placeholder)
      : new Blockly.FieldDropdown(options),
    name,
  );
}
function configureEnvironment(block) {
  block.getField("ENVIRONMENT").setValidator(function (value) {
    if (value === block.getFieldValue("ENVIRONMENT")) return value;
    updateEnvironmentField(
      block,
      "BoxID",
      value === "STAGING" || !boxes?.length,
      boxes?.map((box) => [box.name, box._id]) || [],
      "senseBox ID",
    );
    block.getField("access_token").setValue("access_token");
    return value;
  });
}

Blockly.Blocks["sensebox_osem_connection"] = {
  init: function () {
    var ssl = "TRUE";
    this.setTooltip(Blockly.Msg.senseBox_osem_connection_tip);
    this.setHelpUrl(Blockly.Msg.senseBox_osem_connection_helpurl);
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_osem_connection)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_osem_host, "PRODUCTION"],
          [Blockly.Msg.senseBox_osem_host_staging, "STAGING"],
        ]),
        "ENVIRONMENT",
      )
      .appendField("SSL")
      .appendField(new Blockly.FieldCheckbox(ssl), "SSL");
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_osem_restart)
      .appendField(new Blockly.FieldCheckbox("TRUE"), "RESTART");
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.LEFT)
      .appendField(Blockly.Msg.senseBox_osem_exposure)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_osem_stationary, "Stationary"],
          [Blockly.Msg.senseBox_osem_mobile, "Mobile"],
        ]),
        "type",
      );
    if (!boxes || boxes.length === 0) {
      this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.LEFT)
        .appendField("senseBox ID")
        .appendField(new Blockly.FieldTextInput("senseBox ID"), "BoxID");

      // .appendField(
      //   new Blockly.FieldDropdown([["Bitte auswählen", ""]]),
      //   "BoxID",
      // );
    } else {
      var dropdown = [];
      for (var i = 0; i < boxes.length; i++) {
        dropdown.push([boxes[i].name, boxes[i]._id]);
      }
      if (dropdown.length === 0) {
        dropdown = [["Bitte auswählen", ""]];
      }
      this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.LEFT)
        .appendField("senseBox ID")
        .appendField(new Blockly.FieldDropdown(dropdown), "BoxID");
    }
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.LEFT)
      .appendField(Blockly.Msg.senseBox_osem_access_token)
      .appendField(new Blockly.FieldTextInput("access_token"), "access_token");
    this.appendStatementInput("DO")
      .appendField(Blockly.Msg.senseBox_sensor)
      .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    configureEnvironment(this);
    this.getField("type").setValidator(
      function (val) {
        this.updateShape_(val === "Mobile");
      }.bind(this),
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
    if (
      this.getFieldValue("ENVIRONMENT") !== "STAGING" &&
      selectedBox !== "" &&
      boxes?.length
    ) {
      var accessToken = boxes.find(
        (element) => element._id === selectedBox,
      )?.access_token;
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
          "gps",
        );
        this.appendValueInput("lng", "Number").appendField(
          Blockly.Msg.senseBox_gps_lng,
        );
        this.appendValueInput("altitude", "Number").appendField(
          Blockly.Msg.senseBox_gps_alt,
        );
        this.appendValueInput("timeStamp", "Number").appendField(
          Blockly.Msg.senseBox_gps_timeStamp,
        );
      }
    } else {
      this.removeInput("lat", true);
      this.removeInput("lng", true);
      this.removeInput("altitude", true);
      this.removeInput("timeStamp", true);
    }
  },
  LOOP_TYPES: ["sensebox_interval_timer", "switch_case"],
};
Blockly.Blocks["sensebox_send_to_osem"] = {
  init: function () {
    this.setTooltip(Blockly.Msg.senseBox_send_to_osem_tip);
    this.setHelpUrl(Blockly.Msg.senseBox_osem_connection_helpurl);
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_send_to_osem);
    if (boxes && boxes.length > 0) {
      this.appendValueInput("Value")
        .appendField("Phänomen")
        .appendField(
          new Blockly.FieldDropdown(this.generateOptions),
          "SensorID",
        );
    } else {
      this.appendValueInput("Value")
        .setAlign(Blockly.inputs.Align.LEFT)
        .appendField("Phänomen")
        .appendField(new Blockly.FieldTextInput("Sensor Id"), "SensorID");

      // .appendField(
      //   new Blockly.FieldDropdown([["Bitte auswählen", ""]]),
      //   "SensorID",
      // );
    }

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },

  saveExtraState() {
    return {
      manualSensorId:
        this.getField("SensorID") instanceof Blockly.FieldTextInput,
    };
  },
  loadExtraState(state) {
    updateEnvironmentField(
      this,
      "SensorID",
      !!state.manualSensorId,
      this.generateOptions.bind(this),
      "Sensor Id",
    );
  },
  mutationToDom() {
    const mutation = Blockly.utils.xml.createElement("mutation");
    mutation.setAttribute(
      "manual_sensor_id",
      String(this.saveExtraState().manualSensorId),
    );
    return mutation;
  },
  domToMutation(mutation) {
    this.loadExtraState({
      manualSensorId: mutation.getAttribute("manual_sensor_id") === "true",
    });
  },

  generateOptions: function () {
    var dropdown = [];
    var boxID = selectedBox;
    if (boxID !== "" && boxes) {
      let box = boxes.find((el) => el._id === boxID);
      if (box !== undefined && box.sensors && box.sensors.length > 0) {
        for (var i = 0; i < box.sensors.length; i++) {
          dropdown.push([box.sensors[i].title, box.sensors[i]._id]);
        }
      }
    }
    if (dropdown.length === 0) {
      dropdown = [["Bitte auswählen", ""]];
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
    let connection = this.getSurroundParent();
    while (connection && !this.LOOP_TYPES.includes(connection.type))
      connection = connection.getSurroundParent();
    updateEnvironmentField(
      this,
      "SensorID",
      !boxes?.length || connection?.getFieldValue("ENVIRONMENT") === "STAGING",
      this.generateOptions.bind(this),
      "Sensor Id",
    );
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
  LOOP_TYPES: ["sensebox_osem_connection", "sensebox_esp32s2_osem_connection"],
};

Blockly.Blocks["sensebox_esp32s2_osem_connection"] = {
  init: function () {
    var ssl = "TRUE";
    this.setTooltip(Blockly.Msg.senseBox_osem_connection_tip);
    this.setHelpUrl(Blockly.Msg.senseBox_osem_connection_helpurl);
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_osem_connection)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_osem_host, "PRODUCTION"],
          [Blockly.Msg.senseBox_osem_host_staging, "STAGING"],
        ]),
        "ENVIRONMENT",
      )
      .appendField("SSL")
      .appendField(new Blockly.FieldCheckbox(ssl), "SSL");
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.LEFT)
      .appendField(Blockly.Msg.senseBox_osem_exposure)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_osem_stationary, "Stationary"],
          [Blockly.Msg.senseBox_osem_mobile, "Mobile"],
        ]),
        "type",
      );
    if (!boxes || boxes.length === 0) {
      this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.LEFT)
        .appendField("senseBox ID")
        .appendField(new Blockly.FieldTextInput("senseBox ID"), "BoxID");
    } else {
      var dropdown = [];
      for (var i = 0; i < boxes.length; i++) {
        dropdown.push([boxes[i].name, boxes[i]._id]);
      }
      this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.LEFT)
        .appendField("senseBox ID")
        .appendField(new Blockly.FieldDropdown(dropdown), "BoxID");
      // .appendField(new Blockly.FieldDropdown(dropdown), "BoxID");
    }
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.LEFT)
      .appendField(Blockly.Msg.senseBox_osem_access_token)
      .appendField(new Blockly.FieldTextInput("access_token"), "access_token");
    this.appendStatementInput("DO")
      .appendField(Blockly.Msg.senseBox_sensor)
      .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    configureEnvironment(this);
    this.getField("type").setValidator(
      function (val) {
        this.updateShape_(val === "Mobile");
      }.bind(this),
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
    if (
      this.getFieldValue("ENVIRONMENT") !== "STAGING" &&
      selectedBox !== "" &&
      boxes?.length
    ) {
      var accessToken = boxes.find(
        (element) => element._id === selectedBox,
      )?.access_token;
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
          "gps",
        );
        this.appendValueInput("lng", "Number").appendField(
          Blockly.Msg.senseBox_gps_lng,
        );
        this.appendValueInput("altitude", "Number").appendField(
          Blockly.Msg.senseBox_gps_alt,
        );
        this.appendValueInput("timeStamp", "Number").appendField(
          Blockly.Msg.senseBox_gps_timeStamp,
        );
      }
    } else {
      this.removeInput("lat", true);
      this.removeInput("lng", true);
      this.removeInput("altitude", true);
      this.removeInput("timeStamp", true);
    }
  },
  LOOP_TYPES: ["sensebox_interval_timer", "switch_case"],
};
