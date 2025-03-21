// path: src/components/Blockly/generator/arduino/sensebox-fluoroASM.js
import * as Blockly from "blockly/core";

/**
 * FluoroASM Sensor und LED Control - Arduino Code Generator
 */

// Pin-Definitionen und Bibliothek-Includes
Blockly.Generator.Arduino.definitions_["define_fluoro_asm_and_led"] = `
// Bibliotheken für den FluoroASM-Sensor
#include <Wire.h>

// I2C-Adresse des FluoroASM-Sensors
#define FLUOROASM_I2C_ADDR 0x50

// Pin-Definitionen für LEDs
#define blau 18
#define gruen 17
#define gelb 37
#define rot 38

short maxBrightness = 100;

// Funktion zum Lesen des FluoroASM-Sensors über I2C
float readFluoroASM_I2C() {
  Wire.beginTransmission(FLUOROASM_I2C_ADDR);
  Wire.write(0x00);  // Registeradresse für Messwerte
  Wire.endTransmission();
  
  Wire.requestFrom(FLUOROASM_I2C_ADDR, 2);  // 2 Bytes anfordern
  
  if (Wire.available() >= 2) {
    byte highByte = Wire.read();
    byte lowByte = Wire.read();
    
    // 16-bit-Integer aus den beiden Bytes
    int rawValue = (highByte << 8) | lowByte;
    
    // Skalierung auf Fließkommazahl
    return rawValue / 100.0;
  }
  
  return -1.0;  // Fehlerwert
}

// Funktion zum Lesen des Quantenwerts mit verschiedenen Modi
float readQuantumValue(const char* mode) {
  float baseValue = readFluoroASM_I2C();
  
  if (baseValue < 0) {
    return baseValue;  // Fehler weitergeben
  }
  
  // Unterschiedliche Modi simulieren
  if (strcmp(mode, "HIGH_PRECISION") == 0) {
    // Hochpräzisionsmodus: Mittelwert aus mehreren Messungen
    float sum = baseValue;
    for (int i = 0; i < 4; i++) {
      sum += readFluoroASM_I2C();
    }
    return sum / 5.0;
  } 
  else if (strcmp(mode, "FAST") == 0) {
    // Schneller Modus: Einzelmessung, keine Nachbearbeitung
    return baseValue;
  }
  else {
    // Standardmodus: Einzelmessung mit leichter Glättung
    return baseValue;
  }
}

// Funktion zur Simulation von Quantenrauschen
float simulateQuantumNoise(int sensitivity) {
  // Erzeuge Pseudo-Zufallswert, abhängig von Analogwert und Empfindlichkeit
  int rawNoise = analogRead(A0);
  float noise = (rawNoise / 1023.0 - 0.5) * 2.0;  // normalisiert auf Bereich [-1, 1]
  return noise * sensitivity;
}
`;

// FluoroASM Sensor Initialisierung
Blockly.Generator.Arduino.forBlock["sensebox_fluoroASM_init"] = function (
  block,
  generator,
) {
  var code = `
  // Initialisiere I2C für FluoroASM-Sensor
  Wire.begin();
  delay(100);  // Kurze Verzögerung für Sensorinitialisierung
`;
  return code;
};

// Quanten-Sensorwert lesen
Blockly.Generator.Arduino.forBlock["sensebox_fluoroASM_read"] = function (
  block,
  generator,
) {
  var mode = block.getFieldValue("mode");
  return [
    `readQuantumValue("${mode}")`,
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  ];
};

// Quantenrauschen simulieren
Blockly.Generator.Arduino.forBlock["sensebox_fluoroASM_noise"] = function (
  block,
  generator,
) {
  var sensitivity = block.getFieldValue("sensitivity");
  return [
    `simulateQuantumNoise(${sensitivity})`,
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  ];
};

// FluoroASM über I2C auslesen
Blockly.Generator.Arduino.forBlock["sensebox_fluoroASM_i2c"] = function (
  block,
  generator,
) {
  return [`readFluoroASM_I2C()`, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

// LED Initialisierung
Blockly.Generator.Arduino.forBlock["sensebox_fluoroASM_led_init"] = function (
  block,
  generator,
) {
  var code = `
  pinMode(blau, OUTPUT);
  pinMode(gruen, OUTPUT);
  pinMode(gelb, OUTPUT);
  pinMode(rot, OUTPUT);

  // Alle LEDs initial ausschalten
  digitalWrite(blau, LOW);
  digitalWrite(gruen, LOW);
  digitalWrite(gelb, LOW);
  digitalWrite(rot, LOW);
`;
  return code;
};

// LED Ein/Aus-Steuerung
Blockly.Generator.Arduino.forBlock["sensebox_fluoroASM_led_set"] = function (
  block,
  generator,
) {
  var led = block.getFieldValue("LED");
  var state = block.getFieldValue("STATE");
  return `digitalWrite(${led}, ${state});\n`;
};

// LED-Sequenz
Blockly.Generator.Arduino.forBlock["sensebox_fluoroASM_led_sequence"] =
  function (block, generator) {
    var delay =
      Blockly.Generator.Arduino.valueToCode(
        block,
        "DELAY",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) || "500";

    var code = `
  digitalWrite(blau, HIGH);
  delay(${delay});
  digitalWrite(gruen, HIGH);
  delay(${delay});
  digitalWrite(gelb, HIGH);
  delay(${delay});
  digitalWrite(rot, HIGH);
  delay(${delay});
  digitalWrite(blau, LOW);
  delay(${delay});
  digitalWrite(gruen, LOW);
  delay(${delay});
  digitalWrite(gelb, LOW);
  delay(${delay});
  digitalWrite(rot, LOW);
  delay(${delay});
`;
    return code;
  };

// LED-Fading
Blockly.Generator.Arduino.forBlock["sensebox_fluoroASM_led_fade"] = function (
  block,
  generator,
) {
  var maxBrightness =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "MAX_BRIGHTNESS",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "100";

  var code = `
  // Fade up
  for (int i = 0; i <= ${maxBrightness}; i++) {
    analogWrite(blau, i);
    analogWrite(gruen, i);
    analogWrite(gelb, i);
    analogWrite(rot, i);
  }
  
  // Fade down
  for (int i = ${maxBrightness}; i >= 0; i--) {
    analogWrite(blau, i);
    analogWrite(gruen, i);
    analogWrite(gelb, i);
    analogWrite(rot, i);
  }
`;
  return code;
};
