export const SOLAR = {
  /**
   * All Blocks Necessary for Solar Operation
   * ---------------------------------------------------
   */

  /**
   * Solar Charger (SB-041)
   */
  senseBox_solar_charger_SB041: "Solarladeregler (SB-041)",
  senseBox_solar_charger_SB041_solar_panel_voltage:
    "Spannung der Solarplatte in V",
  senseBox_solar_charger_SB041_solar_is_connected:
    "Solarplatte ist angeschlossen",
  senseBox_solar_charger_SB041_battery_voltage: "Spannung der Batterie in V",
  senseBox_solar_charger_SB041_battery_level: "Ladelevel der Batterie in 1/4",
  senseBox_solar_charger_SB041_battery_is_charging: "Batterie wird geladen",
  senseBox_solar_charger_SB041_battery_is_fast_charging:
    "Batterie wird schnell geladen",
  senseBox_solar_charger_SB041_battery_temperature:
    "Temperatur der Batterie in C",
  senseBox_solar_charger_SB041_tooltip_mcu:
    "Schließe den Solarladeregler (SB-041) an einen der **I2C-Anschlüsse** der senseBox MCU an. Der Solarladeregler liefert sowohl Strom, als auch Daten über den Ladeprozess, die Batterie und die Solarplatte.",
  senseBox_solar_charger_SB041_tooltip_mini:
    "Schließe den Solarladeregler (SB-041) mit einem **JST auf Qwic Kabel** an einen der **I2C-Anschlüsse** der senseBox MCU mini an. Der Solarladeregler liefert sowohl Strom, als auch Daten über den Ladeprozess, die Batterie und die Solarplatte.",
  senseBox_solar_charger_SB041_tooltip_esp32:
    "Schließe den Solarladeregler (SB-041) an das **mitgelieferte adapter Kabel** an. Der Stecker mit dem **roten und schwarzen Kabel** versorgt die senseBox MCU-S2 mit Strom und kommt in den entsprechend Anschluss. Der zweite Stecker mit **gelbem und grünen Kabel** liefert Daten über die Batterie und Solarplatte und kommt in einen der **I2C-Anschlüsse**.",
  senseBox_solar_charger_SB041_helpurl:
    "https://sensebox.kaufen/product/solar-set",

  /**
   * Deep Sleep and Restart
   */
  sensebox_solar_deep_sleep_and_restart:
    "Stromsparender Tiefschlaf und Neustart nach",
  sensebox_solar_deep_sleep_and_restart_milliseconds: "Millisekunden",
  sensebox_solar_deep_sleep_and_restart_minutes: "Minuten",
  sensebox_solar_deep_sleep_and_restart_hours: "Stunden",
  sensebox_solar_deep_sleep_and_restart_tooltip:
    "Dieser Block versetzt die senseBox für vorgegebene Zeit in einen Stromsparenden Tiefschlaf. Dabei werden jegliche Funktionen und angeschlossene Sensoren deaktiviert. Nach der vorgegebenen Zeit wacht die senseBox auf und startet neu. Dieser Block ist nützlich für den Solarbetrieb.",
  sensebox_solar_deep_sleep_and_restart_helpurl:
    "https://sensebox.kaufen/product/solar-set",
};
