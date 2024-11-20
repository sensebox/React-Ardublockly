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
    "Spannung des Solarmoduls in V",
  senseBox_solar_charger_SB041_solar_is_connected:
    "Solarmodul ist angeschlossen",
  senseBox_solar_charger_SB041_battery_voltage: "Spannung der Batterie in V",
  senseBox_solar_charger_SB041_battery_level: "Ladelevel der Batterie in 1/4",
  senseBox_solar_charger_SB041_battery_is_charging: "Batterie wird geladen",
  senseBox_solar_charger_SB041_battery_is_fast_charging:
    "Batterie wird schnell geladen",
  senseBox_solar_charger_SB041_battery_temperature:
    "Temperatur der Batterie in °C",
  senseBox_solar_charger_SB041_tooltip_mcu:
    "Schließe den Solarladeregler (SB-041) an einen der **I2C-Anschlüsse** der senseBox MCU an. Der Solarladeregler liefert sowohl Strom als auch Daten über den Ladeprozess, die Batterie und das Solarmodul.",
  senseBox_solar_charger_SB041_tooltip_mini:
    "Schließe den Solarladeregler (SB-041) mit einem **JST-auf-Qwiic-Kabel** an einen der **I2C-Anschlüsse** der senseBox MCU mini an. Der Solarladeregler liefert sowohl Strom als auch Daten über den Ladeprozess, die Batterie und das Solarmodul.",
  senseBox_solar_charger_SB041_tooltip_esp32:
    "Schließe den Solarladeregler (SB-041) an das **mitgelieferte Adapterkabel** an. Der Stecker mit dem **roten und schwarzen Kabel** versorgt die senseBox MCU-S2 mit Strom und kommt in den entsprechenden Anschluss. Der zweite Stecker mit dem **gelben und grünen Kabel** liefert Daten über die Batterie und das Solarmodul und kommt in einen der **I2C-Anschlüsse**.",
  senseBox_solar_charger_SB041_helpurl:
    "https://sensebox.kaufen/product/solar-set",

  /**
   * Ensure Wake Time
   */
  sensebox_solar_ensure_wake_time: "Mindestwachzeit von",
  sensebox_solar_ensure_wake_time_tooltip:
    "Dieser Block stellt sicher, dass die senseBox mindestens die angegebene Zeit seit dem letzten Neustart wach war. **Wenn du den Tiefschlaf-Block am Ende der Endlosschleife verwendest, dann platziere diesen Block am Anfang der Endlosschleife, um sicherzugehen, dass alle Sensoren mindestens die angegebene Zeit lang aktiv waren.** Für die Feinstaubsensoren wird beispielsweise eine Mindestwachzeit von 30 Sekunden empfohlen.",
  sensebox_solar_ensure_wake_time_helpurl: "",

  /**
   * Deep Sleep and Restart
   */
  sensebox_solar_deep_sleep_and_restart:
    "Stromsparender Tiefschlaf und Neustart nach",
  sensebox_solar_seconds: "Sekunden",
  sensebox_solar_minutes: "Minuten",
  sensebox_solar_hours: "Stunden",
  sensebox_solar_milliseconds: "Millisekunden",
  sensebox_solar_deep_sleep_and_restart_deactivate_ports:
    "Anschlüsse zum deaktivieren:",
  sensebox_solar_deep_sleep_and_restart_tooltip:
    "Dieser Block versetzt die senseBox für vorgegebene Zeit in einen **Stromsparenden Tiefschlaf**. Dabei werden jegliche Funktionen und die Sensoren an den angegebenen Anschlüssen deaktiviert. Nach der vorgegebenen Zeit wacht die senseBox auf und startet neu. Dieser Block ist nützlich für den Solarbetrieb.",
  sensebox_solar_deep_sleep_and_restart_helpurl: "",
};
