import * as Blockly from "blockly";
import { getColour } from "../helpers/colour";
import * as Types from "../helpers/types";
import store from "../../../store";

/**
 * AI Model Class Check Block
 * Checks if the most likely class matches the selected class from the model
 */
Blockly.Blocks["sensebox_teachable_classify"] = {
  init: function () {
    // Get class labels from the uploaded model, fallback to placeholder
    const aiModel = store.getState().general.aiModel;
    let classLabels = Array.isArray(aiModel?.labels) ? aiModel.labels : [];
    if (!classLabels.length) {
      classLabels = ["class1", "class2"];
    }

    this.appendValueInput("image")
      .appendField(Blockly.Msg.sensebox_teachable_classify || "is")
      .setCheck(Types.IMAGE.typeName);

    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown(classLabels.map((label) => [label, label])),
        "CLASS_NAME",
      )
      .appendField("?");

    this.setOutput(true, Types.BOOLEAN.typeName);
    this.setColour(getColour().ai);
    this.setTooltip(
      Blockly.Msg.sensebox_teachable_classify_tooltip ||
        "Check if the most likely class matches the selected class.",
    );
    this.setHelpUrl("");

    if (!aiModel.code) {
      this.setWarningText(
        Blockly.Msg.ai_no_model_uploaded || "No model uploaded",
      );
    }

    // Subscribe to Redux store to react immediately when a new model is uploaded
    let prevLabels = classLabels;
    this._unsubscribeStore = store.subscribe(() => {
      const newAiModel = store.getState().general.aiModel;
      const newLabels = Array.isArray(newAiModel?.labels)
        ? newAiModel.labels
        : [];

      if (!newAiModel.code) {
        this.setWarningText(
          Blockly.Msg.ai_no_model_uploaded || "No model uploaded",
        );
      } else {
        this.setWarningText(null);
      }

      if (
        JSON.stringify(newLabels) !== JSON.stringify(prevLabels) &&
        newLabels.length
      ) {
        prevLabels = newLabels;
        const dropdown = this.getField("CLASS_NAME");
        if (dropdown) {
          dropdown.menuGenerator_ = newLabels.map((label) => [label, label]);
          dropdown.setValue(newLabels[0]);
        }
      }
    });
  },

  destroy: function () {
    if (this._unsubscribeStore) {
      this._unsubscribeStore();
    }
  },
};
