import * as Blockly from "blockly/core";

Blockly.Generator.Arduino.forBlock["sensebox_led"] = function () {
  var dropdown_pin = this.getFieldValue("PIN");
  var dropdown_stat = this.getFieldValue("STAT");
  Blockly.Generator.Arduino.setupCode_["setup_led_" + dropdown_pin] =
    "pinMode(" + dropdown_pin + ", OUTPUT);";
  var code = "digitalWrite(" + dropdown_pin + "," + dropdown_stat + ");\n";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_rgb_led"] = function () {
  var dropdown_pin = this.getFieldValue("PIN");
  var color =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "COLOR",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  Blockly.Generator.Arduino.libraries_["library_neopixel"] =
    "#include <Adafruit_NeoPixel.h>";
  Blockly.Generator.Arduino.definitions_["define_rgb_led" + dropdown_pin] =
    "Adafruit_NeoPixel rgb_led_" +
    dropdown_pin +
    " = Adafruit_NeoPixel(1," +
    dropdown_pin +
    ",NEO_RGB + NEO_KHZ800);\n";
  Blockly.Generator.Arduino.setupCode_["setup_rgb_led" + dropdown_pin] =
    "rgb_led_" + dropdown_pin + ".begin();";
  var code =
    "rgb_led_" +
    dropdown_pin +
    ".setPixelColor(0,rgb_led_" +
    dropdown_pin +
    ".Color(" +
    color +
    "));\n";
  code += "rgb_led_" + dropdown_pin + ".show();";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_ws2818_led_init"] = function () {
  let dropdown_pin = 1;
  dropdown_pin = this.getFieldValue("Port");
  var numPixel =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "NUMBER",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "1";
  var brightness =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "BRIGHTNESS",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "50";
  Blockly.Generator.Arduino.libraries_["library_neopixel"] =
    "#include <Adafruit_NeoPixel.h>";
  Blockly.Generator.Arduino.definitions_["define_rgb_led" + dropdown_pin] =
    `Adafruit_NeoPixel rgb_led_${dropdown_pin}= Adafruit_NeoPixel(${numPixel}, ${dropdown_pin},NEO_GRB + NEO_KHZ800);\n`;
  Blockly.Generator.Arduino.setupCode_["setup_rgb_led" + dropdown_pin] =
    "rgb_led_" + dropdown_pin + ".begin();\n";
  Blockly.Generator.Arduino.setupCode_[
    "setup_rgb_led_brightness" + dropdown_pin
  ] = `rgb_led_${dropdown_pin}.setBrightness(${brightness});\n`;
  return "";
};

