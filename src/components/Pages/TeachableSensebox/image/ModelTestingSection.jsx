import React, { useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import ConfusionMatrix from "./ConfusionMatrix";
import CollapsibleSection from "./CollapsibleSection";
import ClassSampleCard from "./ClassSampleCard";
import HelpButton, { useHelpBlink } from "../HelpButton";

/**
 * Model Testing Section - lets the user capture test images per class and
 * evaluate the trained model on them (accuracy + confusion matrix).
 */
const ModelTestingSection = ({
  testClasses,
  sampleScrollRefs,
  onImageClick,
  onRemoveSample,
  onCapture,
  isCameraActive,
  disabled,
  testDisabledReason,
  isDataStale,
  onTestModel,
  isTesting,
  testSampleMatrix,
  finalAccuracy,
  resultClassNames,
  onOpenHelp,
  t,
  sx,
}) => {
  const {
    isBlinking: testResultsBlinking,
    trigger: triggerTestResults,
    markSeen: markTestResultsSeen,
  } = useHelpBlink("image/testResults");

  useEffect(() => {
    triggerTestResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasResults = testSampleMatrix && testSampleMatrix.length > 0;

  return (
    <CollapsibleSection
      sx={sx}
      title={
        <Typography variant="h5" gutterBottom>
          {t.testing.title}
          <HelpButton
            onClick={() => {
              markTestResultsSeen();
              onOpenHelp && onOpenHelp("image/testResults");
            }}
            isBlinking={testResultsBlinking}
            tooltip={t.training.tooltip.helpTestResults}
          />
        </Typography>
      }
    >
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {testClasses.map((cls) => (
          <Grid item xs={12} key={cls.id}>
            <ClassSampleCard
              className={cls.name}
              samples={cls.samples}
              title={<Typography variant="h6">{cls.name}</Typography>}
              headerActions={
                <Chip
                  label={`${cls.samples.length} ${t.training.samples}`}
                  size="small"
                  color={cls.samples.length > 0 ? "primary" : "default"}
                />
              }
              scrollRef={(el) => {
                sampleScrollRefs.current[`test-${cls.id}`] = el;
              }}
              onImageClick={onImageClick}
              onRemoveSample={(sampleId) => onRemoveSample(cls.id, sampleId)}
              disabled={disabled}
              onCapture={() => onCapture(cls.id)}
              captureDisabled={!isCameraActive || disabled}
              captureTooltip={
                !isCameraActive ? t.training.tooltip.startCamera : undefined
              }
              captureLabel={t.training.captureImage}
            />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {isDataStale && (
        <Box
          sx={{
            mb: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            color: "warning.main",
          }}
        >
          <WarningIcon fontSize="small" />
          <Typography variant="caption">
            {t.training.dataChangedTestWarning}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Tooltip
          title={testDisabledReason || ""}
          arrow
          disableHoverListener={!testDisabledReason}
        >
          <span>
            <Button
              variant="contained"
              size="large"
              onClick={onTestModel}
              disabled={Boolean(testDisabledReason) || isTesting}
              startIcon={
                isTesting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : undefined
              }
            >
              {isTesting ? t.testing.testingInProgress : t.testing.testModel}
            </Button>
          </span>
        </Tooltip>
      </Box>

      {hasResults && !isTesting && (
        <Box sx={{ width: "100%" }}>
          {finalAccuracy !== null && finalAccuracy !== undefined && (
            <Box sx={{ mb: 2, textAlign: "center", width: "100%" }}>
              <Chip
                label={`${t.training.finalAccuracy}: ${(finalAccuracy * 100).toFixed(1)}%`}
                sx={{
                  color: "primary.text",
                  fontWeight: "bold",
                  fontSize: { xs: "0.8rem", sm: "0.875rem", md: "0.95rem" },
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 0.75, sm: 1 },
                  height: "auto",
                  "& .MuiChip-label": {
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  },
                }}
              />
            </Box>
          )}
          <ConfusionMatrix
            sampleMatrix={testSampleMatrix}
            classNames={resultClassNames}
          />
        </Box>
      )}
    </CollapsibleSection>
  );
};

export default ModelTestingSection;
