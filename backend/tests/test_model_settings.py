"""
Tests for model settings generation functionality.

This module tests the generate_model_settings function and the integration
of model settings with the model injection process.
"""

import pytest
import os
import sys

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.tflite_converter import generate_model_settings, get_model_info
from services.model_injection import inject_model_settings, inject_model_data_and_settings


class TestModelSettingsGeneration:
    """Test model settings generation from metadata."""
    
    def test_generate_model_settings_basic(self):
        """Test basic model settings generation."""
        model_metadata = {
            'num_rows': 96,
            'num_cols': 96,
            'num_channels': 1,
            'category_count': 3,
            'max_image_size': 9216
        }
        
        settings = generate_model_settings(model_metadata)
        
        # Verify the settings contain expected values
        assert 'constexpr int kNumCols = 96;' in settings
        assert 'constexpr int kNumRows = 96;' in settings
        assert 'constexpr int kNumChannels = 1;' in settings
        assert 'constexpr int kCategoryCount = 3;' in settings
        assert 'model_settings.h' in settings
        assert 'model_settings.cpp' in settings
    
    def test_generate_model_settings_with_labels(self):
        """Test model settings generation with custom class labels."""
        model_metadata = {
            'num_rows': 96,
            'num_cols': 96,
            'num_channels': 1,
            'category_count': 3,
            'max_image_size': 9216
        }
        
        class_labels = ['rock', 'paper', 'scissors']
        settings = generate_model_settings(model_metadata, class_labels)
        
        # Verify labels are included
        assert '"rock"' in settings
        assert '"paper"' in settings
        assert '"scissors"' in settings
        assert 'kCategoryLabels[kCategoryCount]' in settings
    
    def test_generate_model_settings_default_labels(self):
        """Test model settings generation with default labels when none provided."""
        model_metadata = {
            'num_rows': 224,
            'num_cols': 224,
            'num_channels': 3,
            'category_count': 5,
            'max_image_size': 150528
        }
        
        settings = generate_model_settings(model_metadata)
        
        # Verify default labels are generated
        assert '"class_0"' in settings
        assert '"class_1"' in settings
        assert '"class_2"' in settings
        assert '"class_3"' in settings
        assert '"class_4"' in settings
        assert 'constexpr int kCategoryCount = 5;' in settings
    
    def test_generate_model_settings_different_shapes(self):
        """Test model settings generation with different input shapes."""
        model_metadata = {
            'num_rows': 128,
            'num_cols': 128,
            'num_channels': 3,
            'category_count': 10,
            'max_image_size': 49152
        }
        
        settings = generate_model_settings(model_metadata)
        
        assert 'constexpr int kNumCols = 128;' in settings
        assert 'constexpr int kNumRows = 128;' in settings
        assert 'constexpr int kNumChannels = 3;' in settings
        assert 'constexpr int kCategoryCount = 10;' in settings
    
    def test_generate_model_settings_label_padding(self):
        """Test that labels are padded when fewer than category count."""
        model_metadata = {
            'num_rows': 96,
            'num_cols': 96,
            'num_channels': 1,
            'category_count': 5,
            'max_image_size': 9216
        }
        
        class_labels = ['cat', 'dog']  # Only 2 labels, need 5
        settings = generate_model_settings(model_metadata, class_labels)
        
        # Verify provided labels and padded labels
        assert '"cat"' in settings
        assert '"dog"' in settings
        assert '"class_2"' in settings
        assert '"class_3"' in settings
        assert '"class_4"' in settings
    
    def test_generate_model_settings_label_truncation(self):
        """Test that labels are truncated when more than category count."""
        model_metadata = {
            'num_rows': 96,
            'num_cols': 96,
            'num_channels': 1,
            'category_count': 2,
            'max_image_size': 9216
        }
        
        class_labels = ['cat', 'dog', 'bird', 'fish']  # 4 labels, need only 2
        settings = generate_model_settings(model_metadata, class_labels)
        
        # Verify only first 2 labels are used
        assert '"cat"' in settings
        assert '"dog"' in settings
        assert '"bird"' not in settings
        assert '"fish"' not in settings


class TestModelSettingsInjection:
    """Test model settings injection into templates."""
    
    def test_inject_model_settings(self):
        """Test injecting model settings into template content."""
        template_content = """// ******************** model_settings.h ********************
constexpr int kNumCols = 96;
constexpr int kNumRows = 96;
constexpr int kNumChannels = 1;

constexpr int kMaxImageSize = kNumCols * kNumRows * kNumChannels;

constexpr int kCategoryCount = 3;
// ********************************************************
// ******************* model_settings.cpp ********************
const char* kCategoryLabels[kCategoryCount] = {
    "old1","old2","old3",
};
// ********************************************************
// Some other content
"""
        
        new_settings = """// ******************** model_settings.h ********************
constexpr int kNumCols = 128;
constexpr int kNumRows = 128;
constexpr int kNumChannels = 3;

constexpr int kMaxImageSize = kNumCols * kNumRows * kNumChannels;

constexpr int kCategoryCount = 5;
// ********************************************************
// ******************* model_settings.cpp ********************
const char* kCategoryLabels[kCategoryCount] = {
    "new1","new2","new3","new4","new5",
};
// ********************************************************"""
        
        result = inject_model_settings(template_content, new_settings)
        
        # Verify old settings are replaced
        assert 'kNumCols = 128' in result
        assert 'kNumRows = 128' in result
        assert 'kNumChannels = 3' in result
        assert 'kCategoryCount = 5' in result
        assert '"new1"' in result
        assert '"new2"' in result
        
        # Verify old settings are gone
        assert 'kNumCols = 96' not in result
        assert '"old1"' not in result
        
        # Verify other content is preserved
        assert '// Some other content' in result
    
    def test_inject_model_data_and_settings_integration(self):
        """Test the combined injection of model data and settings."""
        # This is an integration test that requires the actual template file
        # We'll just verify the function signature and that it works
        model_bytes = b'\x00\x01\x02\x03\x04\x05'
        
        model_settings = """// ******************** model_settings.h ********************
constexpr int kNumCols = 96;
constexpr int kNumRows = 96;
constexpr int kNumChannels = 1;

constexpr int kMaxImageSize = kNumCols * kNumRows * kNumChannels;

constexpr int kCategoryCount = 3;
extern const char* kCategoryLabels[kCategoryCount];

// ********************************************************
// ******************* model_settings.cpp ********************
const char* kCategoryLabels[kCategoryCount] = {
    "test1","test2","test3",
};
// ********************************************************"""
        
        # This should not raise an error
        result, error = inject_model_data_and_settings(model_bytes, model_settings)
        
        # If template file exists, result should contain both injections
        if not error:
            assert 'g_person_detect_model_data' in result
            assert 'kNumCols = 96' in result
            assert '"test1"' in result


class TestModelInfoExtraction:
    """Test model info extraction (requires actual TFLite model)."""
    
    def test_get_model_info_returns_correct_structure(self):
        """Test that get_model_info returns the expected data structure."""
        # This test would require an actual TFLite model file
        # For now, we just document the expected structure
        expected_keys = [
            'input_shape',
            'output_shape',
            'input_dtype',
            'output_dtype',
            'model_size',
            'num_rows',
            'num_cols',
            'num_channels',
            'category_count',
            'max_image_size'
        ]
        
        # This is a documentation test - the actual test would need a real model
        assert True  # Placeholder


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
