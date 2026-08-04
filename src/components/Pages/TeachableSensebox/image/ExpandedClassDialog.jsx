import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  IconButton,
  TextField,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";

const ExpandedClassDialog = ({
  open,
  cls,
  editingClassId,
  editingClassName,
  onStartEditing,
  onSaveRename,
  onCancelEditing,
  sampleScrollRefs,
  openLightbox,
  removeSample,
  disabled,
  t,
  onClose,
}) => {
  if (!cls) return null;

  return (
    <Dialog
      open={!!open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}
      >
        {editingClassId === cls.id ? (
          <TextField
            autoFocus
            size="small"
            value={editingClassName}
            onChange={(e) => onStartEditing(cls.id, e.target.value)}
            onBlur={onSaveRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSaveRename();
              else if (e.key === "Escape") onCancelEditing();
            }}
            sx={{ flex: 1 }}
          />
        ) : (
          <Typography
            variant="h6"
            onClick={(e) => {
              e.stopPropagation();
              onStartEditing(cls.id, cls.name);
            }}
            component="span"
            sx={{
              cursor: "pointer",
              flex: 1,
              padding: "4px 8px",
              borderRadius: "4px",
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            {cls.name}
          </Typography>
        )}

        <Tooltip title={t.training.tooltip.desirableNumberSamples} arrow>
          <Chip
            label={`${cls.samples.length} ${t.training.samples}`}
            size="small"
            color={
              cls.samples.length >= 100
                ? "success"
                : cls.samples.length >= 10
                  ? "warning"
                  : cls.samples.length > 0
                    ? "error"
                    : "default"
            }
          />
        </Tooltip>

        <IconButton
          edge="start"
          onClick={onClose}
          size="small"
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          ref={(el) => {
            if (sampleScrollRefs && sampleScrollRefs.current)
              sampleScrollRefs.current[cls.id] = el;
          }}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            minHeight: 200,
            maxHeight: 400,
            overflowY: "auto",
            p: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            bgcolor: "grey.50",
          }}
        >
          {cls.samples.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                m: "auto",
                alignSelf: "center",
                width: "100%",
                textAlign: "center",
              }}
            >
              {t.training.captureImage}
            </Typography>
          )}

          {cls.samples.map((sample) => (
            <Box
              key={sample.id}
              sx={{ position: "relative", height: "fit-content" }}
            >
              <img
                src={sample.url}
                alt={`Sample for ${cls.name}`}
                onClick={(e) => openLightbox(sample.url, e)}
                style={{
                  width: 90,
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  bgcolor: "background.paper",
                  "&:hover": { bgcolor: "error.light", color: "white" },
                }}
                onClick={() => removeSample(cls.id, sample.id)}
                disabled={disabled}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ExpandedClassDialog;
