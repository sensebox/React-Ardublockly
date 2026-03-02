import * as Blockly from 'blockly/core';

// Setup Teachable Machine generator
Blockly.Generator.Arduino.forBlock['sensebox_teachable_machine_setup'] = function() {
  const modelName = this.getFieldValue('MODEL_NAME');
  
  const code = `
// Setup Teachable Machine Model: ${modelName}
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <esp32cam.h>

// Teachable Machine model configuration
String modelName = "${modelName}";
String modelUrl = ""; // Will be set from localStorage

void setupTeachableMachine() {
  // Initialize camera
  static auto loRes = esp32cam::Resolution::find(320, 240);
  esp32cam::Config cfg;
  cfg.setPins(esp32cam::pins::AiThinker);
  cfg.setResolution(loRes);
  cfg.setBufferCount(2);
  cfg.setJpeg(80);
  
  bool ok = esp32cam::Camera.begin(cfg);
  if (!ok) {
    Serial.println("Failed to initialize camera");
    return;
  }
  
  Serial.println("Teachable Machine model '${modelName}' initialized");
}

`;
  
  return code;
};

// Make Prediction generator
Blockly.Generator.Arduino.forBlock['sensebox_teachable_machine_predict'] = function() {
  const modelName = this.getFieldValue('MODEL_NAME');
  const input = Blockly.Generator.Arduino.valueToCode(this, 'INPUT', Blockly.Generator.Arduino.ORDER_ATOMIC);
  
  const code = `makePrediction("${modelName}", ${input})`;
  
  return [code, Blockly.Generator.Arduino.ORDER_FUNCTION_CALL];
};

// Get Confidence generator
Blockly.Generator.Arduino.forBlock['sensebox_teachable_machine_confidence'] = function() {
  const modelName = this.getFieldValue('MODEL_NAME');
  const className = this.getFieldValue('CLASS_NAME');
  const input = Blockly.Generator.Arduino.valueToCode(this, 'INPUT', Blockly.Generator.Arduino.ORDER_ATOMIC);
  
  const code = `getConfidence("${modelName}", "${className}", ${input})`;
  
  return [code, Blockly.Generator.Arduino.ORDER_FUNCTION_CALL];
};

// Camera Capture generator
Blockly.Generator.Arduino.forBlock['sensebox_camera_capture'] = function() {
  const code = `captureImage()`;
  
  return [code, Blockly.Generator.Arduino.ORDER_FUNCTION_CALL];
};