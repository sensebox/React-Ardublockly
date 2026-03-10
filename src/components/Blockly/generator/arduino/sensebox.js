import * as Blockly from "blockly/core";

/*
 * Multiplexer
 */
Blockly.Generator.Arduino.forBlock["sensebox_multiplexer_init"] = function () {
  // Blockly.Generator.Arduino.libraries_['library_spi'] = '#include <SPI.h>';
  var nrChannels =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "nrChannels",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) | 0;
  var array = [];
  for (var i = 0; i < nrChannels; i++) {
    array.push(i);
  }
  Blockly.Generator.Arduino.libraries_["library_wire"] = "#include <Wire.h>";
  Blockly.Generator.Arduino.definitions_["define_multiplexer"] =
    `byte multiplexAddress = 0x77;
    byte channels[] = {${array}};`;
  // Blockly.Generator.Arduino.setupCode_['sensebox_display_begin'] = 'senseBoxIO.powerI2C(true);\ndelay(2000);\ndisplay.begin(SSD1306_SWITCHCAPVCC, 0x3D);\ndisplay.display();\ndelay(100);\ndisplay.clearDisplay();';
  var code = "";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_multiplexer_changeChannel"] =
  function () {
    var channel = Blockly.Generator.Arduino.valueToCode(
      this,
      "Channel",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    );
    var code = `Wire.beginTransmission(0x77);
  Wire.write(1 << channels[${channel - 1}]);
  Wire.endTransmission();`;
    return code;
  };
