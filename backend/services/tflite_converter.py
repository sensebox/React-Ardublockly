"""
TensorFlow Lite Conversion Service

This module provides functions to convert TensorFlow.js models to TFLite format
and generate C/C++ byte array representations for microcontroller deployment.
"""

import os
import tempfile
import shutil
from datetime import datetime
from typing import Optional, Tuple
import tensorflow as tf
import tensorflowjs as tfjs


def convert_tfjs_to_tflite(
    model_path: str,
    output_path: str,
    quantize: bool = True,
    quantization_type: str = "int8",
    representative_dataset: Optional[list] = None
) -> str:
    """
    Convert TensorFlow.js model to TFLite format.
    
    Args:
        model_path: Path to model.json file
        output_path: Path for output .tflite file
        quantize: Apply post-training quantization
        quantization_type: "int8", "float16", or "dynamic"
        representative_dataset: Sample data for int8 quantization (required for int8)
    
    Returns:
        Path to converted .tflite file
    """
    if not os.path.exists(model_path):
        raise ValueError(f"Model path does not exist: {model_path}")
    
    # Get the directory containing model.json
    model_dir = os.path.dirname(model_path)
    
    try:
        # Step 1: Load TensorFlow.js model as Keras model
        # The tfjs.converters.load_keras_model expects the path to model.json
        keras_model = tfjs.converters.load_keras_model(model_path)
        
        # Step 2: Convert Keras model to TFLite
        converter = tf.lite.TFLiteConverter.from_keras_model(keras_model)
        
        # Step 3: Apply optimizations if quantization is enabled
        if quantize:
            converter.optimizations = [tf.lite.Optimize.DEFAULT]
            
            if quantization_type == "int8":
                # Validate representative dataset is provided
                if not representative_dataset or len(representative_dataset) == 0:
                    raise ValueError(
                        "For full integer quantization, a `representative_dataset` must be specified. "
                        "Please provide sample input data for calibration."
                    )
                
                # Full integer quantization - most efficient for microcontrollers
                # This quantizes both weights and activations to int8
                # converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
                converter.inference_input_type = tf.int8
                converter.inference_output_type = tf.int8
                
                # Infer input shape from the model
                input_shape = keras_model.input_shape
                
                # Create representative dataset generator
                def representative_dataset_gen():
                    """Generator function for representative dataset calibration."""
                    import numpy as np
                    for sample in representative_dataset:
                        # Sample is a flat list of floats representing 96x96x1 grayscale image
                        sample_array = np.array(sample, dtype=np.float32)
                        
                        # Expected shape: (1, 96, 96, 1) for grayscale images
                        if len(sample_array.shape) == 1:
                            # Flat array - reshape to (1, 96, 96, 1)
                            try:
                                sample_array = sample_array.reshape(1, 96, 96, 1)
                            except ValueError as e:
                                raise ValueError(f"Error reshaping sample: {e}. Sample size: {sample_array.size}, expected: {1*96*96*1}")
                        elif len(sample_array.shape) == 3:
                            # Add batch dimension
                            sample_array = np.expand_dims(sample_array, 0)
                        
                        yield [sample_array]
                
                converter.representative_dataset = representative_dataset_gen
                
            elif quantization_type == "float16":
                # Float16 weight quantization
                converter.target_spec.supported_types = [tf.float16]
                
            elif quantization_type == "dynamic":
                # Dynamic range quantization (default behavior with Optimize.DEFAULT)
                # Weights are quantized to int8, activations stay float
                pass
        
        # Step 4: Convert the model
        tflite_model = converter.convert()
        
        # Step 5: Save to output path
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'wb') as f:
            f.write(tflite_model)
        
        return output_path
        
    except Exception as e:
        raise RuntimeError(f"TFLite conversion failed: {str(e)}") from e


def tflite_to_c_array(
    tflite_path: str,
    array_name: str = "g_person_detect_model_data",
    include_metadata: bool = True
) -> str:
    """
    Convert TFLite binary to C/C++ byte array representation.
    
    Args:
        tflite_path: Path to .tflite file
        array_name: Name for the C array variable
        include_metadata: Include metadata comments
    
    Returns:
        Formatted C/C++ code string with byte array and size constant
    """
    if not os.path.exists(tflite_path):
        raise ValueError(f"TFLite file does not exist: {tflite_path}")
    
    try:
        # Read TFLite binary file
        with open(tflite_path, 'rb') as f:
            tflite_data = f.read()
        
        model_size = len(tflite_data)
        
        if len(tflite_data) < 4:
            raise RuntimeError("Invalid TFLite file: too small")
        
        # Generate C/C++ code
        lines = []
        
        # Add metadata comments if requested
        if include_metadata:
            timestamp = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
            lines.extend([
                "// TensorFlow Lite Micro Model",
                f"// Generated: {timestamp}",
                "// Original Format: TensorFlow.js",
                f"// Model Size: {model_size:,} bytes",
                "// Quantized: Yes",
                ""
            ])
        
        # Add header guard
        header_guard = f"{array_name.upper()}_H"
        lines.extend([
            f"#ifndef {header_guard}",
            f"#define {header_guard}",
            ""
        ])
        
        # Add array declaration with proper alignment
        lines.append(f"// Keep model aligned to 8 bytes to guarantee aligned 64-bit accesses.")
        lines.append(f"alignas(8) const unsigned char {array_name}[] = {{")
        
        # Format bytes: 12 bytes per line in hexadecimal
        bytes_per_line = 12
        for i in range(0, model_size, bytes_per_line):
            chunk = tflite_data[i:i + bytes_per_line]
            hex_values = ', '.join(f'0x{byte:02x}' for byte in chunk)
            
            # Add comma at end if not last line
            if i + bytes_per_line < model_size:
                hex_values += ','
            
            lines.append(f"  {hex_values}")
        
        lines.append("};")
        lines.append("")
        
        # Add size constant
        lines.append("// Model size in bytes")
        lines.append(f"const int {array_name}_len = {model_size};")
        lines.append("")
        
        # Close header guard
        lines.append(f"#endif  // {header_guard}")
        
        # Join all lines with newlines
        return '\n'.join(lines)
        
    except Exception as e:
        raise RuntimeError(f"C array generation failed: {str(e)}") from e


