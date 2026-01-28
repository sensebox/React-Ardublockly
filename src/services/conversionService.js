/**
 * ConversionService
 *
 * Service for converting TensorFlow.js models to TFLite format with C/C++ byte array generation
 * and compiling models to Arduino binaries.
 * Handles model serialization, API communication, progress tracking, and error handling.
 */

import * as tf from "@tensorflow/tfjs";
import axios from "axios";

/**
 * Error types for conversion failures
 */
export const ConversionErrorType = {
  NETWORK: "NETWORK",
  CONVERSION: "CONVERSION_ERROR",
  UNSUPPORTED_OPS: "UNSUPPORTED_OPS",
  SIZE_LIMIT: "SIZE_LIMIT",
  VALIDATION: "VALIDATION_ERROR",
  SERIALIZATION: "SERIALIZATION_ERROR",
  UNKNOWN: "UNKNOWN",
};

/**
 * Conversion stages for progress tracking
 */
export const ConversionStage = {
  SERIALIZING: "serializing",
  UPLOADING: "uploading",
  CONVERTING: "converting",
  GENERATING: "generating",
  COMPILING: "compiling",
  COMPLETE: "complete",
};

/**
 * Default conversion options
 */
const DEFAULT_OPTIONS = {
  quantize: true,
  quantizationType: "int8", // int8 (recommended for microcontrollers), float16, or dynamic
  optimize: true,
  arrayName: "g_person_detect_model_data",
  includeMetadata: true,
};

/**
 * API configuration
 */
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000";
const API_ENDPOINT = `${API_BASE_URL}/api/convert-to-tflite`;
const COMPILE_ENDPOINT = `${API_BASE_URL}/api/compile-model`;
const REQUEST_TIMEOUT = 60000; // 60 seconds
const COMPILE_TIMEOUT = 120000; // 120 seconds for compilation

/**
 * ConversionService class
 *
 * Provides methods for converting TensorFlow.js models to TFLite format
 * and generating C/C++ byte array representations.
 */
class ConversionService {
  /**
   * Converts a TensorFlow.js model to TFLite C array format
   *
   * @param {tf.LayersModel} model - The trained TensorFlow.js model
   * @param {Object} options - Conversion options
   * @param {boolean} options.quantize - Apply post-training quantization (default: true)
   * @param {string} options.quantizationType - Quantization type: 'int8' (recommended), 'float16', or 'dynamic' (default: 'int8')
   * @param {boolean} options.optimize - Apply optimization (default: true)
   * @param {string} options.arrayName - Name for the C array variable (default: 'g_person_detect_model_data')
   * @param {boolean} options.includeMetadata - Include metadata comments (default: true)
   * @param {Array} options.representativeDataset - Array of sample data for int8 quantization (default: null)
   * @param {Array<string>} options.classLabels - Array of class label names (default: [])
   * @param {Function} onProgress - Progress callback function(stage, progress)
   * @returns {Promise<ConversionResult>} Conversion result with C++ code or error
   */
  async convertToTFLite(model, options = {}, onProgress = null) {
    // Validate model
    if (!model || typeof model.save !== "function") {
      return {
        success: false,
        error: {
          message: "Invalid model",
          details: "Model must be a valid TensorFlow.js LayersModel",
          type: ConversionErrorType.VALIDATION,
          suggestions: ["Ensure the model is trained and valid"],
          retryable: false,
        },
      };
    }

    // Merge options with defaults
    const conversionOptions = { ...DEFAULT_OPTIONS, ...options };

    try {
      // Stage 1: Serialize model
      this._reportProgress(onProgress, ConversionStage.SERIALIZING, 0);

      const serializedModel = await this.serializeModel(
        model,
        conversionOptions.classLabels || [],
        conversionOptions.inputShape || null,
      );

      this._reportProgress(onProgress, ConversionStage.SERIALIZING, 100);

      // Stage 2: Upload and convert
      this._reportProgress(onProgress, ConversionStage.UPLOADING, 0);

      const result = await this._callConversionAPI(
        serializedModel,
        conversionOptions,
        onProgress,
      );

      // Stage 3: Complete
      this._reportProgress(onProgress, ConversionStage.COMPLETE, 100);

      return result;
    } catch (error) {
      // Handle different error types
      if (error.response) {
        // API returned an error response
        const errorData = error.response.data;
        return {
          success: false,
          error: errorData.error || {
            message: "Conversion failed",
            details: error.message,
            type: ConversionErrorType.CONVERSION,
            suggestions: ["Try again or contact support"],
            retryable: true,
          },
        };
      } else if (error.request) {
        // Network error - request made but no response
        return {
          success: false,
          error: {
            message: "Network error",
            details: "Unable to reach the conversion service",
            type: ConversionErrorType.NETWORK,
            suggestions: [
              "Check your internet connection",
              "Verify the backend service is running",
              "Try again in a moment",
            ],
            retryable: true,
          },
        };
      } else if (error.type === ConversionErrorType.SERIALIZATION) {
        // Serialization error
        return {
          success: false,
          error: error,
        };
      } else {
        // Unknown error
        return {
          success: false,
          error: {
            message: "Unexpected error",
            details: error.message || "An unknown error occurred",
            type: ConversionErrorType.UNKNOWN,
            suggestions: ["Try again or contact support"],
            retryable: true,
          },
        };
      }
    }
  }

