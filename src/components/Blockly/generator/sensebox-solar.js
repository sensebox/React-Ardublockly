import Blockly from "blockly";
import { selectedBoard } from "../helpers/board";

/**
 * Solar Charger (SB-041)
 */
Blockly.Arduino.sensebox_solar_charger_SB041 = function () {
  var dropdown_name = this.getFieldValue("value");
  Blockly.Arduino.libraries_["library_wire"] = "#include <Wire.h>;";
  Blockly.Arduino.variables_["solar_voltage"] = "float solar_voltage;";
  Blockly.Arduino.variables_["solar_is_connected"] = "bool solar_is_connected;";
  Blockly.Arduino.variables_["battery_voltage"] = "float battery_voltage;";
  Blockly.Arduino.variables_["battery_level"] = "int battery_level;";
  Blockly.Arduino.variables_["battery_is_charging"] =
    "bool battery_is_charging;";
  Blockly.Arduino.variables_["battery_is_fast_charging"] =
    "bool battery_is_fast_charging ;";
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
  byte address = 0x32;
  Wire.beginTransmission(address);
  byte error = Wire.endTransmission();
  if (error == 0) {
    solar_is_connected = true;
    Wire.requestFrom((uint8_t)address, (uint8_t)4);

    // register 0
    uint vbat_raw = Wire.read();
    battery_voltage = 0.02 * vbat_raw;

    // register 1
    uint vin_raw = Wire.read();
    solar_panal_voltage = 0.1 * vin_raw;

    // register 2
    uint flags = Wire.read();
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
  } else if (error == 2) { // solar not connected
    solar_is_connected = true;
    Wire.requestFrom((uint8_t)address, (uint8_t)4);

    // register 0
    uint vbat_raw = Wire.read();
    battery_voltage = 0.02 * vbat_raw;

    // register 1
    uint vin_raw = Wire.read();
    solar_panal_voltage = 0.1 * vin_raw;

    // register 2
    uint flags = Wire.read();
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
  } else if (error) { // different error
    solar_panal_voltage_SB041 = -1;
    battery_voltage_SB041 = -1;
  }
}
  `;
  Blockly.Arduino.setupCode_["Wire.begin()"] = "Wire.begin();";
  Blockly.Arduino.setupCode_["solar_update_SB041"] = "solar_update_SB041();";
  Blockly.Arduino.loopCodeOnce_["solar_update_SB041"] = "solar_update_SB041();";
  return [dropdown_name, Blockly.Arduino.ORDER_ATOMIC];
};
