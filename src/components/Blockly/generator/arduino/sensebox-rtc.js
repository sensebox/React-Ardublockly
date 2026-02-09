import * as Blockly from "blockly";

Blockly.Generator.Arduino.forBlock["sensebox_rtc_init"] = function () {
  Blockly.Generator.Arduino.libraries_["RV8523"] = `#include <RV8523.h>`;
  Blockly.Generator.Arduino.definitions_["RTC"] = `RV8523 rtc;`;
  Blockly.Generator.Arduino.setupCode_["rtc.begin"] = `rtc.begin();`;
  var code = ``;
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_rtc_set"] = function () {
  var second =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "second",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  var minutes =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "minutes",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  var hour =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "hour",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  var day =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "day",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  var month =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "month",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  var year =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "year",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  Blockly.Generator.Arduino.libraries_["RV8523"] = `#include <RV8523.h>`;
  Blockly.Generator.Arduino.setupCode_["rtc.start"] = `rtc.start();`;
  Blockly.Generator.Arduino.setupCode_["rtc.batterySwitchOver"] =
    `rtc.batterySwitchOver(1);`;
  Blockly.Generator.Arduino.setupCode_["rtc.set"] =
    `rtc.set(${second}, ${minutes}, ${hour}, ${day}, ${month}, ${year});`;
  var code = ``;
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_rtc_ntp"] = function () {
  Blockly.Generator.Arduino.libraries_["RV8523"] = `#include <RV8523.h>`;
  Blockly.Generator.Arduino.setupCode_["rtc.start"] = `rtc.start();`;
  Blockly.Generator.Arduino.setupCode_["rtc.batterySwitchOver"] =
    `rtc.batterySwitchOver(1);`;
  Blockly.Generator.Arduino.setupCode_["rtc.set"] =
    `rtc.set(SECOND, MINUTE, HOUR, DAY, MONTH, YEAR);`;
  var code = ``;
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_rtc_get"] = function () {
  var dropdown = this.getFieldValue("dropdown");
  Blockly.Generator.Arduino.libraries_["RV8523"] = `#include <RV8523.h>`;
  Blockly.Generator.Arduino.setupCode_["rtc.start"] = `rtc.start();`;
  Blockly.Generator.Arduino.setupCode_["rtc.batterySwitchOver"] =
    `rtc.batterySwitchOver(1);`;
  Blockly.Generator.Arduino.loopCodeOnce_["rtc_variables"] =
    `uint8_t sec, min, hour, day, month;\nuint16_t year;`;

  Blockly.Generator.Arduino.loopCodeOnce_["rtc_get"] =
    `rtc.get(&sec, &min, &hour, &day, &month, &year);`;

  var code = `${dropdown}`;
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_rtc_get_timestamp"] = function () {
  Blockly.Generator.Arduino.libraries_["RV8523"] = `#include <RV8523.h>`;
  Blockly.Generator.Arduino.setupCode_["rtc.start"] = `rtc.start();`;
  Blockly.Generator.Arduino.setupCode_["rtc.batterySwitchOver"] =
    `rtc.batterySwitchOver(1);`;
  Blockly.Generator.Arduino.variables_["rtc_timestamp"] = `char timestamp[20];`;
  Blockly.Generator.Arduino.codeFunctions_["getTimeStamp"] = `
char* getTimeStamp() {
uint8_t sec, min, hour, day, month;
 uint16_t year;
 rtc.get(&sec, &min, &hour, &day, &month, &year);
 sprintf(timestamp, "%02d-%02d-%02dT%02d:%02d:%02dZ", year, month, day, hour, min, sec);
 return timestamp;
 }
  `;
  var code = `getTimeStamp()`;
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_internal_rtc_init"] = function () {
  Blockly.Generator.Arduino.libraries_["RTClib"] = `#include <RTCZero.h>`;
  Blockly.Generator.Arduino.definitions_["RTC"] = `RTCZero rtc;`;
  Blockly.Generator.Arduino.setupCode_["rtc.begin"] = `rtc.begin();`;
  return "";
};

Blockly.Generator.Arduino.forBlock["sensebox_internal_rtc_set"] = function () {
  var branch =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "time",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  Blockly.Generator.Arduino.setupCode_["rtc.setEpoch"] =
    `rtc.setEpoch(${branch});`;
  var code = ``;
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_internal_rtc_get"] = function () {
  var dropdown = this.getFieldValue("dropdown");
  var code = `rtc.get${dropdown}()`;
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_internal_rtc_get_timestamp"] =
  function () {
    Blockly.Generator.Arduino.variables_["rtc_timestamp"] =
      `char timestamp[20];`;
    Blockly.Generator.Arduino.codeFunctions_["getTimeStamp"] = `
char* getTimeStamp() {
uint8_t sec, min, hour, day, month;
 uint16_t year;
sec = rtc.getSeconds();
min = rtc.getMinutes();
hour = rtc.getHours();
day = rtc.getDay();
month = rtc.getMonth();
year = rtc.getYear();
 sprintf(timestamp, "%02d-%02d-%02dT%02d:%02d:%02dZ", year, month, day, hour, min, sec);
 return timestamp;
 }
  `;
    var code = `getTimeStamp()`;
    return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
  };
