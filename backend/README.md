# Backend Services

This directory contains the backend services for the Blockly TFLite conversion feature.

## Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Services

### TFLite Converter Service

Located in `services/tflite_converter.py`, this service provides functions to:

1. **Convert TensorFlow.js models to TFLite format** (`convert_tfjs_to_tflite`)
   - Accepts a TensorFlow.js model directory path
   - Converts to TensorFlow SavedModel (intermediate format)
   - Applies TFLite converter with optional quantization
   - Returns path to the generated .tflite file

2. **Generate C/C++ byte arrays** (`tflite_to_c_array`)
   - Reads a TFLite binary file
   - Generates formatted C/C++ code with const unsigned char array
   - Includes metadata comments and size constants
   - Returns formatted code string ready for microcontroller deployment

3. **Extract model metadata** (`get_model_info`)
   - Reads TFLite model and extracts input/output shapes
   - Returns dictionary with model information

## Usage Example

```python
from services.tflite_converter import convert_tfjs_to_tflite, tflite_to_c_array

# Convert TensorFlow.js model to TFLite
tflite_path = convert_tfjs_to_tflite(
    model_path='path/to/tfjs/model',
    output_path='output/model.tflite',
    quantize=True
)

# Generate C/C++ byte array
cpp_code = tflite_to_c_array(
    tflite_path=tflite_path,
    array_name='my_model_data',
    include_metadata=True
)

print(cpp_code)
```

## Testing

Run tests using pytest:

```bash
pytest tests/
```

Run with coverage:

```bash
pytest --cov=services tests/
```

## API Endpoint

The conversion service will be exposed via a REST API endpoint (to be implemented in task 2.1):

- **POST /api/convert-to-tflite**
  - Accepts TensorFlow.js model data
  - Returns formatted C/C++ code or error response

## Notes

- The conversion process requires temporary disk space for intermediate files
- Large models (>10MB) may take longer to convert
- Quantization is enabled by default to reduce model size for microcontrollers
- The service automatically cleans up temporary files after conversion
