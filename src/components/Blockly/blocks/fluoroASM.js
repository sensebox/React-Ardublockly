// path: src/components/Blockly/blocks/fluoroASM.jsx
// Erstellt
import * as Blockly from "blockly";
import "blockly/javascript"; // Stellt sicher, dass Blockly.JavaScript existiert
import { getColour } from "../helpers/colour";
import * as Types from "../helpers/types";
import { FieldGridDropdown } from "@blockly/field-grid-dropdown";
import { FieldSlider } from "@blockly/field-slider";

/**
 * Fluoro-ASM Sensor und LED-Steuerung
 */

// Initialisierung des Sensors
Blockly.Blocks["sensebox_fluoroASM_init"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField("Fluoro-ASM Sensor initialisieren");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Initialisiert den Fluoro-ASM Sensor.");
    this.setHelpUrl("https://fluoroASM-sensor-docs.com");
  },
};

// Block: Quanten-Sensorwert lesen
Blockly.Blocks["sensebox_fluoroASM_read"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField("Fluoro-ASM Quantenwert lesen");

    // Messmodus als Dropdown (z. B. verschiedene Sensormodi)
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Modus:")
      .appendField(
        new FieldGridDropdown([
          ["Standard", "STANDARD"],
          ["Hochpräzise", "HIGH_PRECISION"],
          ["Schnell", "FAST"],
        ]),
        "mode",
      );

    this.setOutput(true, Types.DECIMAL.typeName);
    this.setTooltip(
      "Liest den aktuellen Quanten-Sensorwert im gewählten Modus.",
    );
    this.setHelpUrl("https://fluoroASM-sensor-docs.com");
    this.data = { name: "fluoroASM", connection: "I2C" };
  },
};

// Block: Quantenrauschen simulieren
Blockly.Blocks["sensebox_fluoroASM_noise"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(
      "Fluoro-ASM Quantenrauschen simulieren",
    );

    // Empfindlichkeit des Rauschens über Slider einstellbar
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Empfindlichkeit:")
      .appendField(new FieldSlider(1, 0, 10), "sensitivity");

    this.setOutput(true, Types.DECIMAL.typeName);
    this.setTooltip(
      "Simuliert Quantenrauschen mit einstellbarer Empfindlichkeit.",
    );
    this.setHelpUrl("https://fluoroASM-sensor-docs.com");
    this.data = { name: "fluoroASM_noise" };
  },
};

// Block: Quantenwert über I2C auslesen
Blockly.Blocks["sensebox_fluoroASM_i2c"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField("Fluoro-ASM über I2C auslesen");
    this.setOutput(true, Types.DECIMAL.typeName);
    this.setTooltip("Liest den Fluoro-ASM-Sensorwert über I2C aus.");
    this.setHelpUrl("https://fluoroASM-sensor-docs.com");
  },
};

// LED Initialisierung
Blockly.Blocks["sensebox_fluoroASM_led_init"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField("Fluoro-ASM LEDs initialisieren");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Initialisiert die LEDs des Fluoro-ASM Sensors.");
    this.setHelpUrl("https://fluoroASM-sensor-docs.com");
  },
};

// LED Ein/Aus-Steuerung
Blockly.Blocks["sensebox_fluoroASM_led_set"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField("Fluoro-ASM LED schalten");

    // LED-Auswahl
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("LED:")
      .appendField(
        new FieldGridDropdown([
          ["Blau", "blau"],
          ["Grün", "gruen"],
          ["Gelb", "gelb"],
          ["Rot", "rot"],
        ]),
        "LED",
      );

    // Zustand (Ein/Aus)
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Zustand:")
      .appendField(
        new FieldGridDropdown([
          ["Ein", "HIGH"],
          ["Aus", "LOW"],
        ]),
        "STATE",
      );

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Schaltet eine LED des Fluoro-ASM Sensors ein oder aus.");
    this.setHelpUrl("https://fluoroASM-sensor-docs.com");
  },
};

