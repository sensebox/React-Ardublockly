// path: src/components/Blockly/generator/simulator/fluoro-asm.js
import * as Blockly from "blockly/core";

/**
 * LED Control - Simulator Code Generator
 */

// LED Initialisierung
Blockly.Generator.Simulator.forBlock["sensebox_fluoroASM_led_init"] = function (
  block,
) {
  Blockly.Generator.Simulator.modules_["senseBox_fluoroASM"] =
    "senseBox_fluoroASM";
  return `initLEDs();\n`;
};

// LED Ein/Aus-Steuerung
Blockly.Generator.Simulator.forBlock["sensebox_fluoroASM_led_set"] = function (
  block,
) {
  Blockly.Generator.Simulator.modules_["senseBox_fluoroASM"] =
    "senseBox_fluoroASM";

  var led = block.getFieldValue("LED");
  var state = block.getFieldValue("STATE");
  return `setLEDState("${led}", ${state});\n`;
};

// LED-Sequenz
Blockly.Generator.Simulator.forBlock["sensebox_fluoroASM_led_sequence"] =
  function (block) {
    Blockly.Generator.Simulator.modules_["senseBox_fluoroASM"] =
      "senseBox_fluoroASM";

    var delay =
      Blockly.Generator.Simulator.valueToCode(
        block,
        "DELAY",
        Blockly.Generator.Simulator.ORDER_ATOMIC,
      ) || "500";
    return `playLEDSequence(${delay});\n`;
  };

// LED-Fading
Blockly.Generator.Simulator.forBlock["sensebox_fluoroASM_led_fade"] = function (
  block,
) {
  Blockly.Generator.Simulator.modules_["senseBox_fluoroASM"] =
    "senseBox_fluoroASM";

  var maxBrightness =
    Blockly.Generator.Simulator.valueToCode(
      block,
      "MAX_BRIGHTNESS",
      Blockly.Generator.Simulator.ORDER_ATOMIC,
    ) || "100";
  return `fadeLEDs(${maxBrightness});\n`;
};

/**
 * FluoroASM Sensor - Simulator Code Generator
 */

// FluoroASM Sensor Initialisierung
Blockly.Generator.Simulator.forBlock["sensebox_fluoroASM_init"] = function (
  block,
) {
  Blockly.Generator.Simulator.modules_["senseBox_fluoroASM"] =
    "senseBox_fluoroASM";
  return `initFluoroASM();\n`;
};

// Quanten-Sensorwert lesen
Blockly.Generator.Simulator.forBlock["sensebox_fluoroASM_read"] = function (
  block,
) {
  Blockly.Generator.Simulator.modules_["senseBox_fluoroASM"] =
    "senseBox_fluoroASM";
  var mode = block.getFieldValue("mode");
  return [
    `readQuantumValue("${mode}")`,
    Blockly.Generator.Simulator.ORDER_ATOMIC,
  ];
};

// Quantenrauschen simulieren
Blockly.Generator.Simulator.forBlock["sensebox_fluoroASM_noise"] = function (
  block,
) {
  Blockly.Generator.Simulator.modules_["senseBox_fluoroASM"] =
    "senseBox_fluoroASM";
  var sensitivity = block.getFieldValue("sensitivity");
  return [
    `simulateQuantumNoise(${sensitivity})`,
    Blockly.Generator.Simulator.ORDER_ATOMIC,
  ];
};

// FluoroASM über I2C auslesen
Blockly.Generator.Simulator.forBlock["sensebox_fluoroASM_i2c"] = function (
  block,
) {
  Blockly.Generator.Simulator.modules_["senseBox_fluoroASM"] =
    "senseBox_fluoroASM";
  return [`readFluoroASM_I2C()`, Blockly.Generator.Simulator.ORDER_ATOMIC];
};
