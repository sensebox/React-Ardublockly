"""
Unit tests for the compiler service module.

Tests compilation workflow, error handling, timeout logic, retry mechanisms,
and binary validation.
"""

import os
import pytest
import base64
from unittest.mock import Mock, patch, MagicMock
from services.compiler_service import (
    compile_sketch,
    validate_config,
    parse_compiler_error,
    validate_binary,
    CompilationError,
    CompilerTimeoutError,
    CompilerConnectionError,
    COMPILER_URL,
    MIN_BINARY_SIZE,
    MAX_BINARY_SIZE
)
import requests


class TestConfigValidation:
    """Test configuration validation."""
    
    def test_validate_config_success(self):
        """Test that valid configuration passes validation."""
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://localhost:3000',
            'COMPILATION_TIMEOUT': '120'
        }):
            is_valid, error = validate_config()
            assert is_valid is True
            assert error is None
    
    def test_validate_config_missing_url(self):
        """Test that missing compiler URL fails validation."""
        with patch('services.compiler_service.COMPILER_URL', ''):
            is_valid, error = validate_config()
            assert is_valid is False
            assert 'not set' in error.lower()
    
    def test_validate_config_invalid_url_format(self):
        """Test that invalid URL format fails validation."""
        with patch('services.compiler_service.COMPILER_URL', 'invalid-url'):
            is_valid, error = validate_config()
            assert is_valid is False
            assert 'invalid' in error.lower()
    
    def test_validate_config_invalid_timeout(self):
        """Test that invalid timeout fails validation."""
        with patch('services.compiler_service.COMPILATION_TIMEOUT', -1):
            is_valid, error = validate_config()
            assert is_valid is False
            assert 'timeout' in error.lower()


class TestErrorParsing:
    """Test compiler error parsing and formatting."""
    
    def test_parse_basic_error(self):
        """Test parsing a basic error response."""
        response_data = {"error": "Compilation failed"}
        error_info = parse_compiler_error(response_data, 400)
        
        assert error_info['message'] == "Compilation failed"
        assert error_info['type'] == "COMPILATION_ERROR"
        assert isinstance(error_info['suggestions'], list)
    
    def test_parse_file_not_found_error(self):
        """Test that file not found errors are properly categorized."""
        response_data = {"error": "fatal error: SomeHeader.h: No such file or directory"}
        error_info = parse_compiler_error(response_data, 400)
        
        assert error_info['type'] == "FILE_NOT_FOUND"
        assert len(error_info['suggestions']) > 0
    
    def test_parse_undeclared_identifier_error(self):
        """Test that undeclared identifier errors are properly categorized."""
        response_data = {"stderr": "'someFunction' was not declared in this scope"}
        error_info = parse_compiler_error(response_data, 400)
        
        assert error_info['type'] == "UNDECLARED_IDENTIFIER"
        assert any('declaration' in s.lower() for s in error_info['suggestions'])
    
    def test_parse_syntax_error(self):
        """Test that syntax errors are properly categorized."""
        response_data = {"error": "expected ';' before '}' token"}
        error_info = parse_compiler_error(response_data, 400)
        
        assert error_info['type'] == "SYNTAX_ERROR"
        assert any('semicolon' in s.lower() for s in error_info['suggestions'])
    
    def test_parse_duplicate_definition_error(self):
        """Test that duplicate definition errors are properly categorized."""
        response_data = {"error": "multiple definition of 'myFunction'"}
        error_info = parse_compiler_error(response_data, 400)
        
        assert error_info['type'] == "DUPLICATE_DEFINITION"
        assert any('duplicate' in s.lower() for s in error_info['suggestions'])
    
    def test_parse_timeout_error(self):
        """Test that timeout errors are marked as retryable."""
        response_data = {"error": "Request timeout"}
        error_info = parse_compiler_error(response_data, 504)
        
        assert error_info['type'] == "TIMEOUT"
        assert error_info['retryable'] is True
    
    def test_parse_server_error(self):
        """Test that server errors are marked as retryable."""
        response_data = {"error": "Internal server error"}
        error_info = parse_compiler_error(response_data, 500)
        
        assert error_info['type'] == "SERVER_ERROR"
        assert error_info['retryable'] is True
    
    def test_parse_string_response(self):
        """Test parsing non-JSON error responses."""
        response_data = "Compilation error occurred"
        error_info = parse_compiler_error(response_data, 400)
        
        assert error_info['details'] == response_data


