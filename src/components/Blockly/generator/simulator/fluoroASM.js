import * as Blockly from "blockly";

Blockly.Generator.Simulator.forBlock["sensebox_fluoroASM_init"] = function () {
    Blockly.Generator.Simulator.modules_["sensebox_fluoroASM_init"] = "sensebox_fluoroASM_init";
  
    var code = "initFluoroASM();\n";
    return code;
  };


Blockly.Generator.Simulator.forBlock["sensebox_fluoroASM_setLED"] = function () {
    Blockly.Generator.Simulator.modules_["sensebox_fluoroASM_setLED"] = "sensebox_fluoroASM_setLED";
  
    var code = `initFluoroASM()`;
    return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
  };
  