Blockly.Generator.Arduino.forBlock["sensebox_ws2818_led"] = function () {
  let dropdown_pin = 1;
  dropdown_pin = this.getFieldValue("Port");
  var position =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "POSITION",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  var color =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "COLOR",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  var code = `rgb_led_${dropdown_pin}.setPixelColor(${position},rgb_led_${dropdown_pin}.Color(${color}));\nrgb_led_${dropdown_pin}.show();\n`;
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

Blockly.Generator.Arduino.forBlock["colour_picker"] = function (
  block,
  generator,
) {
  const rgb = hexToRgb(block.getFieldValue("COLOUR"));

  return [
    rgb.r + ", " + rgb.g + ", " + rgb.b,
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  ];
};

Blockly.Generator.Arduino.forBlock["colour_random"] = function (
  block,
  generator,
) {
  return [
    "random(0, 255), random(0, 255), random(0, 255)",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  ];
};

Blockly.Generator.Arduino.forBlock["colour_rgb"] = function (block, generator) {
  const red = Blockly.Generator.Arduino.valueToCode(
    block,
    "RED",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  );
  const green = Blockly.Generator.Arduino.valueToCode(
    block,
    "GREEN",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  );
  const blue = Blockly.Generator.Arduino.valueToCode(
    block,
    "BLUE",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  );

  return [
    red + ", " + green + ", " + blue,
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  ];
};

/**
 * LED-Matrix Blocks
 *
 *
 */

Blockly.Generator.Arduino.forBlock["sensebox_ws2812_matrix_init"] = function (
  block,
  generator,
) {
  var dropdown_pin = this.getFieldValue("Port");
  var brightness = this.getFieldValue("BRIGHTNESS");
  Blockly.Generator.Arduino.libraries_["libraries_neopixel"] =
    `#include <Adafruit_NeoPixel.h>`;
  Blockly.Generator.Arduino.libraries_["libraries_rgb_matrix"] =
    "#include <Adafruit_NeoMatrix.h>";
  Blockly.Generator.Arduino.libraries_["library_AdafruitGFX"] =
    "#include <Adafruit_GFX.h> // http://librarymanager/All#Adafruit_GFX_Library";
  Blockly.Generator.Arduino.definitions_["definition_rgb_matrix_widht"] =
    "#define WIDTH 12";
  Blockly.Generator.Arduino.definitions_["definition_rgb_matrix_height"] =
    "#define HEIGHT 8";
  Blockly.Generator.Arduino.definitions_[
    "definition_rgb_matrix" + dropdown_pin
  ] =
    `Adafruit_NeoMatrix matrix_${dropdown_pin} = Adafruit_NeoMatrix(WIDTH, HEIGHT, ${dropdown_pin}, NEO_MATRIX_TOP + NEO_MATRIX_LEFT + NEO_MATRIX_ROWS + NEO_MATRIX_ZIGZAG, NEO_GRB + NEO_KHZ800);`;
  Blockly.Generator.Arduino.setupCode_[
    "setup_matrix_brightness" + dropdown_pin
  ] = `matrix_${dropdown_pin}.setBrightness(${brightness});\n`;
  Blockly.Generator.Arduino.setupCode_[
    "setup_matrix_text_wrap" + dropdown_pin
  ] = "matrix_" + dropdown_pin + ".setTextWrap(false);\n";
  Blockly.Generator.Arduino.setupCode_["matrix" + dropdown_pin] =
    "matrix_" + dropdown_pin + ".begin();\n";

  // Blockly.Generator.Arduino.setupCode_['setup_matrix_color' + dropdown_pin] = `matrix_${dropdown_pin}.setColor(matrix.Color(255, 0, 0));\n`;
  return "";
};

Blockly.Generator.Arduino.forBlock["sensebox_ws2812_matrix_clear"] = function (
  block,
  generator,
) {
  var dropdown_pin = this.getFieldValue("Port");
  var code = "";
  code += `matrix_${dropdown_pin}.fillScreen(0);\n`;
  code += `matrix_${dropdown_pin}.show();\n`;
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_ws2812_matrix_text"] = function (
  block,
  generator,
) {
  var code = "";
  var dropdown_pin = this.getFieldValue("Port");
  var value =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "input",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || '"Keine Eingabe"';
  var autoscroll = this.getFieldValue("AUTOSCROLL");
  var color = Blockly.Generator.Arduino.valueToCode(
    this,
    "COLOR",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  );
  code += `matrix_${dropdown_pin}.setTextColor(matrix_${dropdown_pin}.Color(${color}));\n`;
  if (autoscroll === "TRUE") {
    code += "String txt = String(" + value + ");\n";
    code += "int length = txt.length();\n";
    code += "for(int i = 0; i<length*6+12; i++) {\n";
    code += ` matrix_${dropdown_pin}.fillScreen(0);\n`;
    code += ` matrix_${dropdown_pin}.setCursor(12-i, 0);\n`;
    code += ` matrix_${dropdown_pin}.print(txt);\n`;
    code += ` matrix_${dropdown_pin}.show();\n`;
    code += ` delay(100);\n`;
    code += "}\n";
  } else {
    code += `matrix_${dropdown_pin}.fillScreen(0);\n`;
    code += `matrix_${dropdown_pin}.setCursor(0, 0);\n`;
    code += `matrix_${dropdown_pin}.print(` + value + `);\n`;
    code += `matrix_${dropdown_pin}.show();\n`;
  }
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_ws2812_matrix_drawPixel"] =
  function (block) {
    var dropdown_pin = this.getFieldValue("Port");
    var x = Blockly.Generator.Arduino.valueToCode(
      this,
      "X",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    );
    var y = Blockly.Generator.Arduino.valueToCode(
      this,
      "Y",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    );
    var color = Blockly.Generator.Arduino.valueToCode(
      this,
      "COLOR",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    );
    var show = this.getFieldValue("SHOW");
    var code = `matrix_${dropdown_pin}.drawPixel(${x},${y},matrix_${dropdown_pin}.Color(${color}));\n`;
    if (show === "TRUE") {
      code += `matrix_${dropdown_pin}.show();\n`;
    }
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_ws2812_matrix_showBitmap"] =
  function (block) {
    var dropdown_pin = this.getFieldValue("Port");
    var value =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "input",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || '"Keine Eingabe"';

    var code = `matrix_${dropdown_pin}.drawRGBBitmap(0,0, ${value}, WIDTH, HEIGHT);\n`;
    code += `matrix_${dropdown_pin}.show();\n`;
    return code;
  };

Blockly.Generator.Arduino.forBlock["sensebox_ws2812_matrix_bitmap"] = function (
  block,
  generator,
) {
  var dropdown_bitmap = this.getFieldValue("BITMAP");
  var bitmap = "";
  switch (dropdown_bitmap) {
    case "happy":
      bitmap = `0x0000, 0x0000, 0x0000, 0x2589, 0x0000, 0x0000, 0x0000, 0x0000, 0x2589, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x2589,
            0x0000, 0x0000, 0x0000, 0x0000, 0x2589, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
            0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
            0x0000, 0x0000, 0x2589, 0x2589, 0x2589, 0x2589, 0x2589, 0x2589, 0x2589, 0x2589, 0x0000, 0x0000, 0x0000, 0x0000, 0x2589, 0x0000,
            0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x2589, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x2589, 0x0000, 0x0000, 0x0000, 0x0000,
            0x2589, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x2589, 0x2589, 0x2589, 0x2589, 0x0000, 0x0000, 0x0000, 0x0000,`;
      break;
    case "neutral":
      bitmap = `0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xFE01, 0xFE01,
            0x0000, 0x0000, 0x0000, 0x0000, 0xFE01, 0xFE01, 0x0000, 0x0000, 0x0000, 0x0000, 0xFE01, 0xFE01, 0x0000, 0x0000, 0x0000, 0x0000,
            0xFE01, 0xFE01, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
            0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
            0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xFE01, 0xFE01, 0xFE01, 0xFE01, 0xFE01, 0xFE01,
            0xFE01, 0xFE01, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,`;
      break;
    case "sad":
      bitmap = `0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x4B7E,
            0x0000, 0x0000, 0x0000, 0x0000, 0x4B7E, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x4B7E, 0x4B7E, 0x0000, 0x0000, 0x0000, 0x0000,
            0x4B7E, 0x4B7E, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
            0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x4B7E,
            0x4B7E, 0x4B7E, 0x4B7E, 0x4B7E, 0x4B7E, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x4B7E, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
            0x0000, 0x4B7E, 0x0000, 0x0000, 0x0000, 0x4B7E, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x4B7E, 0x0000,`;
      break;
    case "angry":
      bitmap = `0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xE8E4, 0x0000,
            0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xE8E4, 0x0000, 0x0000, 0x0000, 0x0000, 0xE8E4, 0xE8E4, 0x0000, 0x0000, 0x0000, 0x0000,
            0xE8E4, 0xE8E4, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
            0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xE8E4,
            0xE8E4, 0xE8E4, 0xE8E4, 0xE8E4, 0xE8E4, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xE8E4, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
            0x0000, 0xE8E4, 0x0000, 0x0000, 0x0000, 0xE8E4, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xE8E4, 0x0000,`;
      break;
    case "hat":
      bitmap = `0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xB5B6,
            0x0000, 0x0000, 0x29B3, 0x29B3, 0x29B3, 0x0000, 0x0000, 0x0000, 0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6, 0xE54F, 0xE54F, 0x29B3, 0x29B3,
            0x29B3, 0x74DA, 0x74DA, 0x74DA, 0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6, 0x0000, 0xE54F, 0x29B3, 0x29B3, 0x29B3, 0x74DA, 0x74DA, 0x74DA,
            0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6, 0xE54F, 0xE54F, 0x29B3, 0x29B3, 0x29B3, 0x74DA, 0x0000, 0x0000, 0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6,
            0x0000, 0xE54F, 0x29B3, 0x29B3, 0x29B3, 0x74DA, 0x74DA, 0x74DA, 0xB5B6, 0xB5B6, 0xE8E4, 0xB5B6, 0xE54F, 0xE54F, 0x29B3, 0x29B3,
            0x29B3, 0x74DA, 0x74DA, 0x74DA, 0x0000, 0x0000, 0x0000, 0xB5B6, 0x0000, 0x0000, 0x29B3, 0x29B3, 0x29B3, 0x0000, 0x0000, 0x0000,`;
      break;
    case "island":
      bitmap = `0xFFCC, 0xFFCC, 0xFFCC, 0xFF89, 0xFCE3, 0xFB06, 0xFB06, 0xBC07, 0x6679, 0x569E, 0x4578, 0x3C95, 0xFFCC, 0xFFCC, 0xFFCC, 0x43E3,
            0xA364, 0xFB06, 0xCBE7, 0x4688, 0x4EB9, 0x569E, 0x4578, 0x3C95, 0xFFCC, 0xFFCC, 0x54C5, 0x4BA3, 0xCB05, 0xF306, 0xB407, 0x2F08,
            0x4ED9, 0x569E, 0x4578, 0x3C95, 0xFFCC, 0xFFCC, 0x54C5, 0x1B62, 0x22A2, 0x99E4, 0x8B25, 0x2F08, 0x56FA, 0x569E, 0x4578, 0x3C95,
            0xFFCC, 0xFFCC, 0x4C64, 0x1B62, 0x2282, 0x31C1, 0x9305, 0x2F08, 0x573A, 0x569E, 0x4578, 0x3C95, 0xFFCC, 0xFFCC, 0x4CA5, 0x1BC3,
            0x7344, 0xCB05, 0xCBE6, 0x2F08, 0x573A, 0x569E, 0x4578, 0x3C95, 0xFFCC, 0xFFCC, 0xF7AC, 0x43C3, 0x4342, 0xD305, 0xD3A6, 0x3EA8,
            0x571A, 0x569E, 0x4578, 0x3C95, 0xFFCC, 0xFFCC, 0xFFCC, 0xFF89, 0xFCE3, 0xFB06, 0xFB06, 0xBC07, 0x6679, 0x569E, 0x4578, 0x3C95,`;
      break;
    case "knight":
      bitmap = `0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xFFFF, 0xFFFF, 0x0000, 0x0000,
            0x0000, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x0000, 0x0000, 0x0000, 0x0000, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
            0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x0000, 0xFFFF, 0x0000, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
            0x0000, 0xFFFF, 0x0000, 0x0000, 0x0000, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x0000, 0x0000, 0x0000, 0x0000, 0xFFFF, 0x0000, 0xFFFF,
            0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x0000, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
            0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x0000, 0x0000, 0x0000, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x0000, 0x0000, 0x0000,`;
      break;
    case "amogus":
      bitmap = `0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
            0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0xE8E4, 0xE8E4, 0x0000, 0x0000, 0x0000, 0x0000,
            0xFE01, 0xFE01, 0x0000, 0x0000, 0x0000, 0xE8E4, 0xE8E4, 0xE8E4, 0xE8E4, 0x0000, 0x0000, 0xFE01, 0xFE01, 0xFE01, 0xFE01, 0x0000,
            0xE8E4, 0xE8E4, 0xE8E4, 0x05BD, 0x05BD, 0x0000, 0x0000, 0x05BD, 0x05BD, 0xFE01, 0xFE01, 0xFE01, 0xE8E4, 0xE8E4, 0xE8E4, 0xE8E4,
            0xE8E4, 0x0000, 0x0000, 0xFE01, 0xFE01, 0xFE01, 0xFE01, 0xFE01, 0x0000, 0xE8E4, 0xE8E4, 0xE8E4, 0xE8E4, 0x0000, 0x0000, 0xFE01,
            0xFE01, 0xFE01, 0xFE01, 0x0000, 0x0000, 0xE8E4, 0x0000, 0x0000, 0xE8E4, 0x0000, 0x0000, 0xFE01, 0x0000, 0x0000, 0xFE01, 0x0000,`;
      break;
    default:
      bitmap = `0x0000, 0x0000, 0x0000, 0x2589, 0x0000, 0x0000, 0x0000, 0x0000, 0x2589, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x2589,
            0x0000, 0x0000, 0x0000, 0x0000, 0x2589, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
            0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
            0x0000, 0x0000, 0x2589, 0x2589, 0x2589, 0x2589, 0x2589, 0x2589, 0x2589, 0x2589, 0x0000, 0x0000, 0x0000, 0x0000, 0x2589, 0x0000,
            0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x2589, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x2589, 0x0000, 0x0000, 0x0000, 0x0000,
            0x2589, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x2589, 0x2589, 0x2589, 0x2589, 0x0000, 0x0000, 0x0000, 0x0000,`;
      break;
  }
  Blockly.Generator.Arduino.definitions_[`define_bitmap_${dropdown_bitmap}`] =
    `const uint16_t bitmap_${dropdown_bitmap}[] = {${bitmap}};`;
  var code = "bitmap_" + dropdown_bitmap;
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_ws2812_matrix_custom_bitmap"] =
  function (block) {
    // Generate a unique name for the bitmap
    let hash = 0;
    for (let i = 0; i < block.id.length; i++) {
      hash = (hash * 31 + block.id.charCodeAt(i)) >>> 0; // 32-bit unsigned integer
    }
    let bitmapName = hash.toString(16);

    var inputValue = block.getFieldValue("input") || "{}";

    // Remove existing { and } if present at the start and end
    if (inputValue.startsWith("{") && inputValue.endsWith("}")) {
      inputValue = inputValue.slice(1, -1);
    }

    // Add { and } around the value
    var customBitmap = "{" + inputValue + "}";

    Blockly.Generator.Arduino.definitions_[`define_bitmap_${bitmapName}`] =
      `const uint16_t bitmap_${bitmapName}[] = ${customBitmap};`;

    return [`bitmap_${bitmapName}`, Blockly.Generator.Arduino.ORDER_ATOMIC];
  };

Blockly.Generator.Arduino.forBlock[
  "sensebox_ws2812_matrix_draw_custom_bitmap_example"
] = function (block) {
  var bitmap = "";
  const bitmapName = block.getFieldValue("name");
  for (let i = 1; i <= 8; i += 1) {
    for (let j = 1; j <= 12; j += 1) {
      const colorHex = block.getFieldValue(i + "," + j);
      const color = hexToRgb(colorHex);
      bitmap +=
        "0x" +
        (
          ((color.r >> 3) << 11) |
          ((color.g >> 2) << 5) |
          (color.b >> 3)
        ).toString(16) +
        ", ";
    }
    bitmap += "\n";
  }
  Blockly.Generator.Arduino.definitions_[`define_${bitmapName}_example`] =
    `const uint16_t bitmap_${bitmapName}[] = {${bitmap}};`;
  var code = `bitmap_${bitmapName}`;

  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_ws2812_matrix_fullcolor"] =
  function (block) {
    var bitmap = "";
    var colorRgb =
      Blockly.Generator.Arduino.valueToCode(
        this,
        "COLOR",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "0,255,0";
    const [r, g, b] = colorRgb
      .split(",")
      .map((value) => parseInt(value.trim(), 10));
    var dropdown_pin = this.getFieldValue("Port");
    for (let i = 1; i <= 8; i += 1) {
      for (let j = 1; j <= 12; j += 1) {
        bitmap +=
          "0x" +
          (((r >> 3) << 11) | ((g >> 2) << 5) | (b >> 3)).toString(16) +
          ", ";
      }
      bitmap += "\n";
    }
    console.log(bitmap);
    Blockly.Generator.Arduino.definitions_[
      `define_custom_draw_bitmap_full_${r}}`
    ] = `const uint16_t bitmap_full_${r}[] = {${bitmap}};`;
    var code = `matrix_${dropdown_pin}.drawRGBBitmap(0,0,bitmap_full_${r},WIDTH,HEIGHT);\n`;
    code += `matrix_${dropdown_pin}.show();\n`;
    return code;
  };
