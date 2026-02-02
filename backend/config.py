"""
Configuration Management for TFLite Backend

This module provides centralized configuration management with validation,
default values, and environment variable loading.
"""

import os
from typing import Dict, Any, Tuple, Optional
from pathlib import Path

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).parent / '.env'
    load_dotenv(dotenv_path=env_path)
except ImportError:
    pass


class ConfigurationError(Exception):
    """Exception raised when configuration is invalid or missing."""
    pass


class Config:
    """
    Application configuration with validation and defaults.
    
    Environment Variables:
        VITE_BLOCKLY_API: URL of the Blockly compiler service
        COMPILATION_TIMEOUT: Timeout for compilation requests in seconds (default: 120)
        DEFAULT_BOARD: Default board type for compilation (default: esp32:esp32:sensebox_eye)
        DEFAULT_OPTIMIZATION: Default optimization level (default: default)
        MAX_CONTENT_LENGTH: Maximum request size in bytes (default: 10MB)
        CONVERSION_TIMEOUT: Timeout for TFLite conversion in seconds (default: 60)
        FLASK_ENV: Flask environment (development, production, testing)
        DEBUG: Enable debug mode (default: False)
    """
    
    # Required configuration keys
    REQUIRED_KEYS = ['VITE_BLOCKLY_API']
    
    # Default values
    DEFAULTS = {
        'COMPILATION_TIMEOUT': 120,
        'DEFAULT_BOARD': 'esp32:esp32:sensebox_eye',
        'DEFAULT_OPTIMIZATION': 'default',
        'MAX_CONTENT_LENGTH': 10 * 1024 * 1024,  # 10MB
        'CONVERSION_TIMEOUT': 60,
        'FLASK_ENV': 'development',
        'DEBUG': False,
        'MAX_RETRIES': 3,
        'RETRY_DELAY': 2,
        'TEMP_DIR_PREFIX': 'tflite_conversion_',
    }
    
    # Valid optimization levels
    VALID_OPTIMIZATIONS = ['default', 'size', 'speed']
    
    # Timeout constraints
    MIN_TIMEOUT = 10  # seconds
    MAX_TIMEOUT = 600  # 10 minutes
    
    def __init__(self):
        """Initialize configuration from environment variables."""
        self._config = {}
        self._load_from_env()
    
    def _load_from_env(self):
        """Load configuration from environment variables with defaults."""
        # Load required configuration
        for key in self.REQUIRED_KEYS:
            value = os.getenv(key)
            if value:
                self._config[key] = value
        
        # Load optional configuration with defaults
        for key, default_value in self.DEFAULTS.items():
            env_value = os.getenv(key)
            if env_value is not None:
                # Type conversion
                if isinstance(default_value, bool):
                    self._config[key] = env_value.lower() in ('true', '1', 'yes')
                elif isinstance(default_value, int):
                    try:
                        self._config[key] = int(env_value)
                    except ValueError:
                        self._config[key] = default_value
                else:
                    self._config[key] = env_value
            else:
                self._config[key] = default_value
    
    def get(self, key: str, default: Any = None) -> Any:
        """
        Get configuration value.
        
        Args:
            key: Configuration key
            default: Default value if key not found
            
        Returns:
            Configuration value or default
        """
        return self._config.get(key, default)
    
    def validate(self) -> Tuple[bool, Optional[str]]:
        """
        Validate configuration values.
        
        Returns:
            Tuple[bool, Optional[str]]: (is_valid, error_message)
        """
        # Check required configuration
        for key in self.REQUIRED_KEYS:
            if key not in self._config or not self._config[key]:
                return False, f"Required configuration '{key}' is missing. Please set it in your environment or .env file."
        
        # Validate compiler URL format
        compiler_url = self._config.get('VITE_BLOCKLY_API', '')
        if not compiler_url.startswith(('http://', 'https://')):
            return False, f"Invalid VITE_BLOCKLY_API URL format: '{compiler_url}'. Must start with http:// or https://"
        
        # Validate compilation timeout
        compilation_timeout = self._config.get('COMPILATION_TIMEOUT', 0)
        if not isinstance(compilation_timeout, int) or compilation_timeout < self.MIN_TIMEOUT:
            return False, f"COMPILATION_TIMEOUT must be at least {self.MIN_TIMEOUT} seconds, got: {compilation_timeout}"
        if compilation_timeout > self.MAX_TIMEOUT:
            return False, f"COMPILATION_TIMEOUT cannot exceed {self.MAX_TIMEOUT} seconds, got: {compilation_timeout}"
        
        # Validate conversion timeout
        conversion_timeout = self._config.get('CONVERSION_TIMEOUT', 0)
        if not isinstance(conversion_timeout, int) or conversion_timeout < self.MIN_TIMEOUT:
            return False, f"CONVERSION_TIMEOUT must be at least {self.MIN_TIMEOUT} seconds, got: {conversion_timeout}"
        if conversion_timeout > self.MAX_TIMEOUT:
            return False, f"CONVERSION_TIMEOUT cannot exceed {self.MAX_TIMEOUT} seconds, got: {conversion_timeout}"
        
        # Validate optimization level
        optimization = self._config.get('DEFAULT_OPTIMIZATION', 'default')
        if optimization not in self.VALID_OPTIMIZATIONS:
            return False, f"Invalid DEFAULT_OPTIMIZATION: '{optimization}'. Must be one of: {', '.join(self.VALID_OPTIMIZATIONS)}"
        
        # Validate max content length
        max_content = self._config.get('MAX_CONTENT_LENGTH', 0)
        if not isinstance(max_content, int) or max_content <= 0:
            return False, f"MAX_CONTENT_LENGTH must be a positive integer, got: {max_content}"
        
        # Validate max retries
        max_retries = self._config.get('MAX_RETRIES', 0)
        if not isinstance(max_retries, int) or max_retries < 1 or max_retries > 10:
            return False, f"MAX_RETRIES must be between 1 and 10, got: {max_retries}"
        
        return True, None
    
    def validate_or_raise(self):
        """
        Validate configuration and raise exception if invalid.
        
        Raises:
            ConfigurationError: If configuration is invalid
        """
        is_valid, error_msg = self.validate()
        if not is_valid:
            raise ConfigurationError(error_msg)
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Get configuration as dictionary.
        
        Returns:
            Dict containing all configuration values
        """
        return self._config.copy()
    
    def __repr__(self) -> str:
        """String representation of configuration."""
        # Hide sensitive values
        safe_config = self._config.copy()
        if 'VITE_BLOCKLY_API' in safe_config:
            safe_config['VITE_BLOCKLY_API'] = safe_config['VITE_BLOCKLY_API'][:20] + '...'
        return f"Config({safe_config})"


# Global configuration instance
config = Config()


def get_config() -> Config:
    """
    Get the global configuration instance.
    
    Returns:
        Config: Global configuration instance
    """
    return config


def validate_config_on_startup():
    """
    Validate configuration on application startup.
    
    This function should be called when the Flask app initializes
    to ensure all required configuration is present and valid.
    
    Raises:
        ConfigurationError: If configuration is invalid
    """
    config.validate_or_raise()
    print("\n" + "="*60)
    print("Configuration validated successfully!")
    print("="*60)
    print(f"Compiler URL: {config.get('VITE_BLOCKLY_API')}")
    print(f"Compilation Timeout: {config.get('COMPILATION_TIMEOUT')}s")
    print(f"Conversion Timeout: {config.get('CONVERSION_TIMEOUT')}s")
    print(f"Default Board: {config.get('DEFAULT_BOARD')}")
    print(f"Default Optimization: {config.get('DEFAULT_OPTIMIZATION')}")
    print(f"Max Content Length: {config.get('MAX_CONTENT_LENGTH') / (1024*1024):.1f}MB")
    print(f"Environment: {config.get('FLASK_ENV')}")
    print(f"Debug Mode: {config.get('DEBUG')}")
    print("="*60 + "\n")
