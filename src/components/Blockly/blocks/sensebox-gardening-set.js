import * as Blockly from "blockly/core";
import { getColour } from "../helpers/colour";
import { selectedBoard } from "../helpers/board";
import * as Types from "../helpers/types";
import { FieldSlider } from "@blockly/field-slider";

Blockly.Blocks["sensebox_gardening_water_pump_init"] = {
  init: function () {
    this.appendDummyInput().appendField("Initialisiere Wasserpumpe");

    this.setPreviousStatement(true, null);

    this.setNextStatement(true, null);
    this.setColour(getColour().sensebox);
    this.setTooltip(
      "Initialisiert die Wasserpumpe. Diese muss vor der Verwendung initialisiert werden.",
    );
    this.setHelpUrl(
      "https://docs.sensebox.de/de/guides/arduino/blocks/#sensebox-gardening-water-pump",
    );
  },
};

Blockly.Blocks["sensebox_gardening_water_pump_toggle"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Wasserpumpe steuern")
      .appendField(Blockly.Msg.senseBox_basic_state)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_on, "HIGH"],
          [Blockly.Msg.senseBox_off, "LOW"],
        ]),
        "STAT",
      );
    this.appendDummyInput()
      .appendField("Stärke:")
      .appendField(new FieldSlider(0, 0, 100), "VALUE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().sensebox);
  },
};

Blockly.Blocks["sensebox_gardening_water_pump_status"] = {
  init: function () {
    this.appendDummyInput().appendField("Wasserpumpe status abfragen");
    this.setOutput(true, Types.NUMBER.typeName);

    this.setColour(getColour().sensebox);
  },
};
