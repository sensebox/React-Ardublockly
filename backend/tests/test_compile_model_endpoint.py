"""
Unit tests for the /api/compile-model endpoint.

Tests compilation workflow, error handling, options validation, and response formatting.
"""

import os
import pytest
import json
import base64
from unittest.mock import patch, Mock, MagicMock

# Set testing flag before importing app
os.environ['TESTING'] = 'true'
os.environ['VITE_BLOCKLY_API'] = 'http://test-compiler.com'

from app import app
from services.compiler_service import CompilationError, CompilerTimeoutError, CompilerConnectionError


@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


@pytest.fixture
def sample_model_data():
    """Create sample TFLite model data."""
    # Create minimal valid TFLite model bytes
    model_bytes = b'TFL3' + b'\x00' * 100  # Minimal TFLite format
    return base64.b64encode(model_bytes).decode('utf-8')


class TestCompileModelEndpoint:
    """Test the /api/compile-model endpoint."""
    
    def test_endpoint_exists(self, client):
        """Test that the endpoint exists and accepts POST."""
        response = client.post('/api/compile-model', json={})
        # Should not be 404
        assert response.status_code != 404
    
    def test_requires_json_content_type(self, client):
        """Test that endpoint requires JSON content type."""
        response = client.post('/api/compile-model', data='not json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['success'] is False
        assert 'content type' in data['error']['message'].lower()
    
    def test_requires_model_data(self, client):
        """Test that endpoint requires modelData field."""
        response = client.post('/api/compile-model', json={'options': {}})
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['success'] is False
        assert 'model' in data['error']['message'].lower()
    
    def test_invalid_base64_model_data(self, client):
        """Test handling of invalid base64 model data."""
        response = client.post('/api/compile-model', json={
            'modelData': 'not-valid-base64!!!'
        })
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['success'] is False
        assert 'encoding' in data['error']['message'].lower()
    
    @patch('app.inject_model_data')
    @patch('app.compile_sketch')
    def test_successful_compilation(self, mock_compile, mock_inject, client, sample_model_data):
        """Test successful model compilation."""
        # Mock services
        mock_inject.return_value = "void setup() {} void loop() {}"
        mock_compile.return_value = b'\x00' * 100000  # 100KB binary
        
        response = client.post('/api/compile-model', json={
            'modelData': sample_model_data
        })
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert 'binary' in data['data']
        assert 'modelSize' in data['data']
        assert 'binarySize' in data['data']
        assert 'timestamp' in data['data']
        
        # Verify binary is base64 encoded
        binary_data = base64.b64decode(data['data']['binary'])
        assert len(binary_data) == 100000
    
    @patch('app.inject_model_data')
    @patch('app.compile_sketch')
    def test_compilation_with_custom_board(self, mock_compile, mock_inject, client, sample_model_data):
        """Test compilation with custom board option."""
        mock_inject.return_value = "void setup() {} void loop() {}"
        mock_compile.return_value = b'\x00' * 50000
        
        response = client.post('/api/compile-model', json={
            'modelData': sample_model_data,
            'options': {
                'board': 'sensebox:esp32s2'
            }
        })
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert data['data']['board'] == 'sensebox:esp32s2'
        
        # Verify compile_sketch was called with correct board
        mock_compile.assert_called_once()
        call_kwargs = mock_compile.call_args[1]
        assert call_kwargs['board'] == 'sensebox:esp32s2'
    
    @patch('app.inject_model_data')
    @patch('app.compile_sketch')
    def test_compilation_with_optimization(self, mock_compile, mock_inject, client, sample_model_data):
        """Test compilation with optimization option."""
        mock_inject.return_value = "void setup() {} void loop() {}"
        mock_compile.return_value = b'\x00' * 50000
        
        response = client.post('/api/compile-model', json={
            'modelData': sample_model_data,
            'options': {
                'optimization': 'size'
            }
        })
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert data['data']['optimization'] == 'size'
        
        # Verify compile_sketch was called with correct optimization
        call_kwargs = mock_compile.call_args[1]
        assert call_kwargs['optimization'] == 'size'
    
    def test_invalid_board_type(self, client, sample_model_data):
        """Test handling of invalid board type."""
        response = client.post('/api/compile-model', json={
            'modelData': sample_model_data,
            'options': {
                'board': ''  # Empty string
            }
        })
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['success'] is False
        assert 'board' in data['error']['message'].lower()
    
    def test_invalid_optimization(self, client, sample_model_data):
        """Test handling of invalid optimization level."""
        response = client.post('/api/compile-model', json={
            'modelData': sample_model_data,
            'options': {
                'optimization': 'turbo'  # Invalid option
            }
        })
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['success'] is False
        assert 'optimization' in data['error']['message'].lower()
    
    @patch('app.inject_model_data')
    def test_injection_error(self, mock_inject, client, sample_model_data):
        """Test handling of model injection errors."""
        mock_inject.side_effect = RuntimeError("Template not found")
        
        response = client.post('/api/compile-model', json={
            'modelData': sample_model_data
        })
        
        assert response.status_code == 500
        data = json.loads(response.data)
        assert data['success'] is False
        assert 'injection' in data['error']['message'].lower()
    
    @patch('app.inject_model_data')
    @patch('app.compile_sketch')
    def test_compilation_timeout_error(self, mock_compile, mock_inject, client, sample_model_data):
        """Test handling of compilation timeout."""
        mock_inject.return_value = "void setup() {} void loop() {}"
        mock_compile.side_effect = CompilerTimeoutError(
            message="Compilation timeout",
            details="Compiler did not respond"
        )
        
        response = client.post('/api/compile-model', json={
            'modelData': sample_model_data
        })
        
        assert response.status_code == 504
        data = json.loads(response.data)
        assert data['success'] is False
        assert data['error']['type'] == 'TIMEOUT'
        assert data['error']['retryable'] is True
    
    @patch('app.inject_model_data')
    @patch('app.compile_sketch')
    def test_compilation_connection_error(self, mock_compile, mock_inject, client, sample_model_data):
        """Test handling of compiler connection errors."""
        mock_inject.return_value = "void setup() {} void loop() {}"
        mock_compile.side_effect = CompilerConnectionError(
            message="Cannot connect to compiler",
            details="Connection refused"
        )
        
        response = client.post('/api/compile-model', json={
            'modelData': sample_model_data
        })
        
        assert response.status_code == 503
        data = json.loads(response.data)
        assert data['success'] is False
        assert data['error']['type'] == 'CONNECTION_ERROR'
        assert data['error']['retryable'] is True
    
    @patch('app.inject_model_data')
    @patch('app.compile_sketch')
    def test_compilation_error_non_retryable(self, mock_compile, mock_inject, client, sample_model_data):
        """Test handling of non-retryable compilation errors."""
        mock_inject.return_value = "void setup() {} void loop() {}"
        mock_compile.side_effect = CompilationError(
            message="Syntax error",
            details="expected ';' before '}'",
            error_type="SYNTAX_ERROR",
            retryable=False
        )
        
        response = client.post('/api/compile-model', json={
            'modelData': sample_model_data
        })
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data['success'] is False
        assert data['error']['type'] == 'SYNTAX_ERROR'
        assert data['error']['retryable'] is False
    
    @patch('app.inject_model_data')
    @patch('app.compile_sketch')
    def test_compile_only_option(self, mock_compile, mock_inject, client, sample_model_data):
        """Test compileOnly option (no binary returned)."""
        mock_inject.return_value = "void setup() {} void loop() {}"
        mock_compile.return_value = b'\x00' * 100000
        
        response = client.post('/api/compile-model', json={
            'modelData': sample_model_data,
            'options': {
                'compileOnly': True
            }
        })
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        assert data['data']['compiled'] is True
        assert 'binary' not in data['data']  # Binary should not be included
        assert 'modelSize' in data['data']
        assert 'timestamp' in data['data']
    
    @patch('app.inject_model_data')
    @patch('app.compile_sketch')
    def test_response_metadata(self, mock_compile, mock_inject, client, sample_model_data):
        """Test that response includes all required metadata."""
        mock_inject.return_value = "void setup() {} void loop() {}"
        mock_compile.return_value = b'\x00' * 75000
        
        response = client.post('/api/compile-model', json={
            'modelData': sample_model_data,
            'options': {
                'board': 'arduino:avr:uno',
                'optimization': 'speed'
            }
        })
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        
        # Check all metadata fields
        assert data['data']['modelSize'] > 0
        assert data['data']['binarySize'] == 75000
        assert data['data']['board'] == 'arduino:avr:uno'
        assert data['data']['optimization'] == 'speed'
        assert 'timestamp' in data['data']
        # Verify timestamp format
        assert data['data']['timestamp'].endswith('Z')


class TestCompileModelErrorHandling:
    """Test error handling for various failure scenarios."""
    
    def test_empty_request_body(self, client):
        """Test handling of completely empty request."""
        # When body is truly empty, Flask returns 400
        # Our code should handle None from get_json()
        response = client.post('/api/compile-model', json=None)
        
        # Accept either 400 or 500 as both are valid error responses
        assert response.status_code in [400, 500]
        data = json.loads(response.data)
        assert data['success'] is False
    
    @patch('app.inject_model_data')
    @patch('app.compile_sketch')
    def test_unexpected_error(self, mock_compile, mock_inject, client, sample_model_data):
        """Test handling of unexpected errors."""
        mock_inject.return_value = "void setup() {} void loop() {}"
        mock_compile.side_effect = ValueError("Unexpected error")
        
        response = client.post('/api/compile-model', json={
            'modelData': sample_model_data
        })
        
        assert response.status_code == 500
        data = json.loads(response.data)
        assert data['success'] is False
        assert data['error']['type'] == 'UNEXPECTED_ERROR'
        assert data['error']['retryable'] is True


class TestCompileModelIntegration:
    """Integration-style tests (with mocked services)."""
    
    @patch('app.inject_model_data')
    @patch('app.compile_sketch')
    def test_full_workflow(self, mock_compile, mock_inject, client, sample_model_data):
        """Test complete compilation workflow."""
        # Mock the full workflow
        mock_inject.return_value = "void setup() { /* model code */ } void loop() {}"
        binary_data = b'\xE9' + b'\x00' * 200000  # 200KB binary
        mock_compile.return_value = binary_data
        
        # Make request
        response = client.post('/api/compile-model', json={
            'modelData': sample_model_data,
            'options': {
                'board': 'esp32:esp32:esp32',
                'optimization': 'default'
            }
        })
        
        # Verify response
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['success'] is True
        
        # Verify services were called correctly
        assert mock_inject.called
        assert mock_compile.called
        
        # Verify inject was called with decoded model bytes
        inject_call_args = mock_inject.call_args[0]
        assert len(inject_call_args[0]) > 0  # Model bytes
        
        # Verify compile was called with injected sketch
        compile_call_kwargs = mock_compile.call_args[1]
        assert compile_call_kwargs['board'] == 'esp32:esp32:esp32'
        assert compile_call_kwargs['optimization'] == 'default'
        
        # Verify binary in response
        returned_binary = base64.b64decode(data['data']['binary'])
        assert returned_binary == binary_data
