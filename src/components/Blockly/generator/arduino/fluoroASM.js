import * as Blockly from "blockly/core";

Blockly.Generator.Arduino.forBlock["sensebox_fluoroASM_init"] = function () {
        Blockly.Generator.Arduino.setupCode_["sensebox_fluoroASM_init"] = "fluoroASM_init();";
        let code = "";
        return code;

}

Blockly.Generator.Arduino.forBlock["sensebox_fluoroASM_setLED"] = function (block) {
    const ledColor = block.getFieldValue("LED_COLOR");
    
    const code = `fluoroASM_setLED(${ledColor});\n`;
    return code;
    }