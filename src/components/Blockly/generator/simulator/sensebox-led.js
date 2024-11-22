import * as Blockly from "blockly/core";

Blockly.Simulator.sensebox_ws2818_led = function () {
  var color =
    Blockly.Simulator.valueToCode(this, "COLOR", Blockly.Simulator.ORDER_ATOMIC) ||
    "0";
  var code = `neopixel(${color});`;
  return code;
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

Blockly.Simulator["colour_picker"] = function (block) {
  const rgb = hexToRgb(block.getFieldValue("COLOUR"));

  return [rgb.r + ", " + rgb.g + ", " + rgb.b, Blockly.Simulator.ORDER_ATOMIC];
};

Blockly.Simulator["colour_random"] = function (block) {
  return [
    "random(0, 255), random(0, 255), random(0, 255)",
    Blockly.Simulator.ORDER_ATOMIC,
  ];
};

Blockly.Simulator["colour_rgb"] = function (block) {
  const red = Blockly.Simulator.valueToCode(
    block,
    "RED",
    Blockly.Simulator.ORDER_ATOMIC,
  );
  const green = Blockly.Simulator.valueToCode(
    block,
    "GREEN",
    Blockly.Simulator.ORDER_ATOMIC,
  );
  const blue = Blockly.Simulator.valueToCode(
    block,
    "BLUE",
    Blockly.Simulator.ORDER_ATOMIC,
  );

  return [red + ", " + green + ", " + blue, Blockly.Simulator.ORDER_ATOMIC];
};
