// path: src/components/Blockly/generator/simulator/sensebox-sps30.js
import * as Blockly from "blockly/core";

// SPS30 Sensor Initialisierung
Blockly.Generator.Simulator.forBlock["sensebox_sps30_init"] = function (block) {
  Blockly.Generator.Simulator.modules_["senseBox_sps30"] = "senseBox_sps30";
  return `initSPS30();\n`;
};

// SPS30 Auto-Clean Interval
Blockly.Generator.Simulator.forBlock["sensebox_sps30_clean_interval"] =
  function (block) {
    Blockly.Generator.Simulator.modules_["senseBox_sps30"] = "senseBox_sps30";
    var days =
      Blockly.Generator.Simulator.valueToCode(
        block,
        "DAYS",
        Blockly.Generator.Simulator.ORDER_ATOMIC,
      ) || "4";
    return `setSPS30CleanInterval(${days});\n`;
  };

// SPS30 Messintervall
Blockly.Generator.Simulator.forBlock["sensebox_sps30_measure_interval"] =
  function (block) {
    Blockly.Generator.Simulator.modules_["senseBox_sps30"] = "senseBox_sps30";
    var interval =
      Blockly.Generator.Simulator.valueToCode(
        block,
        "INTERVAL",
        Blockly.Generator.Simulator.ORDER_ATOMIC,
      ) || "1";
    return `setSPS30MeasureInterval(${interval});\n`;
  };

// SPS30 Feinstaubwert lesen
Blockly.Generator.Simulator.forBlock["sensebox_sps30_read"] = function (block) {
  Blockly.Generator.Simulator.modules_["senseBox_sps30"] = "senseBox_sps30";
  var valueType = block.getFieldValue("value");
  return [
    `readSPS30Value("${valueType}")`,
    Blockly.Generator.Simulator.ORDER_ATOMIC,
  ];
};

// SPS30 manuelle Reinigung
Blockly.Generator.Simulator.forBlock["sensebox_sps30_clean"] = function (
  block,
) {
  Blockly.Generator.Simulator.modules_["senseBox_sps30"] = "senseBox_sps30";
  return `startSPS30Cleaning();\n`;
};
