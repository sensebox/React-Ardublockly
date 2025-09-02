import * as Blockly from "blockly";
import { getColour } from "@/components/Blockly/helpers/colour";
import * as Types from "../helpers/types";
import { selectedBoard } from "@/components/Blockly/helpers/board";

/**
 * Solar Charger (SB-041)
 */
Blockly.Blocks["sensebox_solar_charger_SB041"] = {
  init: function () {
    var board = selectedBoard().title;
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setColour(getColour().solar);
    this.appendDummyInput().appendField(
      Blockly.Msg.senseBox_solar_charger_SB041,
    );
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(
        new Blockly.FieldDropdown(
          [
            [
              Blockly.Msg.senseBox_solar_charger_SB041_charger_connected,
              "isChargerConnected",
            ],
            [
              Blockly.Msg.senseBox_solar_charger_SB041_solar_panel_voltage,
              "getSolarPanelVoltage",
            ],
            [
              Blockly.Msg.senseBox_solar_charger_SB041_battery_voltage,
              "getBatteryVoltage",
            ],
            [Blockly.Msg.senseBox_solar_charger_SB041_charging, "isCharging"],
            [
              Blockly.Msg.senseBox_solar_charger_SB041_fast_charging,
              "isFastCharging",
            ],
            [
              Blockly.Msg.senseBox_solar_charger_SB041_battery_level,
              "getBatteryLevel",
            ],
            [
              Blockly.Msg.senseBox_solar_charger_SB041_good_input_voltage,
              "isGoodInputVoltage",
            ],
            [
              Blockly.Msg.senseBox_solar_charger_SB041_battery_present,
              "isBatteryPresent",
            ],
            [
              Blockly.Msg.senseBox_solar_charger_SB041_battery_temperature,
              "getBatteryTemperature",
            ],
          ],
          this.updateOutputType.bind(this),
        ),
        "MEASUREMENT",
      );
    if (board === "MCU:mini") {
      this.setTooltip(Blockly.Msg.senseBox_solar_charger_SB041_tooltip_mini);
    } else if (board === "MCU-S2") {
      this.setTooltip(Blockly.Msg.senseBox_solar_charger_SB041_tooltip_esp32);
    } else {
      // assume board === "MCU"
      this.setTooltip(Blockly.Msg.senseBox_solar_charger_SB041_tooltip_mcu);
    }
    this.setHelpUrl(Blockly.Msg.senseBox_solar_charger_SB041_helpurl);
  },

  // Function to update the output type dynamically
  updateOutputType: function (newMeasurement) {
    switch (newMeasurement) {
      case "isChargerConnected":
      case "isCharging":
      case "isFastCharging":
      case "isGoodInputVoltage":
      case "isBatteryPresent":
        this.setOutput(true, Types.BOOLEAN.typeName);
        break;

      case "getSolarPanelVoltage":
      case "getBatteryVoltage":
      case "getBatteryLevel":
      case "getBatteryTemperature":
        this.setOutput(true, Types.NUMBER.typeName);
        break;

      default:
        this.setOutput(true, null); // Fallback
    }
  },
};

/**
 * Deep Sleep and Restart
 */
Blockly.Blocks["sensebox_solar_deep_sleep_and_restart"] = {
  init: function () {
    var board = selectedBoard().title;
    var time_scales = [
      [Blockly.Msg.sensebox_solar_deep_sleep_and_restart_hours, "3600000"],
      [Blockly.Msg.sensebox_solar_deep_sleep_and_restart_minutes, "60000"],
      [Blockly.Msg.sensebox_solar_deep_sleep_and_restart_seconds, "1000"],
      [Blockly.Msg.sensebox_solar_deep_sleep_and_restart_milliseconds, "1"],
    ];
    var sensor_wake_up_seconds = [
      ["30", "30"],
      ["60", "60"],
      ["120", "120"],
    ];
    this.setColour(getColour().solar);
    this.setPreviousStatement(true);
    this.appendDummyInput().appendField(
      Blockly.Msg.sensebox_solar_deep_sleep_and_restart,
    );
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_solar_deep_sleep_and_restart_sleep_time)
      .appendField(new Blockly.FieldNumber(1), "SLEEP_TIME")
      .appendField(new Blockly.FieldDropdown(time_scales), "TIME_SCALE");
    this.appendDummyInput()
      .appendField(
        Blockly.Msg.sensebox_solar_deep_sleep_and_restart_minimal_wake_up_time,
      )
      .appendField(
        new Blockly.FieldDropdown(sensor_wake_up_seconds),
        "WAKE_SECONDS",
      )
      .appendField(Blockly.Msg.sensebox_solar_deep_sleep_and_restart_seconds);
    if (board === "MCU-S2") {
      this.appendDummyInput()
        .appendField(
          Blockly.Msg.sensebox_solar_deep_sleep_and_restart_deactivate_ports,
        )
        .appendField("GPIO")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "POWER_OFF_GPIO")
        .appendField(", UART")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "POWER_OFF_UART")
        .appendField(", XB")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "POWER_OFF_XB");
    } else {
      // assume board === "MCU" || board === "MINI"
      this.appendDummyInput()
        .appendField(
          Blockly.Msg.sensebox_solar_deep_sleep_and_restart_deactivate_ports,
        )
        .appendField("I2C")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "POWER_OFF_I2C")
        .appendField(", UART")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "POWER_OFF_UART")
        .appendField(", XB")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "POWER_OFF_XB");
    }
    this.setTooltip(Blockly.Msg.sensebox_solar_deep_sleep_and_restart_tooltip);
    //this.setHelpUrl(Blockly.Msg.sensebox_solar_deep_sleep_and_restart_helpurl);
  },
};
