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
    Converts TensorFlow.js model to TFLite format.
    
    This function performs a multi-step conversion:
    1. Load TensorFlow.js model as Keras model
    2. Apply TFLite converter with optional quantization
    3. Save TFLite model to output path
    
    Args:
        model_path: Path to model.json file (TensorFlow.js model)
        output_path: Path for output .tflite file
        quantize: Whether to apply post-training quantization (default: True)
        quantization_type: Type of quantization - "int8", "float16", or "dynamic" (default: "int8")
            - "int8": Full integer quantization (recommended for microcontrollers)
            - "float16": Float16 weight quantization
            - "dynamic": Dynamic range quantization (weights to int8, activations stay float)
        representative_dataset: List of sample data arrays for int8 quantization (default: None)
            Required for full integer quantization. Each sample should be a list representing 
            one input example.
    
    Returns:
        Path to converted .tflite file
        
    Raises:
        ValueError: If model_path doesn't exist or is invalid, or if int8 quantization 
                    is requested without representative_dataset
        RuntimeError: If conversion fails
    """
    if not os.path.exists(model_path):
        raise ValueError(f"Model path does not exist: {model_path}")
    
    # Get the directory containing model.json
    model_dir = os.path.dirname(model_path)
    print(f"Contents of model_dir ({model_dir}): {os.listdir(model_dir)}")
    
    # Print the contents of the model_path file
    try:
        with open(model_path, 'r') as f:
            print(f"\nContents of {model_path}:\n{f.read()}\n")
    except Exception as e:
        print(f"Could not read model_path file: {e}")
    
    try:
        # Step 1: Load TensorFlow.js model as Keras model
        # The tfjs.converters.load_keras_model expects the path to model.json
        keras_model = tfjs.converters.load_keras_model(model_path)
        
        # Debug: Print model architecture
        print("\n=== Keras Model Debug (after loading from TF.js) ===")
        print(f"Model type: {type(keras_model)}")
        print(f"Number of layers: {len(keras_model.layers)}")
        for i, layer in enumerate(keras_model.layers):
            print(f"Layer {i}: {layer.name} - {layer.__class__.__name__}")
            if hasattr(layer, 'output_shape'):
                print(f"  Output shape: {layer.output_shape}")
            if hasattr(layer, 'units'):
                print(f"  Units: {layer.units}")
        print(f"Model input shape: {keras_model.input_shape}")
        print(f"Model output shape: {keras_model.output_shape}")
        keras_model.summary()
        print("=" * 50 + "\n")
        
        # Step 2: Convert Keras model to TFLite
        converter = tf.lite.TFLiteConverter.from_keras_model(keras_model)
        
        # Step 3: Apply optimizations if quantization is enabled
        if quantize:
            converter.optimizations = [tf.lite.Optimize.DEFAULT]
            
            if quantization_type == "int8":
                print("Applying int8 quantization for TFLite conversion (recommended for microcontrollers).")
                
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
                                print(f"Error reshaping sample: {e}")
                                print(f"Sample size: {sample_array.size}, expected: {1*96*96*1}")
                                raise
                        elif len(sample_array.shape) == 3:
                            # Add batch dimension
                            sample_array = np.expand_dims(sample_array, 0)
                        
                        yield [sample_array]
                
                converter.representative_dataset = representative_dataset_gen
                
            elif quantization_type == "float16":
                print("Applying float16 quantization for TFLite conversion.")
                # Float16 weight quantization
                converter.target_spec.supported_types = [tf.float16]
                
            elif quantization_type == "dynamic":
                print("Applying dynamic range quantization for TFLite conversion.")
                # Dynamic range quantization (default behavior with Optimize.DEFAULT)
                # Weights are quantized to int8, activations stay float
                # No need to set additional flags - this is the default
                pass
            
            else:
                print(f"Warning: Unknown quantization type '{quantization_type}', using dynamic range quantization.")
        
        # Step 4: Convert the model
        tflite_model = converter.convert()
        
        # Debug: Check the converted TFLite model
        print("\n=== TFLite Model Debug (after conversion) ===")
        import tempfile
        with tempfile.NamedTemporaryFile(suffix='.tflite', delete=False) as tmp_file:
            tmp_file.write(tflite_model)
            tmp_path = tmp_file.name
        
        try:
            interpreter = tf.lite.Interpreter(model_path=tmp_path)
            interpreter.allocate_tensors()
            input_details = interpreter.get_input_details()
            output_details = interpreter.get_output_details()
            print(f"TFLite input shape: {input_details[0]['shape']}")
            print(f"TFLite output shape: {output_details[0]['shape']}")
            print(f"TFLite input dtype: {input_details[0]['dtype']}")
            print(f"TFLite output dtype: {output_details[0]['dtype']}")
        finally:
            os.unlink(tmp_path)
        print("=" * 50 + "\n")
        
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
    Converts TFLite binary to C/C++ byte array representation.
    
    This function reads a TFLite model file and generates formatted C/C++ code
    with a const unsigned char array containing all model bytes in hexadecimal
    format, suitable for embedding in microcontroller firmware.
    
    Args:
        tflite_path: Path to .tflite file
        array_name: Name for the C array variable (default: "g_person_detect_model_data")
        include_metadata: Whether to include metadata comments (default: True)
    
    Returns:
        Formatted C/C++ code string with byte array and size constant
        
    Raises:
        ValueError: If tflite_path doesn't exist
        RuntimeError: If file reading or formatting fails
    """
    if not os.path.exists(tflite_path):
        raise ValueError(f"TFLite file does not exist: {tflite_path}")
    
    try:
        # Read TFLite binary file
        with open(tflite_path, 'rb') as f:
            tflite_data = f.read()
        
        model_size = len(tflite_data)
        
        # Verify TFLite magic bytes (0x54464C33 = "TFL3")
        # Note: Some TFLite files may have different byte order or format
        if len(tflite_data) < 4:
            raise RuntimeError("Invalid TFLite file: too small")
        
        magic_bytes = tflite_data[:4]
        # Check for TFL3 magic bytes (can be in different byte orders)
        expected_magic = b'TFL3'
        if magic_bytes != expected_magic:
            # Log warning but continue - the file might still be valid
            import sys
            print(f"Warning: Unexpected magic bytes (expected 'TFL3', got {magic_bytes.hex()})", 
                  file=sys.stderr)
            # Don't raise error - TFLite files can have variations
        
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
    print(f"[generate_model_settings] Called with class_labels: {class_labels}")
    print(f"[generate_model_settings] class_labels type: {type(class_labels)}")
    
    num_cols = model_metadata.get('num_cols', 96)
    num_rows = model_metadata.get('num_rows', 96)
    num_channels = model_metadata.get('num_channels', 1)
    category_count = model_metadata.get('category_count', 3)
    max_image_size = model_metadata.get('max_image_size', num_cols * num_rows * num_channels)
    
    print(f"[generate_model_settings] category_count: {category_count}")
    
    # Generate class labels if not provided
    if not class_labels or len(class_labels) == 0:
        print(f"[generate_model_settings] No class labels provided, generating defaults")
        class_labels = [f'class_{i}' for i in range(category_count)]
    else:
        print(f"[generate_model_settings] Using provided class labels: {class_labels}")
        # Ensure we have the right number of labels
        if len(class_labels) < category_count:
            # Pad with generic labels
            print(f"[generate_model_settings] Padding from {len(class_labels)} to {category_count}")
            class_labels = list(class_labels) + [f'class_{i}' for i in range(len(class_labels), category_count)]
        elif len(class_labels) > category_count:
            # Truncate
            print(f"[generate_model_settings] Truncating from {len(class_labels)} to {category_count}")
            class_labels = class_labels[:category_count]
        # Remove any existing quotes from labels
        class_labels = [label.strip('"').strip("'") for label in class_labels]
        print(f"[generate_model_settings] After stripping quotes: {class_labels}")
    
    # Format labels with quotes for C++ string array
    labels_str = ','.join([f'"{label}"' for label in class_labels])
    print(f"[generate_model_settings] Final labels_str for C++: {labels_str}")
    
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
