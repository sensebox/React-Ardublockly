import * as Blockly from "blockly";
import { getColour } from "../helpers/colour";
import * as Types from "../helpers/types";
import store from "../../../store";

/**
 * AI Model Output Block
 * Returns prediction output from uploaded TensorFlow Lite model
 */
Blockly.Blocks["sensebox_teachable_output"] = {
  init: function () {
    this.appendDummyInput().appendField(
      Blockly.Msg.sensebox_teachable_output || "AI Model Output",
    );
    this.setOutput(true, Types.TEXT.typeName);
    this.setColour(getColour().ai);
    this.setTooltip(
      Blockly.Msg.sensebox_teachable_output_tooltip ||
        "Get output from the uploaded AI model",
    );
    this.setHelpUrl("");

    // Check if model is uploaded
    const aiModel = store.getState().general.aiModel;
    if (!aiModel.code) {
      this.setWarningText(
        Blockly.Msg.ai_no_model_uploaded || "No model uploaded",
      );
    }
  },

  onchange: function () {
    // Update warning based on model availability
    const aiModel = store.getState().general.aiModel;
    if (!aiModel.code) {
      this.setWarningText(
        Blockly.Msg.ai_no_model_uploaded || "No model uploaded",
      );
    } else {
      this.setWarningText(null);
    }
  },
};
