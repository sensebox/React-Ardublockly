import * as Blockly from "blockly";
import { selectedBoard } from "@/helpers/board";

/**
 * Solar Charger (SB-041)
 */
Blockly.Generator.Arduino.forBlock["sensebox_solar_charger_SB041"] =
  function () {
    var measurement = this.getFieldValue("MEASUREMENT");
    Blockly.Generator.Arduino.libraries_["library_solar_charger_SB041"] =
      "#include <SolarChargerSB041.h>;";
    Blockly.Generator.Arduino.variables_["define_solar_charger_SB041"] =
      "SolarChargerSB041 charger;";

    Blockly.Generator.Arduino.setupCode_["begin_solar_charger_SB041"] =
      "charger.begin();";
    Blockly.Generator.Arduino.loopCodeOnce_["update_solar_charger_SB041"] =
      "charger.update();";
    return [`charger.${measurement}()`, Blockly.Generator.Arduino.ORDER_ATOMIC];
  };

/**
 * Deep Sleep and Restart
 */
Blockly.Generator.Arduino.forBlock["sensebox_solar_deep_sleep_and_restart"] =
  function () {
    var board = selectedBoard().title;
    var sleep_time = this.getFieldValue("SLEEP_TIME");
    var time_scale = this.getFieldValue("TIME_SCALE");
    var wake_seconds = this.getFieldValue("WAKE_UP_SECONDS");
    if (board === "MCU-S2") {
      var powerOffGPIO = this.getFieldValue("POWER_OFF_GPIO") === "TRUE";
      var powerOffUART = this.getFieldValue("POWER_OFF_UART") === "TRUE";
      var powerOffXB = this.getFieldValue("POWER_OFF_XB") === "TRUE";
      Blockly.Generator.Arduino.libraries_["library_esp32_hal_gpio"] =
        "#include <esp32-hal-gpio.h>;";
      Blockly.Generator.Arduino.libraries_["library_pins_arduino"] =
        "#include <pins_arduino.h>;";
      Blockly.Generator.Arduino.codeFunctions_["deep_sleep_and_restart"] = `
// power saving deep sleep for specific time and a final restart
void deep_sleep_and_restart(int sleep_time, bool powerOffGPIO, bool powerOffUART, bool powerOffXB) {
  digitalWrite(IO_ENABLE, powerOffGPIO ? HIGH : LOW);
  digitalWrite(PIN_XB1_ENABLE, powerOffUART ? HIGH : LOW);
  digitalWrite(PIN_UART_ENABLE, powerOffXB ? HIGH : LOW);
  digitalWrite(PD_ENABLE, LOW);
  esp_sleep_enable_timer_wakeup(max(0, sleep_time - 1000));
  delay(1000);
  esp_deep_sleep_start();
}
`;
      return `deep_sleep_and_restart(${sleep_time} * ${time_scale}, ${powerOffGPIO}, ${powerOffUART}, ${powerOffXB});`;
    } else {
      // assume board === "MCU" || board === "Mini"
      var powerOffI2C = this.getFieldValue("POWER_OFF_I2C") === "TRUE";
      var powerOffUART = this.getFieldValue("POWER_OFF_UART") === "TRUE";
      var powerOffXB = this.getFieldValue("POWER_OFF_XB") === "TRUE";
      Blockly.Generator.Arduino.libraries_["library_low_power"] =
        "#include <ArduinoLowPower.h>;";
      Blockly.Generator.Arduino.codeFunctions_["deep_sleep_and_restart"] = `
// power saving deep sleep for specific time and a final restart
void deep_sleep_and_restart(int sleep_time, bool powerOffI2C, bool powerOffUART, bool powerOffXB) {
  senseBoxIO.powerI2C(!powerOffI2C);
  senseBoxIO.powerUART(!powerOffUART);
  senseBoxIO.powerXB1(!powerOffXB);
  senseBoxIO.powerXB2(!powerOffXB);
  LowPower.deepSleep(max(0, sleep_time - 1000));
  delay(1000);
  noInterrupts();
  NVIC_SystemReset();
  while (true);
}
`;
      return `deep_sleep_and_restart(${sleep_time} * ${time_scale}, ${powerOffI2C}, ${powerOffUART}, ${powerOffXB});`;
    }
  };

// /**
//  * Ensure Wake Time
//  */
// Blockly.Generator.Arduino.forBlock["sensebox_solar_ensure_wake_time"] =
//   function () {
//     var wake_time = this.getFieldValue("wake_time");
//     var time_scale = this.getFieldValue("time_scale");
//     return `
// // ensure minimal wake time
// while(millis() < ${wake_time}${time_scale});
// `;
//   };
