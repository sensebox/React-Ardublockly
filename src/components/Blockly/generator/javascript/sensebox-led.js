import * as Blockly from "blockly/core";

Blockly.Generator.Simulator.forBlock["sensebox_ws2818_led"] = function () {
  var color =
    Blockly.Generator.Simulator.valueToCode(
      this,
      "COLOR",
      Blockly.Generator.Simulator.ORDER_ATOMIC,
    ) || "0";
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

Blockly.Generator.Simulator.forBlock["colour_picker"] = function (
  block,
  generator,
) {
  const rgb = hexToRgb(block.getFieldValue("COLOUR"));

  return [
    rgb.r + ", " + rgb.g + ", " + rgb.b,
    Blockly.Generator.Simulator.ORDER_ATOMIC,
  ];
};

Blockly.Generator.Simulator.forBlock["colour_random"] = function (
  block,
  generator,
) {
  return [
    "random(0, 255), random(0, 255), random(0, 255)",
    Blockly.Generator.Simulator.ORDER_ATOMIC,
  ];
};

Blockly.Generator.Simulator.forBlock["colour_rgb"] = function (
  block,
  generator,
) {
  const red = Blockly.Generator.Simulator.valueToCode(
    block,
    "RED",
    Blockly.Generator.Simulator.ORDER_ATOMIC,
  );
  const green = Blockly.Generator.Simulator.valueToCode(
    block,
    "GREEN",
    Blockly.Generator.Simulator.ORDER_ATOMIC,
  );
  const blue = Blockly.Generator.Simulator.valueToCode(
    block,
    "BLUE",
    Blockly.Generator.Simulator.ORDER_ATOMIC,
  );

  return [
    red + ", " + green + ", " + blue,
    Blockly.Generator.Simulator.ORDER_ATOMIC,
  ];
};
