import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { CheckCircle, Replay } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function TutorialProgressStatus({ progressInfo, onReset, canReset = false }) {
  if (!progressInfo) return null;

  const { status, progressText, progressRatio, totalSteps } = progressInfo;

  return (
    <Box
      sx={{
        mt: 1.5,
        px: 1,
        py: 1,
        borderRadius: 2,
        backgroundColor:
          status === "completed"
            ? "success.light"
            : status === "in_progress"
              ? "warning.light"
              : "grey.100",
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        position: "relative",
      }}
    >
      {/* 🔄 Reset-Button */}
      {canReset && status !== "not_started" && (
        <Tooltip title="Fortschritt zurücksetzen">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
            }}
          >
            <Replay fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* 🔹 Status-Zeile */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {status === "completed" && (
          <CheckCircle fontSize="small" color="success" />
        )}
        {status === "in_progress" && <CircularProgress size={16} />}
        {status === "not_started" && <FontAwesomeIcon icon={faEye} />}

        <Typography variant="body2" fontWeight={600}>
          {status === "completed" && "Abgeschlossen"}
          {status === "in_progress" && "In Bearbeitung"}
          {status === "not_started" && "Noch nicht gestartet"}
        </Typography>
      </Box>

      {/* 🔹 Fortschritt */}
      {totalSteps > 0 && (
        <>
          <Typography variant="caption" color="text.secondary">
            {progressText} Schritte abgeschlossen
          </Typography>

          <Box
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: "grey.300",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${progressRatio * 100}%`,
                backgroundColor:
                  status === "completed" ? "success.main" : "warning.main",
                transition: "width 0.3s ease",
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
}

TutorialProgressStatus.propTypes = {
  progressInfo: PropTypes.shape({
    status: PropTypes.oneOf(["not_started", "in_progress", "completed"])
      .isRequired,
    completedSteps: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired,
    progressText: PropTypes.string.isRequired,
    progressRatio: PropTypes.number.isRequired,
  }),
  onReset: PropTypes.func,
  canReset: PropTypes.bool,
};

export default TutorialProgressStatus;
