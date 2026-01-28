"""
Compiler Integration Service

This module provides functionality to send Arduino sketches to the Blockly compiler
and handle the compilation process, including error handling, timeouts, and binary validation.
"""

import time
import requests
from typing import Dict, Any, Optional, Tuple
from datetime import datetime

# Import configuration
try:
    from config import get_config
    config = get_config()
    COMPILER_URL = config.get('VITE_BLOCKLY_API', 'http://localhost:3000')
    COMPILATION_TIMEOUT = config.get('COMPILATION_TIMEOUT', 120)
    MAX_RETRIES = config.get('MAX_RETRIES', 3)
    RETRY_DELAY = config.get('RETRY_DELAY', 2)
except ImportError:
    # Fallback for testing or standalone use
    import os
    COMPILER_URL = os.getenv('VITE_BLOCKLY_API', 'http://localhost:3000')
    COMPILATION_TIMEOUT = int(os.getenv('COMPILATION_TIMEOUT', '120'))
    MAX_RETRIES = 3
    RETRY_DELAY = 2

MIN_BINARY_SIZE = 1024  # 1KB - minimum reasonable binary size
MAX_BINARY_SIZE = 10 * 1024 * 1024  # 10MB - maximum reasonable binary size


class CompilationError(Exception):
    """Exception raised when compilation fails."""
    def __init__(self, message: str, details: Any = None, error_type: str = "COMPILATION_ERROR", retryable: bool = False):
        self.message = message
        self.details = details
        self.error_type = error_type
        self.retryable = retryable
        super().__init__(self.message)


class CompilerTimeoutError(CompilationError):
    """Exception raised when compilation times out."""
    def __init__(self, message: str = "Compilation timeout", details: Any = None):
        super().__init__(message, details, "TIMEOUT", retryable=True)


class CompilerConnectionError(CompilationError):
    """Exception raised when connection to compiler fails."""
    def __init__(self, message: str = "Cannot connect to compiler", details: Any = None):
        super().__init__(message, details, "CONNECTION_ERROR", retryable=True)


def validate_config() -> Tuple[bool, Optional[str]]:
    """
    Validate compiler service configuration.
    
    Returns:
        Tuple[bool, Optional[str]]: (is_valid, error_message)
    """
    # Check compiler URL is set
    if not COMPILER_URL:
        return False, "VITE_BLOCKLY_API environment variable not set"
    
    # Validate URL format
    if not COMPILER_URL.startswith(('http://', 'https://')):
        return False, f"Invalid compiler URL format: {COMPILER_URL}"
    
    # Validate timeout value
    if COMPILATION_TIMEOUT <= 0:
        return False, f"Invalid compilation timeout: {COMPILATION_TIMEOUT}"
    
    return True, None