class TestBinaryValidation:
    """Test binary validation logic."""
    
    def test_validate_valid_binary(self):
        """Test that valid binary passes validation."""
        # Create a binary of reasonable size (100KB)
        binary_data = b'\x00' * 100000
        is_valid, error = validate_binary(binary_data)
        
        assert is_valid is True
        assert error is None
    
    def test_validate_empty_binary(self):
        """Test that empty binary fails validation."""
        binary_data = b''
        is_valid, error = validate_binary(binary_data)
        
        assert is_valid is False
        assert 'empty' in error.lower()
    
    def test_validate_too_small_binary(self):
        """Test that too-small binary fails validation."""
        binary_data = b'\x00' * 100  # Only 100 bytes
        is_valid, error = validate_binary(binary_data)
        
        assert is_valid is False
        assert 'too small' in error.lower()
    
    def test_validate_too_large_binary(self):
        """Test that too-large binary fails validation."""
        binary_data = b'\x00' * (MAX_BINARY_SIZE + 1000)
        is_valid, error = validate_binary(binary_data)
        
        assert is_valid is False
        assert 'too large' in error.lower()
    
    def test_validate_minimum_size_boundary(self):
        """Test binary at minimum size boundary."""
        binary_data = b'\x00' * MIN_BINARY_SIZE
        is_valid, error = validate_binary(binary_data)
        
        assert is_valid is True
        assert error is None


class TestCompileSketch:
    """Test the main compile_sketch function."""
    
    @patch('services.compiler_service.requests.post')
    def test_successful_compilation_raw_binary(self, mock_post):
        """Test successful compilation with raw binary response."""
        # Create mock binary response
        binary_data = b'\xE9' + b'\x00' * 100000  # 100KB binary with ESP32 magic byte
        
        mock_response = Mock()
        mock_response.ok = True
        mock_response.status_code = 200
        mock_response.content = binary_data
        mock_response.json.side_effect = ValueError("Not JSON")
        mock_post.return_value = mock_response
        
        sketch = "void setup() {} void loop() {}"
        result = compile_sketch(sketch, board="esp32:esp32:sensebox_eye")
        
        assert result == binary_data
        assert mock_post.called
        
        # Verify request format
        call_args = mock_post.call_args
        assert f"{COMPILER_URL}/compile" in call_args[0][0]
        assert call_args[1]['json']['sketch'] == sketch
        assert call_args[1]['json']['board'] == "esp32:esp32:sensebox_eye"
    
    @patch('services.compiler_service.requests.post')
    def test_successful_compilation_base64_response(self, mock_post):
        """Test successful compilation with base64-encoded binary response."""
        # Create mock binary
        binary_data = b'\x00' * 100000
        encoded_binary = base64.b64encode(binary_data).decode('utf-8')
        
        mock_response = Mock()
        mock_response.ok = True
        mock_response.status_code = 200
        mock_response.json.return_value = {"binary": encoded_binary}
        mock_post.return_value = mock_response
        
        sketch = "void setup() {} void loop() {}"
        result = compile_sketch(sketch)
        
        assert result == binary_data
    
    @patch('services.compiler_service.requests.post')
    def test_compilation_with_custom_options(self, mock_post):
        """Test compilation with custom board and optimization options."""
        binary_data = b'\x00' * 100000
        
        mock_response = Mock()
        mock_response.ok = True
        mock_response.content = binary_data
        mock_response.json.side_effect = ValueError("Not JSON")
        mock_post.return_value = mock_response
        
        sketch = "void setup() {} void loop() {}"
        result = compile_sketch(
            sketch,
            board="esp32:esp32:sensebox_eye",
            project_id="test-123",
            optimization="size"
        )
        
        assert result == binary_data
        
        # Verify custom options in request
        call_args = mock_post.call_args
        request_data = call_args[1]['json']
        assert request_data['board'] == "esp32:esp32:sensebox_eye"
        assert request_data['projectId'] == "test-123"
        assert request_data['optimization'] == "size"
    
    @patch('services.compiler_service.requests.post')
    def test_compilation_error_non_retryable(self, mock_post):
        """Test that non-retryable compilation errors raise immediately."""
        mock_response = Mock()
        mock_response.ok = False
        mock_response.status_code = 400
        mock_response.json.return_value = {
            "error": "Syntax error: expected ';' before '}'"
        }
        mock_post.return_value = mock_response
        
        sketch = "void setup() { void loop() {}"
        
        with pytest.raises(CompilationError) as exc_info:
            compile_sketch(sketch)
        
        assert exc_info.value.error_type == "SYNTAX_ERROR"
        assert exc_info.value.retryable is False
        # Should not retry non-retryable errors
        assert mock_post.call_count == 1
    
    @patch('services.compiler_service.requests.post')
    @patch('services.compiler_service.time.sleep')  # Mock sleep to speed up test
    def test_compilation_retry_on_timeout(self, mock_sleep, mock_post):
        """Test that timeout errors trigger retry logic."""
        # First two attempts timeout, third succeeds
        binary_data = b'\x00' * 100000
        
        mock_post.side_effect = [
            requests.exceptions.Timeout(),
            requests.exceptions.Timeout(),
            Mock(ok=True, content=binary_data, json=Mock(side_effect=ValueError))
        ]
        
        sketch = "void setup() {} void loop() {}"
        result = compile_sketch(sketch)
        
        assert result == binary_data
        assert mock_post.call_count == 3
        assert mock_sleep.call_count == 2  # Sleep between retries
    
    @patch('services.compiler_service.requests.post')
    @patch('services.compiler_service.time.sleep')
    def test_compilation_retry_on_connection_error(self, mock_sleep, mock_post):
        """Test that connection errors trigger retry logic."""
        binary_data = b'\x00' * 100000
        
        # First attempt fails with connection error, second succeeds
        mock_post.side_effect = [
            requests.exceptions.ConnectionError("Connection refused"),
            Mock(ok=True, content=binary_data, json=Mock(side_effect=ValueError))
        ]
        
        sketch = "void setup() {} void loop() {}"
        result = compile_sketch(sketch)
        
        assert result == binary_data
        assert mock_post.call_count == 2
    
    @patch('services.compiler_service.requests.post')
    @patch('services.compiler_service.time.sleep')
    def test_compilation_max_retries_exceeded(self, mock_sleep, mock_post):
        """Test that max retries raises appropriate error."""
        # All attempts timeout
        mock_post.side_effect = requests.exceptions.Timeout()
        
        sketch = "void setup() {} void loop() {}"
        
        with pytest.raises(CompilerTimeoutError):
            compile_sketch(sketch)
        
        # Should retry MAX_RETRIES times
        assert mock_post.call_count == 3
    
    @patch('services.compiler_service.requests.post')
    def test_compilation_invalid_binary(self, mock_post):
        """Test that invalid binary data raises error."""
        # Return binary that's too small
        invalid_binary = b'\x00' * 100
        
        mock_response = Mock()
        mock_response.ok = True
        mock_response.content = invalid_binary
        mock_response.json.side_effect = ValueError("Not JSON")
        mock_post.return_value = mock_response
        
        sketch = "void setup() {} void loop() {}"
        
        with pytest.raises(CompilationError) as exc_info:
            compile_sketch(sketch)
        
        assert exc_info.value.error_type == "INVALID_BINARY"
        assert 'too small' in str(exc_info.value.details).lower()
    
    @patch('services.compiler_service.validate_config')
    def test_compilation_invalid_config(self, mock_validate):
        """Test that invalid configuration raises error immediately."""
        mock_validate.return_value = (False, "VITE_BLOCKLY_API not set")
        
        sketch = "void setup() {} void loop() {}"
        
        with pytest.raises(CompilationError) as exc_info:
            compile_sketch(sketch)
        
        assert exc_info.value.error_type == "CONFIG_ERROR"
        assert exc_info.value.retryable is False
    
    @patch('services.compiler_service.requests.post')
    def test_compilation_server_error_retryable(self, mock_post):
        """Test that server errors are marked as retryable."""
        mock_response = Mock()
        mock_response.ok = False
        mock_response.status_code = 500
        mock_response.json.return_value = {"error": "Internal server error"}
        mock_post.return_value = mock_response
        
        sketch = "void setup() {} void loop() {}"
        
        with pytest.raises(CompilationError) as exc_info:
            compile_sketch(sketch)
        
        assert exc_info.value.error_type == "SERVER_ERROR"
        # Server errors should trigger retries
        assert mock_post.call_count == 3