// LED-Sequenz
Blockly.Blocks["sensebox_fluoroASM_led_sequence"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField("Fluoro-ASM LED-Sequenz abspielen");

    // Verzögerung zwischen LED-Wechseln
    this.appendValueInput("DELAY")
      .setCheck(Types.NUMBER.typeName)
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Verzögerung (ms):");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      "Spielt eine Sequenz aller LEDs des Fluoro-ASM Sensors ab.",
    );
    this.setHelpUrl("https://fluoroASM-sensor-docs.com");
  },
};

// LED-Fading
Blockly.Blocks["sensebox_fluoroASM_led_fade"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField("Fluoro-ASM LEDs faden");

    // Maximale Helligkeit
    this.appendValueInput("MAX_BRIGHTNESS")
      .setCheck(Types.NUMBER.typeName)
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Max. Helligkeit (0-255):");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Lässt die LEDs des Fluoro-ASM Sensors ein- und ausfaden.");
    this.setHelpUrl("https://fluoroASM-sensor-docs.com");
  },
};

/**
 * **JavaScript-Code-Generator für Fluoro-ASM**
 */

// Funktion zum Registrieren der JavaScript-Generator-Funktionen
function registerJavaScriptGenerators() {
  // Prüfen, ob Blockly.JavaScript existiert
  if (typeof Blockly === "undefined" || !Blockly.JavaScript) {
    // Falls nicht, nach 100ms erneut versuchen
    setTimeout(registerJavaScriptGenerators, 100);
    return;
  }

  // Code-Generator für Quantenwert lesen
  Blockly.JavaScript["sensebox_fluoroASM_read"] = function (block) {
    var mode = block.getFieldValue("mode"); // Modus aus dem Dropdown
    return [`readQuantumValue("${mode}")`, Blockly.JavaScript.ORDER_ATOMIC];
  };

  // Code-Generator für Quantenrauschen simulieren
  Blockly.JavaScript["sensebox_fluoroASM_noise"] = function (block) {
    var sensitivity = block.getFieldValue("sensitivity"); // Wert vom Slider
    return [
      `simulateQuantumNoise(${sensitivity})`,
      Blockly.JavaScript.ORDER_ATOMIC,
    ];
  };

  // Code-Generator für I2C-Wert auslesen
  Blockly.JavaScript["sensebox_fluoroASM_i2c"] = function (block) {
    return [`readFluoroASM_I2C()`, Blockly.JavaScript.ORDER_ATOMIC];
  };

  // Code-Generator für Sensor-Initialisierung
  Blockly.JavaScript["sensebox_fluoroASM_init"] = function (block) {
    return `initFluoroASM();\n`;
  };

  // Code-Generator für LED-Initialisierung
  Blockly.JavaScript["sensebox_fluoroASM_led_init"] = function (block) {
    return `initLEDs();\n`;
  };

  // Code-Generator für LED ein/aus schalten
  Blockly.JavaScript["sensebox_fluoroASM_led_set"] = function (block) {
    var led = block.getFieldValue("LED");
    var state = block.getFieldValue("STATE");
    return `setLEDState("${led}", ${state});\n`;
  };

  // Code-Generator für LED-Sequenz
  Blockly.JavaScript["sensebox_fluoroASM_led_sequence"] = function (block) {
    var delay =
      Blockly.JavaScript.valueToCode(
        block,
        "DELAY",
        Blockly.JavaScript.ORDER_ATOMIC,
      ) || "500";
    return `playLEDSequence(${delay});\n`;
  };

  // Code-Generator für LED-Fading
  Blockly.JavaScript["sensebox_fluoroASM_led_fade"] = function (block) {
    var maxBrightness =
      Blockly.JavaScript.valueToCode(
        block,
        "MAX_BRIGHTNESS",
        Blockly.JavaScript.ORDER_ATOMIC,
      ) || "100";
    return `fadeLEDs(${maxBrightness});\n`;
  };
}

// Starten Sie die Registrierung, sobald dieses Skript geladen ist
registerJavaScriptGenerators();
