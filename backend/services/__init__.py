"""
Backend services for TensorFlow Lite conversion.
"""

from .tflite_converter import (
    convert_tfjs_to_tflite,
    tflite_to_c_array,
    get_model_info
)

__all__ = [
    'convert_tfjs_to_tflite',
    'tflite_to_c_array',
    'get_model_info'
]
