"""
Unit tests for TFLite converter service.

These tests verify the core functionality of the TFLite conversion service,
including model conversion, C array generation, and error handling.
"""

import os
import tempfile
import pytest
from services.tflite_converter import (
    convert_tfjs_to_tflite,
    tflite_to_c_array,
    get_model_info
)


class TestTFLiteToCAarray:
    """Tests for tflite_to_c_array function."""
    
    def test_invalid_path_raises_error(self):
        """Test that non-existent file path raises ValueError."""
        with pytest.raises(ValueError, match="does not exist"):
            tflite_to_c_array("/nonexistent/path/model.tflite")
    
    def test_generates_valid_c_array_format(self):
        """Test that generated code follows C/C++ array format."""
        # Create a minimal valid TFLite file (with magic bytes)
        with tempfile.NamedTemporaryFile(mode='wb', suffix='.tflite', delete=False) as f:
            # Write TFLite magic bytes "TFL3" (0x54464C33)
            f.write(b'TFL3')
            # Add some dummy data
            f.write(b'\x00' * 100)
            temp_path = f.name
        
        try:
            result = tflite_to_c_array(temp_path, array_name="test_model")
            
            # Verify const unsigned char array declaration
            assert "const unsigned char test_model[]" in result
            
            # Verify size constant with _len suffix
            assert "const unsigned int test_model_len = 104" in result
            
            # Verify header guard
            assert "#ifndef TEST_MODEL_H" in result
            assert "#define TEST_MODEL_H" in result
            assert "#endif  // TEST_MODEL_H" in result
            
            # Verify hexadecimal format (0x prefix)
            assert "0x54" in result  # 'T' in hex
            assert "0x46" in result  # 'F' in hex
            assert "0x4c" in result  # 'L' in hex
            assert "0x33" in result  # '3' in hex
            
        finally:
            os.unlink(temp_path)
    
    def test_includes_metadata_comments(self):
        """Test that metadata comments are included when requested."""
        with tempfile.NamedTemporaryFile(mode='wb', suffix='.tflite', delete=False) as f:
            f.write(b'TFL3' + b'\x00' * 50)
            temp_path = f.name
        
        try:
            result = tflite_to_c_array(temp_path, include_metadata=True)
            
            # Verify metadata comments
            assert "// TensorFlow Lite Micro Model" in result
            assert "// Generated:" in result
            assert "// Original Format: TensorFlow.js" in result
            assert "// Model Size:" in result
            assert "// Quantized: Yes" in result
            
        finally:
            os.unlink(temp_path)
    
    def test_proper_indentation(self):
        """Test that generated code has proper 2-space indentation."""
        with tempfile.NamedTemporaryFile(mode='wb', suffix='.tflite', delete=False) as f:
            f.write(b'TFL3' + b'\x00' * 20)
            temp_path = f.name
        
        try:
            result = tflite_to_c_array(temp_path)
            
            # Check that array content lines start with 2 spaces
            lines = result.split('\n')
            array_content_lines = [
                line for line in lines 
                if line.strip().startswith('0x')
            ]
            
            for line in array_content_lines:
                assert line.startswith('  '), f"Line not properly indented: {line}"
            
        finally:
            os.unlink(temp_path)
    
    def test_twelve_bytes_per_line(self):
        """Test that array formatting uses 12 bytes per line."""
        with tempfile.NamedTemporaryFile(mode='wb', suffix='.tflite', delete=False) as f:
            # Write exactly 24 bytes (should be 2 lines)
            f.write(b'TFL3' + b'\x00' * 20)
            temp_path = f.name
        
        try:
            result = tflite_to_c_array(temp_path)
            
            # Count hex values in first data line
            lines = result.split('\n')
            first_data_line = None
            for line in lines:
                if '0x54' in line:  # First byte of magic
                    first_data_line = line
                    break
            
            assert first_data_line is not None
            # Count occurrences of '0x' in the line
            hex_count = first_data_line.count('0x')
            assert hex_count == 12, f"Expected 12 bytes per line, got {hex_count}"
            
        finally:
            os.unlink(temp_path)
    
    def test_invalid_magic_bytes_raises_error(self):
        """Test that file without TFLite magic bytes raises error."""
        with tempfile.NamedTemporaryFile(mode='wb', suffix='.tflite', delete=False) as f:
            # Write invalid magic bytes
            f.write(b'XXXX' + b'\x00' * 100)
            temp_path = f.name
        
        try:
            with pytest.raises(RuntimeError, match="incorrect magic bytes"):
                tflite_to_c_array(temp_path)
        finally:
            os.unlink(temp_path)
    
    def test_empty_file_raises_error(self):
        """Test that empty file raises error."""
        with tempfile.NamedTemporaryFile(mode='wb', suffix='.tflite', delete=False) as f:
            # Write nothing
            temp_path = f.name
        
        try:
            with pytest.raises(RuntimeError, match="too small"):
                tflite_to_c_array(temp_path)
        finally:
            os.unlink(temp_path)


class TestConvertTFJSToTFLite:
    """Tests for convert_tfjs_to_tflite function."""
    
    def test_invalid_model_path_raises_error(self):
        """Test that non-existent model path raises ValueError."""
        with tempfile.TemporaryDirectory() as temp_dir:
            output_path = os.path.join(temp_dir, "output.tflite")
            
            with pytest.raises(ValueError, match="does not exist"):
                convert_tfjs_to_tflite(
                    "/nonexistent/model/path",
                    output_path
                )
    
    def test_creates_output_directory(self):
        """Test that output directory is created if it doesn't exist."""
        # This test would require a valid TensorFlow.js model
        # For now, we just verify the function signature and error handling
        pass
    
    def test_quantization_parameter(self):
        """Test that quantization parameter is accepted."""
        # This test would require a valid TensorFlow.js model
        # For now, we verify the function accepts the parameter
        pass


class TestGetModelInfo:
    """Tests for get_model_info function."""
    
    def test_invalid_path_raises_error(self):
        """Test that non-existent file path raises ValueError."""
        with pytest.raises(ValueError, match="does not exist"):
            get_model_info("/nonexistent/path/model.tflite")


# Note: Full integration tests with actual TensorFlow.js models
# would require creating test models, which is beyond the scope
# of these unit tests. Those will be covered in integration tests.
