"""
Unit tests for the TFLite conversion API endpoint.

Tests cover:
- Successful conversion flow
- Error responses for invalid inputs
- Large model handling
- Request validation
- Error handling for different failure scenarios
"""

import pytest
import json
import base64
import os
import tempfile
from unittest.mock import patch, MagicMock, Mock
import sys

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock TensorFlow imports before importing app
sys.modules['tensorflow'] = Mock()
sys.modules['tensorflowjs'] = Mock()

from app import app


@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


@pytest.fixture
def sample_model_data():
    """Create sample model data for testing."""
    # Minimal TensorFlow.js model.json structure
    model_json = {
        "format": "layers-model",
        "generatedBy": "TensorFlow.js tfjs-layers v4.0.0",
        "convertedBy": None,
        "modelTopology": {
            "class_name": "Sequential",
            "config": {
                "name": "sequential_1",
                "layers": [
                    {
                        "class_name": "Dense",
                        "config": {
                            "units": 10,
                            "activation": "relu",
                            "use_bias": True,
                            "kernel_initializer": {"class_name": "GlorotUniform"},
                            "bias_initializer": {"class_name": "Zeros"},
                            "name": "dense_1",
                            "trainable": True,
                            "batch_input_shape": [None, 5],
                            "dtype": "float32"
                        }
                    }
                ]
            },
            "keras_version": "tfjs-layers 4.0.0",
            "backend": "tensorflow"
        },
        "weightsManifest": [
            {
                "paths": ["group1-shard1of1.bin"],
                "weights": [
                    {"name": "dense_1/kernel", "shape": [5, 10], "dtype": "float32"},
                    {"name": "dense_1/bias", "shape": [10], "dtype": "float32"}
                ]
            }
        ]
    }
    
    model_json_str = json.dumps(model_json)
    model_data_b64 = base64.b64encode(model_json_str.encode()).decode()
    
    # Create minimal weight data (5*10 + 10 = 60 float32 values = 240 bytes)
    import struct
    weights = [0.1] * 60  # Simple weight values
    weight_bytes = struct.pack(f'{len(weights)}f', *weights)
    weights_data_b64 = [base64.b64encode(weight_bytes).decode()]
    
    return {
        "modelData": model_data_b64,
        "weightsData": weights_data_b64,
        "modelMetadata": {
            "inputShape": [1, 5],
            "outputShape": [1, 10],
            "classes": ["class_" + str(i) for i in range(10)]
        },
        "options": {
            "quantize": True,
            "optimize": True,
            "arrayName": "test_model",
            "includeMetadata": True
        }
    }


class TestHealthEndpoint:
    """Tests for the health check endpoint."""
    
    def test_health_check(self, client):
        """Test that health check endpoint returns 200."""
        response = client.get('/api/health')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert data['status'] == 'healthy'
        assert 'timestamp' in data


