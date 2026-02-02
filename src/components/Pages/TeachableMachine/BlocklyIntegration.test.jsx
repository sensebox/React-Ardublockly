/**
 * Integration tests for BlocklyIntegration component
 * Tests end-to-end conversion flow and error propagation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlocklyIntegration from "./BlocklyIntegration";
import ConversionService from "../../../services/conversionService";

// Mock the ConversionService
vi.mock("../../../services/conversionService", () => ({
  default: {
    convertToTFLite: vi.fn(),
    compileModel: vi.fn(),
    downloadBinary: vi.fn(),
  },
}));

// Mock navigator.clipboard
const mockClipboard = {
  writeText: vi.fn(),
};

Object.assign(navigator, {
  clipboard: mockClipboard,
});

describe("BlocklyIntegration - Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClipboard.writeText.mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("End-to-End Conversion Flow", () => {
    it("should complete full conversion flow successfully", async () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      const mockResult = {
        success: true,
        data: {
          cppCode: "const unsigned char model_data[] = {0x00, 0x01};",
          modelSize: 1024,
          arrayName: "g_person_detect_model_data",
          timestamp: "2024-01-15T10:30:00Z",
        },
      };

      ConversionService.convertToTFLite.mockResolvedValue(mockResult);

      render(<BlocklyIntegration model={mockModel} />);

      // Click convert button
      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      expect(convertButton).toBeEnabled();

      fireEvent.click(convertButton);

      // Button should be disabled during conversion
      expect(convertButton).toBeDisabled();

      // Wait for conversion to complete
      await waitFor(() => {
        expect(
          screen.getByText(/model successfully converted/i),
        ).toBeInTheDocument();
      });

      // Verify code is displayed (check for model size chip)
      expect(screen.getByText(/model size: 1\.00 kb/i)).toBeInTheDocument();

      // Verify model size is displayed
      expect(screen.getByText(/model size: 1\.00 kb/i)).toBeInTheDocument();

      // Verify success message
      expect(
        screen.getByText(/model successfully converted/i),
      ).toBeInTheDocument();

      // Button should be re-enabled
      expect(convertButton).toBeEnabled();
    });

    it("should track progress through all stages", async () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      let progressCallback;
      ConversionService.convertToTFLite.mockImplementation(
        (model, options, onProgress) => {
          progressCallback = onProgress;
          return new Promise((resolve) => {
            setTimeout(() => {
              // Simulate progress updates
              progressCallback("serializing", 25);
              progressCallback("uploading", 50);
              progressCallback("converting", 75);
              progressCallback("generating", 100);
              progressCallback("complete", 100);

              resolve({
                success: true,
                data: {
                  cppCode: "const unsigned char model_data[] = {0x00};",
                  modelSize: 512,
                  arrayName: "g_person_detect_model_data",
                  timestamp: "2024-01-15T10:30:00Z",
                },
              });
            }, 100);
          });
        },
      );

      render(<BlocklyIntegration model={mockModel} />);

      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      fireEvent.click(convertButton);

      // Wait for conversion to complete
      await waitFor(
        () => {
          expect(
            screen.getByText(/model successfully converted/i),
          ).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });
  });

  describe("Error Propagation from Backend", () => {
    it("should display network error with retry option", async () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      const networkError = {
        success: false,
        error: {
          message: "Network error",
          details: "Unable to reach the conversion service",
          type: "NETWORK",
          suggestions: [
            "Check your internet connection",
            "Verify the backend service is running",
            "Try again in a moment",
          ],
          retryable: true,
        },
      };

      ConversionService.convertToTFLite.mockResolvedValue(networkError);

      render(<BlocklyIntegration model={mockModel} />);

      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      fireEvent.click(convertButton);

      // Wait for error to display
      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });

      // Verify error details
      expect(
        screen.getByText(/unable to reach the conversion service/i),
      ).toBeInTheDocument();

      // Verify suggestions are displayed
      expect(
        screen.getByText(/check your internet connection/i),
      ).toBeInTheDocument();

      // Verify retry button is present
      const retryButton = screen.getByRole("button", { name: /retry/i });
      expect(retryButton).toBeInTheDocument();
    });

    it("should display conversion error with suggestions", async () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      const conversionError = {
        success: false,
        error: {
          message: "Model contains unsupported operations",
          details:
            "The following operations are not supported: BatchNormalization",
          type: "UNSUPPORTED_OPS",
          suggestions: [
            "Try using a simpler model architecture",
            "Remove batch normalization layers",
          ],
          retryable: false,
        },
      };

      ConversionService.convertToTFLite.mockResolvedValue(conversionError);

      render(<BlocklyIntegration model={mockModel} />);

      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      fireEvent.click(convertButton);

      // Wait for error to display
      await waitFor(() => {
        expect(
          screen.getByText(/model contains unsupported operations/i),
        ).toBeInTheDocument();
      });

      // Verify error details
      expect(screen.getByText(/batchnormalization/i)).toBeInTheDocument();

      // Verify suggestions
      expect(
        screen.getByText(/try using a simpler model architecture/i),
      ).toBeInTheDocument();

      // Retry button should NOT be present for non-retryable errors
      expect(
        screen.queryByRole("button", { name: /retry/i }),
      ).not.toBeInTheDocument();
    });

    it("should display size limit error", async () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      const sizeLimitError = {
        success: false,
        error: {
          message: "Model too large for TFLite Micro",
          details: "Model size exceeds 1MB limit",
          type: "SIZE_LIMIT",
          suggestions: [
            "Reduce the number of layers",
            "Use smaller layer dimensions",
            "Enable quantization to reduce size",
          ],
          retryable: false,
        },
      };

      ConversionService.convertToTFLite.mockResolvedValue(sizeLimitError);

      render(<BlocklyIntegration model={mockModel} />);

      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      fireEvent.click(convertButton);

      // Wait for error to display
      await waitFor(() => {
        expect(
          screen.getByText(/model too large for tflite micro/i),
        ).toBeInTheDocument();
      });

      // Verify suggestions
      expect(
        screen.getByText(/reduce the number of layers/i),
      ).toBeInTheDocument();
    });

    it("should handle retry functionality", async () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      const networkError = {
        success: false,
        error: {
          message: "Network error",
          details: "Connection timeout",
          type: "NETWORK",
          suggestions: ["Try again"],
          retryable: true,
        },
      };

      const successResult = {
        success: true,
        data: {
          cppCode: "const unsigned char model_data[] = {0x00};",
          modelSize: 512,
          arrayName: "g_person_detect_model_data",
          timestamp: "2024-01-15T10:30:00Z",
        },
      };

      // First call fails, second succeeds
      ConversionService.convertToTFLite
        .mockResolvedValueOnce(networkError)
        .mockResolvedValueOnce(successResult);

      render(<BlocklyIntegration model={mockModel} />);

      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      fireEvent.click(convertButton);

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });

      // Click retry
      const retryButton = screen.getByRole("button", { name: /retry/i });
      fireEvent.click(retryButton);

      // Wait for success
      await waitFor(() => {
        expect(
          screen.getByText(/model successfully converted/i),
        ).toBeInTheDocument();
      });

      // Verify conversion was called twice
      expect(ConversionService.convertToTFLite).toHaveBeenCalledTimes(2);
    });
  });

  describe("Button State Management", () => {
    it("should disable button when no model is available", () => {
      render(<BlocklyIntegration model={null} />);

      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      expect(convertButton).toBeDisabled();
    });

    it("should enable button when model is available", () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      render(<BlocklyIntegration model={mockModel} />);

      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      expect(convertButton).toBeEnabled();
    });

    it("should disable button during conversion", async () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      ConversionService.convertToTFLite.mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              data: {
                cppCode: "const unsigned char model_data[] = {0x00};",
                modelSize: 512,
                arrayName: "g_person_detect_model_data",
                timestamp: "2024-01-15T10:30:00Z",
              },
            });
          }, 100);
        });
      });

      render(<BlocklyIntegration model={mockModel} />);

      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      fireEvent.click(convertButton);

      // Button should be disabled immediately
      expect(convertButton).toBeDisabled();
      expect(screen.getByText(/converting\.\.\./i)).toBeInTheDocument();

      // Wait for completion
      await waitFor(() => {
        expect(convertButton).toBeEnabled();
      });
    });
  });

  describe("Clipboard Integration", () => {
    it("should copy code to clipboard successfully", async () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      const mockResult = {
        success: true,
        data: {
          cppCode: "const unsigned char model_data[] = {0x00, 0x01};",
          modelSize: 1024,
          arrayName: "g_person_detect_model_data",
          timestamp: "2024-01-15T10:30:00Z",
        },
      };

      ConversionService.convertToTFLite.mockResolvedValue(mockResult);

      render(<BlocklyIntegration model={mockModel} />);

      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      fireEvent.click(convertButton);

      // Wait for conversion to complete by checking for success message
      await waitFor(() => {
        expect(
          screen.getByText(/model successfully converted/i),
        ).toBeInTheDocument();
      });

      // Click copy button (use the main one, not the one in CodeViewer)
      const copyButtons = screen.getAllByRole("button", {
        name: /copy to clipboard/i,
      });
      const mainCopyButton = copyButtons[copyButtons.length - 1]; // Get the last one (main button)
      fireEvent.click(mainCopyButton);

      // Verify clipboard was called
      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(
          mockResult.data.cppCode,
        );
      });

      // Verify success feedback
      expect(screen.getByText(/copied!/i)).toBeInTheDocument();
    });

    it("should handle clipboard error gracefully", async () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      const mockResult = {
        success: true,
        data: {
          cppCode: "const unsigned char model_data[] = {0x00};",
          modelSize: 512,
          arrayName: "g_person_detect_model_data",
          timestamp: "2024-01-15T10:30:00Z",
        },
      };

      ConversionService.convertToTFLite.mockResolvedValue(mockResult);
      mockClipboard.writeText.mockRejectedValue(
        new Error("Clipboard not available"),
      );

      render(<BlocklyIntegration model={mockModel} />);

      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      fireEvent.click(convertButton);

      // Wait for conversion to complete by checking for success message
      await waitFor(() => {
        expect(
          screen.getByText(/model successfully converted/i),
        ).toBeInTheDocument();
      });

      // Click copy button (use the main one, not the one in CodeViewer)
      const copyButtons = screen.getAllByRole("button", {
        name: /copy to clipboard/i,
      });
      const mainCopyButton = copyButtons[copyButtons.length - 1]; // Get the last one (main button)
      fireEvent.click(mainCopyButton);

      // Wait for error to display
      await waitFor(() => {
        expect(
          screen.getByText(/failed to copy to clipboard/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Compilation Workflow", () => {
    it("should show compile button after successful conversion", async () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      const mockResult = {
        success: true,
        data: {
          cppCode: "const unsigned char model_data[] = {0x00, 0x01};",
          modelSize: 1024,
          modelByteArray: [0x00, 0x01],
          arrayName: "g_person_detect_model_data",
          timestamp: "2024-01-15T10:30:00Z",
        },
      };

      ConversionService.convertToTFLite.mockResolvedValue(mockResult);

      render(<BlocklyIntegration model={mockModel} />);

      // Convert model first
      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      fireEvent.click(convertButton);

      // Wait for conversion to complete
      await waitFor(() => {
        expect(
          screen.getByText(/compile to arduino binary/i),
        ).toBeInTheDocument();
      });

      // Verify compile button is present and enabled
      const compileButton = screen.getByRole("button", {
        name: /compile model/i,
      });
      expect(compileButton).toBeInTheDocument();
      expect(compileButton).toBeEnabled();
    });

    it("should successfully compile model and show download button", async () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      const mockConversionResult = {
        success: true,
        data: {
          cppCode: "const unsigned char model_data[] = {0x00, 0x01};",
          modelSize: 1024,
          modelByteArray: [0x00, 0x01],
          arrayName: "g_person_detect_model_data",
        },
      };

      const mockCompilationResult = {
        success: true,
        data: {
          binaryData: btoa("mock binary content"),
          binarySize: 2048,
          metadata: {
            timestamp: "2024-01-15T10:30:00Z",
            boardType: "arduino:avr:uno",
          },
        },
      };

      ConversionService.convertToTFLite.mockResolvedValue(mockConversionResult);
      ConversionService.compileModel.mockResolvedValue(mockCompilationResult);

      render(<BlocklyIntegration model={mockModel} />);

      // Convert model first
      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      fireEvent.click(convertButton);

      // Wait for compile button to appear
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /compile model/i }),
        ).toBeInTheDocument();
      });

      // Click compile button
      const compileButton = screen.getByRole("button", {
        name: /compile model/i,
      });
      fireEvent.click(compileButton);

      // Wait for compilation to complete
      await waitFor(() => {
        expect(
          screen.getByText(/compilation successful!/i),
        ).toBeInTheDocument();
      });

      // Verify download button is present
      const downloadButton = screen.getByRole("button", {
        name: /download binary/i,
      });
      expect(downloadButton).toBeInTheDocument();

      // Verify binary size is displayed
      expect(screen.getByText(/binary size: 2\.00 kb/i)).toBeInTheDocument();
    });

    it("should track compilation progress", async () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      const mockConversionResult = {
        success: true,
        data: {
          cppCode: "code",
          modelSize: 1024,
          modelByteArray: [0x00, 0x01],
        },
      };

      let compilationProgressCallback;
      ConversionService.convertToTFLite.mockResolvedValue(mockConversionResult);
      ConversionService.compileModel.mockImplementation(
        (model, options, onProgress) => {
          compilationProgressCallback = onProgress;
          return new Promise((resolve) => {
            setTimeout(() => {
              compilationProgressCallback("compiling", 50);
              setTimeout(() => {
                compilationProgressCallback("complete", 100);
                resolve({
                  success: true,
                  data: {
                    binaryData: btoa("binary"),
                    binarySize: 2048,
                  },
                });
              }, 50);
            }, 50);
          });
        },
      );

      render(<BlocklyIntegration model={mockModel} />);

      // Convert and then compile
      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      fireEvent.click(convertButton);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /compile model/i }),
        ).toBeInTheDocument();
      });

      const compileButton = screen.getByRole("button", {
        name: /compile model/i,
      });
      fireEvent.click(compileButton);

      // Should show progress indicator
      await waitFor(() => {
        expect(
          screen.getByText(/compiling model to binary/i),
        ).toBeInTheDocument();
      });

      // Wait for completion
      await waitFor(() => {
        expect(
          screen.getByText(/compilation successful!/i),
        ).toBeInTheDocument();
      });
    });

    it("should handle compilation errors with retry option", async () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      const mockConversionResult = {
        success: true,
        data: {
          cppCode: "code",
          modelSize: 1024,
          modelByteArray: [0x00, 0x01],
        },
      };

      const compilationError = {
        success: false,
        error: {
          message: "Compilation failed",
          details: "Sketch has syntax errors",
          type: "CONVERSION",
          suggestions: ["Check the generated code", "Try a different board"],
          retryable: true,
        },
      };

      ConversionService.convertToTFLite.mockResolvedValue(mockConversionResult);
      ConversionService.compileModel.mockResolvedValue(compilationError);

      render(<BlocklyIntegration model={mockModel} />);

      // Convert and compile
      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      fireEvent.click(convertButton);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /compile model/i }),
        ).toBeInTheDocument();
      });

      const compileButton = screen.getByRole("button", {
        name: /compile model/i,
      });
      fireEvent.click(compileButton);

      // Wait for error to display
      await waitFor(() => {
        expect(
          screen.getByText(/compilation error: compilation failed/i),
        ).toBeInTheDocument();
      });

      // Verify error details and suggestions
      expect(screen.getByText(/sketch has syntax errors/i)).toBeInTheDocument();
      expect(screen.getByText(/check the generated code/i)).toBeInTheDocument();

      // Verify retry button is present
      const retryButtons = screen.getAllByRole("button", { name: /retry/i });
      expect(retryButtons.length).toBeGreaterThan(0);
    });

    it("should change board type before compilation", async () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      const mockConversionResult = {
        success: true,
        data: {
          cppCode: "code",
          modelSize: 1024,
          modelByteArray: [0x00, 0x01],
        },
      };

      const mockCompilationResult = {
        success: true,
        data: {
          binaryData: btoa("binary"),
          binarySize: 2048,
        },
      };

      ConversionService.convertToTFLite.mockResolvedValue(mockConversionResult);
      ConversionService.compileModel.mockResolvedValue(mockCompilationResult);

      render(<BlocklyIntegration model={mockModel} />);

      // Convert model
      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      fireEvent.click(convertButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/target board/i)).toBeInTheDocument();
      });

      // Change board type
      const boardSelect = screen.getByLabelText(/target board/i);
      fireEvent.mouseDown(boardSelect);

      const esp32Option = await screen.findByText("senseBox Eye");
      fireEvent.click(esp32Option);

      // Compile with new board type
      const compileButton = screen.getByRole("button", {
        name: /compile model/i,
      });
      fireEvent.click(compileButton);

      // Verify compileModel was called with ESP32 board type
      await waitFor(() => {
        expect(ConversionService.compileModel).toHaveBeenCalledWith(
          expect.any(Object),
          expect.objectContaining({
            boardType: "esp32:esp32:sensebox_eye",
          }),
          expect.any(Function),
        );
      });
    });

    it("should download binary when download button is clicked", async () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      const mockConversionResult = {
        success: true,
        data: {
          cppCode: "code",
          modelSize: 1024,
          modelByteArray: [0x00, 0x01],
        },
      };

      const mockCompilationResult = {
        success: true,
        data: {
          binaryData: btoa("binary content"),
          binarySize: 2048,
        },
      };

      ConversionService.convertToTFLite.mockResolvedValue(mockConversionResult);
      ConversionService.compileModel.mockResolvedValue(mockCompilationResult);
      ConversionService.downloadBinary.mockReturnValue(true);

      render(<BlocklyIntegration model={mockModel} />);

      // Convert and compile
      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      fireEvent.click(convertButton);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /compile model/i }),
        ).toBeInTheDocument();
      });

      const compileButton = screen.getByRole("button", {
        name: /compile model/i,
      });
      fireEvent.click(compileButton);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /download binary/i }),
        ).toBeInTheDocument();
      });

      // Click download button
      const downloadButton = screen.getByRole("button", {
        name: /download binary/i,
      });
      fireEvent.click(downloadButton);

      // Verify downloadBinary was called with correct parameters
      expect(ConversionService.downloadBinary).toHaveBeenCalledWith(
        btoa("binary content"),
        expect.stringMatching(/teachable_machine.*\.bin$/),
      );
    });

    it("should handle download errors gracefully", async () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      const mockConversionResult = {
        success: true,
        data: {
          cppCode: "code",
          modelSize: 1024,
          modelByteArray: [0x00, 0x01],
        },
      };

      const mockCompilationResult = {
        success: true,
        data: {
          binaryData: btoa("binary content"),
          binarySize: 2048,
        },
      };

      ConversionService.convertToTFLite.mockResolvedValue(mockConversionResult);
      ConversionService.compileModel.mockResolvedValue(mockCompilationResult);
      ConversionService.downloadBinary.mockReturnValue(false); // Simulate download failure

      render(<BlocklyIntegration model={mockModel} />);

      // Convert and compile
      const convertButton = screen.getByRole("button", {
        name: /convert model/i,
      });
      fireEvent.click(convertButton);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /compile model/i }),
        ).toBeInTheDocument();
      });

      const compileButton = screen.getByRole("button", {
        name: /compile model/i,
      });
      fireEvent.click(compileButton);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /download binary/i }),
        ).toBeInTheDocument();
      });

      // Click download button
      const downloadButton = screen.getByRole("button", {
        name: /download binary/i,
      });
      fireEvent.click(downloadButton);

      // Should show error message
      await waitFor(() => {
        expect(
          screen.getByText(/failed to download binary/i),
        ).toBeInTheDocument();
      });
    });

    it("should not show compile button before conversion", () => {
      const mockModel = {
        model: {
          save: vi.fn(),
        },
      };

      render(<BlocklyIntegration model={mockModel} />);

      // Compile section should not be visible
      expect(
        screen.queryByText(/compile to arduino binary/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /compile model/i }),
      ).not.toBeInTheDocument();
    });
  });
});
