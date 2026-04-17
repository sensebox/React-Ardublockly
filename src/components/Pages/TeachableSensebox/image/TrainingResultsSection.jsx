import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Chip,
  Divider,
  useTheme,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import TrainingMetricsChart from "./TrainingMetricsChart";
import ConfusionMatrix from "./ConfusionMatrix";
import HelpButton from "../HelpButton";

/**
 * Training Results Section - collapsible panel showing training metrics and confusion matrix
 */
const TrainingResultsSection = ({
  trainingMetrics,
  testResults,
  classNames,
  finalAccuracy,
  isTraining,
  hasEnoughSamples,
  onOpenHelp,
  translations,
}) => {
  const [expanded, setExpanded] = useState(true);
  const theme = useTheme();

  const t = translations || {
    title: "Training Results",
    metricsChart: "Training Progress",
    testResults: "Test Results",
    finalAccuracy: "Final Accuracy",
    trainingInProgress: "Training in progress...",
    noDataYet: "Complete training to see results",
    needMoreImages: "Collect at least 10 images per class to see test results.",
  };

  const hasData = trainingMetrics && trainingMetrics.length > 0;
  const hasTestResults =
    hasEnoughSamples &&
    testResults &&
    testResults.length > 0 &&
    classNames &&
    classNames.length > 0;

  // Don't render if no training has happened yet and not currently training
  if (!hasData && !isTraining) {
    return null;
  }

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      sx={{
        mt: 3,
        borderRadius: 2,
        "&:before": { display: "none" },
        boxShadow: theme.shadows[2],
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          bgcolor: expanded
            ? hasData
              ? "primary.light"
              : "grey.100"
            : "transparent",
          borderRadius: expanded ? "8px 8px 0 0" : 2,
          "& .MuiAccordionSummary-content": {
            alignItems: "center",
            gap: 1,
          },
        }}
      >
        <AnalyticsIcon
          sx={{
            color: expanded
              ? hasData
                ? "primary.contrastText"
                : "text.primary"
              : "text.secondary",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: expanded
              ? hasData
                ? "primary.contrastText"
                : "text.primary"
              : "text.secondary",
            flex: 1,
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          {t.title}
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ p: { xs: 2, md: 3 } }}>
        {isTraining && !hasData && (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "grey.50",
              borderRadius: 1,
            }}
          >
            <Typography color="text.secondary">
              {t.trainingInProgress}
            </Typography>
          </Box>
        )}

        {hasData && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              alignItems: { xs: "stretch", md: "flex-start" },
            }}
          >
            {/* Training Metrics Chart */}
            <Box
              sx={{
                flex: { xs: "1 1 auto", md: "0 0 60%" },
                minWidth: 0,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {t.metricsChart}
                </Typography>
                <HelpButton
                  onClick={() => onOpenHelp && onOpenHelp("trainingProgress")}
                  tooltip={
                    t.training?.tooltip?.helpTrainingProgress ||
                    "Hilfe zum Trainingsverlauf"
                  }
                  size="small"
                />
              </Box>
              <TrainingMetricsChart metrics={trainingMetrics} />
            </Box>

            {/* Divider */}
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: { xs: "none", md: "block" },
              }}
            />

            {/* Test Results Section */}
            {hasTestResults && (
              <Box
                sx={{
                  flex: { xs: "1 1 auto", md: "1 1 0" },
                  minWidth: 0,
                  maxWidth: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                {/* Section Title */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    {t.testResults}
                  </Typography>
                  <HelpButton
                    onClick={() => onOpenHelp && onOpenHelp("testResults")}
                    tooltip={
                      t.training?.tooltip?.helpTestResults ||
                      "Hilfe zum Testergebnis"
                    }
                    size="small"
                  />
                </Box>

                {/* Final Accuracy */}
                {finalAccuracy !== null && finalAccuracy !== undefined && (
                  <Box
                    sx={{
                      mb: { xs: 1.5, sm: 2 },
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    <Chip
                      label={`${t.finalAccuracy}: ${(finalAccuracy * 100).toFixed(1)}%`}
                      sx={{
                        color: "primary.text",
                        fontWeight: "bold",
                        fontSize: {
                          xs: "0.8rem",
                          sm: "0.875rem",
                          md: "0.95rem",
                        },
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

                {/* Confusion Matrix */}
                <ConfusionMatrix matrix={testResults} classNames={classNames} />
              </Box>
            )}

            {/* Message when not enough samples for test results */}
            {!hasEnoughSamples && (
              <Box
                sx={{
                  flex: { xs: "1 1 auto", md: "1 1 0" },
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                  bgcolor: "grey.50",
                  borderRadius: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    {t.testResults}
                  </Typography>
                  <HelpButton
                    onClick={() => onOpenHelp && onOpenHelp("testResults")}
                    tooltip={
                      t.training?.tooltip?.helpTestResults ||
                      "Hilfe zum Testergebnis"
                    }
                    size="small"
                  />
                </Box>
                <Typography
                  color="text.secondary"
                  sx={{
                    textAlign: "center",
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                >
                  {t.needMoreImages}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default TrainingResultsSection;
