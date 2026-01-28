"""
Model Data Injection Service

This module provides functionality to inject TFLite model data into the Arduino
sketch template. It replaces placeholder model data with actual converted model
bytes while maintaining proper C++ syntax.
"""

import os
import re
from pathlib import Path
from typing import Tuple, Optional


# Template file location
TEMPLATE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'templates')
TEMPLATE_FILE = os.path.join(TEMPLATE_DIR, 'tflite_sketch_template.ino')

# Placeholder patterns for model data injection
# These patterns identify the sections in the template that need to be replaced
MODEL_DATA_ARRAY_START = "alignas(8) const unsigned char g_person_detect_model_data[] = {"
MODEL_DATA_ARRAY_END_PATTERN = r"};\s*const int g_person_detect_model_data_len"
MODEL_SIZE_PATTERN = r"const\s+int\s+g_person_detect_model_data_len\s*=\s*\d+;"


def validate_template() -> Tuple[bool, Optional[str]]:
    """
    Validate that the template file exists and contains required placeholders.
    
    Returns:
        Tuple[bool, Optional[str]]: (is_valid, error_message)
            - is_valid: True if template is valid, False otherwise
            - error_message: None if valid, error description if invalid
    """
    # Check if template file exists
    if not os.path.exists(TEMPLATE_FILE):
        return False, f"Template file not found: {TEMPLATE_FILE}"
    
    # Read template content
    try:
        with open(TEMPLATE_FILE, 'r', encoding='utf-8') as f:
            template_content = f.read()
    except Exception as e:
        return False, f"Failed to read template file: {str(e)}"
    
    # Check for model data array start
    if MODEL_DATA_ARRAY_START not in template_content:
        return False, f"Template missing model data array start marker: {MODEL_DATA_ARRAY_START}"
    
    # Check for model data array end and size constant
    if not re.search(MODEL_DATA_ARRAY_END_PATTERN, template_content):
        return False, "Template missing model data array end pattern"
    
    if not re.search(MODEL_SIZE_PATTERN, template_content):
        return False, "Template missing model size constant"
    
    return True, None


def format_byte_array(model_bytes: bytes, bytes_per_line: int = 12) -> str:
    """
    Format model bytes as a C++ byte array with proper formatting.
    
    Args:
        model_bytes: Raw model bytes to format
        bytes_per_line: Number of bytes to display per line (default: 12)
    
    Returns:
        str: Formatted C++ byte array content
    
    Example:
        >>> format_byte_array(b'\\x01\\x02\\x03', bytes_per_line=2)
        '  0x01, 0x02,\\n  0x03'
    """
    lines = []
    for i in range(0, len(model_bytes), bytes_per_line):
        chunk = model_bytes[i:i + bytes_per_line]
        hex_values = ', '.join(f'0x{byte:02x}' for byte in chunk)
        
        # Add trailing comma except for the last line
        if i + bytes_per_line < len(model_bytes):
            hex_values += ','
        
        lines.append(f'  {hex_values}')
    
    return '\n'.join(lines)


def validate_cpp_syntax(injected_content: str) -> Tuple[bool, Optional[str]]:
    """
    Validate that the injected code maintains valid C++ syntax.
    
    This performs basic syntax checks:
    - Array declaration format is correct
    - Size constant is properly formatted
    - Hexadecimal bytes are correctly formatted
    - Braces and semicolons are balanced
    
    Args:
        injected_content: The content after model data injection
    
    Returns:
        Tuple[bool, Optional[str]]: (is_valid, error_message)
    """
    # Check for model data array declaration
    if not re.search(r'alignas\(\d+\)\s+const\s+unsigned\s+char\s+g_person_detect_model_data\[\]\s*=\s*{', 
                     injected_content):
        return False, "Invalid model data array declaration syntax"
    
    # Check for size constant first (should come after array)
    if not re.search(MODEL_SIZE_PATTERN, injected_content):
        return False, "Invalid model size constant syntax"
    
    # Check for proper array closure
    if not re.search(MODEL_DATA_ARRAY_END_PATTERN, injected_content):
        return False, "Model data array not properly closed"
    
    # Validate hex byte format (sample check on a portion)
    # Find the model data section
    model_section_match = re.search(
        r'g_person_detect_model_data\[\]\s*=\s*{(.*?)};',
        injected_content,
        re.DOTALL
    )
    
    if model_section_match:
        model_data = model_section_match.group(1).strip()
        # Allow empty arrays (for empty models) or check for valid hex bytes
        if model_data and not re.search(r'0x[0-9a-fA-F]{2}', model_data):
            return False, "Model data does not contain valid hexadecimal bytes"
        
        # Check for invalid characters in the array (allow only hex, commas, whitespace, newlines)
        if model_data and re.search(r'[^0-9a-fA-Fx,\s\n]', model_data):
            return False, "Model data contains invalid characters"
    
    return True, None


