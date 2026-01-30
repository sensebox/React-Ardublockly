"""
Flask API for TensorFlow Lite Model Conversion

This module provides a REST API endpoint for converting TensorFlow.js models
to TFLite format and generating C/C++ byte array representations.
"""

import os
import tempfile
import shutil
import json
import base64
import requests
from pathlib import Path
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.exceptions import BadRequest, RequestEntityTooLarge

from services.tflite_converter import (
    convert_tfjs_to_tflite,
    tflite_to_c_array,
    get_model_info,
    generate_model_settings
)
from services.model_injection import inject_model_data, inject_model_data_and_settings
from services.compiler_service import (
    compile_sketch,
    CompilationError,
    CompilerTimeoutError,
    CompilerConnectionError
)
from config import get_config, validate_config_on_startup, ConfigurationError


# Initialize Flask app
app = Flask(__name__)

# Get configuration
config = get_config()

# Validate configuration on startup (skip during testing)
if os.getenv('TESTING') != 'true':
    try:
        validate_config_on_startup()
    except ConfigurationError as e:
        print(f"\n{'='*60}")
        print("CONFIGURATION ERROR!")
        print(f"{'='*60}")
        print(f"Error: {str(e)}")
        print(f"{'='*60}\n")
        # Only raise in production, allow tests to run
        if os.getenv('FLASK_ENV') != 'testing':
            raise

# Enable CORS for frontend communication
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://localhost:3000"],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Apply configuration to Flask app
app.config['MAX_CONTENT_LENGTH'] = config.get('MAX_CONTENT_LENGTH')
TEMP_DIR_PREFIX = config.get('TEMP_DIR_PREFIX')
CONVERSION_TIMEOUT = config.get('CONVERSION_TIMEOUT')
COMPILER_URL = config.get('VITE_BLOCKLY_API')
DEMO_SCRIPT_PATH = os.path.join(os.path.dirname(__file__), 'demo-tflite-script')


