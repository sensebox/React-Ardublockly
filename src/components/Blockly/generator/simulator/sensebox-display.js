import * as Blockly from "blockly/core";

Blockly.Simulator.sensebox_display_clearDisplay = function () {
  var code = "clearDisplay();\n";
  return code;
};

Blockly.Simulator.sensebox_display_printDisplay = function () {
  var x = this.getFieldValue("X");
  var y = this.getFieldValue("Y");
  var printDisplay =
    Blockly.Simulator.valueToCode(
      this,
      "printDisplay",
      Blockly.Simulator.ORDER_ATOMIC,
    ) || '"Keine Eingabe"';
  var size = this.getFieldValue("SIZE");
  var color = this.getFieldValue("COLOR");
  var code = `drawText(${printDisplay}, ${x}, ${y}, ${size});\n`;
  return code;
};
