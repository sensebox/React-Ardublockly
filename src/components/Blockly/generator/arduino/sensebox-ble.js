import * as Blockly from "blockly/core";
import {
  SENSEBOX_BIKE_PHENOMENA,
  SENSEBOX_BIKE_SERVICE_UUID,
  getSenseboxBikeCharacteristicVar,
  getSenseboxBikePhenomenon,
} from "@/components/Blockly/helpers/senseboxBikeBle";

Blockly.Generator.Arduino.forBlock["sensebox_phyphox_init"] = function () {
  var name = this.getFieldValue("devicename");
  Blockly.Generator.Arduino.libraries_["phyphox_library"] =
    `#include <phyphoxBle.h>`;
  Blockly.Generator.Arduino.phyphoxSetupCode_["phyphox_start"] =
    `PhyphoxBLE::start("${name}");`;
  var code = ``;
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_phyphox_experiment"] =
  function () {
    var experimentname = "experiment";
    var title = this.getFieldValue("title").replace(/[^a-zA-Z0-9]/g, "");
    var description = this.getFieldValue("description");
    var branch = Blockly.Generator.Arduino.statementToCode(this, "view");
    Blockly.Generator.Arduino.phyphoxSetupCode_[
      `PhyphoxBleExperiment_${experimentname}`
    ] = `PhyphoxBleExperiment ${experimentname};`;
    Blockly.Generator.Arduino.phyphoxSetupCode_[`setTitle_${title}`] =
      `${experimentname}.setTitle("${title}");`;
    Blockly.Generator.Arduino.phyphoxSetupCode_[
      `setCategory_senseBoxExperiments}`
    ] = `${experimentname}.setCategory("senseBox Experimente");`;
    Blockly.Generator.Arduino.phyphoxSetupCode_[
      `setDescription_${description}`
    ] = `${experimentname}.setDescription("${description}");`;
    Blockly.Generator.Arduino.phyphoxSetupCode_[`addView_${experimentname}`] =
      `PhyphoxBleExperiment::View firstView;\nfirstView.setLabel("Messwerte"); //Create a "view"`;
    Blockly.Generator.Arduino.phyphoxSetupCode_[`addGraph`] = `${branch}`;
    Blockly.Generator.Arduino.phyphoxSetupCode_[`addView_firstview`] =
      `${experimentname}.addView(firstView);`; //Attach view to experiment
    Blockly.Generator.Arduino.phyphoxSetupCode_[
      `addExperiment_${experimentname}`
    ] = `PhyphoxBLE::addExperiment(${experimentname});`; //Attach experiment to server

    var code = ``;
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_phyphox_timestamp"] = function (
  block,
  generator,
) {
  var code = 0;
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_phyphox_channel"] = function (
  block,
  generator,
) {
  var channel = parseFloat(this.getFieldValue("channel"));
  var code = channel;
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_phyphox_sendchannel"] = function (
  block,
  generator,
) {
  var channel = this.getFieldValue("channel");
  var value =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "value",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "1";

  var code = `float channel${channel} = ${value};\n`;
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_phyphox_graph"] = function () {
  var label = this.getFieldValue("label").replace(/[^a-zA-Z0-9]/g, "");
  var unitx = this.getFieldValue("unitx");
  var unity = this.getFieldValue("unity");
  var labelx = this.getFieldValue("labelx");
  var labely = this.getFieldValue("labely");
  var style = this.getFieldValue("style");
  var channelX =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "channel0",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || 0;
  var channelY =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "channel1",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || 1;

  var code = `PhyphoxBleExperiment::Graph ${label};\n`; //Create graph which will plot random numbers over time
  code += `${label}.setLabel("${label}");\n`;
  code += `${label}.setUnitX("${unitx}");\n`;
  code += `${label}.setUnitY("${unity}");\n`;
  code += `${label}.setLabelX("${labelx}");\n`;
  code += `${label}.setLabelY("${labely}");\n`;
  if (style === "dots") {
    code += `${label}.setStyle("${style}");\n`;
  }
  code += `${label}.setChannel(${channelX}, ${channelY});\n`;
  code += `firstView.addElement(${label});\n`;
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_phyphox_experiment_send"] =
  function () {
    var branch = Blockly.Generator.Arduino.statementToCode(this, "sendValues");
    var blocks = this.getDescendants();
    var count = 0;
    if (blocks !== undefined) {
      for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].type === "sensebox_phyphox_sendchannel") {
          count++;
        }
      }
    }
    if (count === 5) {
    }
    var string = "";

    for (var j = 1; j <= count; j++) {
      if (string === "") {
        string += `channel${j}`;
      } else if (string !== "") {
        string += `, channel${j}`;
      }
    }
    Blockly.Generator.Arduino.loopCodeOnce_["phyphox_poll"] =
      `PhyphoxBLE::poll();`;
    var code = `${branch}\nPhyphoxBLE::write(${string});`;
    return code;
  };

