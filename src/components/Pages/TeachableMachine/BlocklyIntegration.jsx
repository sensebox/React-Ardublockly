import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  CheckCircle as CheckIcon,
  Refresh as RefreshIcon,
  Build as BuildIcon,
  Download as DownloadIcon,
  Code as CodeIcon,
  Transform as TransformIcon,
} from "@mui/icons-material";
import ConversionService from "../../../services/conversionService";

const BlocklyIntegration = ({ model }) => {
  // Workflow state for the two-step process
  const [workflowState, setWorkflowState] = useState({
    // Current step: 'idle', 'converting', 'converted', 'compiling', 'complete'
    currentStep: "idle",
    isProcessing: false,
    progress: 0,
    stage: "",
    error: null,
    // Conversion data (stored after successful conversion)
    conversionData: null,
    // Compilation data
    binaryData: null,
    binarySize: null,
  });

  // Fixed board type for senseBox Eye
  const boardType = "sensebox_eye";

  // Step 1: Convert model only
  const handleConvertModel = useCallback(async () => {
    if (!model || !model.model) {
      setWorkflowState((prev) => ({
        ...prev,
        error: {
          message: "No model available",
          details: "Please train a model before converting.",
          type: "VALIDATION",
          suggestions: ["Train a model first"],
          retryable: false,
        },
      }));
      return;
    }

    // Reset state and start conversion
    setWorkflowState({
      currentStep: "converting",
      isProcessing: true,
      progress: 0,
      stage: "serializing",
      error: null,
      conversionData: null,
      binaryData: null,
      binarySize: null,
    });

    try {
      // Prepare representative dataset for int8 quantization
      const representativeDataset = model.representativeSamples || [];
      // Extract class labels from model
      const classLabels = model.classes
        ? model.classes.map((cls) => cls.name)
        : [];

      const conversionResult = await ConversionService.convertToTFLite(
        model.model,
        {
          quantize: true,
          quantizationType: "int8",
          optimize: true,
          arrayName: "g_person_detect_model_data",
          includeMetadata: true,
          representativeDataset: representativeDataset,
          classLabels: classLabels,
          inputShape: model.inputShape || null,
        },
        (stage, progress) => {
          setWorkflowState((prev) => ({
            ...prev,
            stage,
            progress: Math.round(progress),
          }));
        },
      );

      if (!conversionResult.success) {
        setWorkflowState({
          currentStep: "idle",
          isProcessing: false,
          progress: 0,
          stage: "",
          error: conversionResult.error,
          conversionData: null,
          binaryData: null,
          binarySize: null,
        });
        return;
      }

      // Conversion successful - store data and show options
      setWorkflowState({
        currentStep: "converted",
        isProcessing: false,
        progress: 100,
        stage: "complete",
        error: null,
        conversionData: {
          cppCode: conversionResult.data.cppCode,
          modelSettingsCode: conversionResult.data.modelSettingsCode || null,
          modelSize: conversionResult.data.modelSize,
          modelByteArray: conversionResult.data.modelByteArray,
          timestamp:
            conversionResult.data.timestamp || new Date().toISOString(),
        },
        binaryData: null,
        binarySize: null,
      });
    } catch (error) {
      setWorkflowState({
        currentStep: "idle",
        isProcessing: false,
        progress: 0,
        stage: "",
        error: {
          message: "Conversion failed",
          details: error.message || "An unexpected error occurred",
          type: "UNKNOWN",
          suggestions: ["Check your network connection", "Try again later"],
          retryable: true,
        },
        conversionData: null,
        binaryData: null,
        binarySize: null,
      });
    }
  }, [model]);

  // Step 2a: Download cpp file
  const handleDownloadCpp = useCallback(() => {
    if (!workflowState.conversionData) {
      return;
    }

    const classLabels = model.classes
      ? model.classes.map((cls) => cls.name)
      : [];

    const metadata = {
      timestamp: workflowState.conversionData.timestamp,
      modelSize: workflowState.conversionData.modelSize,
      inputShape: model.inputShape,
      classes: classLabels,
    };

    const success = ConversionService.downloadCppFile(
      workflowState.conversionData.cppCode,
      workflowState.conversionData.modelSettingsCode,
      metadata,
    );

    if (!success) {
      setWorkflowState((prev) => ({
        ...prev,
        error: {
          message: "Failed to download cpp file",
          details: "Could not trigger download",
          type: "DOWNLOAD",
          suggestions: ["Try again or check browser permissions"],
          retryable: false,
        },
      }));
    }
  }, [workflowState.conversionData, model]);

  // Step 2b: Compile and download binary
  const handleCompileAndDownload = useCallback(async () => {
    if (!workflowState.conversionData) {
      return;
    }

    const classLabels = model.classes
      ? model.classes.map((cls) => cls.name)
      : [];

    // Start compilation
    setWorkflowState((prev) => ({
      ...prev,
      currentStep: "compiling",
      isProcessing: true,
      progress: 0,
      stage: "compiling",
      error: null,
    }));

    try {
      const compilationResult = await ConversionService.compileModel(
        {
          modelByteArray: workflowState.conversionData.modelByteArray,
          modelSize: workflowState.conversionData.modelSize,
          modelSettingsCode: workflowState.conversionData.modelSettingsCode,
        },
        {
          boardType: boardType,
          optimization: "default",
          classLabels: classLabels,
        },
        (stage, progress) => {
          setWorkflowState((prev) => ({
            ...prev,
            stage,
            progress: Math.round(progress),
          }));
        },
      );

      if (!compilationResult.success) {
        setWorkflowState((prev) => ({
          ...prev,
          currentStep: "converted",
          isProcessing: false,
          error: compilationResult.error,
        }));
        return;
      }

      // Download the binary
      const downloadSuccess = ConversionService.downloadBinary(
        compilationResult.data.binaryData,
        `teachable_machine_${boardType.replace(/:/g, "_")}_${Date.now()}.bin`,
      );

      if (!downloadSuccess) {
        setWorkflowState((prev) => ({
          ...prev,
          currentStep: "converted",
          isProcessing: false,
          error: {
            message: "Failed to download binary",
            details: "Could not trigger download",
            type: "DOWNLOAD",
            suggestions: ["Try again or check browser permissions"],
            retryable: true,
          },
        }));
        return;
      }

      // Success!
      setWorkflowState((prev) => ({
        ...prev,
        currentStep: "complete",
        isProcessing: false,
        progress: 100,
        stage: "complete",
        error: null,
        binaryData: compilationResult.data.binaryData,
        binarySize: compilationResult.data.binarySize,
      }));
    } catch (error) {
      setWorkflowState((prev) => ({
        ...prev,
        currentStep: "converted",
        isProcessing: false,
        error: {
          message: "Compilation failed",
          details: error.message || "An unexpected error occurred",
          type: "UNKNOWN",
          suggestions: ["Check your network connection", "Try again later"],
          retryable: true,
        },
      }));
    }
  }, [workflowState.conversionData, model, boardType]);

  // Retry conversion
  const handleRetryConversion = useCallback(() => {
    setWorkflowState((prev) => ({
      ...prev,
      error: null,
    }));
    handleConvertModel();
  }, [handleConvertModel]);

  // Reset to start new conversion
  const handleReset = useCallback(() => {
    setWorkflowState({
      currentStep: "idle",
      isProcessing: false,
      progress: 0,
      stage: "",
      error: null,
      conversionData: null,
      binaryData: null,
      binarySize: null,
    });
  }, []);

  // Get descriptive stage text for progress bar
  const getStageText = () => {
    const { currentStep, stage } = workflowState;
    if (currentStep === "converting") {
      if (stage === "serializing") return "Serializing model...";
      if (stage === "uploading") return "Uploading to server...";
      if (stage === "converting") return "Converting to TFLite...";
      if (stage === "generating") return "Generating C/C++ code...";
      return "Converting model...";
    } else if (currentStep === "compiling") {
      return "Compiling model to binary...";
    }
    return "";
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Convert your trained model to TensorFlow Lite Micro format. After
        conversion, you can download the model as a cpp file for use in Arduino
        IDE, or compile it to a binary for direct upload to your senseBox Eye.
      </Typography>

      {/* Step 1: Convert Model Button */}
      {(workflowState.currentStep === "idle" ||
        workflowState.currentStep === "converting") && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={
            workflowState.isProcessing ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <TransformIcon />
            )
          }
          onClick={handleConvertModel}
          disabled={!model || !model.model || workflowState.isProcessing}
          sx={{ mb: 3 }}
        >
          {workflowState.isProcessing ? "Converting..." : "Convert Model"}
        </Button>
      )}

      {/* Progress Indicator */}
      {workflowState.isProcessing && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ flexGrow: 1 }}
            >
              {getStageText()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {workflowState.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={workflowState.progress}
          />
        </Box>
      )}

      {/* Error Display */}
      {workflowState.error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            workflowState.error.retryable && (
              <Button
                color="inherit"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={handleRetryConversion}
              >
                Retry
              </Button>
            )
          }
        >
          <Typography variant="subtitle2" gutterBottom>
            {workflowState.error.message}
          </Typography>
          {workflowState.error.details && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              {workflowState.error.details}
            </Typography>
          )}
          {workflowState.error.suggestions &&
            workflowState.error.suggestions.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  Suggestions:
                </Typography>
                <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
                  {workflowState.error.suggestions.map((suggestion, idx) => (
                    <li key={idx}>
                      <Typography variant="body2">{suggestion}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
        </Alert>
      )}

      {/* Step 2: Conversion Complete - Show Download Options */}
      {(workflowState.currentStep === "converted" ||
        workflowState.currentStep === "compiling" ||
        workflowState.currentStep === "complete") &&
        workflowState.conversionData && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              {/* Success Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <CheckIcon color="success" />
                <Typography variant="h6">
                  Model Successfully Converted
                </Typography>
                {workflowState.conversionData.modelSize && (
                  <Chip
                    label={`${(workflowState.conversionData.modelSize / 1024).toFixed(2)} KB`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Choose one of the following options:
              </Typography>

              {/* Option A: Download cpp file */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Option A: Download as cpp File
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Download the model as a single cpp file for use in Arduino IDE
                  or to upload to Blockly UI later.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CodeIcon />}
                  onClick={handleDownloadCpp}
                  disabled={workflowState.isProcessing}
                >
                  Download cpp File
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Option B: Compile and download binary */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Option B: Compile & Download Binary
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Compile the model to a binary file that can be directly
                  uploaded to your senseBox Eye via drag-and-drop.
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={
                      workflowState.currentStep === "compiling" ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <BuildIcon />
                      )
                    }
                    onClick={handleCompileAndDownload}
                    disabled={workflowState.isProcessing}
                  >
                    {workflowState.currentStep === "compiling"
                      ? "Compiling..."
                      : "Compile & Download Binary"}
                  </Button>
                  {workflowState.binaryData && (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<DownloadIcon />}
                      onClick={() => {
                        ConversionService.downloadBinary(
                          workflowState.binaryData,
                          `teachable_machine_${boardType.replace(/:/g, "_")}_${Date.now()}.bin`,
                        );
                      }}
                    >
                      Download Binary Again
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Convert another model button */}
              <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
                <Button
                  variant="text"
                  color="secondary"
                  size="small"
                  onClick={handleReset}
                  disabled={workflowState.isProcessing}
                >
                  Convert a Different Model
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

      {/* Success Message after binary download */}
      {workflowState.currentStep === "complete" && workflowState.binaryData && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Success! Binary Downloaded
          </Typography>
          <Typography variant="body2">
            Your model has been compiled and downloaded! The binary file is
            ready to upload to your senseBox Eye board via drag-and-drop.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default BlocklyIntegration;
