import * as Blockly from 'blockly/core';
import { getColour } from '../helpers/colour';

// Setup Teachable Machine block
Blockly.Blocks['sensebox_teachable_machine_setup'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('Setup Teachable Machine')
      .appendField('model')
      .appendField(new Blockly.FieldTextInput('my-model'), 'MODEL_NAME');
    this.setNextStatement(true, null);
    this.setColour(getColour().sensebox);
    this.setTooltip('Initialize a Teachable Machine model for predictions');
    this.setHelpUrl('');
  }
};

// Make Prediction block
Blockly.Blocks['sensebox_teachable_machine_predict'] = {
  init: function() {
    this.appendValueInput('INPUT')
      .setCheck(null)
      .appendField('Predict with')
      .appendField(new Blockly.FieldTextInput('my-model'), 'MODEL_NAME')
      .appendField('using');
    this.setOutput(true, 'String');
    this.setColour(getColour().sensebox);
    this.setTooltip('Make a prediction using the Teachable Machine model');
    this.setHelpUrl('');
  }
};

// Get Confidence block
Blockly.Blocks['sensebox_teachable_machine_confidence'] = {
  init: function() {
    this.appendValueInput('INPUT')
      .setCheck(null)
      .appendField('Get confidence for')
      .appendField(new Blockly.FieldTextInput('my-model'), 'MODEL_NAME')
      .appendField('class')
      .appendField(new Blockly.FieldTextInput('class-name'), 'CLASS_NAME')
      .appendField('using');
    this.setOutput(true, 'Number');
    this.setColour(getColour().sensebox);
    this.setTooltip('Get the confidence score for a specific class prediction');
    this.setHelpUrl('');
  }
};

// Camera Capture block (for use with teachable machine)
Blockly.Blocks['sensebox_camera_capture'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('Capture camera image');
    this.setOutput(true, null);
    this.setColour(getColour().sensebox);
    this.setTooltip('Capture an image from the camera for machine learning prediction');
    this.setHelpUrl('');
  }
};