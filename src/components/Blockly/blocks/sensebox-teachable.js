import * as Blockly from "blockly";
import { getColour } from "../helpers/colour";
import * as Types from "../helpers/types";
import {
  getAiModelType,
  AI_MODEL_TYPE_CAMERA,
  AI_MODEL_TYPE_SPELL,
} from "../helpers/aiModel";
import store from "../../../store";

const svgIcon = (paths) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
      'stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      paths +
      "</svg>",
  );

const CAMERA_ICON = svgIcon(
  '<path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/>' +
    '<circle cx="12" cy="13" r="4"/>',
);

const SPELL_ICON = svgIcon(
  '<path d="M4 20L15 9"/><path d="M13 7l4 4"/>' +
    '<path d="M18 2v4M16 4h4M21 9v2M20 10h2M10 2v2M9 3h2"/>',
);

/**
 * Shared setup for the AI classification blocks. Camera and spell
 * classification are separate blocks (different inputs and generated code),
 * but look the same apart from the tag (icon + word).
 * @param {!Blockly.Block} block the block
 * @param {object} options modelType, icon, tag, inputCheck, tooltip
 */
const initClassifyBlock = (block, options) => {
  const getLabels = (aiModel) => {
    const labels =
      getAiModelType(aiModel?.code) === options.modelType &&
      Array.isArray(aiModel?.labels)
        ? aiModel.labels
        : [];
    return labels.length ? labels : ["class1", "class2"];
  };

  const aiModel = store.getState().general.aiModel;
  let prevLabels = getLabels(aiModel);

  block
    .appendValueInput(options.inputName)
    .appendField(Blockly.Msg.sensebox_teachable_classify || "is")
    .appendField(new Blockly.FieldImage(options.icon, 16, 16, options.tag))
    .setCheck(options.inputCheck);

  block
    .appendDummyInput()
    .appendField(
      new Blockly.FieldDropdown(prevLabels.map((label) => [label, label])),
      "CLASS_NAME",
    )
    .appendField("?");

  block.setOutput(true, Types.BOOLEAN.typeName);
  block.setColour(getColour().ai);
  block.setTooltip(options.tooltip);
  block.setHelpUrl("");

  const updateWarning = (model) => {
    const modelType = getAiModelType(model?.code);
    if (!modelType) {
      block.setWarningText(
        Blockly.Msg.ai_no_model_uploaded || "No model uploaded",
      );
    } else if (modelType !== options.modelType) {
      block.setWarningText(
        modelType === AI_MODEL_TYPE_SPELL
          ? Blockly.Msg.sensebox_teachable_model_is_spell
          : Blockly.Msg.sensebox_teachable_model_is_camera,
      );
    } else {
      block.setWarningText(null);
    }
  };
  updateWarning(aiModel);

  // React immediately when a new model is uploaded
  block._unsubscribeStore = store.subscribe(() => {
    const newAiModel = store.getState().general.aiModel;
    updateWarning(newAiModel);

    // only take over the labels of a model of the same type
    if (getAiModelType(newAiModel?.code) !== options.modelType) return;
    const newLabels = getLabels(newAiModel);
    if (JSON.stringify(newLabels) !== JSON.stringify(prevLabels)) {
      prevLabels = newLabels;
      const dropdown = block.getField("CLASS_NAME");
      if (dropdown) {
        dropdown.menuGenerator_ = newLabels.map((label) => [label, label]);
        dropdown.setValue(newLabels[0]);
      }
    }
  });
};

/**
 * AI Model Class Check Block (camera image)
 * Checks if the most likely class matches the selected class from the model
 */
Blockly.Blocks["sensebox_teachable_classify"] = {
  init: function () {
    initClassifyBlock(this, {
      modelType: AI_MODEL_TYPE_CAMERA,
      icon: CAMERA_ICON,
      tag: Blockly.Msg.sensebox_teachable_tag_camera || "camera",
      inputName: "image",
      inputCheck: Types.CAMERA_IMAGE.typeName,
      tooltip:
        Blockly.Msg.sensebox_teachable_classify_tooltip ||
        "Check if the most likely class matches the selected class.",
    });
  },

  destroy: function () {
    if (this._unsubscribeStore) {
      this._unsubscribeStore();
    }
  },
};

/**
 * AI Model Class Check Block (spell drawn with the MCU-Eye)
 * Checks if the most likely class of the last finished spell matches the
 * selected class from the model
 */
Blockly.Blocks["sensebox_teachable_classify_spell"] = {
  init: function () {
    initClassifyBlock(this, {
      modelType: AI_MODEL_TYPE_SPELL,
      icon: SPELL_ICON,
      tag: Blockly.Msg.sensebox_teachable_tag_spell || "spell",
      inputName: "spell",
      inputCheck: Types.SPELL_IMAGE.typeName,
      tooltip:
        Blockly.Msg.sensebox_teachable_classify_spell_tooltip ||
        "Check if the most likely class of the last spell matches the selected class.",
    });
  },

  destroy: function () {
    if (this._unsubscribeStore) {
      this._unsubscribeStore();
    }
  },
};
