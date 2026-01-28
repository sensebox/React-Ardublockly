"""
Basic structure tests that don't require TensorFlow imports.
These tests verify the module structure and basic functionality.
"""

import os
import sys

# Get the backend directory path (parent of tests directory)
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def test_services_module_exists():
    """Test that services module directory exists."""
    services_dir = os.path.join(BACKEND_DIR, 'services')
    services_init = os.path.join(BACKEND_DIR, 'services', '__init__.py')
    tflite_converter = os.path.join(BACKEND_DIR, 'services', 'tflite_converter.py')
    
    assert os.path.exists(services_dir), "services directory should exist"
    assert os.path.exists(services_init), "services/__init__.py should exist"
    assert os.path.exists(tflite_converter), "tflite_converter.py should exist"

def test_requirements_file_exists():
    """Test that requirements.txt exists."""
    requirements_path = os.path.join(BACKEND_DIR, 'requirements.txt')
    assert os.path.exists(requirements_path), "requirements.txt should exist"

def test_readme_exists():
    """Test that README.md exists."""
    readme_path = os.path.join(BACKEND_DIR, 'README.md')
    assert os.path.exists(readme_path), "README.md should exist"

def test_python_version():
    """Test that Python version is 3.8 or higher."""
    assert sys.version_info >= (3, 8), "Python 3.8+ required"

if __name__ == '__main__':
    test_services_module_exists()
    test_requirements_file_exists()
    test_readme_exists()
    test_python_version()
    print("All structure tests passed!")
