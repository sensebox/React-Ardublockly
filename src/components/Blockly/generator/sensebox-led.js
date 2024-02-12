import * as Blockly from 'blockly/core';

Blockly.Arduino.sensebox_led = function () {
    var dropdown_pin = this.getFieldValue('PIN');
    var dropdown_stat = this.getFieldValue('STAT');
    Blockly.Arduino.setupCode_['setup_led_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
    var code = 'digitalWrite(' + dropdown_pin + ',' + dropdown_stat + ');\n'
    return code;
};

Blockly.Arduino.sensebox_rgb_led = function () {
    var dropdown_pin = this.getFieldValue('PIN');
    var color = Blockly.Arduino.valueToCode(this, 'COLOR', Blockly.Arduino.ORDER_ATOMIC) || '0'
    Blockly.Arduino.libraries_['define_rgb_led' + dropdown_pin] = '#include <Adafruit_NeoPixel.h>\n Adafruit_NeoPixel rgb_led_' + dropdown_pin + ' = Adafruit_NeoPixel(1,' + dropdown_pin + ',NEO_RGB + NEO_KHZ800);\n';
    Blockly.Arduino.setupCode_['setup_rgb_led' + dropdown_pin] = 'rgb_led_' + dropdown_pin + '.begin();';
    var code = 'rgb_led_' + dropdown_pin + '.setPixelColor(0,rgb_led_' + dropdown_pin + '.Color(' + color + '));\n';
    code += 'rgb_led_' + dropdown_pin + '.show();';
    return code;
};


Blockly.Arduino.sensebox_ws2818_led_init = function () {
    var dropdown_pin = this.getFieldValue('Port');
    var numPixel = Blockly.Arduino.valueToCode(this, 'NUMBER', Blockly.Arduino.ORDER_ATOMIC) || '1';
    var brightness = Blockly.Arduino.valueToCode(this, 'BRIGHTNESS', Blockly.Arduino.ORDER_ATOMIC) || '50'
    Blockly.Arduino.definitions_['define_rgb_led' + dropdown_pin] = `#include <Adafruit_NeoPixel.h>\n Adafruit_NeoPixel rgb_led_${dropdown_pin}= Adafruit_NeoPixel(${numPixel}, ${dropdown_pin},NEO_GRB + NEO_KHZ800);\n`;
    Blockly.Arduino.setupCode_['setup_rgb_led' + dropdown_pin] = 'rgb_led_' + dropdown_pin + '.begin();\n';
    Blockly.Arduino.setupCode_['setup_rgb_led_brightness' + dropdown_pin] = `rgb_led_${dropdown_pin}.setBrightness(${brightness});\n`;
    return '';
};

Blockly.Arduino.sensebox_ws2818_led = function () {
    var dropdown_pin = this.getFieldValue('Port');
    var position = Blockly.Arduino.valueToCode(this, 'POSITION', Blockly.Arduino.ORDER_ATOMIC) || '0';
    var color = Blockly.Arduino.valueToCode(this, 'COLOR', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var code = `rgb_led_${dropdown_pin}.setPixelColor(${position},rgb_led_${dropdown_pin}.Color(${color}));\nrgb_led_${dropdown_pin}.show();\n`;
    return code;
};


function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

Blockly.Arduino['colour_picker'] = function (block) {
    const rgb = hexToRgb(block.getFieldValue('COLOUR'));

    return [rgb.r + ', ' + rgb.g + ', ' + rgb.b, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['colour_random'] = function (block) {
    return ['random(0, 255), random(0, 255), random(0, 255)', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['colour_rgb'] = function (block) {
    const red = Blockly.Arduino.valueToCode(block, 'RED', Blockly.Arduino.ORDER_ATOMIC);
    const green = Blockly.Arduino.valueToCode(block, 'GREEN', Blockly.Arduino.ORDER_ATOMIC);
    const blue = Blockly.Arduino.valueToCode(block, 'BLUE', Blockly.Arduino.ORDER_ATOMIC);

    return [red + ', ' + green + ', ' + blue, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * LED-Matrix Blocks
 * 
 * 
 */


Blockly.Arduino['sensebox_ws2812_matrix_init'] = function (block) {
    var dropdown_pin = this.getFieldValue('Port');
    var brightness = Blockly.Arduino.valueToCode(this, 'BRIGHTNESS', Blockly.Arduino.ORDER_ATOMIC) || '20'
    Blockly.Arduino.libraries_['libraries_neopixel'] = `#include <Adafruit_NeoPixel.h>`;
    Blockly.Arduino.libraries_['libraries_rgb_matrix'] = "#include <Adafruit_NeoMatrix.h>"
    Blockly.Arduino.libraries_["library_AdafruitGFX"] =
    "#include <Adafruit_GFX.h> // http://librarymanager/All#Adafruit_GFX_Library";
    Blockly.Arduino.definitions_['definition_rgb_matrix' + dropdown_pin] = `Adafruit_NeoMatrix matrix = Adafruit_NeoMatrix(12, 8, ${dropdown_pin},
        NEO_MATRIX_TOP     + NEO_MATRIX_LEFT +
        NEO_MATRIX_ROWS + NEO_MATRIX_ZIGZAG,
        NEO_GRB            + NEO_KHZ800);`;
    Blockly.Arduino.setupCode_['matrix' + dropdown_pin] = 'matrix_' + dropdown_pin + '.begin();\n';
    Blockly.Arduino.setupCode_['setup_matrix_brightness' + dropdown_pin] = `matrix_${dropdown_pin}.setBrightness(${brightness});\n`;
    Blockly.Arduino.setupCode_['setup_matrix_color' + dropdown_pin] = `matrix_${dropdown_pin}.setColor(matrix.Color(255, 0, 0));\n`;
    return '';


}


Blockly.Arduino['sensebox_ws2812_matrix_text'] = function (block) {
    var code = "";
    var dropdown_pin = this.getFieldValue('Port');
    var value = Blockly.Arduino.valueToCode(this, "input", Blockly.Arduino.ORDER_ATOMIC) || '"Keine Eingabe"';
    code+= "matrix_" + dropdown_pin + ".fillScreen(0);\n";
    code+= "matrix_" + dropdown_pin + ".setCursor(x,0);\n";
    code+= "matrix_" + dropdown_pin + ".print(F(" + value + "));\n";
    code+= "matrix_" + dropdown_pin + ".show();\n";
    return code;
}



