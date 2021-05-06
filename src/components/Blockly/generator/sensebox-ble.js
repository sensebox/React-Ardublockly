import * as Blockly from "blockly/core";

Blockly.Arduino.sensebox_phyphox_init = function () {
  var name = this.getFieldValue("devicename");
  Blockly.Arduino.libraries_["phyphox_library"] = `#include <phyphoxBle.h>`;
  Blockly.Arduino.libraries_["library_senseBoxMCU"] =
    '#include "SenseBoxMCU.h"';
  Blockly.Arduino.setupCode_["phyphox_start"] = `PhyphoxBLE::start("${name}");`;
  var code = ``;
  return code;
};

Blockly.Arduino.sensebox_phyphox_experiment = function () {
  var experimentname = this.getFieldValue("exeperimentname");
  var title = this.getFieldValue("title");
  var category = this.getFieldValue("category");
  var description = this.getFieldValue("description");
  Blockly.Arduino.setupCode_[
    `PhyphoxBleExperiment_${experimentname}`
  ] = `PhyphoxBleExperiment ${experimentname};`;
  Blockly.Arduino.setupCode_[
    `setTitle_${title}`
  ] = `${experimentname}.setTitle("${title}")`;
  Blockly.Arduino.setupCode_[
    `setCategory_${category}`
  ] = `${experimentname}.setCategory("${category}")`;
  Blockly.Arduino.setupCode_[
    `setDescription_${description}`
  ] = `${experimentname}.setDescription("${description}")`;
  var code = ``;
  return code;
};

Blockly.Arduino.sensebox_phyphox_experiment_send = function () {
  var data = "";
  Blockly.Arduino.loopCodeOnce_["phyphox_poll"] = `PhyphoxBLE::poll()`;
  var code = `PhyphoxBLE::write()`;
  return code;
};
