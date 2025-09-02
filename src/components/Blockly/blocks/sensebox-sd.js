import * as Blockly from "blockly/core";
import { getColour } from "@/components/Blockly/helpers/colour";

var checkFileName = function (filename) {
  var length = filename.length;
  if (length > 8) {
    alert("dateiname sollte kleiner als 8 Zeichen sein");
    return filename.slice(0, 8);
  }
  return filename;
};

Blockly.Blocks["sensebox_sd_open_file"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_sd_open_file)
      .setAlign(Blockly.inputs.Align.LEFT);

    // String-Variable für Dateiname
    this.appendValueInput("FILENAME")
      .setCheck("String")
      .setAlign(Blockly.inputs.Align.LEFT)
      .appendField(Blockly.Msg.senseBox_output_filename);

    // Dropdown für Endung
    this.appendDummyInput()
      .appendField(".")
      .appendField(
        new Blockly.FieldDropdown([
          ["txt", "txt"],
          ["csv", "csv"],
        ]),
        "extension",
      );

    // Inhalt, der in die Datei geschrieben wird
    this.appendStatementInput("SD").setCheck(null);

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_sd_open_file_tooltip);
    this.setHelpUrl(Blockly.Msg.sensebox_sd_helpurl);
  },
  onchange: function () {
    var targetBlock = this.getInputTargetBlock("FILENAME");
    if (targetBlock && targetBlock.type === "text") {
      var txt = targetBlock.getFieldValue("TEXT") || "";
      if (txt.length > 8) {
        this.setWarningText(Blockly.Msg.sd_max_chars);
      } else {
        this.setWarningText(null);
      }
    }
  },
};

// -------- BLOCK ----------
Blockly.Blocks["sensebox_sd_create_file"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_sd_create_file)
      .setAlign(Blockly.inputs.Align.LEFT);

    // Variablen-Input für den Basis-Dateinamen
    this.appendValueInput("FILENAME")
      .setCheck("String")
      .setAlign(Blockly.inputs.Align.LEFT)
      .appendField(Blockly.Msg.senseBox_output_filename);

    // Dropdown für die Endung
    this.appendDummyInput()
      .appendField(".")
      .appendField(
        new Blockly.FieldDropdown([
          ["txt", "txt"],
          ["csv", "csv"],
        ]),
        "extension",
      );

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_sd_create_file_tooltip);
    this.setHelpUrl(Blockly.Msg.sensebox_sd_helpurl);
  },
};

Blockly.Blocks["sensebox_sd_write_file"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_sd_write_file)
      .setAlign(Blockly.inputs.Align.LEFT);
    this.appendValueInput("DATA").setCheck(null);
    this.appendDummyInput("CheckboxText")
      .appendField(Blockly.Msg.senseBox_output_linebreak)
      .appendField(new Blockly.FieldCheckbox("TRUE"), "linebreak");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_sd_write_file_tooltip);
    this.setHelpUrl(Blockly.Msg.sensebox_sd_helpurl);
  },
  /**
   * Called whenever anything on the workspace changes.
   * Add warning if block is not nested inside a the correct loop.
   * @param {!Blockly.Events.Abstract} e Change event.
   * @this Blockly.Block
   */
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
  },
  LOOP_TYPES: ["sensebox_sd_open_file"],
};

Blockly.Blocks["sensebox_sd_osem"] = {
  init: function () {
    this.setTooltip(Blockly.Msg.sensebox_sd_osem_tip);
    this.setHelpUrl(Blockly.Msg.sensebox_sd_helpurl);
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.LEFT)
      .appendField(Blockly.Msg.sensebox_sd_osem);
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
    this.appendValueInput("timeStamp", "Number").appendField(
      Blockly.Msg.senseBox_gps_timeStamp,
    );
    this.appendStatementInput("DO")
      .appendField(Blockly.Msg.sensebox_sd_measurement)
      .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.getField("type").setValidator(
      function (val) {
        this.updateShape_(val === "Mobile");
      }.bind(this),
    );
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
      }
    } else {
      this.removeInput("lat", true);
      this.removeInput("lng", true);
      this.removeInput("altitude", true);
    }
  },
};

Blockly.Blocks["sensebox_sd_save_for_osem"] = {
  init: function () {
    this.setTooltip(Blockly.Msg.sensebox_sd_save_for_osem_tip);
    this.setHelpUrl(Blockly.Msg.sensebox_sd_helpurl);
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.sensebox_sd_save_for_osem);
    this.appendValueInput("Value")
      .setAlign(Blockly.inputs.Align.LEFT)
      .appendField(Blockly.Msg.sensebox_sd_save_for_osem_id)
      .appendField(new Blockly.FieldTextInput("sensorID"), "SensorID");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
};

/**
 * senseBox-esp32-s2 sd Blocks
 */

Blockly.Blocks["sensebox_esp32s2_sd_open_file"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_sd_open_file)
      .setAlign(Blockly.inputs.Align.LEFT);

    // Variablen-Input für Basis-Dateiname
    this.appendValueInput("FILENAME")
      .setCheck("String")
      .setAlign(Blockly.inputs.Align.LEFT)
      .appendField(Blockly.Msg.senseBox_output_filename);

    // Dropdown für Endung
    this.appendDummyInput()
      .appendField(".")
      .appendField(
        new Blockly.FieldDropdown([
          ["txt", "txt"],
          ["csv", "csv"],
        ]),
        "extension",
      );

    // Inhalt, der in die Datei geschrieben werden soll
    this.appendStatementInput("SD").setCheck(null);

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_sd_open_file_tooltip);
    this.setHelpUrl(Blockly.Msg.sensebox_sd_helpurl);
  },
};

Blockly.Blocks["sensebox_esp32s2_sd_create_file"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_sd_create_file)
      .setAlign(Blockly.inputs.Align.LEFT);

    // Variablen-Input für Dateiname
    this.appendValueInput("FILENAME")
      .setCheck("String")
      .setAlign(Blockly.inputs.Align.LEFT)
      .appendField(Blockly.Msg.senseBox_output_filename);

    // Endung per Dropdown
    this.appendDummyInput()
      .appendField(".")
      .appendField(
        new Blockly.FieldDropdown([
          ["txt", "txt"],
          ["csv", "csv"],
        ]),
        "extension",
      );

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_sd_create_file_tooltip);
    this.setHelpUrl(Blockly.Msg.sensebox_sd_helpurl);
  },
};

Blockly.Blocks["sensebox_esp32s2_sd_write_file"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_sd_write_file)
      .setAlign(Blockly.inputs.Align.LEFT);
    this.appendValueInput("DATA").setCheck(null);
    this.appendDummyInput("CheckboxText")
      .appendField(Blockly.Msg.senseBox_output_linebreak)
      .appendField(new Blockly.FieldCheckbox("TRUE"), "linebreak");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_sd_write_file_tooltip);
    this.setHelpUrl(Blockly.Msg.sensebox_sd_helpurl);
  },
  /**
   * Called whenever anything on the workspace changes.
   * Add warning if block is not nested inside a the correct loop.
   * @param {!Blockly.Events.Abstract} e Change event.
   * @this Blockly.Block
   */
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
  },
  LOOP_TYPES: ["sensebox_esp32s2_sd_open_file"],
};

Blockly.Blocks["sensebox_sd_exists"] = {
  init: function () {
    this.appendValueInput("FILENAME")
      .appendField(Blockly.Msg.sensebox_sd_exists)
      .appendField(Blockly.Msg.filename);
    this.setOutput(true);

    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_sd_exists_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_sd_exists_tooltip);
  },
};
