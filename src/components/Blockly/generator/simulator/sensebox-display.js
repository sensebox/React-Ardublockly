import * as Blockly from "blockly/core";

/**
 * OLED display. Like on the device, drawing happens in a buffer and
 * "sensebox_display_show" puts it on the screen (showDisplay()).
 */

function useDisplay() {
  Blockly.Generator.Simulator.modules_["senseBox_display"] = "senseBox_display";
}

Blockly.Generator.Simulator.forBlock["sensebox_display_beginDisplay"] =
  function () {
    useDisplay();
    Blockly.Generator.Simulator.setupCode_["sensebox_display_begin"] =
      "clearDisplay();\nshowDisplay();";
    return "";
  };

Blockly.Generator.Simulator.forBlock["sensebox_display_show"] = function (
  block,
) {
  useDisplay();
  const show = Blockly.Generator.Simulator.statementToCode(block, "SHOW");
  return show + "showDisplay();\n";
};

Blockly.Generator.Simulator.forBlock["sensebox_display_clearDisplay"] =
  function () {
    useDisplay();
    return "clearDisplay();\n";
  };

Blockly.Generator.Simulator.forBlock["sensebox_display_printDisplay"] =
  function () {
    useDisplay();
    var x = this.getFieldValue("X");
    var y = this.getFieldValue("Y");

    var printDisplay =
      Blockly.Generator.Simulator.valueToCode(
        this,
        "printDisplay",
        Blockly.Generator.Simulator.ORDER_ATOMIC,
      ) || '"Keine Eingabe"';
    var size = this.getFieldValue("SIZE");
    var color = this.getFieldValue("COLOR");
    var code = `drawText(${printDisplay}, ${x}, ${y}, ${size}, "${color.split(",")[0]}");\n`;
    return code;
  };
