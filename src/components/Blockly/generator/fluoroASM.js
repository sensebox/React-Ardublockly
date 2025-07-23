import * as Blockly from "blockly/core";

Blockly.Generator.Arduino.forBlock["sensebox_fluoroASM_init"] = function () {
  Blockly.Generator.Arduino.setupCode_["sensebox_fluoroASM_init"] =
    `pinMode(18, OUTPUT);
    pinMode(17, OUTPUT);
    pinMode(37, OUTPUT);
    pinMode(38, OUTPUT);
    digitalWrite(blau, LOW);
    digitalWrite(gruen, LOW);
    digitalWrite(gelb, LOW);
    digitalWrite(rot, LOW);
    `;
  let code = "";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_fluoroASM_setLED"] = function (
  block,
) {
  const ledNumber = block.getFieldValue("LED_NUMBER");

  const code = `fluoroASM_setLED(${ledNumber});\n`;
  return code;
};
Blockly.Generator.Arduino.forBlock["sensebox_fluoroASM_setLED2"] = function (
  block,
) {
  const ledNumber = block.getFieldValue("LED_NUMBER");
  const status = block.getFieldValue("STAT");
  var brightness =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "BRIGHTNESS",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "50";
  let pin;
  switch (ledNumber) {
    case "1":
      pin = 18;
      break;
    case "2":
      pin = 17;
      break;
    case "3":
      pin = 37;
      break;
    case "4":
      pin = 38;
      break;
    default:
      pin = 18;
  }
  const code = `analogWrite(${pin}, ${brightness});\n`;
  return code;
};
