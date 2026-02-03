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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
  Memory as MemoryIcon,
  Refresh as RefreshIcon,
  Build as BuildIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
} from "@mui/icons-material";
import ConversionService from "../../../services/conversionService";
import CodeViewer from "./CodeViewer";

const BlocklyIntegration = ({ model }) => {
  const [copied, setCopied] = useState(false);
  const [codeExpanded, setCodeExpanded] = useState(false);

  // Unified state for conversion, compilation, and download
  const [workflowState, setWorkflowState] = useState({
    isProcessing: false,
    currentStep: "", // 'conversion', 'compilation', 'download', 'complete'
    stage: "", // Stage description within current step
    progress: 0, // Overall progress 0-100
    error: null,
    // Conversion data
    tfliteCode: null,
    modelSettingsCode: null,
    modelSize: null,
    modelData: null,
    // Compilation data
    binaryData: null,
    binarySize: null,
  });

  // Fixed board type for senseBox Eye
  const boardType = "sensebox_eye";

  // Combined workflow: Convert -> Compile -> Download
  const handleConvertCompileDownload = useCallback(async () => {
    if (!model || !model.model) {
      setWorkflowState((prev) => ({
        ...prev,
        error: {
          message: "No model available",
          details: "Please train a model before processing.",
          type: "VALIDATION",
          suggestions: ["Train a model first"],
          retryable: false,
        },
      }));
      return;
    }

    // Reset state and start processing
    setWorkflowState({
      isProcessing: true,
      currentStep: "conversion",
      progress: 0,
      stage: "serializing",
      error: null,
      tfliteCode: null,
      modelSettingsCode: null,
      modelSize: null,
      modelData: null,
      binaryData: null,
      binarySize: null,
    });

    try {
      // ==================== STEP 1: MODEL CONVERSION ====================

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
          inputShape: model.inputShape || null, // Pass the expected input shape
        },
        (stage, progress) => {
          // Progress 0-33% for conversion phase
          const overallProgress = Math.round(progress / 3);
          setWorkflowState((prev) => ({
            ...prev,
            stage,
            progress: overallProgress,
          }));
        },
      );

      if (!conversionResult.success) {
        setWorkflowState({
          isProcessing: false,
          currentStep: "conversion",
          progress: 0,
          stage: "",
          error: conversionResult.error,
          tfliteCode: null,
          modelSettingsCode: null,
          modelSize: null,
          modelData: null,
          binaryData: null,
          binarySize: null,
        });
        return;
      }

      // Update state with conversion results
      setWorkflowState((prev) => ({
        ...prev,
        currentStep: "compilation",
        progress: 33,
        stage: "compiling",
        tfliteCode: conversionResult.data.cppCode,
        modelSettingsCode: conversionResult.data.modelSettingsCode || null,
        modelSize: conversionResult.data.modelSize,
        modelData: conversionResult.data,
      }));

      // ==================== STEP 2: MODEL COMPILATION ====================
      const compilationResult = await ConversionService.compileModel(
        conversionResult.data,
        {
          boardType: boardType,
          optimization: "default",
          classLabels: classLabels,
        },
        (stage, progress) => {
          // Progress 33-66% for compilation phase
          const overallProgress = Math.round(33 + progress / 3);
          setWorkflowState((prev) => ({
            ...prev,
            stage,
            progress: overallProgress,
          }));
        },
      );

      if (!compilationResult.success) {
        setWorkflowState((prev) => ({
          ...prev,
          isProcessing: false,
          currentStep: "compilation",
          error: compilationResult.error,
        }));
        return;
      }

      // Update state with compilation results
      setWorkflowState((prev) => ({
        ...prev,
        currentStep: "download",
        progress: 66,
        stage: "preparing download",
        binaryData: compilationResult.data.binaryData,
        binarySize: compilationResult.data.binarySize,
      }));

      // ==================== STEP 3: DOWNLOAD BINARY ====================
      const downloadSuccess = ConversionService.downloadBinary(
        compilationResult.data.binaryData,
        `teachable_machine_${boardType.replace(/:/g, "_")}_${Date.now()}.bin`,
      );

      if (!downloadSuccess) {
        setWorkflowState((prev) => ({
          ...prev,
          isProcessing: false,
          currentStep: "download",
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

      // All steps complete!
      setWorkflowState((prev) => ({
        ...prev,
        isProcessing: false,
        currentStep: "complete",
        progress: 100,
        stage: "complete",
        error: null,
      }));

      // Auto-expand code viewer on success
      setCodeExpanded(true);
    } catch (error) {
      setWorkflowState({
        isProcessing: false,
        currentStep: "conversion",
        progress: 0,
        stage: "",
        error: {
          message: "Process failed",
          details: error.message || "An unexpected error occurred",
          type: "UNKNOWN",
          suggestions: ["Check your network connection", "Try again later"],
          retryable: true,
        },
        tfliteCode: null,
        modelSettingsCode: null,
        modelSize: null,
        modelData: null,
        binaryData: null,
        binarySize: null,
      });
    }
  }, [model, boardType]);

  const handleCopyCode = useCallback(async () => {
    if (!workflowState.tfliteCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(workflowState.tfliteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
      setWorkflowState((prev) => ({
        ...prev,
        error: {
          message: "Failed to copy to clipboard",
          details: error.message || "Clipboard API not available",
          type: "CLIPBOARD",
          suggestions: ["Try selecting and copying the code manually"],
          retryable: false,
        },
      }));
    }
  }, [workflowState.tfliteCode]);

  const handleRetry = useCallback(() => {
    setWorkflowState((prev) => ({
      ...prev,
      error: null,
    }));
    handleConvertCompileDownload();
  }, [handleConvertCompileDownload]);

  // Get descriptive stage text for progress bar
  const getStageText = () => {
    const { currentStep, stage } = workflowState;
    if (currentStep === "conversion") {
      if (stage === "serializing") return "Serializing model...";
      if (stage === "uploading") return "Uploading to server...";
      if (stage === "converting") return "Converting to TFLite...";
      if (stage === "generating") return "Generating C/C++ code...";
      return "Converting model...";
    } else if (currentStep === "compilation") {
      return "Compiling model to binary...";
    } else if (currentStep === "download") {
      return "Preparing download...";
    } else if (currentStep === "complete") {
      return "Process complete!";
    }
    return "";
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Convert your trained model to TensorFlow Lite Micro format, compile it
        to a binary, and download it. You can then drag and drop the downloaded
        binary onto your senseBox Eye.
      </Typography>

      {/* Combined Convert, Compile & Download Button */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={
          workflowState.isProcessing ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <DownloadIcon />
          )
        }
        onClick={handleConvertCompileDownload}
        disabled={!model || !model.model || workflowState.isProcessing}
        sx={{ mb: 3 }}
      >
        {workflowState.isProcessing
          ? "Processing..."
          : "Convert, Compile & Download"}
      </Button>

      {/* Unified Progress Indicator */}
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
                onClick={handleRetry}
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

      {/* Success Message */}
      {workflowState.currentStep === "complete" && workflowState.binaryData && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Success! Model Ready for Upload
          </Typography>
          <Typography variant="body2">
            Your model has been converted, compiled, and downloaded! The binary
            file is ready to upload to your senseBox Eye board. You can also
            view the generated code below.
          </Typography>
        </Alert>
      )}

      {/* Collapsible Code Viewer */}
      {workflowState.tfliteCode && (
        <Accordion
          expanded={codeExpanded}
          onChange={(e, isExpanded) => setCodeExpanded(isExpanded)}
          sx={{ mb: 3 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="generated-code-content"
            id="generated-code-header"
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CodeIcon />
              <Typography variant="subtitle1">View Generated Code</Typography>
              {workflowState.modelSize && (
                <Chip
                  label={`${(workflowState.modelSize / 1024).toFixed(2)} KB`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {/* Model Settings Code */}
            {workflowState.modelSettingsCode && (
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Model Settings (Header & Implementation)
                  </Typography>
                  <CodeViewer
                    code={workflowState.modelSettingsCode}
                    language="cpp"
                    maxHeight={300}
                  />
                </CardContent>
              </Card>
            )}

            {/* Model Data Code */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Model Data (C/C++ Byte Array)
                </Typography>
                <CodeViewer
                  code={workflowState.tfliteCode}
                  language="cpp"
                  onCopy={handleCopyCode}
                  maxHeight={400}
                />
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={copied ? <CheckIcon /> : <CopyIcon />}
                    onClick={handleCopyCode}
                    color={copied ? "success" : "primary"}
                  >
                    {copied ? "Copied!" : "Copy to Clipboard"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Binary Info Card */}
      {workflowState.binaryData && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1">Compiled Binary</Typography>
              {workflowState.binarySize && (
                <Chip
                  label={`Binary Size: ${(workflowState.binarySize / 1024).toFixed(2)} KB`}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Board: senseBox Eye
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              The binary has been automatically downloaded. If the download
              didn't start, click the button below to download again.
            </Typography>
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
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default BlocklyIntegration;
