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
    var red = Blockly.Arduino.valueToCode(this, 'RED', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var green = Blockly.Arduino.valueToCode(this, 'GREEN', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var blue = Blockly.Arduino.valueToCode(this, 'BLUE', Blockly.Arduino.ORDER_ATOMIC) || '0'
    Blockly.Arduino.libraries_['define_rgb_led' + dropdown_pin] = '#include <Adafruit_NeoPixel.h>\n Adafruit_NeoPixel rgb_led_' + dropdown_pin + ' = Adafruit_NeoPixel(1,' + dropdown_pin + ',NEO_RGB + NEO_KHZ800);\n';
    Blockly.Arduino.setupCode_['setup_rgb_led' + dropdown_pin] = 'rgb_led_' + dropdown_pin + '.begin();';

    var code = 'rgb_led_' + dropdown_pin + '.setPixelColor(0,rgb_led_' + dropdown_pin + '.Color(' + red + ',' + green + ',' + blue + '));\n';
    code += 'rgb_led_' + dropdown_pin + '.show();';
    return code;
};


Blockly.Arduino.sensebox_ws2818_led = function () {
    var dropdown_pin = this.getFieldValue('Port');
    var blocks = Blockly.mainWorkspace.getAllBlocks();
    var count = 0;
    for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].type === 'sensebox_ws2818_led' && blocks[i].getFieldValue('Port') === dropdown_pin) {
            count++;

        }
    }
    var numPixel = count;
    var brightness = Blockly.Arduino.valueToCode(this, 'BRIGHTNESS', Blockly.Arduino.ORDER_ATOMIC) || '50'
    var position = Blockly.Arduino.valueToCode(this, 'POSITION', Blockly.Arduino.ORDER_ATOMIC) || '0';
    var red = Blockly.Arduino.valueToCode(this, 'RED', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var green = Blockly.Arduino.valueToCode(this, 'GREEN', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var blue = Blockly.Arduino.valueToCode(this, 'BLUE', Blockly.Arduino.ORDER_ATOMIC) || '0'
    Blockly.Arduino.definitions_['define_rgb_led' + dropdown_pin] = `#include <Adafruit_NeoPixel.h>\n Adafruit_NeoPixel rgb_led_${dropdown_pin}= Adafruit_NeoPixel(${numPixel}, ${dropdown_pin},NEO_GRB + NEO_KHZ800);\n`;
    Blockly.Arduino.setupCode_['setup_rgb_led' + dropdown_pin] = 'rgb_led_' + dropdown_pin + '.begin();\n';
    Blockly.Arduino.setupCode_['setup_rgb_led_brightness' + dropdown_pin] = `rgb_led_${dropdown_pin}.setBrightness(${brightness});\n`;
    var code = `rgb_led_${dropdown_pin}.setPixelColor(${position},rgb_led_${dropdown_pin}.Color(${red},${green},${blue}));\nrgb_led_${dropdown_pin}.show();\n`;
    return code;
};