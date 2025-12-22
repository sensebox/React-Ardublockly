import { CheckCircle, Error, WarningAmber } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/styles";
import { motion, AnimatePresence } from "framer-motion";

// 🔲 Dialog-Komponente (extrahiert für Übersicht)
const SaveStatusDialog = ({
  savingState,
  onClose,
  savedTutorialId,
  history,
}) => {
  const theme = useTheme();
  const renderContent = () => {
    switch (savingState) {
      case "loading":
        return (
          <>
            <CircularProgress color="primary" />
            <Typography variant="body2" color="text.secondary">
              Bitte warten, das Tutorial wird gespeichert...
            </Typography>
          </>
        );

      case "missing":
        return (
          <>
            <WarningAmber sx={{ fontSize: 64, color: "warning.main" }} />
            <Typography variant="body1" fontWeight={600}>
              Folgende Pflichtfelder fehlen noch:
            </Typography>
            <Box sx={{ mt: 1, textAlign: "left" }}>
              <Typography color="error.main">• Titel</Typography>
              <Typography color="error.main">• Untertitel</Typography>
            </Box>
            <Button variant="contained" sx={{ mt: 2 }} onClick={onClose}>
              Verstanden
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
              Tutorial erfolgreich gespeichert!
            </Typography>
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => history.push("/tutorial")}
              >
                Zur Übersicht
              </Button>
              {savedTutorialId && (
                <Button
                  variant="contained"
                  onClick={() => history.push(`/tutorial/${savedTutorialId}`)}
                >
                  Zum Tutorial
                </Button>
              )}
            </Box>
          </>
        );

      case "error":
        return (
          <>
            <Error sx={{ fontSize: 64, color: "error.main" }} />
            <Typography variant="body1" fontWeight={600}>
              Beim Speichern ist ein Fehler aufgetreten.
            </Typography>
            <Button variant="contained" color="error" onClick={onClose}>
              Schließen
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
          ? "Tutorial wird gespeichert..."
          : savingState === "success"
            ? "Gespeichert!"
            : savingState === "missing"
              ? "Angaben unvollständig"
              : "Fehler beim Speichern"
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
