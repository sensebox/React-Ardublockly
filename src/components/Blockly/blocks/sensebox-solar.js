import Blockly from "blockly";
import { getColour } from "../helpers/colour";
import * as Types from "../helpers/types";
import { selectedBoard } from "../helpers/board";
import { FieldGridDropdown } from "@blockly/field-grid-dropdown";
import { FieldSlider } from "@blockly/field-slider";

/**
 * Solar Charger (SB-041)
 */
Blockly.Blocks["sensebox_solar_charger_sb041"] = {
  init: function () {
    this.appendDummyInput().appendField(
      Blockly.Msg.senseBox_solar_charger_sb041,
    );
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(
        new Blockly.FieldDropdown([
          [
            Blockly.Msg.senseBox_solar_charger_sb041_solar_voltage,
            "solar_voltage",
          ],
          [
            Blockly.Msg.senseBox_solar_charger_sb041_battery_voltage,
            "battery_voltage",
          ],
          [
            Blockly.Msg.senseBox_solar_charger_sb041_battery_level,
            "battery_level",
          ],
          [
            Blockly.Msg.senseBox_solar_charger_sb041_battery_temp,
            "battery_temp",
          ],
        ]),
        "measurement",
      );
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().solar);
    this.setTooltip(Blockly.Msg.senseBox_solar_charger_sb041_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_solar_charger_sb041_helpurl);
  },
};

/**
 * Deep Sleep and Restart
 */

Blockly.Blocks["sensebox_solar_deep_sleep_and_restart"] = {
  init: function () {
    this.setColour(getColour().solar);
    this.appendDummyInput().appendField();
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.appendValueInput("sleep_time")
      .setCheck(Types.NUMBER.checkList)
      .appendField(Blockly.Msg.sensebox_solar_deep_sleep);
    this.appendDummyInput().appendField(
      Blockly.Msg.sensebox_solar_deep_sleep_unit,
    );
    this.setHelpUrl(sensebox_solar_deep_sleep_tooltip);
    this.setTooltip(sensebox_solar_deep_sleep_helpurl);
  },
};