def parse_compiler_error(response_data: Any, status_code: int) -> Dict[str, Any]:
    """
    Parse compiler error response and format for user-friendly display.
    
    Args:
        response_data: Raw response data from compiler
        status_code: HTTP status code
        
    Returns:
        Dict containing formatted error information
    """
    error_info = {
        "message": "Compilation failed",
        "details": str(response_data),
        "type": "COMPILATION_ERROR",
        "suggestions": [],
        "retryable": False
    }
    
    # Try to extract structured error information
    if isinstance(response_data, dict):
        # Extract error message
        if 'error' in response_data:
            error_info['message'] = response_data['error']
        elif 'message' in response_data:
            error_info['message'] = response_data['message']
        
        # Extract details
        if 'details' in response_data:
            error_info['details'] = response_data['details']
        elif 'stderr' in response_data:
            error_info['details'] = response_data['stderr']
        
        # Analyze error type and provide suggestions
        error_text = str(response_data).lower()
        
        if 'no such file' in error_text or 'file not found' in error_text:
            error_info['type'] = 'FILE_NOT_FOUND'
            error_info['suggestions'] = [
                'Ensure all required header files are included',
                'Verify library dependencies are available'
            ]
        elif 'was not declared' in error_text or 'undeclared identifier' in error_text:
            error_info['type'] = 'UNDECLARED_IDENTIFIER'
            error_info['suggestions'] = [
                'Check for missing function declarations',
                'Verify all variables are defined before use',
                'Ensure proper header file inclusions'
            ]
        elif 'expected' in error_text and 'before' in error_text:
            error_info['type'] = 'SYNTAX_ERROR'
            error_info['suggestions'] = [
                'Check for missing semicolons or braces',
                'Verify correct syntax near the error location',
                'Look for mismatched parentheses or brackets'
            ]
        elif 'multiple definition' in error_text or 'already defined' in error_text:
            error_info['type'] = 'DUPLICATE_DEFINITION'
            error_info['suggestions'] = [
                'Remove duplicate function or variable definitions',
                'Use header guards in .h files',
                'Check for conflicting library versions'
            ]
        elif 'board' in error_text:
            error_info['type'] = 'INVALID_BOARD'
            error_info['suggestions'] = [
                'Verify the board type is supported',
                'Use a valid board identifier (e.g., "esp32:esp32:esp32")'
            ]
        elif 'timeout' in error_text or status_code == 504:
            error_info['type'] = 'TIMEOUT'
            error_info['retryable'] = True
            error_info['suggestions'] = [
                'Try compiling again',
                'The compiler may be under heavy load'
            ]
        elif status_code >= 500:
            error_info['type'] = 'SERVER_ERROR'
            error_info['retryable'] = True
            error_info['suggestions'] = [
                'The compiler service may be experiencing issues',
                'Try again in a few moments'
            ]
    
    return error_info


def validate_binary(binary_data: bytes) -> Tuple[bool, Optional[str]]:
    """
    Validate compiled binary data.
    
    Args:
        binary_data: Raw binary data from compilation
        
    Returns:
        Tuple[bool, Optional[str]]: (is_valid, error_message)
    """
    # Check if binary data exists
    if not binary_data:
        return False, "Binary data is empty"
    
    # Check minimum size
    if len(binary_data) < MIN_BINARY_SIZE:
        return False, f"Binary too small ({len(binary_data)} bytes). Minimum expected: {MIN_BINARY_SIZE} bytes"
    
    # Check maximum size
    if len(binary_data) > MAX_BINARY_SIZE:
        return False, f"Binary too large ({len(binary_data)} bytes). Maximum allowed: {MAX_BINARY_SIZE} bytes"
    
    # For ESP32 binaries, check for basic file signature (optional, but helpful)
    # ESP32 binaries typically start with 0xE9 (ESP32 image header magic byte)
    # This is not mandatory for all boards, so we'll just log a warning if missing
    if len(binary_data) > 0:
        first_byte = binary_data[0]
        # Common magic bytes for ESP32: 0xE9
        # For Arduino binaries: varies by architecture
        # We'll keep this simple for now and just check size
        pass
    
    return True, None


