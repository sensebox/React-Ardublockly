"""
Unit tests for configuration management module.

Tests configuration loading, validation, and error handling.
"""

import os
import pytest
from unittest.mock import patch
from config import (
    Config,
    ConfigurationError,
    get_config,
    validate_config_on_startup
)


class TestConfigLoading:
    """Test configuration loading from environment variables."""
    
    def test_load_required_config(self):
        """Test loading required configuration."""
        with patch.dict(os.environ, {'VITE_BLOCKLY_API': 'http://test-compiler.com'}):
            config = Config()
            assert config.get('VITE_BLOCKLY_API') == 'http://test-compiler.com'
    
    def test_load_with_defaults(self):
        """Test that default values are used when env vars not set."""
        # Clear environment and reload to avoid .env file interference
        with patch.dict(os.environ, {'VITE_BLOCKLY_API': 'http://test.com'}, clear=True):
            with patch('config.load_dotenv'):  # Prevent .env loading
                config = Config()
                
                assert config.get('COMPILATION_TIMEOUT') == 120
                assert config.get('DEFAULT_BOARD') == 'esp32:esp32:sensebox_eye'
                assert config.get('DEFAULT_OPTIMIZATION') == 'default'
                assert config.get('CONVERSION_TIMEOUT') == 60
                assert config.get('MAX_CONTENT_LENGTH') == 10 * 1024 * 1024
    
    def test_override_defaults_with_env(self):
        """Test that environment variables override defaults."""
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://test.com',
            'COMPILATION_TIMEOUT': '180',
            'DEFAULT_BOARD': 'esp32:esp32:sensebox_eye',
            'DEFAULT_OPTIMIZATION': 'size'
        }):
            config = Config()
            
            assert config.get('COMPILATION_TIMEOUT') == 180
            assert config.get('DEFAULT_BOARD') == 'esp32:esp32:sensebox_eye'
            assert config.get('DEFAULT_OPTIMIZATION') == 'size'
    
    def test_boolean_conversion(self):
        """Test that boolean values are correctly converted."""
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://test.com',
            'DEBUG': 'true'
        }):
            config = Config()
            assert config.get('DEBUG') is True
        
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://test.com',
            'DEBUG': '1'
        }):
            config = Config()
            assert config.get('DEBUG') is True
        
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://test.com',
            'DEBUG': 'false'
        }):
            config = Config()
            assert config.get('DEBUG') is False
    
    def test_integer_conversion(self):
        """Test that integer values are correctly converted."""
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://test.com',
            'COMPILATION_TIMEOUT': '300'
        }):
            config = Config()
            assert config.get('COMPILATION_TIMEOUT') == 300
            assert isinstance(config.get('COMPILATION_TIMEOUT'), int)
    
    def test_invalid_integer_uses_default(self):
        """Test that invalid integer values fall back to defaults."""
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://test.com',
            'COMPILATION_TIMEOUT': 'not-a-number'
        }):
            config = Config()
            # Should use default value
            assert config.get('COMPILATION_TIMEOUT') == 120
    
    def test_get_method_with_default(self):
        """Test get method with custom default value."""
        with patch.dict(os.environ, {'VITE_BLOCKLY_API': 'http://test.com'}, clear=True):
            with patch('config.load_dotenv'):  # Prevent .env loading
                config = Config()
                
                # Existing key
                assert config.get('DEFAULT_BOARD') == 'esp32:esp32:sensebox_eye'
                
                # Non-existing key with default
                assert config.get('NONEXISTENT_KEY', 'custom-default') == 'custom-default'
    
    def test_to_dict(self):
        """Test configuration export to dictionary."""
        with patch.dict(os.environ, {'VITE_BLOCKLY_API': 'http://test.com'}):
            config = Config()
            config_dict = config.to_dict()
            
            assert isinstance(config_dict, dict)
            assert 'VITE_BLOCKLY_API' in config_dict
            assert 'COMPILATION_TIMEOUT' in config_dict