  /**
   * Serializes a TensorFlow.js model to a transferable format
   *
   * @param {tf.LayersModel} model - The model to serialize
   * @param {Array<string>} classLabels - Optional array of class label names
   * @param {Array<number>} desiredInputShape - Optional desired input shape for the model (e.g., [96, 96, 1])
   * @returns {Promise<Object>} Serialized model data with base64-encoded files
   */
  async serializeModel(model, classLabels = [], desiredInputShape = null) {
    try {
      console.log(
        "[ConversionService] Serializing model with class labels:",
        classLabels,
      );

      // Create a custom IOHandler to capture model artifacts
      let capturedArtifacts = null;

      const customHandler = {
        save: async (artifacts) => {
          capturedArtifacts = artifacts;
          return {
            modelArtifactsInfo: {
              dateSaved: new Date(),
              modelTopologyType: "JSON",
            },
          };
        },
      };

      // Save model using custom handler to capture artifacts
      await model.save(customHandler);

      if (!capturedArtifacts) {
        throw new Error("Failed to capture model artifacts");
      }

      // Convert model topology to base64
      const modelJsonStr = JSON.stringify(capturedArtifacts.modelTopology);
      const modelJsonBase64 = btoa(modelJsonStr);

      // Convert weight data to base64
      const weightsData = [];
      if (capturedArtifacts.weightData) {
        const weightArray = new Uint8Array(capturedArtifacts.weightData);
        const weightBinary = Array.from(weightArray)
          .map((byte) => String.fromCharCode(byte))
          .join("");
        weightsData.push(btoa(weightBinary));
      }

      return {
        modelData: modelJsonBase64,
        weightsData: weightsData,
        modelMetadata: {
          inputShape:
            capturedArtifacts.modelTopology?.config?.layers?.[0]?.config
              ?.batch_input_shape || [],
          outputShape:
            capturedArtifacts.modelTopology?.config?.layers?.[
              capturedArtifacts.modelTopology?.config?.layers?.length - 1
            ]?.config?.units || [],
          classes: classLabels || [],
          desiredInputShape: desiredInputShape, // Store the desired input shape if provided
        },
      };
    } catch (error) {
      throw {
        message: "Failed to serialize model",
        details: error.message || "Could not serialize model data",
        type: ConversionErrorType.SERIALIZATION,
        suggestions: [
          "Ensure the model is properly trained",
          "Check if the model is a valid TensorFlow.js LayersModel",
          "Try retraining the model",
        ],
        retryable: true,
      };
    }
  }