@app.route('/api/convert-to-tflite', methods=['POST'])
def convert_to_tflite():
    """
    POST /api/convert-to-tflite
    
    Converts a TensorFlow.js model to TFLite format and returns C/C++ byte array.
    
    Request Body (JSON):
        {
            "modelData": "base64-encoded model.json content",
            "weightsData": ["base64-encoded weight file 1", ...],
            "representativeDataset": ["base64-encoded sample 1", ...],  // Optional, required for int8 quantization
            "modelMetadata": {
                "inputShape": [1, 224, 224, 3],
                "outputShape": [1, 10],
                "classes": ["class1", "class2", ...]
            },
            "options": {
                "quantize": true,
                "quantizationType": "int8",  // int8, float16, or dynamic
                "optimize": true,
                "arrayName": "model_data",
                "includeMetadata": true
            }
        }
    
    Response (JSON):
        Success:
        {
            "success": true,
            "data": {
                "cppCode": "const unsigned char model_data[] = {...}",
                "modelSize": 18432,
                "modelByteArray": [0x00, 0x01, 0x02, ...],
                "arrayName": "model_data",
                "timestamp": "2024-01-15T10:30:00Z"
            }
        }
        
        Error:
        {
            "success": false,
            "error": {
                "message": "Conversion failed",
                "details": "Detailed error message",
                "type": "CONVERSION_ERROR",
                "suggestions": ["Try simplifying the model", ...],
                "retryable": true
            }
        }
    """
    temp_dir = None
    
    try:
        # Validate request content type
        if not request.is_json:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Invalid request format",
                    "details": "Request must be JSON",
                    "type": "VALIDATION_ERROR",
                    "suggestions": ["Ensure Content-Type is application/json"],
                    "retryable": False
                }
            }), 400
        
        # Parse request data
        data = request.get_json()
        
        # Validate required fields
        if 'modelData' not in data:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Missing required field",
                    "details": "modelData is required",
                    "type": "VALIDATION_ERROR",
                    "suggestions": ["Include modelData in request body"],
                    "retryable": False
                }
            }), 400
        
        # Extract options with defaults
        options = data.get('options', {})
        quantize = options.get('quantize', True)
        quantization_type = options.get('quantizationType', 'int8')  # int8, float16, or dynamic
        array_name = options.get('arrayName', 'g_person_detect_model_data')
        include_metadata = options.get('includeMetadata', True)
        
        # Extract representative dataset if provided (for int8 quantization)
        representative_dataset = data.get('representativeDataset', None)
        if representative_dataset:
            # Decode base64-encoded dataset samples
            try:
                decoded_dataset = []
                for sample_b64 in representative_dataset:
                    sample_bytes = base64.b64decode(sample_b64)
                    # Convert bytes to list of floats (assuming float32)
                    import struct
                    num_floats = len(sample_bytes) // 4
                    sample_floats = list(struct.unpack(f'{num_floats}f', sample_bytes))
                    decoded_dataset.append(sample_floats)
                representative_dataset = decoded_dataset
            except Exception as e:
                return jsonify({
                    "success": False,
                    "error": {
                        "message": "Failed to decode representative dataset",
                        "details": str(e),
                        "type": "VALIDATION_ERROR",
                        "suggestions": ["Ensure representativeDataset contains valid base64-encoded float32 arrays"],
                        "retryable": False
                    }
                }), 400
        
        # Create temporary directory for conversion
        temp_dir = tempfile.mkdtemp(prefix=TEMP_DIR_PREFIX)
        model_dir = os.path.join(temp_dir, 'tfjs_model')
        os.makedirs(model_dir, exist_ok=True)
        
        # Save model.json
        try:
            model_json_data = base64.b64decode(data['modelData'])
            model_json_str = model_json_data.decode('utf-8')
            model_json = json.loads(model_json_str)
            
            # The model.json needs to have the correct structure for TensorFlow.js
            # It should have modelTopology, weightsManifest, etc.
            model_json_path = os.path.join(model_dir, 'model.json')
            
            # Create the proper TensorFlow.js model.json structure
            tfjs_model = {
                'modelTopology': model_json,
                'format': 'layers-model',
                'generatedBy': 'TensorFlow.js Converter',
                'convertedBy': None
            }
            
            # Preserve weights manifest from the original model with weight metadata
            if data.get('weightsData') and len(data['weightsData']) > 0:
                # Generate paths for weight files
                weight_paths = [f'{model_dir}/group1-shard{i+1}of{len(data["weightsData"])}.bin' 
                               for i in range(len(data['weightsData']))]
                
                # Prefer weight specs sent explicitly from the client
                weight_specs = data.get('weightSpecs')
                
                # Try to get weights spec from original model if available
                original_weights_manifest = model_json.get('weightsManifest') if isinstance(model_json, dict) else None
                original_weight_specs = None
                if original_weights_manifest and isinstance(original_weights_manifest, list) and len(original_weights_manifest) > 0:
                    original_weight_specs = original_weights_manifest[0].get('weights', [])
                
                # Choose the best available weight specs
                resolved_weight_specs = None
                if weight_specs and isinstance(weight_specs, list) and len(weight_specs) > 0:
                    resolved_weight_specs = weight_specs
                elif original_weight_specs and len(original_weight_specs) > 0:
                    resolved_weight_specs = original_weight_specs
                else:
                    resolved_weight_specs = []
                
                tfjs_model['weightsManifest'] = [{
                    'paths': weight_paths,
                    'weights': resolved_weight_specs
                }]
            
            with open(model_json_path, 'w') as f:
                json.dump(tfjs_model, f)
        except Exception as e:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Failed to decode model data",
                    "details": str(e),
                    "type": "VALIDATION_ERROR",
                    "suggestions": ["Ensure modelData is valid base64-encoded JSON"],
                    "retryable": False
                }
            }), 400
        
        # Save weight files if provided
        weights_data = data.get('weightsData', [])
        for idx, weight_b64 in enumerate(weights_data):
            try:
                weight_data = base64.b64decode(weight_b64)
                weight_path = os.path.join(model_dir, f'group1-shard{idx + 1}of{len(weights_data)}.bin')
                with open(weight_path, 'wb') as f:
                    f.write(weight_data)
            except Exception as e:
                return jsonify({
                    "success": False,
                    "error": {
                        "message": "Failed to decode weight data",
                        "details": f"Weight file {idx + 1}: {str(e)}",
                        "type": "VALIDATION_ERROR",
                        "suggestions": ["Ensure all weight files are valid base64"],
                        "retryable": False
                    }
                }), 400
        
        # Convert to TFLite
        tflite_path = os.path.join(temp_dir, 'model.tflite')
        
        try:
            convert_tfjs_to_tflite(
                model_path=model_json_path,  # Pass the model.json file path
                output_path=tflite_path,
                quantize=quantize,
                quantization_type=quantization_type,
                representative_dataset=representative_dataset
            )
        except ValueError as e:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Invalid model structure",
                    "details": str(e),
                    "type": "VALIDATION_ERROR",
                    "suggestions": [
                        "Ensure the model is a valid TensorFlow.js model",
                        "Check that all weight files are included"
                    ],
                    "retryable": False
                }
            }), 400
        except RuntimeError as e:
            error_msg = str(e).lower()
            
            # Check for specific error types
            if 'unsupported' in error_msg or 'not supported' in error_msg:
                return jsonify({
                    "success": False,
                    "error": {
                        "message": "Model contains unsupported operations",
                        "details": str(e),
                        "type": "UNSUPPORTED_OPS",
                        "suggestions": [
                            "Try using a simpler model architecture",
                            "Remove custom layers or operations",
                            "Use standard TensorFlow operations only"
                        ],
                        "retryable": False
                    }
                }), 400
            elif 'size' in error_msg or 'large' in error_msg:
                return jsonify({
                    "success": False,
                    "error": {
                        "message": "Model too large for TFLite Micro",
                        "details": str(e),
                        "type": "SIZE_LIMIT",
                        "suggestions": [
                            "Reduce the number of layers",
                            "Use smaller layer dimensions",
                            "Enable quantization to reduce size"
                        ],
                        "retryable": False
                    }
                }), 400
            else:
                return jsonify({
                    "success": False,
                    "error": {
                        "message": "Conversion failed",
                        "details": str(e),
                        "type": "CONVERSION_ERROR",
                        "suggestions": [
                            "Check model structure",
                            "Try with a different model",
                            "Contact support if issue persists"
                        ],
                        "retryable": True
                    }
                }), 500
        
        # Generate C/C++ byte array
        try:
            cpp_code = tflite_to_c_array(
                tflite_path=tflite_path,
                array_name=array_name,
                include_metadata=include_metadata
            )
        except Exception as e:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Failed to generate C array",
                    "details": str(e),
                    "type": "CONVERSION_ERROR",
                    "suggestions": ["Try again or contact support"],
                    "retryable": True
                }
            }), 500
        
        # Get model info and metadata
        try:
            model_info = get_model_info(tflite_path)
            model_size = model_info['model_size']
        except Exception:
            # If we can't get model info, just use file size
            model_size = os.path.getsize(tflite_path)
            model_info = {'model_size': model_size}
        
        # Read TFLite model as byte array for compilation
        try:
            with open(tflite_path, 'rb') as f:
                model_bytes = f.read()
            model_byte_array = list(model_bytes)
        except Exception as e:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Failed to read model bytes",
                    "details": str(e),
                    "type": "CONVERSION_ERROR",
                    "suggestions": ["Try again or contact support"],
                    "retryable": True
                }
            }), 500
        
        # Generate model settings code
        try:
            # Extract class labels from metadata if provided
            model_metadata = data.get('modelMetadata', {})
            class_labels = model_metadata.get('classes', [])
            
            print(f"[Convert API] Received class labels: {class_labels}")
            print(f"[Convert API] Full model metadata: {model_metadata}")
            
            # Generate model settings based on the actual model
            model_settings_code = generate_model_settings(model_info, class_labels)
            print(f"[Convert API] Model settings generated, length: {len(model_settings_code) if model_settings_code else 0}")
        except Exception as e:
            # If model settings generation fails, continue without it
            app.logger.warning(f"Failed to generate model settings: {str(e)}")
            model_settings_code = None
        
        # Return success response
        response_data = {
            "cppCode": cpp_code,
            "modelSize": model_size,
            "modelByteArray": model_byte_array,
            "arrayName": array_name,
            "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        }
        
        # Include model metadata if available
        if model_info:
            response_data["modelMetadata"] = {
                "inputShape": model_info.get('input_shape'),
                "outputShape": model_info.get('output_shape'),
                "numRows": model_info.get('num_rows'),
                "numCols": model_info.get('num_cols'),
                "numChannels": model_info.get('num_channels'),
                "categoryCount": model_info.get('category_count'),
                "classes": class_labels  # Include the class labels that were passed in
            }
            print(f"[Convert API] Returning response with classes: {class_labels}")
        
        # Include model settings code if available
        if model_settings_code:
            response_data["modelSettingsCode"] = model_settings_code
        
        return jsonify({
            "success": True,
            "data": response_data
        }), 200
        
    except RequestEntityTooLarge:
        return jsonify({
            "success": False,
            "error": {
                "message": "Model too large",
                "details": f"Maximum upload size is {app.config['MAX_CONTENT_LENGTH'] // (1024 * 1024)}MB",
                "type": "SIZE_LIMIT",
                "suggestions": [
                    "Reduce model size",
                    "Use fewer layers",
                    "Enable quantization"
                ],
                "retryable": False
            }
        }), 413
        
    except Exception as e:
        # Catch-all for unexpected errors
        app.logger.error(f"Unexpected error in convert_to_tflite: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": {
                "message": "Internal server error",
                "details": str(e),
                "type": "UNKNOWN",
                "suggestions": ["Try again later or contact support"],
                "retryable": True
            }
        }), 500
        
    finally:
        # Clean up temporary directory
        if temp_dir and os.path.exists(temp_dir):
            try:
                shutil.rmtree(temp_dir, ignore_errors=True)
            except Exception as e:
                app.logger.warning(f"Failed to clean up temp directory {temp_dir}: {str(e)}")


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify API is running."""
    return jsonify({
        "status": "healthy",
        "service": "TFLite Conversion API",
        "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    }), 200


@app.route('/api/compile-model', methods=['POST'])
def compile_model():
    """
    POST /api/compile-model
    
    Compile a TFLite model into an Arduino binary.
    Injects the model data into the template sketch and compiles it.
    
    Request Body (JSON):
        {
            "modelData": "base64-encoded TFLite model bytes",
            "modelSize": 18432,
            "boardType": "sensebox_eye",
            "optimization": "default",
            "compileOnly": false
        }
    
    Response (JSON):
        Success (with binary):
        {
            "success": true,
            "data": {
                "binary": "base64-encoded compiled binary",
                "modelSize": 18432,
                "binarySize": 245760,
                "board": "esp32:esp32:esp32",
                "optimization": "default",
                "timestamp": "2024-01-26T10:30:00Z"
            }
        }
        
        Success (compile check only):
        {
            "success": true,
            "data": {
                "compiled": true,
                "modelSize": 18432,
                "board": "esp32:esp32:esp32",
                "timestamp": "2024-01-26T10:30:00Z"
            }
        }
        
        Error:
        {
            "success": false,
            "error": {
                "message": "Compilation failed",
                "details": "Detailed error message",
                "type": "COMPILATION_ERROR",
                "suggestions": ["Try using a smaller model", ...],
                "retryable": true
            }
        }
    """
    try:
        # Validate request content type
        if not request.is_json:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Invalid content type",
                    "details": "Request must have Content-Type: application/json",
                    "type": "INVALID_CONTENT_TYPE",
                    "suggestions": ["Set Content-Type header to application/json"],
                    "retryable": False
                }
            }), 400
        
        # Parse request data
        data = request.get_json()
        if not data:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Empty request body",
                    "details": "Request body is required",
                    "type": "EMPTY_REQUEST",
                    "suggestions": ["Include modelData in request body"],
                    "retryable": False
                }
            }), 400
        
        # Validate required fields
        if 'modelData' not in data:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Missing model data",
                    "details": "modelData field is required",
                    "type": "MISSING_MODEL_DATA",
                    "suggestions": ["Include base64-encoded TFLite model in modelData field"],
                    "retryable": False
                }
            }), 400
        
        # Decode model data
        try:
            model_bytes = base64.b64decode(data['modelData'])
        except Exception as e:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Invalid model data encoding",
                    "details": f"Failed to decode base64 model data: {str(e)}",
                    "type": "INVALID_ENCODING",
                    "suggestions": ["Ensure modelData is valid base64-encoded data"],
                    "retryable": False
                }
            }), 400
        
        # Parse options
        board = data.get('boardType', config.get('DEFAULT_BOARD'))
        optimization = data.get('optimization', config.get('DEFAULT_OPTIMIZATION'))
        compile_only = data.get('compileOnly', False)
        
        # Extract metadata if provided (includes class labels)
        model_metadata_input = data.get('modelMetadata', {})
        class_labels = model_metadata_input.get('classes', [])
        
        # Check if pre-generated model settings code is provided
        model_settings_code = data.get('modelSettingsCode', None)
        
        print(f"[Compile API] Received model metadata: {model_metadata_input}")
        print(f"[Compile API] Received class labels: {class_labels}")
        print(f"[Compile API] Received pre-generated model settings: {bool(model_settings_code)}")
        
        # Validate board type (basic check)
        if not isinstance(board, str) or not board:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Invalid board type",
                    "details": f"Board must be a non-empty string, got: {type(board).__name__}",
                    "type": "INVALID_BOARD",
                    "suggestions": [f"Use a valid board identifier like '{config.get('DEFAULT_BOARD')}'"],
                    "retryable": False
                }
            }), 400
        
        # Validate optimization level
        valid_optimizations = ['default', 'size', 'speed']
        if optimization not in valid_optimizations:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Invalid optimization level",
                    "details": f"Optimization must be one of: {', '.join(valid_optimizations)}",
                    "type": "INVALID_OPTIMIZATION",
                    "suggestions": [f"Use one of: {', '.join(valid_optimizations)}"],
                    "retryable": False
                }
            }), 400
        
        model_size = len(model_bytes)
        print(f"\n[Compile Model] Starting compilation")
        print(f"[Compile Model] Model size: {model_size:,} bytes ({model_size/1024:.2f} KB)")
        print(f"[Compile Model] Board: {board}")
        print(f"[Compile Model] Optimization: {optimization}")
        
        # Step 1: Use pre-generated model settings or generate new ones
        if not model_settings_code:
            print(f"[Compile Model] No pre-generated model settings, will generate new ones")
            try:
                # Save model bytes to a temp file to extract metadata
                temp_dir = tempfile.mkdtemp(prefix='compile_model_')
                temp_tflite_path = os.path.join(temp_dir, 'model.tflite')
                with open(temp_tflite_path, 'wb') as f:
                    f.write(model_bytes)
                
                # Extract model metadata
                model_info = get_model_info(temp_tflite_path)
                print(f"[Compile Model] Model metadata extracted:")
                print(f"[Compile Model]   Input shape: {model_info.get('input_shape')}")
                print(f"[Compile Model]   Output shape: {model_info.get('output_shape')}")
                print(f"[Compile Model]   Category count: {model_info.get('category_count')}")
                
                # Generate model settings
                model_settings_code = generate_model_settings(model_info, class_labels)
                print(f"[Compile API] Generated model settings with class labels: {class_labels}")
                print(f"[Compile API] Model settings code preview (first 500 chars): {model_settings_code[:500] if model_settings_code else 'None'}")
                
                # Clean up temp file
                shutil.rmtree(temp_dir, ignore_errors=True)
            except Exception as e:
                print(f"[Compile Model] Warning: Failed to extract model metadata: {str(e)}")
                # Fall back to injecting only model data without settings
                model_settings_code = None
        else:
            print(f"[Compile Model] Using pre-generated model settings from conversion step")
            print(f"[Compile Model] Model settings preview (first 500 chars): {model_settings_code[:500]}")
        
        # Step 2: Inject model data and settings into template
        try:
            if model_settings_code:
                sketch_content, injection_error = inject_model_data_and_settings(
                    model_bytes,
                    model_settings_code
                )
            else:
                sketch_content, injection_error = inject_model_data(model_bytes)
            
            if injection_error:
                return jsonify({
                    "success": False,
                    "error": {
                        "message": "Model injection failed",
                        "details": injection_error,
                        "type": "INJECTION_ERROR",
                        "suggestions": [
                            "Ensure the template file exists",
                            "Verify model data is valid TFLite format"
                        ],
                        "retryable": False
                    }
                }), 500
            
            print(f"[Compile Model] Model injection successful")
            print(f"[Compile Model] Sketch size: {len(sketch_content):,} characters")
        except Exception as e:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Model injection failed",
                    "details": str(e),
                    "type": "INJECTION_ERROR",
                    "suggestions": [
                        "Ensure the template file exists",
                        "Verify model data is valid TFLite format"
                    ],
                    "retryable": False
                }
            }), 500
        
        # Step 3: Compile the sketch
        try:
            print(f"[Compile Model] Attempting compilation...")
            print(f"[Compile Model] Compiler URL: {COMPILER_URL}")
            binary_data = compile_sketch(
                sketch_content=sketch_content,
                board=board,
                optimization=optimization
            )
            binary_size = len(binary_data)
            print(f"[Compile Model] Compilation successful")
            print(f"[Compile Model] Binary size: {binary_size:,} bytes ({binary_size/1024:.2f} KB)")
        
        except CompilerTimeoutError as e:
            return jsonify({
                "success": False,
                "error": {
                    "message": e.message,
                    "details": e.details,
                    "type": e.error_type,
                    "suggestions": [
                        "Try again - the compiler may be under heavy load",
                        "Consider using a simpler model to reduce compilation time"
                    ],
                    "retryable": True
                }
            }), 504
        
        except CompilerConnectionError as e:
            return jsonify({
                "success": False,
                "error": {
                    "message": e.message,
                    "details": e.details,
                    "type": e.error_type,
                    "suggestions": [
                        "Verify the compiler service is running",
                        f"Check VITE_BLOCKLY_API configuration: {COMPILER_URL}",
                        "Try again in a few moments"
                    ],
                    "retryable": True
                }
            }), 503
        
        except CompilationError as e:
            # Determine HTTP status code based on error type
            status_code = 400 if not e.retryable else 500
            
            return jsonify({
                "success": False,
                "error": {
                    "message": e.message,
                    "details": e.details,
                    "type": e.error_type,
                    "suggestions": [
                        "Check the compilation error details",
                        "Ensure the model is compatible with TFLite Micro",
                        "Try using a simpler model architecture"
                    ],
                    "retryable": e.retryable
                }
            }), status_code
        
        except Exception as e:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Unexpected compilation error",
                    "details": str(e),
                    "type": "UNEXPECTED_ERROR",
                    "suggestions": [
                        "Try again",
                        "Contact support if the issue persists"
                    ],
                    "retryable": True
                }
            }), 500
        
        # Step 4: Format response
        timestamp = datetime.utcnow().isoformat() + 'Z'
        
        if compile_only:
            # Return compilation success without binary
            return jsonify({
                "success": True,
                "data": {
                    "compiled": True,
                    "modelSize": model_size,
                    "board": board,
                    "optimization": optimization,
                    "timestamp": timestamp
                }
            }), 200
        else:
            # Return binary data
            binary_b64 = base64.b64encode(binary_data).decode('utf-8')
            
            return jsonify({
                "success": True,
                "data": {
                    "binaryData": binary_b64,
                    "modelSize": model_size,
                    "binarySize": binary_size,
                    "board": board,
                    "optimization": optimization,
                    "timestamp": timestamp
                }
            }), 200
    
    except Exception as e:
        # Catch-all for unexpected errors
        app.logger.error(f"Unexpected error in compile-model endpoint: {str(e)}")
        return jsonify({
            "success": False,
            "error": {
                "message": "Internal server error",
                "details": str(e),
                "type": "INTERNAL_ERROR",
                "retryable": True
            }
        }), 500


@app.route('/api/compile-camera-capture', methods=['POST'])
def compile_camera_capture():
    """
    POST /api/compile-camera-capture
    
    Compile the camera_capture.ino template and return the compiled binary.
    This is used when the serial camera connection fails and the user needs
    to flash the firmware to their senseBox Eye device.
    
    Request Body (JSON):
        {
            "boardType": "sensebox_mcu_esp32s2"  // Optional, defaults to sensebox board
        }
    
    Response (JSON):
        Success:
        {
            "success": true,
            "data": {
                "binary": "base64-encoded compiled binary",
                "binarySize": 245760,
                "board": "esp32:esp32:esp32s2",
                "timestamp": "2024-01-26T10:30:00Z",
                "filename": "camera_capture.bin"
            }
        }
        
        Error:
        {
            "success": false,
            "error": {
                "message": "Compilation failed",
                "details": "Detailed error message",
                "type": "COMPILATION_ERROR",
                "suggestions": ["Check compiler service is running"],
                "retryable": true
            }
        }
    """
    try:
        # Parse request data (board type is optional)
        data = request.get_json() if request.is_json else {}
        board = data.get('boardType', 'sensebox_eye')
        
        # Map board type to compiler board string
        # The compiler expects senseBox-specific identifiers.
        board_mapping = {
            'sensebox_eye': 'sensebox_eye',
            'sensebox_mcu_esp32s2': 'sensebox-esp32s2',
            'sensebox-esp32s2': 'sensebox-esp32s2',
            'sensebox-mcu': 'sensebox-mcu',
            'sensebox': 'sensebox'
        }
        compiler_board = board_mapping.get(board, 'sensebox_eye')
        
        print(f"[Camera Capture API] Compiling camera_capture.ino for board: {compiler_board}")
        
        # Read the camera_capture.ino template
        template_path = os.path.join(os.path.dirname(__file__), 'templates', 'camera_capture.ino')
        
        if not os.path.exists(template_path):
            return jsonify({
                "success": False,
                "error": {
                    "message": "Template file not found",
                    "details": f"camera_capture.ino template does not exist at {template_path}",
                    "type": "TEMPLATE_NOT_FOUND",
                    "suggestions": ["Ensure the template file exists in backend/templates/"],
                    "retryable": False
                }
            }), 404
        
        with open(template_path, 'r', encoding='utf-8') as f:
            sketch_content = f.read()
        
        print(f"[Camera Capture API] Template loaded, size: {len(sketch_content)} characters")
        
        # Compile the sketch
        try:
            binary_data = compile_sketch(
                sketch_content=sketch_content,
                board=compiler_board,
                project_id=f"camera-capture-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
                optimization="default"
            )
        except CompilerTimeoutError as e:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Compilation timed out",
                    "details": str(e),
                    "type": "TIMEOUT",
                    "suggestions": [
                        "The compiler service may be overloaded",
                        "Try again in a few moments"
                    ],
                    "retryable": True
                }
            }), 408
        except CompilerConnectionError as e:
            return jsonify({
                "success": False,
                "error": {
                    "message": "Cannot connect to compiler service",
                    "details": str(e),
                    "type": "CONNECTION_ERROR",
                    "suggestions": [
                        "Ensure the compiler service is running",
                        f"Check that {COMPILER_URL} is accessible"
                    ],
                    "retryable": True
                }
            }), 503
        except CompilationError as e:
            return jsonify({
                "success": False,
                "error": {
                    "message": e.message,
                    "details": str(e.details) if e.details else str(e),
                    "type": e.error_type,
                    "suggestions": [
                        "Check the compiler service logs for details",
                        "Ensure the template file is valid Arduino code"
                    ],
                    "retryable": e.retryable
                }
            }), 500
        
        # Encode binary as base64
        binary_base64 = base64.b64encode(binary_data).decode('utf-8')
        binary_size = len(binary_data)
        
        print(f"[Camera Capture API] Compilation successful, binary size: {binary_size:,} bytes")
        
        # Return success response
        return jsonify({
            "success": True,
            "data": {
                "binary": binary_base64,
                "binarySize": binary_size,
                "board": compiler_board,
                "timestamp": datetime.utcnow().isoformat() + 'Z',
                "filename": "camera_capture.bin"
            }
        }), 200
        
    except Exception as e:
        print(f"[Camera Capture API] Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": {
                "message": "Internal server error",
                "details": str(e),
                "type": "INTERNAL_ERROR",
                "retryable": True
            }
        }), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({
        "success": False,
        "error": {
            "message": "Endpoint not found",
            "details": "The requested endpoint does not exist",
            "type": "NOT_FOUND",
            "suggestions": ["Check the API documentation"],
            "retryable": False
        }
    }), 404


@app.errorhandler(405)
def method_not_allowed(error):
    """Handle 405 errors."""
    return jsonify({
        "success": False,
        "error": {
            "message": "Method not allowed",
            "details": "The HTTP method is not supported for this endpoint",
            "type": "METHOD_NOT_ALLOWED",
            "suggestions": ["Use POST for /api/convert-to-tflite"],
            "retryable": False
        }
    }), 405


if __name__ == '__main__':
    # Run development server
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
