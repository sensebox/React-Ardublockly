import Blockly from "blockly";
import { getColour } from "../helpers/colour";
import * as Types from "../helpers/types";

/**
 * Solar Charger (SB-041)
 */
Blockly.Blocks["sensebox_solar_charger_SB041"] = {
  init: function () {
    var board = window.sessionStorage.getItem("board");
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().solar);
    this.appendDummyInput().appendField(
      Blockly.Msg.senseBox_solar_charger_SB041,
    );
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(
        new Blockly.FieldDropdown([
          [
            Blockly.Msg.senseBox_solar_charger_SB041_solar_panel_voltage,
            "solar_panel_voltage",
          ],
          [
            Blockly.Msg.senseBox_solar_charger_SB041_solar_is_connected,
            "solar_is_connected",
          ],
          [
            Blockly.Msg.senseBox_solar_charger_SB041_battery_voltage,
            "battery_voltage",
          ],
          [
            Blockly.Msg.senseBox_solar_charger_SB041_battery_level,
            "battery_level",
          ],
          [
            Blockly.Msg.senseBox_solar_charger_SB041_battery_is_charging,
            "battery_is_charging",
          ],
          [
            Blockly.Msg.senseBox_solar_charger_SB041_battery_is_fast_charging,
            "battery_is_fast_charging",
          ],
          [
            Blockly.Msg.senseBox_solar_charger_SB041_battery_temperature,
            "battery_temperature",
          ],
        ]),
        "value",
      );
    if (board === "mini") {
      this.setTooltip(Blockly.Msg.senseBox_solar_charger_SB041_tooltip_mini);
    } else if (board === "esp32") {
      this.setTooltip(Blockly.Msg.senseBox_solar_charger_SB041_tooltip_esp32);
    } else {
      // assume board === "mcu"
      this.setTooltip(Blockly.Msg.senseBox_solar_charger_SB041_tooltip_mcu);
    }
    this.setHelpUrl(Blockly.Msg.senseBox_solar_charger_SB041_helpurl);
  },
};

/**
 * Deep Sleep and Restart
 */

Blockly.Blocks["sensebox_solar_deep_sleep_and_restart"] = {
  init: function () {
    this.setColour(getColour().solar);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.appendValueInput("sleep_time")
      .setCheck(Types.NUMBER.checkList)
      .appendField(Blockly.Msg.sensebox_solar_deep_sleep_and_restart);
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        [Blockly.Msg.sensebox_solar_deep_sleep_and_restart_milliseconds, ""],
        [Blockly.Msg.sensebox_solar_deep_sleep_and_restart_minutes, " * 60000"],
        [Blockly.Msg.sensebox_solar_deep_sleep_and_restart_hours, " * 3600000"],
      ]),
      "time_scale",
    );
    this.setHelpUrl(Blockly.Msg.sensebox_solar_deep_sleep_and_restart_helpurl);
    this.setTooltip(Blockly.Msg.sensebox_solar_deep_sleep_and_restart_tooltip);
  },
};
