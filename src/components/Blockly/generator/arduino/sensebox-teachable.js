import * as Blockly from "blockly";
import store from "@/store";

/**
 * Adds the TensorFlow Lite libraries, the uploaded model code and the model
 * setup. Shared by the camera and the spell classification block.
 */
const addAiModel = () => {
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
`;

  // Add uploaded cpp code to definitions (appears after libraries)
  if (aiModel.code) {
    // Remove any #include lines from the uploaded file to avoid duplicates
    const modelCode = aiModel.code
      .split("\n")
      .filter((line) => !line.trim().startsWith("#include"))
      .join("\n");

    Blockly.Generator.Arduino.definitions_["ai_model_code"] =
      `// ========== AI Model Data (${aiModel.filename}) ==========\n${modelCode}`;
  }

  // Run inference on the prepared model input and return the most likely class
  Blockly.Generator.Arduino.codeFunctions_["ai_model_run"] =
    `String runAiModel() {
  // Run inference, and report any error.
  TfLiteStatus invoke_status = interpreter->Invoke();
  if (invoke_status != kTfLiteOk) {
    return "Error: Inference failed";
  }
  TfLiteTensor* output = interpreter->output(0);
  int maxIndex = 0;
  float maxPercentage = -1;
  for (int i = 0; i < kCategoryCount; i++) {
    float percentage = confidenceToFloat(output->data.int8[i]);
    if (percentage > maxPercentage) {
      maxPercentage = percentage;
      maxIndex = i;
    }
  }
  return kCategoryLabels[maxIndex];
}`;

  Blockly.Generator.Arduino.setupCode_["teachable_model_setup"] =
    `// Map the model into a usable data structure. This doesn't involve any
  // copying or parsing, it's a very lightweight operation.
  model = tflite::GetModel(g_person_detect_model_data);
  if (model->version() != TFLITE_SCHEMA_VERSION) {
    Serial.printf("Model provided is schema version %d not equal "
                         "to supported version %d.",
                         model->version(), TFLITE_SCHEMA_VERSION);
  } else {
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
    Serial.printf("model_input->dims->data[1]: %i \\n", model_input->dims->data[1]);
    Serial.printf("model_input->dims->data[2]: %i \\n", model_input->dims->data[2]);
    Serial.printf("model_input->type: %i \\n", model_input->type);
    if ((model_input->dims->size != 4) || (model_input->dims->data[1] != kNumRows) ||
        (model_input->dims->data[2] != kNumCols) ||
        (model_input->type != kTfLiteInt8)) {
      Serial.println("Bad input tensor parameters in model");
      model_input = nullptr;  // classification returns "" from now on
    } else {
      input_length = model_input->bytes;
      Serial.printf("input_length: %i \\n", input_length);
    }
  }`;
};

/**
 * AI Model Output Generator (camera image)
 */
Blockly.Generator.Arduino.forBlock["sensebox_teachable_classify"] =
  function () {
    const imageCode = Blockly.Generator.Arduino.valueToCode(
      this,
      "image",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    );
    // nothing connected: no image to classify
    if (!imageCode) {
      return ["false", Blockly.Generator.Arduino.ORDER_ATOMIC];
    }
    addAiModel();

    Blockly.Generator.Arduino.codeFunctions_["sensebox_teachable_classify"] =
      `// Function to run inference on the camera image and return the most likely class
String classifyImage(camera_fb_t* image_data) {
  if (!model_input || !image_data) {
    return "";
  }
  // Grayscale image, signed offset for the int8 model input
  const int image_size = image_data->width * image_data->height;
  if (image_size != input_length) {
    return "";
  }
  int8_t* model_input_data = model_input->data.int8;
  for (int i = 0; i < image_size; i++) {
    model_input_data[i] = static_cast<int8_t>(static_cast<int16_t>(image_data->buf[i]) - 128);
  }
  return runAiModel();
}`;

    // Check if the most likely class matches the selected class
    const selectedClass = this.getFieldValue("CLASS_NAME");
    const code = `(classifyImage(${imageCode}) == String("${selectedClass}"))`;
    return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
  };

