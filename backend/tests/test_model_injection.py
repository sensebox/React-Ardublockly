"""
Unit tests for model_injection service.

Tests the functionality of injecting TFLite model data into Arduino sketch templates,
including validation, formatting, and C++ syntax checking.
"""

import pytest
import os
import re
import tempfile
import shutil
from pathlib import Path

from services.model_injection import (
    validate_template,
    format_byte_array,
    validate_cpp_syntax,
    inject_model_data,
    get_template_path,
    get_model_placeholders_info,
    TEMPLATE_FILE,
    MODEL_DATA_ARRAY_START,
    MODEL_SIZE_PATTERN
)


class TestValidateTemplate:
    """Tests for template validation."""
    
    def test_validate_template_exists(self):
        """Test that template validation succeeds when template file exists."""
        is_valid, error = validate_template()
        assert is_valid is True
        assert error is None
    
    def test_validate_template_contains_required_markers(self):
        """Test that template contains all required placeholders."""
        # Read the actual template
        with open(TEMPLATE_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check for model data array start
        assert MODEL_DATA_ARRAY_START in content
        
        # Check for model data array end and size constant
        assert "const int g_person_detect_model_data_len" in content
        assert "alignas(8) const unsigned char g_person_detect_model_data[]" in content


class TestFormatByteArray:
    """Tests for byte array formatting."""
    
    def test_format_byte_array_single_byte(self):
        """Test formatting a single byte."""
        result = format_byte_array(b'\x01', bytes_per_line=12)
        assert result == '  0x01'
    
    def test_format_byte_array_multiple_bytes_single_line(self):
        """Test formatting multiple bytes on a single line."""
        result = format_byte_array(b'\x01\x02\x03', bytes_per_line=12)
        assert result == '  0x01, 0x02, 0x03'
    
    def test_format_byte_array_multiple_lines(self):
        """Test formatting bytes across multiple lines."""
        model_bytes = bytes(range(25))  # 0x00 to 0x18
        result = format_byte_array(model_bytes, bytes_per_line=12)
        lines = result.split('\n')
        
        # Should have 3 lines (12 + 12 + 1)
        assert len(lines) == 3
        
        # First line should have 12 bytes with trailing comma
        assert lines[0].startswith('  0x00, 0x01')
        assert lines[0].endswith(',')
        
        # Last line should not have trailing comma
        assert not lines[-1].endswith(',')
    
    def test_format_byte_array_preserves_values(self):
        """Test that all byte values are correctly formatted."""
        model_bytes = b'\x00\xff\x80\x7f'
        result = format_byte_array(model_bytes, bytes_per_line=12)
        
        assert '0x00' in result
        assert '0xff' in result
        assert '0x80' in result
        assert '0x7f' in result
    
    def test_format_byte_array_custom_bytes_per_line(self):
        """Test formatting with different bytes_per_line values."""
        model_bytes = bytes(range(10))
        
        # 2 bytes per line
        result = format_byte_array(model_bytes, bytes_per_line=2)
        lines = result.split('\n')
        assert len(lines) == 5  # 10 bytes / 2 per line
        
        # 5 bytes per line
        result = format_byte_array(model_bytes, bytes_per_line=5)
        lines = result.split('\n')
        assert len(lines) == 2  # 10 bytes / 5 per line
    
    def test_format_byte_array_indentation(self):
        """Test that all lines are properly indented."""
        model_bytes = bytes(range(30))
        result = format_byte_array(model_bytes, bytes_per_line=10)
        lines = result.split('\n')
        
        for line in lines:
            assert line.startswith('  ')  # 2 spaces indentation


class TestValidateCppSyntax:
    """Tests for C++ syntax validation."""
    
    def test_validate_cpp_syntax_valid_code(self):
        """Test validation passes for valid C++ code."""
        valid_code = """
        alignas(8) const unsigned char g_person_detect_model_data[] = {
          0x01, 0x02, 0x03,
          0x04, 0x05
        };
        const int g_person_detect_model_data_len = 5;
        """
        
        is_valid, error = validate_cpp_syntax(valid_code)
        assert is_valid is True
        assert error is None
    
    def test_validate_cpp_syntax_missing_array_declaration(self):
        """Test validation fails when array declaration is missing."""
        invalid_code = """
        const int g_person_detect_model_data_len = 5;
        """
        
        is_valid, error = validate_cpp_syntax(invalid_code)
        assert is_valid is False
        assert "array declaration" in error.lower()
    
    def test_validate_cpp_syntax_missing_size_constant(self):
        """Test validation fails when size constant is missing."""
        invalid_code = """
        alignas(8) const unsigned char g_person_detect_model_data[] = {
          0x01, 0x02, 0x03
        };
        """
        
        is_valid, error = validate_cpp_syntax(invalid_code)
        assert is_valid is False
        assert "size constant" in error.lower()
    
    def test_validate_cpp_syntax_invalid_hex_format(self):
        """Test validation fails for invalid hexadecimal format."""
        invalid_code = """
        alignas(8) const unsigned char g_person_detect_model_data[] = {
          0xGG, 0x02, 0x03
        };
        const int g_person_detect_model_data_len = 3;
        """
        
        is_valid, error = validate_cpp_syntax(invalid_code)
        assert is_valid is False
    
    def test_validate_cpp_syntax_missing_braces(self):
        """Test validation fails when array braces are missing."""
        invalid_code = """
        alignas(8) const unsigned char g_person_detect_model_data[] = {
          0x01, 0x02, 0x03
        const int g_person_detect_model_data_len = 3;
        """
        
        is_valid, error = validate_cpp_syntax(invalid_code)
        assert is_valid is False


class TestInjectModelData:
    """Tests for model data injection."""
    
    def test_inject_model_data_small_model(self):
        """Test injecting a small model."""
        model_bytes = b'\x01\x02\x03\x04\x05'
        
        injected_sketch, error = inject_model_data(model_bytes)
        
        assert error is None
        assert injected_sketch != ""
        
        # Check that model size is correct
        assert "const int g_person_detect_model_data_len = 5;" in injected_sketch
        
        # Check that model data is present
        assert "0x01, 0x02, 0x03, 0x04, 0x05" in injected_sketch
        
        # Check that array declaration is present
        assert "alignas(8) const unsigned char g_person_detect_model_data[] = {" in injected_sketch
    
    def test_inject_model_data_larger_model(self):
        """Test injecting a larger model (multiple lines)."""
        model_bytes = bytes(range(100))  # 100 bytes
        
        injected_sketch, error = inject_model_data(model_bytes)
        
        assert error is None
        assert injected_sketch != ""
        
        # Check that model size is correct
        assert "const int g_person_detect_model_data_len = 100;" in injected_sketch
        
        # Check that first and last bytes are present
        assert "0x00" in injected_sketch
        assert "0x63" in injected_sketch  # 99 in hex
    
    def test_inject_model_data_preserves_template_structure(self):
        """Test that injection preserves other parts of the template."""
        model_bytes = b'\x01\x02\x03'
        
        injected_sketch, error = inject_model_data(model_bytes)
        
        assert error is None
        
        # Check for other parts of the template that should be preserved
        assert "#include" in injected_sketch
        assert "camera_pins" in injected_sketch or "PWDN_GPIO_NUM" in injected_sketch
        assert "setup()" in injected_sketch or "loop()" in injected_sketch
    
    def test_inject_model_data_updates_size_constant(self):
        """Test that the size constant is correctly updated."""
        # Try different model sizes
        sizes = [1, 10, 100, 1000, 10000]
        
        for size in sizes:
            # Create exact size byte array
            model_bytes = bytes([i % 256 for i in range(size)])
            
            injected_sketch, error = inject_model_data(model_bytes)
            
            assert error is None
            # Check with flexible whitespace matching
            assert re.search(rf"const\s+int\s+g_person_detect_model_data_len\s*=\s*{size};", injected_sketch)
    
    def test_inject_model_data_empty_model(self):
        """Test handling of empty model."""
        model_bytes = b''
        
        injected_sketch, error = inject_model_data(model_bytes)
        
        assert error is None
        assert "const int g_person_detect_model_data_len = 0;" in injected_sketch
    
    def test_inject_model_data_validation_runs(self):
        """Test that C++ syntax validation is performed."""
        model_bytes = b'\x01\x02\x03'
        
        injected_sketch, error = inject_model_data(model_bytes)
        
        assert error is None
        
        # The injected sketch should pass validation
        is_valid, validation_error = validate_cpp_syntax(injected_sketch)
        assert is_valid is True
        assert validation_error is None
    
    def test_inject_model_data_preserves_alignment(self):
        """Test that alignas(8) is preserved in the injected code."""
        model_bytes = b'\x01\x02\x03'
        
        injected_sketch, error = inject_model_data(model_bytes)
        
        assert error is None
        assert "alignas(8)" in injected_sketch
    
    def test_inject_model_data_hex_format(self):
        """Test that all bytes are formatted as hexadecimal."""
        model_bytes = bytes([0, 15, 16, 255])  # Mix of small and large values
        
        injected_sketch, error = inject_model_data(model_bytes)
        
        assert error is None
        assert "0x00" in injected_sketch
        assert "0x0f" in injected_sketch
        assert "0x10" in injected_sketch
        assert "0xff" in injected_sketch


class TestGetTemplatePath:
    """Tests for get_template_path function."""
    
    def test_get_template_path_returns_string(self):
        """Test that get_template_path returns a string."""
        path = get_template_path()
        assert isinstance(path, str)
    
    def test_get_template_path_points_to_file(self):
        """Test that the returned path points to an existing file."""
        path = get_template_path()
        assert os.path.exists(path)
        assert os.path.isfile(path)
    
    def test_get_template_path_is_absolute(self):
        """Test that the returned path is absolute."""
        path = get_template_path()
        assert os.path.isabs(path)


class TestGetModelPlaceholdersInfo:
    """Tests for get_model_placeholders_info function."""
    
    def test_get_model_placeholders_info_returns_dict(self):
        """Test that the function returns a dictionary."""
        info = get_model_placeholders_info()
        assert isinstance(info, dict)
    
    def test_get_model_placeholders_info_contains_required_keys(self):
        """Test that the returned dict contains all required keys."""
        info = get_model_placeholders_info()
        
        required_keys = [
            'array_name',
            'size_name',
            'array_start_marker',
            'array_end_pattern',
            'size_pattern'
        ]
        
        for key in required_keys:
            assert key in info
    
    def test_get_model_placeholders_info_values_are_strings(self):
        """Test that all values in the dict are strings."""
        info = get_model_placeholders_info()
        
        for key, value in info.items():
            assert isinstance(value, str)
    
    def test_get_model_placeholders_info_array_name(self):
        """Test that the array name is correct."""
        info = get_model_placeholders_info()
        assert info['array_name'] == 'g_person_detect_model_data'
    
    def test_get_model_placeholders_info_size_name(self):
        """Test that the size name is correct."""
        info = get_model_placeholders_info()
        assert info['size_name'] == 'g_person_detect_model_data_len'


class TestEndToEndInjection:
    """End-to-end tests for the complete injection workflow."""
    
    def test_complete_workflow_small_model(self):
        """Test the complete workflow with a small model."""
        # Create a small test model
        model_bytes = bytes([0x54, 0x46, 0x4c, 0x33])  # "TFL3" - TFLite signature
        
        # Inject the model
        injected_sketch, error = inject_model_data(model_bytes)
        
        # Should succeed
        assert error is None
        assert injected_sketch != ""
        
        # Should contain the model data
        assert "0x54, 0x46, 0x4c, 0x33" in injected_sketch
        
        # Should have correct size
        assert "const int g_person_detect_model_data_len = 4;" in injected_sketch
        
        # Should pass syntax validation
        is_valid, validation_error = validate_cpp_syntax(injected_sketch)
        assert is_valid is True
        assert validation_error is None
    
    def test_complete_workflow_realistic_model(self):
        """Test the complete workflow with a more realistic model size."""
        # Create a model similar to real TFLite models (several KB)
        model_bytes = bytes(range(256)) * 100  # 25.6 KB
        
        # Inject the model
        injected_sketch, error = inject_model_data(model_bytes)
        
        # Should succeed
        assert error is None
        assert injected_sketch != ""
        
        # Should have correct size
        assert "const int g_person_detect_model_data_len = 25600;" in injected_sketch
        
        # Should pass syntax validation
        is_valid, validation_error = validate_cpp_syntax(injected_sketch)
        assert is_valid is True
        assert validation_error is None
        
        # Should preserve template structure
        assert "#include" in injected_sketch
    
    def test_multiple_injections_independent(self):
        """Test that multiple injections are independent."""
        model_bytes_1 = b'\x01\x02\x03'
        model_bytes_2 = b'\x04\x05\x06\x07\x08'
        
        # Inject first model
        sketch_1, error_1 = inject_model_data(model_bytes_1)
        assert error_1 is None
        
        # Inject second model
        sketch_2, error_2 = inject_model_data(model_bytes_2)
        assert error_2 is None
        
        # They should be different
        assert sketch_1 != sketch_2
        
        # Each should have its own size
        assert "const int g_person_detect_model_data_len = 3;" in sketch_1
        assert "const int g_person_detect_model_data_len = 5;" in sketch_2
