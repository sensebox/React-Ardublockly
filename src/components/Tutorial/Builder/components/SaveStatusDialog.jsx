import { CheckCircle, Error, WarningAmber } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/styles";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as Blockly from "blockly/core";

// 🔲 Dialog-Komponente (extrahiert für Übersicht)
const SaveStatusDialog = ({ savingState, onClose, savedTutorialId }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const renderContent = () => {
    switch (savingState) {
      case "loading":
        return (
          <>
            <CircularProgress color="primary" />
            <Typography variant="body2" color="text.secondary">
              {Blockly.Msg.save_status_saving}
            </Typography>
          </>
        );

      case "missing":
        return (
          <>
            <WarningAmber sx={{ fontSize: 64, color: "warning.main" }} />
            <Typography variant="body1" fontWeight={600}>
              {Blockly.Msg.save_status_missing_fields}
            </Typography>
            <Box sx={{ mt: 1, textAlign: "left" }}>
              <Typography color="error.main">
                • {Blockly.Msg.save_status_missing_title}
              </Typography>
              <Typography color="error.main">
                • {Blockly.Msg.save_status_missing_subtitle}
              </Typography>
            </Box>
            <Button variant="contained" sx={{ mt: 2 }} onClick={onClose}>
              {Blockly.Msg.save_status_missing_understood}
            </Button>
          </>
        );

      case "success":
        return (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <CheckCircle
                sx={{ fontSize: 64, color: theme.palette.primary.main }}
              />
            </motion.div>
            <Typography variant="body1" fontWeight={600}>
              {Blockly.Msg.save_status_success}
            </Typography>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={onClose}
                autoFocus
                fullWidth
              >
                {Blockly.Msg.save_status_keep_editing}
              </Button>
              <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor:
                      theme.palette.mode === "dark" ? "#ccc" : "#999",
                    color: theme.palette.text.primary,
                    flex: 1,
                  }}
                  onClick={() => navigate("/tutorial")}
                >
                  {Blockly.Msg.save_status_to_overview}
                </Button>
                {savedTutorialId && (
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor:
                        theme.palette.mode === "dark" ? "#ccc" : "#999",
                      color: theme.palette.text.primary,
                      flex: 1,
                    }}
                    onClick={() => navigate(`/tutorial/${savedTutorialId}`)}
                  >
                    {Blockly.Msg.save_status_to_tutorial}
                  </Button>
                )}
              </Box>
            </Box>
          </>
        );

      case "error":
        return (
          <>
            <Error sx={{ fontSize: 64, color: "error.main" }} />
            <Typography variant="body1" fontWeight={600}>
              {Blockly.Msg.save_status_error}
            </Typography>
            <Box sx={{ mt: 2, textAlign: "left", maxWidth: "100%" }}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                {Blockly.Msg.save_status_error_hint}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                • {Blockly.Msg.save_status_error_network}
              </Typography>
              <Typography variant="body2">
                • {Blockly.Msg.save_status_error_validation}
              </Typography>
              <Typography variant="body2">
                • {Blockly.Msg.save_status_error_server}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="error"
              onClick={onClose}
              sx={{ mt: 2 }}
            >
              {Blockly.Msg.save_status_close}
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  if (savingState === "idle") return null;

  return (
    <Dialog
      open
      fullWidth
      maxWidth="xs"
      title={
        savingState === "loading"
          ? Blockly.Msg.save_status_dialog_loading
          : savingState === "success"
            ? Blockly.Msg.save_status_dialog_success
            : savingState === "missing"
              ? Blockly.Msg.save_status_dialog_missing
              : Blockly.Msg.save_status_dialog_error
      }
      onClose={onClose}
    >
      <Box
        sx={{
          textAlign: "center",
          py: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        {renderContent()}
      </Box>
    </Dialog>
  );
};

export default SaveStatusDialog;
