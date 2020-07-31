import * as Blockly from 'blockly/core';

/*Display Blocks*/
Blockly.Arduino.sensebox_display_beginDisplay = function () {
    Blockly.Arduino.libraries_['library_spi'] = '#include <SPI.h>';
    Blockly.Arduino.libraries_['library_wire'] = '#include <Wire.h>';
    Blockly.Arduino.libraries_['library_AdafruitGFX'] = '#include <Adafruit_GFX.h>';
    Blockly.Arduino.libraries_['library_AdafruitSSD1306'] = '#include <Adafruit_SSD1306.h>';
    Blockly.Arduino.libraries_['library_senseBoxMCU'] = '#include "SenseBoxMCU.h"';
    Blockly.Arduino.definitions_['define_display'] = '#define OLED_RESET 4\nAdafruit_SSD1306 display(OLED_RESET);';
    Blockly.Arduino.setupCode_['sensebox_display_begin'] = 'senseBoxIO.powerI2C(true);\ndelay(2000);\ndisplay.begin(SSD1306_SWITCHCAPVCC, 0x3D);\ndisplay.display();\ndelay(100);\ndisplay.clearDisplay();';
    var code = '';
    return code;
};

Blockly.Arduino.sensebox_display_clearDisplay = function () {
    var code = 'display.clearDisplay();\n';
    return code;
};

Blockly.Arduino.sensebox_display_printDisplay = function () {
    var x = Blockly.Arduino.valueToCode(this, 'X', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var y = Blockly.Arduino.valueToCode(this, 'Y', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var printDisplay = Blockly.Arduino.valueToCode(this, 'printDisplay', Blockly.Arduino.ORDER_ATOMIC) || '"Keine Eingabe"';
    var size = Blockly.Arduino.valueToCode(this, 'SIZE', Blockly.Arduino.ORDER_ATOMIC) || '1'
    var color = this.getFieldValue('COLOR');
    var code = 'display.setCursor(' + x + ',' + y + ');\n';
    code += 'display.setTextSize(' + size + ');\n';
    code += 'display.setTextColor(' + color + ');\n';
    code += 'display.println(' + printDisplay + ');\n';
    return code;
};

Blockly.Arduino.sensebox_display_show = function (block) {
    var show = Blockly.Arduino.statementToCode(block, 'SHOW');
    var code = '';
    code += show;
    code += 'display.display();\n';
    return code;
};
Blockly.Arduino.sensebox_display_plotDisplay = function () {
    var YLabel = Blockly.Arduino.valueToCode(this, 'YLabel', Blockly.Arduino.ORDER_ATOMIC) || 'Y'
    var XLabel = Blockly.Arduino.valueToCode(this, 'XLabel', Blockly.Arduino.ORDER_ATOMIC) || 'X'
    var Title = Blockly.Arduino.valueToCode(this, 'Title', Blockly.Arduino.ORDER_ATOMIC) || 'Title'
    var XRange1 = Blockly.Arduino.valueToCode(this, 'XRange1', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var XRange2 = Blockly.Arduino.valueToCode(this, 'XRange2', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var YRange1 = Blockly.Arduino.valueToCode(this, 'YRange1', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var YRange2 = Blockly.Arduino.valueToCode(this, 'YRange2', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var XTick = Blockly.Arduino.valueToCode(this, 'XTick', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var YTick = Blockly.Arduino.valueToCode(this, 'YTick', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var TimeFrame = Blockly.Arduino.valueToCode(this, 'TimeFrame', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var plotDisplay = Blockly.Arduino.valueToCode(this, 'plotDisplay', Blockly.Arduino.ORDER_ATOMIC) || '"Keine Eingabe"';
    Blockly.Arduino.libraries_['library_plot'] = '#include <Plot.h>';
    Blockly.Arduino.definitions_['define_plot_class'] = 'Plot DataPlot(&display);\n';
    Blockly.Arduino.variables_['define_plot_class'] = 'const double TIMEFRAME = ' + TimeFrame + ';\n';
    Blockly.Arduino.setupCode_['sensebox_plot_setup'] = 'DataPlot.setTitle(' + Title + ');\nDataPlot.setXLabel(' + XLabel + ');\nDataPlot.setYLabel(' + YLabel + ');\nDataPlot.setXRange(' + XRange1 + ',' + XRange2 + ');\nDataPlot.setYRange(' + YRange1 + ',' + YRange2 + ');\nDataPlot.setXTick(' + XTick + ');\nDataPlot.setYTick(' + YTick + ');\nDataPlot.setXPrecision(0);\nDataPlot.setYPrecision(0);\n';
    var code = 'DataPlot.clear();'
    code += 'double starttime = millis();\ndouble t = 0;\nwhile (t <= TIMEFRAME) {\nt = (millis() - starttime) / 1000.0;\nfloat value = ' + plotDisplay + ';\n';
    code += 'DataPlot.addDataPoint(t,value);\n}\n';
    return code;
};

Blockly.Arduino.sensebox_display_fillCircle = function () {
    var x = Blockly.Arduino.valueToCode(this, 'X', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var y = Blockly.Arduino.valueToCode(this, 'Y', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var radius = Blockly.Arduino.valueToCode(this, 'Radius', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var fill = this.getFieldValue('FILL');
    if (fill == 'TRUE') {
        var code = 'display.fillCircle(' + x + ',' + y + ',' + radius + ',1);\n';
    }
    else {
        var code = 'display.drawCircle(' + x + ',' + y + ',' + radius + ',1);\n';
    }
    return code;
}

Blockly.Arduino.sensebox_display_drawRectangle = function () {
    var x = Blockly.Arduino.valueToCode(this, 'X', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var y = Blockly.Arduino.valueToCode(this, 'Y', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var width = Blockly.Arduino.valueToCode(this, 'width', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var height = Blockly.Arduino.valueToCode(this, 'height', Blockly.Arduino.ORDER_ATOMIC) || '0'
    var fill = this.getFieldValue('FILL');
    if (fill == 'TRUE') {
        var code = 'display.fillRect(' + x + ',' + y + ',' + width + ',' + height + ',1);\n';
    }
    else {
        var code = 'display.drawRect(' + x + ',' + y + ',' + width + ',' + height + ',1);\n';
    }
    return code;
}