// path: src/components/Blockly/blocks/sps30.js
import * as Blockly from "blockly";
import "blockly/javascript"; // Stellt sicher, dass Blockly.JavaScript existiert
import { getColour } from "../helpers/colour";
import * as Types from "../helpers/types";
import { FieldGridDropdown } from "@blockly/field-grid-dropdown";
import { FieldSlider } from "@blockly/field-slider";

/**
 * Sensirion SPS30 Feinstaubsensor
 */

// Initialisierung des Sensors
Blockly.Blocks["sensebox_sps30_init"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField("SPS30 Feinstaubsensor initialisieren");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Initialisiert den SPS30 Feinstaubsensor.");
    this.setHelpUrl("https://sensirion.com/products/catalog/SPS30/");
  },
};

// Block: Auto-Clean Interval setzen
Blockly.Blocks["sensebox_sps30_clean_interval"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField("SPS30 Auto-Clean Interval setzen");

    // Anzahl Tage für Auto-Clean
    this.appendValueInput("DAYS")
      .setCheck(Types.NUMBER.typeName)
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Tage:");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      "Setzt das Intervall für die automatische Reinigung des SPS30 Sensors (in Tagen).",
    );
    this.setHelpUrl("https://sensirion.com/products/catalog/SPS30/");
  },
};

// Block: Messintervall setzen
Blockly.Blocks["sensebox_sps30_measure_interval"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField("SPS30 Messintervall setzen");

    // Messintervall in Sekunden
    this.appendValueInput("INTERVAL")
      .setCheck(Types.NUMBER.typeName)
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Sekunden:");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      "Setzt das Messintervall für den SPS30 Sensor (in Sekunden).",
    );
    this.setHelpUrl("https://sensirion.com/products/catalog/SPS30/");
  },
};

// Block: Feinstaubwert lesen
Blockly.Blocks["sensebox_sps30_read"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField("SPS30 Feinstaubwert lesen");

    // Partikelgröße als Dropdown
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Partikelgröße:")
      .appendField(
        new FieldGridDropdown([
          ["PM1.0", "1p0"],
          ["PM2.5", "2p5"],
          ["PM4.0", "4p0"],
          ["PM10.0", "10p0"],
        ]),
        "value",
      );

    this.setOutput(true, Types.DECIMAL.typeName);
    this.setTooltip("Liest den aktuellen Feinstaubwert des SPS30 Sensors.");
    this.setHelpUrl("https://sensirion.com/products/catalog/SPS30/");
    this.data = { name: "sps30", connection: "I2C" };
  },
};

// Block: Manuelle Reinigung starten
Blockly.Blocks["sensebox_sps30_clean"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField("SPS30 manuelle Reinigung starten");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Startet eine manuelle Reinigung des SPS30 Sensors.");
    this.setHelpUrl("https://sensirion.com/products/catalog/SPS30/");
  },
};

/**
 * **JavaScript-Code-Generator für SPS30**
 */

// Funktion zum Registrieren der JavaScript-Generator-Funktionen
function registerJavaScriptGenerators() {
  // Prüfen, ob Blockly.JavaScript existiert
  if (typeof Blockly === "undefined" || !Blockly.JavaScript) {
    // Falls nicht, nach 100ms erneut versuchen
    setTimeout(registerJavaScriptGenerators, 100);
    return;
  }

  // Code-Generator für Sensor-Initialisierung
  Blockly.JavaScript["sensebox_sps30_init"] = function (block) {
    return `initSPS30();\n`;
  };

  // Code-Generator für Auto-Clean Interval
  Blockly.JavaScript["sensebox_sps30_clean_interval"] = function (block) {
    var days =
      Blockly.JavaScript.valueToCode(
        block,
        "DAYS",
        Blockly.JavaScript.ORDER_ATOMIC,
      ) || "4";
    return `setSPS30CleanInterval(${days});\n`;
  };

  // Code-Generator für Messintervall
  Blockly.JavaScript["sensebox_sps30_measure_interval"] = function (block) {
    var interval =
      Blockly.JavaScript.valueToCode(
        block,
        "INTERVAL",
        Blockly.JavaScript.ORDER_ATOMIC,
      ) || "1";
    return `setSPS30MeasureInterval(${interval});\n`;
  };

  // Code-Generator für Feinstaubwert lesen
  Blockly.JavaScript["sensebox_sps30_read"] = function (block) {
    var valueType = block.getFieldValue("value");
    return [`readSPS30Value("${valueType}")`, Blockly.JavaScript.ORDER_ATOMIC];
  };

  // Code-Generator für manuelle Reinigung
  Blockly.JavaScript["sensebox_sps30_clean"] = function (block) {
    return `startSPS30Cleaning();\n`;
  };
}

// Starten Sie die Registrierung, sobald dieses Skript geladen ist
registerJavaScriptGenerators();
