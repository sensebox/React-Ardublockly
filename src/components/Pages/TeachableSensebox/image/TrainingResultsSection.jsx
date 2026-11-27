import React, { useState, useEffect, useRef } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Analytics as AnalyticsIcon,
} from "@mui/icons-material";
import TrainingMetricsChart from "./TrainingMetricsChart";
import HelpButton, { useHelpBlink } from "../HelpButton";

/**
 * Training Results Section - collapsible panel showing the training progress
 * chart. Test results are shown in the separate Model Testing section.
 */
const TrainingResultsSection = ({
  trainingMetrics,
  isTraining,
  onOpenHelp,
  translations,
}) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const hasData = trainingMetrics && trainingMetrics.length > 0;

  const {
    isBlinking: progressBlinking,
    trigger: triggerProgress,
    markSeen: markProgressSeen,
  } = useHelpBlink("image/trainingProgress");

  const wasTrainingRef = useRef(false);
  useEffect(() => {
    if (isTraining) {
      wasTrainingRef.current = true;
    } else if (wasTrainingRef.current && hasData) {
      wasTrainingRef.current = false;
      triggerProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTraining, hasData]);

  const t = translations || {
    title: "Training Progress",
    trainingInProgress: "Training in progress...",
    helpTooltip: "Help for training progress",
  };

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
        {hasData && (
          <Box
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
          >
            <HelpButton
              onClick={() => {
                markProgressSeen();
                onOpenHelp && onOpenHelp("image/trainingProgress");
              }}
              isBlinking={progressBlinking}
              tooltip={t.helpTooltip}
              size="small"
            />
          </Box>
        )}
      </AccordionSummary>

      <AccordionDetails sx={{ p: { xs: 2, md: 3 } }}>
        {isTraining && !hasData && (
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "background.grey",
              borderRadius: 1,
            }}
          >
            <Typography color="text.secondary">
              {t.trainingInProgress}
            </Typography>
          </Box>
        )}

        {hasData && <TrainingMetricsChart metrics={trainingMetrics} />}
      </AccordionDetails>
    </Accordion>
  );
};

export default TrainingResultsSection;