/**
 * senseBox BLE
 *
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_ble_init"] = function () {
  var code = "";
  return code;
};

/**
 * senseBox:bike BLE
 *
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_bike_ble_init"] = function () {
  const deviceName = (this.getFieldValue("devicename") || "senseBox:bike")
    .replace(/\\/g, "")
    .replace(/"/g, "");

  // Register one characteristic per phenomenon that is sent somewhere in the
  // workspace. Characteristics must be added right after the service.
  const usedPhenomena = [];
  this.workspace
    .getBlocksByType("sensebox_bike_ble_send", false)
    .filter((block) => block.isEnabled())
    .forEach((block) => {
      const key = block.getFieldValue("phenomenon");
      if (SENSEBOX_BIKE_PHENOMENA[key] && !usedPhenomena.includes(key)) {
        usedPhenomena.push(key);
      }
    });

  Blockly.Generator.Arduino.libraries_["library_senseBoxBLE"] =
    "#include <SenseBoxBLE.h>";

  let setup = `SenseBoxBLE::start("senseBox-BLE");\n`;
  setup += `SenseBoxBLE::setName(String("${deviceName} [") + SenseBoxBLE::getMCUId() + "]");\n`;
  setup += `SenseBoxBLE::addService("${SENSEBOX_BIKE_SERVICE_UUID}");`;
  usedPhenomena.forEach((key) => {
    const characteristicVar = getSenseboxBikeCharacteristicVar(key);
    Blockly.Generator.Arduino.variables_[characteristicVar] =
      `int ${characteristicVar} = 0;`;
    setup += `\n${characteristicVar} = SenseBoxBLE::addCharacteristic("${SENSEBOX_BIKE_PHENOMENA[key].uuid}");`;
  });
  Blockly.Generator.Arduino.setupCode_["sensebox_bike_ble_init"] = setup;
  Blockly.Generator.Arduino.loopCodeOnce_["sensebox_bike_ble_poll"] =
    "SenseBoxBLE::poll();";
  return "";
};

Blockly.Generator.Arduino.forBlock["sensebox_bike_ble_send"] = function () {
  const key = this.getFieldValue("phenomenon");
  const phenomenon = getSenseboxBikePhenomenon(key);
  const characteristicVar = getSenseboxBikeCharacteristicVar(key);

  Blockly.Generator.Arduino.libraries_["library_senseBoxBLE"] =
    "#include <SenseBoxBLE.h>";
  Blockly.Generator.Arduino.variables_[characteristicVar] =
    `int ${characteristicVar} = 0;`;

  // SenseBoxBLE::write() takes float references, so store the values first.
  const valueNames = [];
  let code = "{\n";
  phenomenon.values.forEach((_, i) => {
    const value =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "VALUE" + i,
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "0";
    const valueName = `bikeValue${i}`;
    valueNames.push(valueName);
    code += `  float ${valueName} = ${value};\n`;
  });
  code += `  SenseBoxBLE::write(${characteristicVar}, ${valueNames.join(", ")});\n`;
  code += "}\n";
  return code;
};
