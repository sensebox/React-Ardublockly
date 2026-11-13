import React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  PhotoCamera as CameraIcon,
} from "@mui/icons-material";

/**
 * Card showing the samples of one class with a capture button.
 * Used for both training and test images.
 */
const ClassSampleCard = ({
  className,
  samples,
  title,
  headerActions,
  scrollRef,
  onCardClick,
  onImageClick,
  onRemoveSample,
  disabled,
  onCapture,
  captureDisabled,
  captureTooltip,
  captureLabel,
}) => (
  <Card
    onClick={(e) => {
      if (!onCardClick) return;
      if (
        !e.target.closest("button") &&
        !e.target.closest("input") &&
        !e.target.closest(".MuiTypography-root") &&
        !e.target.closest("img")
      ) {
        onCardClick();
      }
    }}
    sx={
      onCardClick
        ? { cursor: "pointer", "&:hover": { boxShadow: 4 } }
        : undefined
    }
  >
    <CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {title}
        <Box>{headerActions}</Box>
      </Box>

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mb: 2,
          height: 100,
          minHeight: 100,
          overflowY: "auto",
          p: 1,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.grey",
          marginBottom: 0,
        }}
      >
        {samples.map((sample) => (
          <Box
            key={sample.id}
            sx={{ position: "relative", height: "fit-content" }}
          >
            <img
              src={sample.url}
              alt={`Sample for ${className}`}
              onClick={(e) => onImageClick(sample.url, e)}
              style={{
                width: 60,
                height: 60,
                objectFit: "cover",
                borderRadius: 4,
                cursor: "pointer",
                display: "block",
              }}
            />
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                bgcolor: "background.paper",
                "&:hover": {
                  bgcolor: "error.light",
                  color: "white",
                },
              }}
              onClick={() => onRemoveSample(sample.id)}
              disabled={disabled}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </CardContent>

    <CardActions>
      <Tooltip
        title={captureTooltip || ""}
        arrow
        disableHoverListener={!captureTooltip}
      >
        <span>
          <Button
            variant="contained"
            size="medium"
            startIcon={<CameraIcon />}
            onClick={onCapture}
            disabled={captureDisabled}
          >
            {captureLabel}
          </Button>
        </span>
      </Tooltip>
    </CardActions>
  </Card>
);

export default ClassSampleCard;