def compile_sketch(
    sketch_content: str,
    board: str = "esp32:esp32:esp32",
    project_id: Optional[str] = None,
    optimization: str = "default"
) -> bytes:
    """
    Compile an Arduino sketch using the Blockly compiler.
    
    Args:
        sketch_content: Single .ino file content as string
        board: Board identifier (default: "esp32:esp32:esp32")
        project_id: Optional project identifier for tracking
        optimization: Optimization level (default, size, speed)
        
    Returns:
        bytes: Compiled binary data
        
    Raises:
        CompilationError: If compilation fails
        CompilerTimeoutError: If compilation times out
        CompilerConnectionError: If connection to compiler fails
    """
    # Validate configuration first
    is_valid, error_msg = validate_config()
    if not is_valid:
        raise CompilationError(
            message="Invalid compiler configuration",
            details=error_msg,
            error_type="CONFIG_ERROR",
            retryable=False
        )
    
    # Generate project ID if not provided
    if not project_id:
        project_id = f"tflite-compile-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    
    # Prepare compilation request
    compile_request = {
        "sketch": sketch_content,
        "board": board,
        "projectId": project_id
    }
    
    # Add optimization if supported (this may vary by compiler implementation)
    if optimization != "default":
        compile_request["optimization"] = optimization
    
    # Calculate payload size for logging
    payload_size = len(sketch_content.encode('utf-8'))
    print(f"\n[Compiler] Compiling sketch for board: {board}")
    print(f"[Compiler] Sketch size: {len(sketch_content):,} characters ({payload_size/1024:.2f} KB)")
    print(f"[Compiler] Project ID: {project_id}")
    
    # Retry logic for network errors
    last_error = None
    for attempt in range(MAX_RETRIES):
        try:
            print(f"[Compiler] Attempt {attempt + 1}/{MAX_RETRIES}: Sending to {COMPILER_URL}/compile")
            
            start_time = time.time()
            response = requests.post(
                f"{COMPILER_URL}/compile",
                json=compile_request,
                headers={"Content-Type": "application/json"},
                timeout=COMPILATION_TIMEOUT
            )
            elapsed_time = time.time() - start_time
            
            print(f"[Compiler] Request completed in {elapsed_time:.2f}s (status: {response.status_code})")
            
            # Handle 404 specifically - service might not be running
            if response.status_code == 404:
                raise CompilerConnectionError(
                    message="Compiler service endpoint not found",
                    details=f"The endpoint {COMPILER_URL}/compile returned 404. Is the compiler service running?"
                )
            
            # Handle successful response
            if response.ok:
                # Check content type to determine response format
                content_type = response.headers.get('Content-Type', '').lower()
                print(f"[Compiler] Response Content-Type: {content_type}")
                print(f"[Compiler] Response size: {len(response.content)} bytes")
                
                # Try to parse JSON response
                response_data = None
                try:
                    response_data = response.json()
                    print(f"[Compiler] Response is JSON with keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'not a dict'}")
                except ValueError:
                    # Response might be raw binary
                    print(f"[Compiler] Response is not JSON, treating as raw binary")
                
                # Extract binary data
                binary_data = None
                
                if response_data and isinstance(response_data, dict):
                    # Log available fields for debugging
                    print(f"[Compiler] JSON response fields: {', '.join(response_data.keys())}")
                    
                    # Check if response contains an ID (two-step process: compile then download)
                    sketch_id = None
                    if 'data' in response_data and isinstance(response_data['data'], dict):
                        sketch_id = response_data['data'].get('id')
                    
                    if sketch_id:
                        # Need to fetch binary in a separate request
                        print(f"[Compiler] Compilation complete. Sketch ID: {sketch_id}")
                        print(f"[Compiler] Downloading binary from {COMPILER_URL}/download")
                        
                        try:
                            download_response = requests.get(
                                f"{COMPILER_URL}/download",
                                params={
                                    'id': sketch_id,
                                    'board': board,
                                    'filename': f'{project_id}.bin'
                                },
                                timeout=COMPILATION_TIMEOUT
                            )
                            
                            if download_response.ok:
                                binary_data = download_response.content
                                print(f"[Compiler] Downloaded binary: {len(binary_data)} bytes")
                            else:
                                raise CompilationError(
                                    message="Failed to download compiled binary",
                                    details=f"Download request failed with status {download_response.status_code}",
                                    error_type="DOWNLOAD_ERROR",
                                    retryable=True
                                )
                        except requests.exceptions.Timeout:
                            raise CompilerTimeoutError(
                                message="Binary download timeout",
                                details=f"Download did not complete within {COMPILATION_TIMEOUT} seconds"
                            )
                        except requests.exceptions.RequestException as e:
                            raise CompilerConnectionError(
                                message="Failed to download binary",
                                details=str(e)
                            )
                    
                    # If no ID, try to extract binary from response directly
                    elif 'binary' in response_data:
                        import base64
                        if isinstance(response_data['binary'], str):
                            print(f"[Compiler] Decoding base64 binary from 'binary' field")
                            binary_data = base64.b64decode(response_data['binary'])
                        else:
                            binary_data = response_data['binary']
                    elif 'data' in response_data:
                        import base64
                        if isinstance(response_data['data'], str):
                            print(f"[Compiler] Decoding base64 binary from 'data' field")
                            binary_data = base64.b64decode(response_data['data'])
                        else:
                            binary_data = response_data['data']
                    elif 'hex' in response_data:
                        # Some compilers return hex format
                        print(f"[Compiler] Decoding hex binary from 'hex' field")
                        binary_data = bytes.fromhex(response_data['hex'])
                    else:
                        # Try all keys that might contain binary data
                        for key in ['compiled', 'output', 'result', 'file', 'firmware']:
                            if key in response_data:
                                import base64
                                print(f"[Compiler] Found potential binary in '{key}' field")
                                if isinstance(response_data[key], str):
                                    try:
                                        binary_data = base64.b64decode(response_data[key])
                                        print(f"[Compiler] Successfully decoded base64 from '{key}' field")
                                        break
                                    except Exception as e:
                                        print(f"[Compiler] Failed to decode '{key}' as base64: {e}")
                                else:
                                    binary_data = response_data[key]
                                    break
                
                if binary_data is None:
                    # Response is raw binary or we couldn't find it in JSON
                    print(f"[Compiler] Using response.content as raw binary")
                    binary_data = response.content
                
                # Validate binary
                is_valid, validation_error = validate_binary(binary_data)
                if not is_valid:
                    raise CompilationError(
                        message="Binary validation failed",
                        details=validation_error,
                        error_type="INVALID_BINARY",
                        retryable=False
                    )
                
                print(f"[Compiler] Compilation successful! Binary size: {len(binary_data):,} bytes ({len(binary_data)/1024:.2f} KB)")
                return binary_data
            
            else:
                # Parse error response
                try:
                    response_data = response.json()
                except ValueError:
                    response_data = response.text
                
                error_info = parse_compiler_error(response_data, response.status_code)
                
                # Don't retry non-retryable errors
                if not error_info['retryable']:
                    raise CompilationError(
                        message=error_info['message'],
                        details=error_info['details'],
                        error_type=error_info['type'],
                        retryable=False
                    )
                
                # Save error for potential retry
                last_error = CompilationError(
                    message=error_info['message'],
                    details=error_info['details'],
                    error_type=error_info['type'],
                    retryable=True
                )
                
                print(f"[Compiler] Compilation failed (retryable): {error_info['message']}")
        
        except requests.exceptions.Timeout:
            last_error = CompilerTimeoutError(
                message="Compilation timeout",
                details=f"Compiler did not respond within {COMPILATION_TIMEOUT} seconds"
            )
            print(f"[Compiler] Timeout after {COMPILATION_TIMEOUT}s")
        
        except requests.exceptions.ConnectionError as e:
            last_error = CompilerConnectionError(
                message="Cannot connect to compiler",
                details=f"Failed to connect to {COMPILER_URL}: {str(e)}"
            )
            print(f"[Compiler] Connection error: {str(e)}")
        
        except CompilationError:
            # Re-raise compilation errors that are not retryable
            raise
        
        except Exception as e:
            # Unexpected error
            raise CompilationError(
                message="Unexpected compilation error",
                details=str(e),
                error_type="UNEXPECTED_ERROR",
                retryable=False
            )
        
        # Wait before retrying (except on last attempt)
        if attempt < MAX_RETRIES - 1:
            print(f"[Compiler] Retrying in {RETRY_DELAY} seconds...")
            time.sleep(RETRY_DELAY)
    
    # All retries exhausted
    if last_error:
        raise last_error
    else:
        raise CompilationError(
            message="Compilation failed after multiple retries",
            details="All retry attempts exhausted",
            error_type="MAX_RETRIES_EXCEEDED",
            retryable=False
        )
