import * as Blockly from "blockly/core";

Blockly.Generator.Arduino.forBlock["watchdog_enable"] = function () {
  var time = this.getFieldValue("TIME");

  Blockly.Generator.Arduino.libraries_["Adafruit_sleepydog"] =
    "#include <Adafruit_SleepyDog.h> // http://librarymanager/All#Adafruit_SleepyDog_Library";
  Blockly.Generator.Arduino.setupCode_["watchdog_enable"] =
    `Watchdog.enable(${time});`;
  var code = "";
  return code;
};

Blockly.Generator.Arduino.forBlock["watchdog_reset"] = function () {
  var code = "Watchdog.reset();";
  return code;
};
