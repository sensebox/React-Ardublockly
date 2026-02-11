import * as Blockly from "blockly";
import store from "../../../store";

/**
 * AI Model Output Generator
 * Adds TensorFlow Lite libraries and uploaded cpp code
 */
Blockly.Generator.Arduino.forBlock["sensebox_teachable_output"] = function () {
  // Get uploaded model code from Redux store
  const aiModel = store.getState().general.aiModel;

  // Add TensorFlow Lite libraries
  Blockly.Generator.Arduino.libraries_["library_tensorflow_lite"] =
    "#include <TensorFlowLite.h>";
  Blockly.Generator.Arduino.libraries_["library_tflite_micro_ops"] =
    '#include "tensorflow/lite/micro/kernels/micro_ops.h"';
  Blockly.Generator.Arduino.libraries_["library_tflite_interpreter"] =
    '#include "tensorflow/lite/micro/micro_interpreter.h"';
  Blockly.Generator.Arduino.libraries_["library_tflite_op_resolver"] =
    '#include "tensorflow/lite/micro/micro_mutable_op_resolver.h"';
  Blockly.Generator.Arduino.libraries_["library_tflite_all_ops"] =
    '#include "tensorflow/lite/micro/all_ops_resolver.h"';
  Blockly.Generator.Arduino.libraries_["library_tflite_schema"] =
    '#include "tensorflow/lite/schema/schema_generated.h"';

  // Add uploaded cpp code to definitions (appears after libraries)
  if (aiModel.code) {
    // Extract just the model data portion (skip any existing includes in the cpp file)
    let modelCode = aiModel.code;

    // Remove any #include lines from the uploaded file to avoid duplicates
    modelCode = modelCode
      .split("\n")
      .filter((line) => !line.trim().startsWith("#include"))
      .join("\n");

    Blockly.Generator.Arduino.definitions_["ai_model_code"] =
      `// ========== AI Model Data (${aiModel.filename}) ==========\n${modelCode}`;
  }

  // For now, return a simple string output
  // This can be extended later to return actual prediction results
  const code = '"output"';
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};