  /**
   * Calls the backend conversion API
   *
   * @private
   * @param {Object} serializedModel - Serialized model data
   * @param {Object} options - Conversion options
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<ConversionResult>} API response
   */
  async _callConversionAPI(serializedModel, options, onProgress) {
    this._reportProgress(onProgress, ConversionStage.UPLOADING, 50);
    console.log("[ConversionService] Conversion options:", options);
    console.log(
      "[ConversionService] Serialized model metadata:",
      serializedModel.modelMetadata,
    );
    console.log(
      "[ConversionService] Class labels in request:",
      serializedModel.modelMetadata?.classes,
    );

    // Prepare representative dataset if provided
    let representativeDataset = null;
    if (
      options.representativeDataset &&
      options.representativeDataset.length > 0
    ) {
      // Convert tensors or image data to base64-encoded float32 arrays
      representativeDataset = await this._prepareRepresentativeDataset(
        options.representativeDataset,
      );
    }

    try {
      const response = await axios.post(
        API_ENDPOINT,
        {
          ...serializedModel,
          representativeDataset: representativeDataset,
          options: options,
        },
        {
          timeout: REQUEST_TIMEOUT,
          headers: {
            "Content-Type": "application/json",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentComplete = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              this._reportProgress(
                onProgress,
                ConversionStage.UPLOADING,
                percentComplete,
              );
            }
          },
        },
      );

      this._reportProgress(onProgress, ConversionStage.CONVERTING, 50);
      this._reportProgress(onProgress, ConversionStage.GENERATING, 100);

      console.log("Conversion API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Conversion API error:", error);
      throw error;
    }
  }

  /**
   * Prepares representative dataset for transmission to backend
   *
   * @private
   * @param {Array} dataset - Array of tensors or image URLs
   * @returns {Promise<Array<string>>} Array of base64-encoded float32 arrays
   */
  async _prepareRepresentativeDataset(dataset) {
    const encodedSamples = [];

    for (const sample of dataset) {
      let tensor;

      // Handle different input types
      if (sample instanceof tf.Tensor) {
        tensor = sample;
      } else if (typeof sample === "string") {
        // Assume it's an image URL
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = sample;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        // Convert to 96x96 grayscale (single channel) as expected by the model
        // IMPORTANT: Must match the preprocessing used during training!
        tensor = tf.tidy(() => {
          const rgb = tf.browser.fromPixels(img);
          // Convert RGB to grayscale using luminance formula
          const grayscale = rgb.mean(2, true); // Average across color channels
          // Normalize to [0, 1] range - MUST MATCH training preprocessing exactly!
          // Training uses: pixel / 255.0
          return grayscale
            .resizeBilinear([96, 96])
            .div(255.0) // Normalize to [0, 1]
            .expandDims(0); // Add batch dimension
        });
      } else {
        console.warn("Unsupported sample type in representative dataset");
        continue;
      }

      // Convert tensor to float32 array
      const dataArray = await tensor.data();
      const float32Array = new Float32Array(dataArray);

      // Encode as base64
      const buffer = new Uint8Array(float32Array.buffer);
      const binary = Array.from(buffer)
        .map((byte) => String.fromCharCode(byte))
        .join("");
      const base64 = btoa(binary);

      encodedSamples.push(base64);

      // Clean up tensor if we created it
      if (!(sample instanceof tf.Tensor)) {
        tensor.dispose();
      }
    }

    return encodedSamples;
  }

  /**
   * Reports progress to callback function
   *
   * @private
   * @param {Function} callback - Progress callback
   * @param {string} stage - Current conversion stage
   * @param {number} progress - Progress percentage (0-100)
   */
  _reportProgress(callback, stage, progress) {
    if (typeof callback === "function") {
      callback(stage, progress);
    }
  }

  /**
   * Compiles a TFLite model to Arduino binary
   *
   * @param {Object} modelData - Converted TFLite model data (from convertToTFLite)
   * @param {Object} options - Compilation options
   * @param {string} options.boardType - Target board type (default: 'arduino:avr:uno')
   * @param {string} options.optimization - Optimization level (default: 'default')
   * @param {Array<string>} options.classLabels - Array of class label names (default: [])
   * @param {Function} onProgress - Progress callback function(stage, progress)
   * @returns {Promise<CompilationResult>} Compilation result with binary data or error
   */
  async compileModel(modelData, options = {}, onProgress = null) {
    // Validate model data
    if (!modelData || !modelData.modelByteArray) {
      return {
        success: false,
        error: {
          message: "Invalid model data",
          details: "Model must be converted to TFLite format first",
          type: ConversionErrorType.VALIDATION,
          suggestions: [
            "Convert the model to TFLite format before compilation",
          ],
          retryable: false,
        },
      };
    }

    // Set default compilation options
    const compilationOptions = {
      boardType: options.boardType || "arduino:avr:uno",
      optimization: options.optimization || "default",
    };

    try {
      // Stage 1: Start compilation
      this._reportProgress(onProgress, ConversionStage.COMPILING, 0);

      const result = await this._callCompilationAPI(
        modelData,
        compilationOptions,
        onProgress,
      );

      // Stage 2: Complete
      this._reportProgress(onProgress, ConversionStage.COMPLETE, 100);

      return result;
    } catch (error) {
      // Handle different error types
      if (error.response) {
        // API returned an error response
        const errorData = error.response.data;
        return {
          success: false,
          error: errorData.error || {
            message: "Compilation failed",
            details: error.message,
            type: ConversionErrorType.CONVERSION,
            suggestions: [
              "Check compilation options",
              "Try again or contact support",
            ],
            retryable: true,
          },
        };
      } else if (error.request) {
        // Network error - request made but no response
        return {
          success: false,
          error: {
            message: "Network error",
            details: "Unable to reach the compilation service",
            type: ConversionErrorType.NETWORK,
            suggestions: [
              "Check your internet connection",
              "Verify the backend service is running",
              "Try again in a moment",
            ],
            retryable: true,
          },
        };
      } else {
        // Unknown error
        return {
          success: false,
          error: {
            message: "Unexpected error",
            details: error.message || "An unknown error occurred",
            type: ConversionErrorType.UNKNOWN,
            suggestions: ["Try again or contact support"],
            retryable: true,
          },
        };
      }
    }
  }

  /**
   * Calls the backend compilation API
   *
   * @private
   * @param {Object} modelData - Converted model data
   * @param {Object} options - Compilation options
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<CompilationResult>} API response
   */
  async _callCompilationAPI(modelData, options, onProgress) {
    this._reportProgress(onProgress, ConversionStage.COMPILING, 25);

    console.log("[ConversionService] Compilation options:", options);
    console.log(
      "[ConversionService] Class labels being sent to compile:",
      options.classLabels,
    );

    try {
      // Convert byte array to base64 if needed
      let modelDataBase64;
      if (Array.isArray(modelData.modelByteArray)) {
        // Convert array of bytes to base64 string
        const byteArray = new Uint8Array(modelData.modelByteArray);
        const binaryString = Array.from(byteArray)
          .map((byte) => String.fromCharCode(byte))
          .join("");
        modelDataBase64 = btoa(binaryString);
      } else {
        // Already a string, use as-is
        modelDataBase64 = modelData.modelByteArray;
      }

      const response = await axios.post(
        COMPILE_ENDPOINT,
        {
          modelData: modelDataBase64,
          modelSize: modelData.modelSize,
          boardType: options.boardType,
          optimization: options.optimization,
          modelSettingsCode: modelData.modelSettingsCode || null, // Send pre-generated model settings
          modelMetadata: {
            classes: options.classLabels || [],
          },
        },
        {
          timeout: COMPILE_TIMEOUT,
          headers: {
            "Content-Type": "application/json",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentComplete = Math.round(
                (progressEvent.loaded * 25) / progressEvent.total,
              );
              this._reportProgress(
                onProgress,
                ConversionStage.COMPILING,
                25 + percentComplete,
              );
            }
          },
        },
      );

      this._reportProgress(onProgress, ConversionStage.COMPILING, 100);

      console.log("Compilation API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Compilation API error:", error);
      throw error;
    }
  }

  /**
   * Downloads the compiled binary as a file
   *
   * @param {string} binaryData - Base64-encoded binary data
   * @param {string} filename - Optional filename (default: 'arduino_sketch_{timestamp}.bin')
   * @returns {boolean} True if download succeeded, false otherwise
   */
  downloadBinary(binaryData, filename = null) {
    if (!binaryData) {
      console.error("No binary data to download");
      return false;
    }

    try {
      // Decode base64 to binary
      const binaryString = atob(binaryData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create blob from binary data
      const blob = new Blob([bytes], { type: "application/octet-stream" });

      // Generate filename if not provided
      const downloadFilename = filename || `arduino_sketch_${Date.now()}.bin`;

      // Create download link and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Failed to download binary:", error);
      return false;
    }
  }
}

// Export singleton instance
export default new ConversionService();