def get_model_info(tflite_path: str) -> dict:
    """
    Extracts metadata information from a TFLite model.
    
    Args:
        tflite_path: Path to .tflite file
        
    Returns:
        Dictionary containing model metadata (input_shape, output_shape, etc.)
    """
    if not os.path.exists(tflite_path):
        raise ValueError(f"TFLite file does not exist: {tflite_path}")
    
    try:
        # Load the TFLite model
        interpreter = tf.lite.Interpreter(model_path=tflite_path)
        interpreter.allocate_tensors()
        
        # Get input and output details
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()
        
        input_shape = input_details[0]['shape'].tolist()
        output_shape = output_details[0]['shape'].tolist()
        
        # Extract dimensions
        # Assuming input shape is [batch, height, width, channels]
        num_rows = input_shape[1] if len(input_shape) > 1 else 1
        num_cols = input_shape[2] if len(input_shape) > 2 else 1
        num_channels = input_shape[3] if len(input_shape) > 3 else 1
        
        # Number of categories from output shape
        # Output shape is typically [batch, num_classes]
        category_count = output_shape[1] if len(output_shape) > 1 else output_shape[0]
        
        return {
            'input_shape': input_shape,
            'output_shape': output_shape,
            'input_dtype': str(input_details[0]['dtype']),
            'output_dtype': str(output_details[0]['dtype']),
            'model_size': os.path.getsize(tflite_path),
            'num_rows': num_rows,
            'num_cols': num_cols,
            'num_channels': num_channels,
            'category_count': category_count,
            'max_image_size': num_rows * num_cols * num_channels
        }
        
    except Exception as e:
        raise RuntimeError(f"Failed to extract model info: {str(e)}") from e


def generate_model_settings(model_metadata: dict, class_labels: Optional[list] = None) -> str:
    """
    Generate model_settings code based on model metadata.
    
    Args:
        model_metadata: Dictionary containing model metadata from get_model_info()
        class_labels: Optional list of class label names. If not provided,
                      generates generic labels like "class_0", "class_1", etc.
    
    Returns:
        str: C++ code for model settings
    """
    num_cols = model_metadata.get('num_cols', 96)
    num_rows = model_metadata.get('num_rows', 96)
    num_channels = model_metadata.get('num_channels', 1)
    category_count = model_metadata.get('category_count', 3)
    max_image_size = model_metadata.get('max_image_size', num_cols * num_rows * num_channels)
    
    # Generate class labels if not provided
    if not class_labels or len(class_labels) == 0:
        class_labels = [f'class_{i}' for i in range(category_count)]
    else:
        # Ensure we have the right number of labels
        if len(class_labels) < category_count:
            class_labels = list(class_labels) + [f'class_{i}' for i in range(len(class_labels), category_count)]
        elif len(class_labels) > category_count:
            class_labels = class_labels[:category_count]
        # Remove any existing quotes from labels
        class_labels = [label.strip('"').strip("'") for label in class_labels]
    
    # Format labels with quotes for C++ string array
    labels_str = ','.join([f'"{label}"' for label in class_labels])
    
    settings_code = f"""// ******************** model_settings.h ********************
// Keeping these as constant expressions allow us to allocate fixed-sized arrays
// on the stack for our working memory.

// All of these values are derived from the values used during model training,
// if you change your model you'll need to update these constants.
constexpr int kNumCols = {num_cols};
constexpr int kNumRows = {num_rows};
constexpr int kNumChannels = {num_channels};

constexpr int kMaxImageSize = kNumCols * kNumRows * kNumChannels;

constexpr int kCategoryCount = {category_count};
constexpr int kPersonIndex = 1;
constexpr int kNotAPersonIndex = 0;
extern const char* kCategoryLabels[kCategoryCount];

// ********************************************************
// ******************* model_settings.cpp ********************
const char* kCategoryLabels[kCategoryCount] = {{
    {labels_str},
}};
// ********************************************************"""
    
    return settings_code
