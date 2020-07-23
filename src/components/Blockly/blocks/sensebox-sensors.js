import Blockly from 'blockly';


Blockly.Blocks['sensebox_sensor_temp_hum'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_temp_hum);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(Blockly.Msg.senseBox_value)
      .appendField(new Blockly.FieldDropdown([[Blockly.Msg.senseBox_temp, "Temperature"], [Blockly.Msg.senseBox_hum, "Humidity"]]), "NAME");
    this.setOutput(true, "Number");
    this.setColour(120);
    this.setTooltip(Blockly.Msg.senseBox_temp_hum_tip);
    this.setHelpUrl('https://edu.books.sensebox.de/de/projekte/diy_umweltstation/temp_und_luftfeuchte.html');
  },
  getBlockType: function () {
    return Blockly.Types.DECIMAL;
  },
};