class TestConfigValidation:
    """Test configuration validation logic."""
    
    def test_validate_success(self):
        """Test that valid configuration passes validation."""
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://valid-url.com',
            'COMPILATION_TIMEOUT': '120'
        }):
            config = Config()
            is_valid, error = config.validate()
            
            assert is_valid is True
            assert error is None
    
    def test_validate_missing_required_config(self):
        """Test that missing required config fails validation."""
        with patch.dict(os.environ, {}, clear=True):
            config = Config()
            is_valid, error = config.validate()
            
            assert is_valid is False
            assert 'VITE_BLOCKLY_API' in error
            assert 'missing' in error.lower()
    
    def test_validate_invalid_url_format(self):
        """Test that invalid URL format fails validation."""
        with patch.dict(os.environ, {'VITE_BLOCKLY_API': 'invalid-url-format'}):
            config = Config()
            is_valid, error = config.validate()
            
            assert is_valid is False
            assert 'invalid' in error.lower()
            assert 'url' in error.lower()
    
    def test_validate_compilation_timeout_too_low(self):
        """Test that too-low compilation timeout fails validation."""
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://test.com',
            'COMPILATION_TIMEOUT': '5'  # Below minimum of 10
        }):
            config = Config()
            is_valid, error = config.validate()
            
            assert is_valid is False
            assert 'COMPILATION_TIMEOUT' in error
    
    def test_validate_compilation_timeout_too_high(self):
        """Test that too-high compilation timeout fails validation."""
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://test.com',
            'COMPILATION_TIMEOUT': '700'  # Above maximum of 600
        }):
            config = Config()
            is_valid, error = config.validate()
            
            assert is_valid is False
            assert 'COMPILATION_TIMEOUT' in error
    
    def test_validate_conversion_timeout(self):
        """Test conversion timeout validation."""
        # Too low
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://test.com',
            'CONVERSION_TIMEOUT': '5'
        }):
            config = Config()
            is_valid, error = config.validate()
            
            assert is_valid is False
            assert 'CONVERSION_TIMEOUT' in error
        
        # Too high
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://test.com',
            'CONVERSION_TIMEOUT': '700'
        }):
            config = Config()
            is_valid, error = config.validate()
            
            assert is_valid is False
            assert 'CONVERSION_TIMEOUT' in error
    
    def test_validate_invalid_optimization(self):
        """Test that invalid optimization level fails validation."""
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://test.com',
            'DEFAULT_OPTIMIZATION': 'invalid-option'
        }):
            config = Config()
            is_valid, error = config.validate()
            
            assert is_valid is False
            assert 'DEFAULT_OPTIMIZATION' in error
            assert 'invalid-option' in error
    
    def test_validate_max_retries_range(self):
        """Test that max retries must be within valid range."""
        # Too low
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://test.com',
            'MAX_RETRIES': '0'
        }):
            config = Config()
            is_valid, error = config.validate()
            
            assert is_valid is False
            assert 'MAX_RETRIES' in error
        
        # Too high
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://test.com',
            'MAX_RETRIES': '15'
        }):
            config = Config()
            is_valid, error = config.validate()
            
            assert is_valid is False
            assert 'MAX_RETRIES' in error
        
        # Valid range
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://test.com',
            'MAX_RETRIES': '5'
        }):
            config = Config()
            is_valid, error = config.validate()
            
            assert is_valid is True
    
    def test_validate_or_raise_success(self):
        """Test validate_or_raise with valid configuration."""
        with patch.dict(os.environ, {'VITE_BLOCKLY_API': 'http://test.com'}):
            config = Config()
            # Should not raise
            config.validate_or_raise()
    
    def test_validate_or_raise_failure(self):
        """Test validate_or_raise with invalid configuration."""
        with patch.dict(os.environ, {}, clear=True):
            config = Config()
            
            with pytest.raises(ConfigurationError) as exc_info:
                config.validate_or_raise()
            
            assert 'VITE_BLOCKLY_API' in str(exc_info.value)


class TestGlobalConfig:
    """Test global configuration instance."""
    
    def test_get_config_returns_instance(self):
        """Test that get_config returns Config instance."""
        config = get_config()
        assert isinstance(config, Config)
    
    def test_get_config_returns_same_instance(self):
        """Test that get_config returns the same instance."""
        config1 = get_config()
        config2 = get_config()
        assert config1 is config2


class TestStartupValidation:
    """Test startup validation function."""
    
    def test_validate_config_on_startup_success(self, capsys):
        """Test successful startup validation."""
        with patch.dict(os.environ, {'VITE_BLOCKLY_API': 'http://test.com'}):
            # Recreate config with test environment
            from config import Config
            test_config = Config()
            
            with patch('config.config', test_config):
                validate_config_on_startup()
                
                # Check that success message was printed
                captured = capsys.readouterr()
                assert 'Configuration validated successfully' in captured.out
                assert 'Compiler URL' in captured.out
    
    def test_validate_config_on_startup_failure(self):
        """Test startup validation with invalid configuration."""
        with patch.dict(os.environ, {}, clear=True):
            from config import Config
            test_config = Config()
            
            with patch('config.config', test_config):
                with pytest.raises(ConfigurationError):
                    validate_config_on_startup()


class TestConfigRepresentation:
    """Test configuration string representation."""
    
    def test_repr_hides_sensitive_data(self):
        """Test that repr hides sensitive URL data."""
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://very-long-secret-url-that-should-be-hidden.com/api/v1'
        }):
            config = Config()
            repr_str = repr(config)
            
            # Should contain truncated URL
            assert 'http://very-long-sec...' in repr_str or 'VITE_BLOCKLY_API' in repr_str
            # Should not contain full sensitive URL
            assert 'very-long-secret-url-that-should-be-hidden' not in repr_str


class TestEdgeCases:
    """Test edge cases and boundary conditions."""
    
    def test_https_url_valid(self):
        """Test that HTTPS URLs are valid."""
        with patch.dict(os.environ, {'VITE_BLOCKLY_API': 'https://secure.com'}):
            config = Config()
            is_valid, error = config.validate()
            
            assert is_valid is True
    
    def test_timeout_at_boundaries(self):
        """Test timeout values at exact boundaries."""
        # Minimum valid timeout
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://test.com',
            'COMPILATION_TIMEOUT': '10'
        }):
            config = Config()
            is_valid, error = config.validate()
            assert is_valid is True
        
        # Maximum valid timeout
        with patch.dict(os.environ, {
            'VITE_BLOCKLY_API': 'http://test.com',
            'COMPILATION_TIMEOUT': '600'
        }):
            config = Config()
            is_valid, error = config.validate()
            assert is_valid is True
    
    def test_empty_string_config_treated_as_missing(self):
        """Test that empty string configuration is treated as missing."""
        with patch.dict(os.environ, {'VITE_BLOCKLY_API': ''}):
            config = Config()
            is_valid, error = config.validate()
            
            assert is_valid is False
            assert 'missing' in error.lower()
    
    def test_whitespace_only_url_invalid(self):
        """Test that whitespace-only URL fails validation."""
        with patch.dict(os.environ, {'VITE_BLOCKLY_API': '   '}):
            config = Config()
            is_valid, error = config.validate()
            
            assert is_valid is False
