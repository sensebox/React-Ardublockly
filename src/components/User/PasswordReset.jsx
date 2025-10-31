// In deiner PasswordReset.jsx
import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom"; // ✅ useLocation statt useSearchParams
import { useDispatch } from "react-redux";
import { resetPassword } from "../../actions/authActions";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert, // 🔥 NEU: Für direkte Erfolgs-/Fehlermeldung
} from "@mui/material";
import Snackbar from "../Snackbar";

const PasswordReset = () => {
  const location = useLocation(); // ✅ useLocation holen
  const history = useHistory();
  const dispatch = useDispatch();

  // 🔥 Token aus der URL parsen (ohne useSearchParams)
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 NEU: Zustand für direkte Server-Meldung
  const [serverMessage, setServerMessage] = useState({ type: "", message: "" });

  const [snackbar, setSnackbar] = useState(false);
  const [snackInfo, setSnackInfo] = useState({
    type: "success",
    key: 0,
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 Reset der vorherigen Servermeldung
    setServerMessage({ type: "", message: "" });

    if (newPassword !== confirmNewPassword) {
      setSnackInfo({
        type: "error",
        key: Date.now(),
        message: "Die Passwörter stimmen nicht überein.",
      });
      setSnackbar(true);
      return;
    }

    if (newPassword.length < 6) {
      setSnackInfo({
        type: "error",
        key: Date.now(),
        message: "Das Passwort muss mindestens 6 Zeichen lang sein.",
      });
      setSnackbar(true);
      return;
    }

    setLoading(true);

    dispatch(resetPassword({ token, newPassword }))
      .then((response) => {
        console.log("Reset Password Response:", response); // 🔍 Debugging

        // ✅ Prüfe explizit auf SUCCESS-Status (z. B. 200)
        if (response?.status === 200 || response?.includes("SUCCESS")) {
          setSnackInfo({
            type: "success",
            key: Date.now(),
            message:
              "Passwort erfolgreich zurückgesetzt. Du kannst dich jetzt anmelden.",
          });
          setSnackbar(true);

          // 🔥 Setze Erfolgsmeldung
          setServerMessage({
            type: "success",
            message: "Passwort erfolgreich zurückgesetzt!",
          });

          setTimeout(() => {
            history.push("/user/login");
          }, 3000);
        } else {
          // 🔥 Fehlermeldung vom Server anzeigen
          const errorMsg =
            response?.payload?.message ||
            "Fehler beim Zurücksetzen des Passworts.";
          setServerMessage({
            type: "error",
            message: errorMsg,
          });
        }
      })
      .catch((error) => {
        console.error("Reset Password Error:", error); // 🔍 Debugging
        // 🔥 Fehlermeldung anzeigen
        const errorMsg =
          error.response?.data?.message ||
          "Ein unbekannter Fehler ist aufgetreten.";
        setServerMessage({
          type: "error",
          message: errorMsg,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!token) {
    return (
      <Box sx={{ maxWidth: "500px", margin: "auto", mt: 4 }}>
        <Typography color="error">
          Kein gültiger Reset-Link. Bitte fordere einen neuen Link an.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "500px", margin: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Neues Passwort setzen
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Gib dein neues Passwort ein.
      </Typography>

      {/* 🔥 Direkte Servermeldung anzeigen */}
      {serverMessage.message && (
        <Alert
          severity={serverMessage.type === "success" ? "success" : "error"}
          sx={{ mb: 2 }}
        >
          {serverMessage.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          variant="standard"
          fullWidth
          label="Neues Passwort"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          variant="standard"
          fullWidth
          label="Neues Passwort bestätigen"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          margin="normal"
          required
        />
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            onClick={() => history.push("/user/login")}
          >
            Abbrechen
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Passwort setzen"}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={snackbar}
        message={snackInfo.message}
        type={snackInfo.type}
        key={snackInfo.key}
        onClose={() => setSnackbar(false)}
      />
    </Box>
  );
};

export default PasswordReset;
