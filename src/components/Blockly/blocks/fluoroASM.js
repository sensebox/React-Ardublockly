import * as Blockly from "blockly";
import { getColour } from "../helpers/colour";
import { selectedBoard } from "../helpers/board";

Blockly.Blocks["sensebox_fluoroASM_init"] = {
  init: function () {
    this.appendDummyInput().appendField(
      "Init FluoroASM Bee",
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().sensebox);
    const text = `Mit dem QOOOL Fluoro kannst Du die Grundlagen von Fluoreszenz erforschen – direkt in der Blockly-Umgebung. In diesem digitalen Experiment steuerst du farbige LEDs und kombinierst sie mit verschiedenen Farbfiltern. Besonders spannend: manche Filter enthalten einen Mikrodiamanten mit sogenannten NV-Zentren (Stickstoff-Leerstellen-Zentren). Diese speziellen Defekte können durch Licht angeregt werden und geben dann einen Teil der Energie in Form von sichtbarem Licht wieder ab. Dieser Effekt heißt Fluoreszenz.

Was kannst Du im Simulator ausprobieren? 
- Schalte verschiedene LEDs (rot, grün, blau, weiß) ein oder aus \n
- Lege verschiedene Farbfilter über die Lichtquelle und beobachte, wie sie das Licht verändern \n
- Füge einen Mikrodiamanten in den Filter ein oder entferne ihn, und achte darauf, ob Fluoreszenz sichtbar wird \n
- Vergleiche verschiedene Kombinationen – welche führen zu leuchtenden Effekten? \n
Viel Spaß beim Entdecken der Fluoreszenz! 

Danke!`;
    this.setTooltip(text);

    this.setHelpUrl(text);
  },
};

Blockly.Blocks['sensebox_fluoroASM_setLED'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Fluoro LED einschalten")
            .appendField(new Blockly.FieldDropdown([
                ["1", "1"], 
                ["2", "2"], 
                ["3", "3"], 
                ["4", "4"]
            ]), "LED_NUMBER");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(getColour().sensebox);
    const text = `Mit dem QOOOL Fluoro kannst Du die Grundlagen von Fluoreszenz erforschen – direkt in der Blockly-Umgebung. In diesem digitalen Experiment steuerst du farbige LEDs und kombinierst sie mit verschiedenen Farbfiltern. Besonders spannend: manche Filter enthalten einen Mikrodiamanten mit sogenannten NV-Zentren (Stickstoff-Leerstellen-Zentren). Diese speziellen Defekte können durch Licht angeregt werden und geben dann einen Teil der Energie in Form von sichtbarem Licht wieder ab. Dieser Effekt heißt Fluoreszenz.

Was kannst Du im Simulator ausprobieren? 
- Schalte verschiedene LEDs (rot, grün, blau, weiß) ein oder aus \n
- Lege verschiedene Farbfilter über die Lichtquelle und beobachte, wie sie das Licht verändern \n
- Füge einen Mikrodiamanten in den Filter ein oder entferne ihn, und achte darauf, ob Fluoreszenz sichtbar wird \n
- Vergleiche verschiedene Kombinationen – welche führen zu leuchtenden Effekten? \n
Viel Spaß beim Entdecken der Fluoreszenz! 

Danke!`;
    this.setTooltip(text);

    }
};



Blockly.Blocks["sensebox_fluoroASM_setLED2"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField("LED ")
      .appendField("Nummer:")
      .appendField(
        new Blockly.FieldDropdown([
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"],
        ]),
        "LED_NUMBER",

      )
      .appendField(Blockly.Msg.senseBox_basic_state)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_on, "HIGH"],
          [Blockly.Msg.senseBox_off, "LOW"],
        ]),
        "STAT",
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_led_tooltip);
        const text = `Mit dem QOOOL Fluoro kannst Du die Grundlagen von Fluoreszenz erforschen – direkt in der Blockly-Umgebung. In diesem digitalen Experiment steuerst du farbige LEDs und kombinierst sie mit verschiedenen Farbfiltern. Besonders spannend: manche Filter enthalten einen Mikrodiamanten mit sogenannten NV-Zentren (Stickstoff-Leerstellen-Zentren). Diese speziellen Defekte können durch Licht angeregt werden und geben dann einen Teil der Energie in Form von sichtbarem Licht wieder ab. Dieser Effekt heißt Fluoreszenz.

Was kannst Du im Simulator ausprobieren? 
- Schalte verschiedene LEDs (rot, grün, blau, weiß) ein oder aus \n
- Lege verschiedene Farbfilter über die Lichtquelle und beobachte, wie sie das Licht verändern \n
- Füge einen Mikrodiamanten in den Filter ein oder entferne ihn, und achte darauf, ob Fluoreszenz sichtbar wird \n
- Vergleiche verschiedene Kombinationen – welche führen zu leuchtenden Effekten? \n
Viel Spaß beim Entdecken der Fluoreszenz! 

Danke!`;
    this.setTooltip(text);

  },
};