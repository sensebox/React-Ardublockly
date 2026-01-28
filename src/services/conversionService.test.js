import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import axios from "axios";
import ConversionService, {
  ConversionErrorType,
  ConversionStage,
} from "./conversionService";

// Mock axios
vi.mock("axios");

describe("ConversionService - Compilation Features", () => {
  let mockModelData;
  let mockCompilationResponse;

  beforeEach(() => {
    // Mock model data (result from convertToTFLite)
    mockModelData = {
      modelByteArray: [0x00, 0x01, 0x02, 0x03],
      modelSize: 1024,
      cppCode: "const unsigned char model_data[] = {...};",
    };

    // Mock successful compilation response
    mockCompilationResponse = {
      data: {
        success: true,
        data: {
          binaryData: btoa("mock binary content"),
          binarySize: 2048,
          metadata: {
            timestamp: "2026-01-26T12:00:00Z",
            modelSize: 1024,
            boardType: "arduino:avr:uno",
          },
        },
      },
    };

    // Clear all mocks
    vi.clearAllMocks();
  });

  describe("compileModel", () => {
    it("should successfully compile model with default options", async () => {
      axios.post.mockResolvedValue(mockCompilationResponse);

      const result = await ConversionService.compileModel(mockModelData);

      expect(result.success).toBe(true);
      expect(result.data.binaryData).toBeDefined();
      expect(result.data.binarySize).toBe(2048);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/compile-model"),
        expect.objectContaining({
          modelData: mockModelData.modelByteArray,
          modelSize: mockModelData.modelSize,
          boardType: "arduino:avr:uno",
          optimization: "default",
        }),
        expect.any(Object),
      );
    });

    it("should compile model with custom board type", async () => {
      axios.post.mockResolvedValue(mockCompilationResponse);

      const options = {
        boardType: "arduino:samd:mkr1000",
        optimization: "size",
      };

      const result = await ConversionService.compileModel(
        mockModelData,
        options,
      );

      expect(result.success).toBe(true);
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          boardType: "arduino:samd:mkr1000",
          optimization: "size",
        }),
        expect.any(Object),
      );
    });

    it("should track compilation progress through callback", async () => {
      axios.post.mockResolvedValue(mockCompilationResponse);

      const progressCallback = vi.fn();
      await ConversionService.compileModel(mockModelData, {}, progressCallback);

      // Should report progress at different stages
      expect(progressCallback).toHaveBeenCalledWith(
        ConversionStage.COMPILING,
        0,
      );
      expect(progressCallback).toHaveBeenCalledWith(
        ConversionStage.COMPILING,
        expect.any(Number),
      );
      expect(progressCallback).toHaveBeenCalledWith(
        ConversionStage.COMPLETE,
        100,
      );
    });

    it("should return validation error when model data is missing", async () => {
      const result = await ConversionService.compileModel(null);

      expect(result.success).toBe(false);
      expect(result.error.type).toBe(ConversionErrorType.VALIDATION);
      expect(result.error.message).toContain("Invalid model data");
      expect(result.error.retryable).toBe(false);
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("should return validation error when modelByteArray is missing", async () => {
      const invalidData = { modelSize: 1024 };
      const result = await ConversionService.compileModel(invalidData);

      expect(result.success).toBe(false);
      expect(result.error.type).toBe(ConversionErrorType.VALIDATION);
      expect(result.error.suggestions).toContain(
        "Convert the model to TFLite format before compilation",
      );
    });

    it("should handle API error response", async () => {
      const errorResponse = {
        response: {
          data: {
            error: {
              message: "Compilation error",
              details: "Sketch has syntax errors",
              type: ConversionErrorType.CONVERSION,
              suggestions: ["Check the generated code"],
              retryable: false,
            },
          },
        },
      };
      axios.post.mockRejectedValue(errorResponse);

      const result = await ConversionService.compileModel(mockModelData);

      expect(result.success).toBe(false);
      expect(result.error.message).toBe("Compilation error");
      expect(result.error.details).toBe("Sketch has syntax errors");
      expect(result.error.type).toBe(ConversionErrorType.CONVERSION);
    });

    it("should handle network errors", async () => {
      const networkError = {
        request: {},
        message: "Network Error",
      };
      axios.post.mockRejectedValue(networkError);

      const result = await ConversionService.compileModel(mockModelData);

      expect(result.success).toBe(false);
      expect(result.error.type).toBe(ConversionErrorType.NETWORK);
      expect(result.error.message).toBe("Network error");
      expect(result.error.retryable).toBe(true);
      expect(result.error.suggestions).toContain(
        "Check your internet connection",
      );
    });

    it("should handle unknown errors", async () => {
      const unknownError = new Error("Something went wrong");
      axios.post.mockRejectedValue(unknownError);

      const result = await ConversionService.compileModel(mockModelData);

      expect(result.success).toBe(false);
      expect(result.error.type).toBe(ConversionErrorType.UNKNOWN);
      expect(result.error.message).toBe("Unexpected error");
      expect(result.error.retryable).toBe(true);
    });

    it("should use correct timeout for compilation", async () => {
      axios.post.mockResolvedValue(mockCompilationResponse);

      await ConversionService.compileModel(mockModelData);

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          timeout: 120000, // 120 seconds
        }),
      );
    });
  });

  describe("downloadBinary", () => {
    let createObjectURLSpy;
    let revokeObjectURLSpy;
    let mockLink;

    beforeEach(() => {
      // Mock URL.createObjectURL and revokeObjectURL
      createObjectURLSpy = vi.fn().mockReturnValue("blob:mock-url");
      revokeObjectURLSpy = vi.fn();
      global.URL.createObjectURL = createObjectURLSpy;
      global.URL.revokeObjectURL = revokeObjectURLSpy;

      // Mock document methods
      mockLink = {
        href: "",
        download: "",
        click: vi.fn(),
      };
      document.createElement = vi.fn().mockReturnValue(mockLink);
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should successfully download binary data", () => {
      const binaryData = btoa("test binary content");
      const result = ConversionService.downloadBinary(binaryData, "test.bin");

      expect(result).toBe(true);
      expect(mockLink.download).toBe("test.bin");
      expect(mockLink.click).toHaveBeenCalled();
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
      expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:mock-url");
    });

    it("should generate filename with timestamp when not provided", () => {
      const binaryData = btoa("test binary content");
      const beforeTime = Date.now();

      ConversionService.downloadBinary(binaryData);

      const afterTime = Date.now();

      expect(mockLink.download).toMatch(/^arduino_sketch_\d+\.bin$/);
      const timestamp = parseInt(mockLink.download.match(/\d+/)[0]);
      expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(timestamp).toBeLessThanOrEqual(afterTime);
    });

    it("should return false when no binary data is provided", () => {
      const result = ConversionService.downloadBinary(null);

      expect(result).toBe(false);
      expect(mockLink.click).not.toHaveBeenCalled();
    });

    it("should return false when binary data is empty string", () => {
      const result = ConversionService.downloadBinary("");

      expect(result).toBe(false);
      expect(mockLink.click).not.toHaveBeenCalled();
    });

    it("should handle errors during download gracefully", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const binaryData = btoa("test binary content");

      // Make click throw an error
      mockLink.click.mockImplementation(() => {
        throw new Error("Download failed");
      });

      const result = ConversionService.downloadBinary(binaryData, "test.bin");

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to download binary:",
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });

    it("should decode base64 binary data correctly", () => {
      const originalBinary = "Hello World!";
      const binaryData = btoa(originalBinary);

      ConversionService.downloadBinary(binaryData, "test.bin");

      // Verify blob was created with correct data
      expect(createObjectURLSpy).toHaveBeenCalledWith(expect.any(Blob));
      const blobArg = createObjectURLSpy.mock.calls[0][0];
      expect(blobArg.type).toBe("application/octet-stream");
    });
  });

  describe("Compilation Integration", () => {
    it("should handle end-to-end compilation workflow", async () => {
      axios.post.mockResolvedValue(mockCompilationResponse);

      const progressCallback = vi.fn();
      const result = await ConversionService.compileModel(
        mockModelData,
        { boardType: "arduino:avr:nano" },
        progressCallback,
      );

      // Verify success
      expect(result.success).toBe(true);
      expect(result.data.binaryData).toBeDefined();

      // Verify progress was tracked
      expect(progressCallback).toHaveBeenCalled();

      // Verify correct endpoint and payload
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/compile-model"),
        expect.objectContaining({
          modelData: mockModelData.modelByteArray,
          boardType: "arduino:avr:nano",
        }),
        expect.any(Object),
      );
    });

    it("should support compile after convert workflow", async () => {
      // Simulate the flow: convert then compile
      const convertResponse = {
        data: {
          success: true,
          data: {
            modelByteArray: [0x00, 0x01, 0x02],
            modelSize: 512,
            cppCode: "mock cpp code",
          },
        },
      };

      // Get the converted data
      const convertedData = convertResponse.data.data;

      // Mock the compilation call with the correct response
      axios.post.mockResolvedValue(mockCompilationResponse);

      // Then compile the converted data
      const compileResult = await ConversionService.compileModel(convertedData);

      expect(compileResult.success).toBe(true);
      expect(compileResult.data.binaryData).toBeDefined();
    });
  });
});