/**
 * AI Model Output Generator (spell drawn with the MCU-Eye)
 * Based on tflite_wand_template.ino: the finished stroke is rendered into a
 * 32x32 RGB image with temporal colour encoding, like the Teachable Machine
 * (useSpellModelTraining.js):
 *   R = 255 at the start, fades to 0 at the end
 *   G = 128 throughout
 *   B = 0 at the start, rises to 255 at the end
 */
Blockly.Generator.Arduino.forBlock["sensebox_teachable_classify_spell"] =
  function () {
    const spellCode = Blockly.Generator.Arduino.valueToCode(
      this,
      "spell",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    );
    // nothing connected: no spell to classify
    if (!spellCode) {
      return ["false", Blockly.Generator.Arduino.ORDER_ATOMIC];
    }
    addAiModel();

    Blockly.Generator.Arduino.codeFunctions_[
      "sensebox_teachable_classify_spell"
    ] = `// Draws a 2 pixel wide line into an RGB image
void drawSpellModelLine(uint8_t* image, int size, int x0, int y0, int x1, int y1, uint8_t r, uint8_t g, uint8_t b) {
  const int dx = abs(x1 - x0);
  const int dy = abs(y1 - y0);
  const int sx = (x0 < x1) ? 1 : -1;
  const int sy = (y0 < y1) ? 1 : -1;
  int err = dx - dy;
  while (true) {
    const int px[3] = {x0, x0 + 1, x0};
    const int py[3] = {y0, y0, y0 + 1};
    for (int k = 0; k < 3; k++) {
      if (px[k] >= 0 && px[k] < size && py[k] >= 0 && py[k] < size) {
        uint8_t* pixel = &image[(py[k] * size + px[k]) * 3];
        pixel[0] = r;
        pixel[1] = g;
        pixel[2] = b;
      }
    }
    if (x0 == x1 && y0 == y1) break;
    const int e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

// Function to run inference on the last finished spell and return the most likely class
String classifySpell(SpellImage* spell_image) {
  static uint32_t classified_spell = 0;
  static String result = "";
  if (!model_input || !spell_image || spell_image->point_count < 2) {
    return "";
  }
  // Only classify each finished spell once
  if (spell_image->spell_count == classified_spell) {
    return result;
  }

  // Render the stroke with temporal colour encoding
  const int size = kNumCols;
  static uint8_t image[kNumCols * kNumRows * 3];
  memset(image, 0, sizeof(image));
  const int half = size / 2;
  const int n = spell_image->point_count;
  for (int i = 1; i < n; i++) {
    const float t = (n > 2) ? static_cast<float>(i - 1) / static_cast<float>(n - 2) : 0.0f;
    const uint8_t r = static_cast<uint8_t>(255.0f * (1.0f - t));
    const uint8_t b = static_cast<uint8_t>(255.0f * t);
    const int8_t* prev = &spell_image->points[(i - 1) * 2];
    const int8_t* curr = &spell_image->points[i * 2];
    drawSpellModelLine(image, size,
                       static_cast<int>(half + (prev[0] / 128.0f) * half),
                       static_cast<int>(half - (prev[1] / 128.0f) * half),
                       static_cast<int>(half + (curr[0] / 128.0f) * half),
                       static_cast<int>(half - (curr[1] / 128.0f) * half),
                       r, 128, b);
  }

  // Convert to the int8 model input (RGB, or grayscale for 1-channel models)
  int8_t* model_input_data = model_input->data.int8;
  const int pixels = kNumCols * kNumRows;
  if (input_length == pixels * 3) {
    for (int i = 0; i < pixels * 3; i++) {
      model_input_data[i] = static_cast<int8_t>(static_cast<int16_t>(image[i]) - 128);
    }
  } else if (input_length == pixels) {
    for (int i = 0; i < pixels; i++) {
      const int gray = (image[i * 3] + image[i * 3 + 1] + image[i * 3 + 2]) / 3;
      model_input_data[i] = static_cast<int8_t>(gray - 128);
    }
  } else {
    return "";
  }

  result = runAiModel();
  classified_spell = spell_image->spell_count;
  return result;
}`;

    // Check if the most likely class of the last spell matches the selected class
    const selectedClass = this.getFieldValue("CLASS_NAME");
    const code = `(classifySpell(${spellCode}) == String("${selectedClass}"))`;
    return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
  };
