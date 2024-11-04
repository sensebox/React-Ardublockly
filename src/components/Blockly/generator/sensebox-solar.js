import Blockly from "blockly";
import { selectedBoard } from "../helpers/board";

/**
 * Solar Charger (SB-041)
 */
Blockly.Arduino.sensebox_solar_charger_SB041 = function () {
  var value = this.getFieldValue("value");
  Blockly.Arduino.libraries_["library_wire"] = "#include <Wire.h>;";
  Blockly.Arduino.variables_["solar_panel_voltage"] =
    "float solar_panel_voltage;";
  Blockly.Arduino.variables_["solar_is_connected"] = "bool solar_is_connected;";
  Blockly.Arduino.variables_["battery_voltage"] = "float battery_voltage;";
  Blockly.Arduino.variables_["battery_level"] = "int battery_level;";
  Blockly.Arduino.variables_["battery_is_charging"] =
    "bool battery_is_charging;";
  Blockly.Arduino.variables_["battery_is_fast_charging"] =
    "bool battery_is_fast_charging;";
  Blockly.Arduino.variables_["battery_temperature"] =
    "float battery_temperature;";
  Blockly.Arduino.codeFunctions_["solar_update_SB041"] = `
// update the values of the solar charger (SB-041)
void solar_update_SB041() {
  /*
   * I2C i/f with following info on address 0x32:
   * - Register 0: cell voltage, 20mV/LSB
   * - Register 1: input voltage, 100mV/LSB
   * - Register 2: status bits: [B,I,L3,L2,L1,L0,F,C]
   *    B=battery present >2.8V
   *    I=Input voltage present > 4.5V
   *    L0-L3=battery status LEDs
   *    F=Fast charge enabled
   *    C=Charging
   * - Register 3: temperature in C, signed 8-bit
   * Thresholds: L0: 3.2V, L1: 3.6V, L2: 3.7V, L3: 3.9V
   */
  byte address_SB041 = 0x32;
  Wire.beginTransmission(address_SB041);
  byte error = Wire.endTransmission();
  if (error == 0 || error == 2) {
    solar_is_connected = (error == 0);
    Wire.requestFrom((uint8_t)address_SB041, (uint8_t)4);

    // register 0
    uint8_t vbat_raw = Wire.read();
    battery_voltage = 0.02 * vbat_raw;

    // register 1
    uint8_t vin_raw = Wire.read();
    solar_panel_voltage = 0.1 * vin_raw;

    // register 2
    uint8_t flags = Wire.read();
    battery_is_charging = flags & 1;
    if (flags & 32)
      battery_level = 4;
    else if (flags & 16)
      battery_level = 3;
    else if (flags & 8)
      battery_level = 2;
    else if (flags & 4)
      battery_level = 1;
    else
      battery_level = 0;
    battery_is_fast_charging = flags & 64;
    battery_is_charging = flags & 128;

    // register 3
    battery_temperature = (int8_t)(Wire.read());
  } else {
    // set all booleans to false because of error
    solar_is_connected = false;   
    battery_is_fast_charging = false;
    battery_is_charging = false;

    // set all numbers to -1 because of error
    battery_voltage = -1;
    solar_panel_voltage = -1;
    battery_level = -1;
    battery_temperature = -1;
  }
}
  `;
  Blockly.Arduino.setupCode_["Wire.begin()"] = "Wire.begin();";
  Blockly.Arduino.setupCode_["solar_update_SB041"] = "solar_update_SB041();";
  Blockly.Arduino.loopCodeOnce_["solar_update_SB041"] = "solar_update_SB041();";
  return [value, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * Deep Sleep and Restart
 */
Blockly.Arduino.sensebox_solar_deep_sleep_and_restart = function () {
  var board = window.sessionStorage.getItem("board");
  var sleep_time =
    Blockly.Arduino.valueToCode(
      this,
      "sleep_time",
      Blockly.Arduino.ORDER_ATOMIC,
    ) || "0";
  var time_scale = this.getFieldValue("time_scale");
  if (board === "esp") {
    Blockly.Arduino.codeFunctions_["deep_sleep_and_restart"] = `
// power saving deep sleep for specific time and a final restart
void deep_sleep_and_restart(int sleep_time) {
  digitalWrite(PIN_RGB_LED, HIGH);
  digitalWrite(PIN_XB1_ENABLE, HIGH);
  digitalWrite(PIN_UART_ENABLE, HIGH);
  digitalWrite(PD_ENABLE, LOW);
  esp_sleep_enable_timer_wakeup(max(0, sleep_time - 1000));
  delay(1000);
  esp_deep_sleep_start();
}
`;
  } else {
    // assume else board === "mcu" || board === "mini"
    Blockly.Arduino.libraries_["library_low_power"] =
      "#include <ArduinoLowPower.h>;";
    Blockly.Arduino.codeFunctions_["deep_sleep_and_restart"] = `
// power saving deep sleep for specific time and a final restart
void deep_sleep_and_restart(int sleep_time) {
  senseBoxIO.powerNone();
  LowPower.deepSleep(max(0, sleep_time - 1000));
  delay(1000);
  noInterrupts();
  NVIC_SystemReset();
  while (1)
    ;
}
  `;
  }
  return `deep_sleep_and_restart(${sleep_time}${time_scale});`;
};