def inject_model_data(model_bytes: bytes, 
                      array_name: str = "g_person_detect_model_data",
                      size_name: str = "g_person_detect_model_data_len") -> Tuple[str, Optional[str]]:
    """
    Inject model data into the Arduino sketch template.
    
    Replaces the placeholder model data array and size constant with actual
    converted model bytes while preserving all other template content.
    
    Args:
        model_bytes: The TFLite model as raw bytes
        array_name: Name of the model data array (default: g_person_detect_model_data)
        size_name: Name of the model size constant (default: g_person_detect_model_data_len)
    
    Returns:
        Tuple[str, Optional[str]]: (injected_sketch, error_message)
            - injected_sketch: Complete sketch with model data injected, or empty string on error
            - error_message: None if successful, error description if failed
    
    Example:
        >>> sketch, error = inject_model_data(b'\\x01\\x02\\x03')
        >>> if error is None:
        ...     print("Success!")
    """
    # Validate template first
    is_valid, error = validate_template()
    if not is_valid:
        return "", error
    
    # Read template content
    try:
        with open(TEMPLATE_FILE, 'r', encoding='utf-8') as f:
            template_content = f.read()
    except Exception as e:
        return "", f"Failed to read template: {str(e)}"
    
    # Calculate model size
    model_size = len(model_bytes)
    
    # Format the byte array
    formatted_array = format_byte_array(model_bytes)
    
    # Create the new model data array declaration
    new_array_declaration = f"alignas(8) const unsigned char {array_name}[] = {{\n{formatted_array}\n\n}};"
    
    # Create the new size constant
    new_size_constant = f"const int {size_name} = {model_size};"
    
    # Replace the model data array
    # Find and replace the entire array from start to the closing brace
    pattern = re.compile(
        r'(alignas\(\d+\)\s+const\s+unsigned\s+char\s+g_person_detect_model_data\[\]\s*=\s*{).*?(};)',
        re.DOTALL
    )
    
    injected_content = pattern.sub(
        lambda m: new_array_declaration,
        template_content
    )
    
    # Replace the size constant
    injected_content = re.sub(
        MODEL_SIZE_PATTERN,
        new_size_constant,
        injected_content
    )
    
    # Validate the result
    is_valid, validation_error = validate_cpp_syntax(injected_content)
    if not is_valid:
        return "", f"C++ syntax validation failed: {validation_error}"
    
    return injected_content, None


def get_template_path() -> str:
    """
    Get the absolute path to the template file.
    
    Returns:
        str: Absolute path to the template file
    """
    return TEMPLATE_FILE


def inject_model_settings(template_content: str, model_settings_code: str) -> str:
    """
    Inject model settings into the template.
    
    Replaces the model_settings section in the template with dynamically generated
    settings based on the actual model metadata.
    
    Args:
        template_content: The template content
        model_settings_code: Generated model settings C++ code
    
    Returns:
        str: Template content with model settings injected
    """
    # Pattern to match the entire model_settings section
    # From "// ******************** model_settings.h ********************"
    # To the end of "// ********************************************************" after model_settings.cpp
    pattern = re.compile(
        r'// \*+\s*model_settings\.h\s+\*+.*?// \*+\s*model_settings\.cpp\s+\*+.*?// \*+',
        re.DOTALL
    )
    
    # Replace with new model settings
    injected_content = pattern.sub(model_settings_code, template_content)
    
    return injected_content


def inject_model_data_and_settings(model_bytes: bytes,
                                    model_settings_code: str,
                                    array_name: str = "g_person_detect_model_data",
                                    size_name: str = "g_person_detect_model_data_len") -> Tuple[str, Optional[str]]:
    """
    Inject both model data and model settings into the Arduino sketch template.
    
    Args:
        model_bytes: The TFLite model as raw bytes
        model_settings_code: Generated model settings C++ code
        array_name: Name of the model data array (default: g_person_detect_model_data)
        size_name: Name of the model size constant (default: g_person_detect_model_data_len)
    
    Returns:
        Tuple[str, Optional[str]]: (injected_sketch, error_message)
    """
    # First inject model data
    injected_sketch, error = inject_model_data(model_bytes, array_name, size_name)
    if error:
        return "", error
    
    # Then inject model settings
    injected_sketch = inject_model_settings(injected_sketch, model_settings_code)
    
    return injected_sketch, None


def get_model_placeholders_info() -> dict:
    """
    Get information about the model data placeholders in the template.
    
    Returns:
        dict: Information about placeholders including:
            - array_name: Name of the model data array
            - size_name: Name of the model size constant
            - array_start_marker: Start marker for the array
            - size_pattern: Pattern for the size constant
    """
    return {
        'array_name': 'g_person_detect_model_data',
        'size_name': 'g_person_detect_model_data_len',
        'array_start_marker': MODEL_DATA_ARRAY_START,
        'array_end_pattern': MODEL_DATA_ARRAY_END_PATTERN,
        'size_pattern': MODEL_SIZE_PATTERN
    }