class TestCompilationExceptions:
    """Test custom exception classes."""
    
    def test_compilation_error_creation(self):
        """Test CompilationError exception."""
        error = CompilationError(
            message="Test error",
            details="Test details",
            error_type="TEST_ERROR",
            retryable=True
        )
        
        assert error.message == "Test error"
        assert error.details == "Test details"
        assert error.error_type == "TEST_ERROR"
        assert error.retryable is True
    
    def test_compiler_timeout_error(self):
        """Test CompilerTimeoutError exception."""
        error = CompilerTimeoutError()
        
        assert error.error_type == "TIMEOUT"
        assert error.retryable is True
    
    def test_compiler_connection_error(self):
        """Test CompilerConnectionError exception."""
        error = CompilerConnectionError()
        
        assert error.error_type == "CONNECTION_ERROR"
        assert error.retryable is True


# Integration-style tests (require actual compiler service - can be skipped in CI)
class TestCompilerIntegration:
    """Integration tests for compiler service (requires running compiler)."""
    
    @pytest.mark.integration
    @pytest.mark.skip(reason="Requires running compiler service")
    def test_real_compilation(self):
        """Test compilation with actual compiler service."""
        sketch = """
        void setup() {
            Serial.begin(115200);
        }
        
        void loop() {
            Serial.println("Hello from TFLite!");
            delay(1000);
        }
        """
        
        result = compile_sketch(sketch, board="esp32:esp32:sensebox_eye")
        
        assert len(result) > MIN_BINARY_SIZE
        assert len(result) < MAX_BINARY_SIZE
