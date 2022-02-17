import Blockly from "blockly";

Blockly.Arduino.sensebox_rtc_init = function () {
  Blockly.Arduino.libraries_["RV8523"] = `#include <RV8523.h>`;
  Blockly.Arduino.definitions_["RTC"] = `RV8523 rtc;`;
  Blockly.Arduino.libraries_["library_senseBoxIO"] = "#include <senseBoxIO.h>";
  Blockly.Arduino.setupCode_["rtc.begin"] = `rtc.begin();`;
  var code = ``;
  return code;
};

Blockly.Arduino.sensebox_rtc_set = function () {
  var second =
    Blockly.Arduino.valueToCode(this, "second", Blockly.Arduino.ORDER_ATOMIC) ||
    "0";
  var minutes =
    Blockly.Arduino.valueToCode(
      this,
      "minutes",
      Blockly.Arduino.ORDER_ATOMIC
    ) || "0";
  var hour =
    Blockly.Arduino.valueToCode(this, "hour", Blockly.Arduino.ORDER_ATOMIC) ||
    "0";
  var day =
    Blockly.Arduino.valueToCode(this, "day", Blockly.Arduino.ORDER_ATOMIC) ||
    "0";
  var month =
    Blockly.Arduino.valueToCode(this, "month", Blockly.Arduino.ORDER_ATOMIC) ||
    "0";
  var year =
    Blockly.Arduino.valueToCode(this, "year", Blockly.Arduino.ORDER_ATOMIC) ||
    "0";
  Blockly.Arduino.libraries_["RV8523"] = `#include <RV8523.h>`;
  Blockly.Arduino.setupCode_["rtc.start"] = `rtc.start();`;
  Blockly.Arduino.setupCode_[
    "rtc.batterySwitchOver"
  ] = `rtc.batterySwitchOver(1);`;
  Blockly.Arduino.setupCode_[
    "rtc.set"
  ] = `rtc.set(${second}, ${minutes}, ${hour}, ${day}, ${month}, ${year});`;
  var code = ``;
  return code;
};

Blockly.Arduino.sensebox_rtc_ntp = function () {
  Blockly.Arduino.libraries_["RV8523"] = `#include <RV8523.h>`;
  Blockly.Arduino.setupCode_["rtc.start"] = `rtc.start();`;
  Blockly.Arduino.setupCode_[
    "rtc.batterySwitchOver"
  ] = `rtc.batterySwitchOver(1);`;
  Blockly.Arduino.setupCode_[
    "rtc.set"
  ] = `rtc.set(SECOND, MINUTE, HOUR, DAY, MONTH, YEAR);`;
  var code = ``;
  return code;
};

Blockly.Arduino.sensebox_rtc_get = function () {
  var dropdown = this.getFieldValue("dropdown");
  Blockly.Arduino.libraries_["RV8523"] = `#include <RV8523.h>`;
  Blockly.Arduino.setupCode_["rtc.start"] = `rtc.start();`;
  Blockly.Arduino.setupCode_[
    "rtc.batterySwitchOver"
  ] = `rtc.batterySwitchOver(1);`;
  Blockly.Arduino.loopCodeOnce_[
    "rtc_variables"
  ] = `uint8_t sec, min, hour, day, month;\nuint16_t year;`;

  Blockly.Arduino.loopCodeOnce_[
    "rtc_get"
  ] = `rtc.get(&sec, &min, &hour, &day, &month, &year);`;

  var code = `${dropdown}`;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.sensebox_rtc_get_timestamp = function () {
  Blockly.Arduino.libraries_["RV8523"] = `#include <RV8523.h>`;
  Blockly.Arduino.setupCode_["rtc.start"] = `rtc.start();`;
  Blockly.Arduino.setupCode_[
    "rtc.batterySwitchOver"
  ] = `rtc.batterySwitchOver(1);`;
  Blockly.Arduino.variables_["rtc_timestamp"] = `char timestamp[20];`;
  Blockly.Arduino.codeFunctions_["getTimeStamp"] = `
char* getTimeStamp() {
uint8_t sec, min, hour, day, month;
 uint16_t year;
 rtc.get(&sec, &min, &hour, &day, &month, &year);
 sprintf(timestamp, "%02d-%02d-%02dT%02d:%02d:%02dZ", year, month, day, hour, min, sec);
 return timestamp;
 }
  `;
  var code = `getTimeStamp()`;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
