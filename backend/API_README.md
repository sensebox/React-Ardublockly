# TFLite Conversion API

This is a Flask-based REST API for converting TensorFlow.js models to TensorFlow Lite format and generating C/C++ byte arrays for microcontroller deployment.

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Run the development server:

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### POST /api/convert-to-tflite

Converts a TensorFlow.js model to TFLite format and returns formatted C/C++ code.

**Request Body:**

```json
{
  "modelData": "base64-encoded model.json content",
  "weightsData": ["base64-encoded weight file 1", "..."],
  "modelMetadata": {
    "inputShape": [1, 224, 224, 3],
    "outputShape": [1, 10],
    "classes": ["class1", "class2", ...]
  },
  "options": {
    "quantize": true,
    "quantizationType": "int8",
    "arrayName": "g_person_detect_model_data",
    "includeMetadata": true
  }
}
```

**Quantization Types:**

- `"int8"` (recommended): Full integer quantization - best for microcontrollers (smallest size, fastest inference)
- `"float16"`: Float16 weight quantization - moderate compression
- `"dynamic"`: Dynamic range quantization - weights to int8, activations stay float

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "cppCode": "alignas(8) const unsigned char g_person_detect_model_data[] = {...}",
    "modelSize": 18432,
    "arrayName": "g_person_detect_model_data",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (4xx/5xx):**

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "details": "Detailed error information",
    "type": "ERROR_TYPE",
    "suggestions": ["Suggestion 1", "Suggestion 2"],
    "retryable": true
  }
}
```

### GET /api/health

Health check endpoint to verify the API is running.

**Response (200):**

```json
{
  "status": "healthy",
  "service": "TFLite Conversion API",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Error Types

- `VALIDATION_ERROR`: Invalid request data (not retryable)
- `CONVERSION_ERROR`: Model conversion failed (retryable)
- `UNSUPPORTED_OPS`: Model contains unsupported operations (not retryable)
- `SIZE_LIMIT`: Model exceeds size limits (not retryable)
- `NETWORK`: Network-related errors (retryable)
- `UNKNOWN`: Unexpected errors (retryable)

## Configuration

- **Max Upload Size**: 10MB (configurable in `app.py`)
- **Port**: 5000 (default)
- **CORS**: Enabled for `localhost:5173` and `localhost:3000`

## Testing

Run the test suite:

```bash
pytest tests/test_api.py -v
```

Run with coverage:

```bash
pytest tests/test_api.py --cov=app --cov-report=html
```

## Production Deployment

For production, use a WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

Or use uWSGI:

```bash
pip install uwsgi
uwsgi --http :5000 --wsgi-file app.py --callable app --processes 4
```

## Notes

- The API automatically cleans up temporary files after each conversion
- Conversion timeout is set to 60 seconds
- Large models (>10MB) will be rejected
- Quantization is enabled by default to reduce model size
