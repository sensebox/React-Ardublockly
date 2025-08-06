export const SOLAR = {
  /**
   * All Blocks Necessary for Solar Operation
   * ---------------------------------------------------
   */

  /**
   * Solar Charger (SB-041)
   */
  senseBox_solar_charger_SB041: "Solar Charger (SB-041)",
  senseBox_solar_charger_SB041_charger_connected:
    "Charge controller is connected (true/false)",
  senseBox_solar_charger_SB041_solar_panel_voltage: "Solar panel voltage in V",
  senseBox_solar_charger_SB041_battery_voltage: "Battery voltage in V",
  senseBox_solar_charger_SB041_charging: "Battery is charging (true/false)",
  senseBox_solar_charger_SB041_fast_charging:
    "Battery is fast charging (true/false)",
  senseBox_solar_charger_SB041_battery_level: "Battery charge level in 1/4",
  senseBox_solar_charger_SB041_good_input_voltage:
    "Sufficient input voltage (true/false)",
  senseBox_solar_charger_SB041_battery_present:
    "Battery is connected (true/false)",
  senseBox_solar_charger_SB041_battery_temperature: "Battery temperature in °C",
  senseBox_solar_charger_SB041_tooltip_mcu:
    "Connect the solar charger (SB-041) to one of the **I2C ports** of the senseBox MCU. The solar charger provides both power and data about the charging process, battery, and solar panel.",
  senseBox_solar_charger_SB041_tooltip_mini:
    "Connect the solar charger (SB-041) with a **JST to Qwic cable** to one of the **I2C ports** of the senseBox MCU mini. The solar charger provides both power and data about the charging process, battery, and solar panel.",
  senseBox_solar_charger_SB041_tooltip_esp32:
    "Connect the solar charger (SB-041) to the **supplied adapter cable**. The connector with the **red and black wires** provides power to the senseBox MCU-S2 and connects to the appropriate port. The second connector with **yellow and green wires** provides data about the battery and solar panel and connects to one of the **I2C ports**.",
  senseBox_solar_charger_SB041_helpurl:
    "https://sensebox.kaufen/product/solar-set",

  /**
   * Ensure Wake Time
   */
  sensebox_solar_ensure_wake_time: "Minimum wake time of",
  sensebox_solar_ensure_wake_time_tooltip:
    "This block ensures that the senseBox has been awake for at least the specified amount of time since the last restart. **If you use the deep sleep block at the end of the main loop, place this block at the beginning of the main loop to ensure that all sensors have been active for at least the specified time.** For fine particular sensors, a minimum wake time of 30 seconds is recommended.",
  sensebox_solar_ensure_wake_time_helpurl: "",

  /**
   * Deep Sleep and Restart
   */
  sensebox_solar_deep_sleep_and_restart: "Power-saving deep sleep and restart",
  sensebox_solar_deep_sleep_and_restart_sleep_time: "Sleep time:",
  sensebox_solar_deep_sleep_and_restart_hours: "hours",
  sensebox_solar_deep_sleep_and_restart_minutes: "minutes",
  sensebox_solar_deep_sleep_and_restart_seconds: "seconds",
  sensebox_solar_deep_sleep_and_restart_milliseconds: "Milliseconds",
  sensebox_solar_milliseconds: "Milliseconds",
  sensebox_solar_deep_sleep_and_restart_deactivate_ports:
    "Ports to deactivate:",
  sensebox_solar_deep_sleep_and_restart_minimal_wake_up_time: "Wake-up time:",
  sensebox_solar_deep_sleep_and_restart_tooltip:
    "This block puts the senseBox into a **power-saving deep sleep** for a specified time. During this time, all functions and connected sensors are disabled. After the specified time, the senseBox wakes up and restarts. This block is useful for solar operation.",
  sensebox_solar_deep_sleep_and_restart_helpurl: "",
};