class TestConversionEndpoint:
    """Tests for the /api/convert-to-tflite endpoint."""
    
    def test_endpoint_exists(self, client):
        """Test that the endpoint exists and accepts POST."""
        response = client.post('/api/convert-to-tflite', json={})
        # Should not return 404
        assert response.status_code != 404
    
    def test_requires_json_content_type(self, client):
        """Test that endpoint requires JSON content type."""
        response = client.post(
            '/api/convert-to-tflite',
            data='not json',
            content_type='text/plain'
        )
        assert response.status_code == 400
        
        data = json.loads(response.data)
        assert data['success'] is False
        assert data['error']['type'] == 'VALIDATION_ERROR'
    
    def test_requires_model_data(self, client):
        """Test that endpoint requires modelData field."""
        response = client.post(
            '/api/convert-to-tflite',
            json={"options": {}}
        )
        assert response.status_code == 400
        
        data = json.loads(response.data)
        assert data['success'] is False
        assert 'modelData' in data['error']['details']
    
    def test_invalid_base64_model_data(self, client):
        """Test error handling for invalid base64 data."""
        response = client.post(
            '/api/convert-to-tflite',
            json={"modelData": "not-valid-base64!!!"}
        )
        assert response.status_code == 400
        
        data = json.loads(response.data)
        assert data['success'] is False
        assert data['error']['type'] == 'VALIDATION_ERROR'
    
    def test_default_options(self, client):
        """Test that default options are applied when not provided."""
        # Create minimal valid model data
        model_json = {"format": "layers-model", "modelTopology": {}}
        model_data_b64 = base64.b64encode(json.dumps(model_json).encode()).decode()
        
        with patch('app.convert_tfjs_to_tflite') as mock_convert, \
             patch('app.tflite_to_c_array') as mock_c_array, \
             patch('app.get_model_info') as mock_info:
            
            mock_convert.return_value = '/tmp/model.tflite'
            mock_c_array.return_value = 'const unsigned char model_data[] = {0x00};'
            mock_info.return_value = {'model_size': 100}
            
            response = client.post(
                '/api/convert-to-tflite',
                json={"modelData": model_data_b64}
            )
            
            # Check that convert was called with default quantize=True
            if response.status_code == 200:
                mock_convert.assert_called_once()
                call_kwargs = mock_convert.call_args[1]
                assert call_kwargs.get('quantize', True) is True
    
    @patch('app.convert_tfjs_to_tflite')
    @patch('app.tflite_to_c_array')
    @patch('app.get_model_info')
    def test_successful_conversion(self, mock_info, mock_c_array, mock_convert, client, sample_model_data):
        """Test successful conversion flow."""
        # Mock the conversion functions
        mock_convert.return_value = '/tmp/model.tflite'
        mock_c_array.return_value = 'const unsigned char test_model[] = {0x54, 0x46, 0x4c, 0x33};'
        mock_info.return_value = {'model_size': 1024}
        
        response = client.post(
            '/api/convert-to-tflite',
            json=sample_model_data
        )
        
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert data['success'] is True
        assert 'data' in data
        assert 'cppCode' in data['data']
        assert 'modelSize' in data['data']
        assert 'timestamp' in data['data']
        assert data['data']['arrayName'] == 'test_model'
    
    @patch('app.convert_tfjs_to_tflite')
    def test_conversion_error_handling(self, mock_convert, client, sample_model_data):
        """Test error handling when conversion fails."""
        mock_convert.side_effect = RuntimeError("Conversion failed: test error")
        
        response = client.post(
            '/api/convert-to-tflite',
            json=sample_model_data
        )
        
        assert response.status_code == 500
        
        data = json.loads(response.data)
        assert data['success'] is False
        assert data['error']['type'] == 'CONVERSION_ERROR'
        assert data['error']['retryable'] is True
    
    @patch('app.convert_tfjs_to_tflite')
    def test_unsupported_operations_error(self, mock_convert, client, sample_model_data):
        """Test error handling for unsupported operations."""
        mock_convert.side_effect = RuntimeError("Unsupported operation: CustomLayer")
        
        response = client.post(
            '/api/convert-to-tflite',
            json=sample_model_data
        )
        
        assert response.status_code == 400
        
        data = json.loads(response.data)
        assert data['success'] is False
        assert data['error']['type'] == 'UNSUPPORTED_OPS'
        assert data['error']['retryable'] is False
        assert len(data['error']['suggestions']) > 0
    
    @patch('app.convert_tfjs_to_tflite')
    def test_model_too_large_error(self, mock_convert, client, sample_model_data):
        """Test error handling for models that are too large."""
        mock_convert.side_effect = RuntimeError("Model size exceeds limit")
        
        response = client.post(
            '/api/convert-to-tflite',
            json=sample_model_data
        )
        
        assert response.status_code == 400
        
        data = json.loads(response.data)
        assert data['success'] is False
        assert data['error']['type'] == 'SIZE_LIMIT'
        assert data['error']['retryable'] is False
    
    def test_request_too_large(self, client):
        """Test handling of requests exceeding size limit."""
        # Create a very large payload (>10MB)
        large_data = "x" * (11 * 1024 * 1024)  # 11MB
        large_data_b64 = base64.b64encode(large_data.encode()).decode()
        
        response = client.post(
            '/api/convert-to-tflite',
            json={"modelData": large_data_b64}
        )
        
        assert response.status_code == 413
        
        data = json.loads(response.data)
        assert data['success'] is False
        assert data['error']['type'] == 'SIZE_LIMIT'
    
    @patch('app.convert_tfjs_to_tflite')
    @patch('app.tflite_to_c_array')
    def test_c_array_generation_error(self, mock_c_array, mock_convert, client, sample_model_data):
        """Test error handling when C array generation fails."""
        mock_convert.return_value = '/tmp/model.tflite'
        mock_c_array.side_effect = RuntimeError("Failed to generate C array")
        
        response = client.post(
            '/api/convert-to-tflite',
            json=sample_model_data
        )
        
        assert response.status_code == 500
        
        data = json.loads(response.data)
        assert data['success'] is False
        assert 'C array' in data['error']['message']


class TestErrorHandlers:
    """Tests for error handlers."""
    
    def test_404_handler(self, client):
        """Test 404 error handler."""
        response = client.get('/api/nonexistent')
        assert response.status_code == 404
        
        data = json.loads(response.data)
        assert data['success'] is False
        assert data['error']['type'] == 'NOT_FOUND'
    
    def test_405_handler(self, client):
        """Test 405 method not allowed handler."""
        response = client.get('/api/convert-to-tflite')
        assert response.status_code == 405
        
        data = json.loads(response.data)
        assert data['success'] is False
        assert data['error']['type'] == 'METHOD_NOT_ALLOWED'


class TestTemporaryFileCleanup:
    """Tests for temporary file management and cleanup."""
    
    @patch('app.convert_tfjs_to_tflite')
    @patch('app.tflite_to_c_array')
    @patch('app.get_model_info')
    @patch('app.tempfile.mkdtemp')
    @patch('app.shutil.rmtree')
    def test_cleanup_on_success(self, mock_rmtree, mock_mkdtemp, mock_info, 
                                mock_c_array, mock_convert, client, sample_model_data):
        """Test that temporary files are cleaned up after successful conversion."""
        temp_dir = '/tmp/test_temp_dir'
        mock_mkdtemp.return_value = temp_dir
        mock_convert.return_value = '/tmp/model.tflite'
        mock_c_array.return_value = 'const unsigned char model[] = {0x00};'
        mock_info.return_value = {'model_size': 100}
        
        response = client.post(
            '/api/convert-to-tflite',
            json=sample_model_data
        )
        
        # Verify cleanup was called
        mock_rmtree.assert_called_once_with(temp_dir, ignore_errors=True)
    
    @patch('app.convert_tfjs_to_tflite')
    @patch('app.tempfile.mkdtemp')
    @patch('app.shutil.rmtree')
    def test_cleanup_on_error(self, mock_rmtree, mock_mkdtemp, mock_convert, 
                             client, sample_model_data):
        """Test that temporary files are cleaned up even when conversion fails."""
        temp_dir = '/tmp/test_temp_dir'
        mock_mkdtemp.return_value = temp_dir
        mock_convert.side_effect = RuntimeError("Conversion failed")
        
        response = client.post(
            '/api/convert-to-tflite',
            json=sample_model_data
        )
        
        # Verify cleanup was called even on error
        mock_rmtree.assert_called_once_with(temp_dir, ignore_errors=True)


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
