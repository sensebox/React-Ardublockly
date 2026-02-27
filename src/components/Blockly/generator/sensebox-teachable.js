import * as Blockly from "blockly";
import store from "../../../store";

/**
 * AI Model Output Generator
 * Adds TensorFlow Lite libraries and uploaded cpp code
 */
Blockly.Generator.Arduino.forBlock["sensebox_teachable_classify"] =
  function () {
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

    Blockly.Generator.Arduino.definitions_["ai_model_globals"] = `
    // Globals, used for compatibility with Arduino-style sketches.
namespace {
  const tflite::Model* model = nullptr;
  tflite::MicroInterpreter* interpreter = nullptr;
  TfLiteTensor* model_input = nullptr;
  int input_length;

  // Create an area of memory to use for input, output, and intermediate arrays.
  // The size of this will depend on the model you're using, and may need to be
  // determined by experimentation.
  constexpr int kTensorArenaSize = 136 * 1024 ;
  uint8_t tensor_arena[kTensorArenaSize];
}
float confidenceToFloat(int8_t score) {
  // Map from range [-127, 128] to [0, 1]
  return (score + 127.0) / 255.0;
}
void feedImageToModel(camera_fb_t* fb, int8_t* model_input_data) {
  const int image_width = fb->width;
  const int image_height = fb->height;
  const int channels = 1;  // Grayscale
  uint8_t* src = fb->buf;
  int image_size = image_width * image_height * channels;
  for (int i = 0; i < image_size; i++) {
    int16_t val = static_cast<int16_t>(src[i]) - 128;  // signed offset
    if (val > 127) val = 127;
    if (val < -128) val = -128;
    model_input_data[i] = static_cast<int8_t>(val);
  }
}  
`;

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

    Blockly.Generator.Arduino.setupCode_["teachable_model_setup"] =
      `// Map the model into a usable data structure. This doesn't involve any
  // copying or parsing, it's a very lightweight operation.
  model = tflite::GetModel(g_person_detect_model_data);
  if (model->version() != TFLITE_SCHEMA_VERSION) {
    Serial.printf("Model provided is schema version %d not equal "
                         "to supported version %d.",
                         model->version(), TFLITE_SCHEMA_VERSION);
    return;
  }

  // This imports all operations, which is more intensive, than just importing the ones we need.
  // If we ever run out of storage with a model, we can check here to free some space
  static tflite::AllOpsResolver resolver;

  // Build an interpreter to run the model with.
  static tflite::MicroInterpreter static_interpreter(
      model, resolver, tensor_arena, kTensorArenaSize);
  interpreter = &static_interpreter;

  // Allocate memory from the tensor_arena for the model's tensors.
  interpreter->AllocateTensors();
  // Obtain pointer to the model's input tensor.
  model_input = interpreter->input(0);

  Serial.printf("model_input->dims->size: %i \\n", model_input->dims->size);
  Serial.printf("model_input->dims->data[0]: %i \\n", model_input->dims->data[0]);
  Serial.printf("model_input->dims->data[1]: %i \\n", model_input->dims->data[1]);
  Serial.printf("model_input->dims->data[2]: %i \\n", model_input->dims->data[2]);
  Serial.printf("model_input->dims->data[3]: %i \\n", model_input->dims->data[3]);
  Serial.printf("model_input->type: %i \\n", model_input->type);
  if ((model_input->dims->size != 4) || (model_input->dims->data[1] != 96) ||
      (model_input->dims->data[2] != 96) || 
      (model_input->type != kTfLiteInt8)) {
    Serial.println(model_input->dims->size);
    Serial.println(model_input->dims->data[1]);
    Serial.println(model_input->dims->data[2]);
    Serial.println(model_input->type);
    Serial.println("Bad input tensor parameters in model");
    return;
  }

  input_length = model_input->bytes;
  Serial.printf("input_length: %i \\n", input_length);`;

    Blockly.Generator.Arduino.codeFunctions_["sensebox_teachable_classify"] =
      `// Function to run inference on the input image and return the output
  String classifyImage(camera_fb_t* image_data) {
  float classPercentages[kCategoryCount];
  for (int i = 0; i < kCategoryCount; i++) {
    classPercentages[i] = -1;
  }
  
  camera_fb_t *fb = esp_camera_fb_get();
  feedImageToModel(fb, model_input->data.int8);
  // Run inference, and report any error.
  TfLiteStatus invoke_status = interpreter->Invoke();
  if (invoke_status == kTfLiteOk)
  {
      TfLiteTensor* output = interpreter->output(0);

      for (int i = 0; i < kCategoryCount; i++) {
        int8_t logit = output->data.int8[i];
        classPercentages[i] = confidenceToFloat(logit);
      }
  }
  
  // Find the class with the highest percentage
  String result;
  if (invoke_status != kTfLiteOk) {
    result = "Error: Inference failed";
  } else {
    int maxIndex = 0;
    for (int i = 1; i < kCategoryCount; i++) {
      if (classPercentages[i] > classPercentages[maxIndex]) {
        maxIndex = i;
      }
    }
    result = kCategoryLabels[maxIndex];
  }
  
  esp_camera_fb_return(fb);
  return result;
  }`;

    // For now, return a simple string output
    // This can be extended later to return actual prediction results
    const code =
      "classifyImage(" +
      Blockly.Generator.Arduino.valueToCode(
        this,
        "image",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      ) +
      ")";
    return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
  };
