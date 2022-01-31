import * as Blockly from "blockly/core";

Blockly.Arduino.watchdog_enable = function () {
  var time = this.getFieldValue("TIME");

  Blockly.Arduino.libraries_["Adafruit_sleepydog"] =
    "#include <Adafruit_SleepyDog.h>";
  Blockly.Arduino.setupCode_["watchdog_enable"] = `Watchdog.enable(${time});`;
  var code = "";
  return code;
};

Blockly.Arduino.watchdog_reset = function () {
  var code = "Watchdog.reset();";
  return code;
};
