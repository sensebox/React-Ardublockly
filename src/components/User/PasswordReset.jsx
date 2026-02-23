// In deiner PasswordReset.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../actions/authActions";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import Snackbar from "../Snackbar";

const PasswordReset = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        if (response?.status === 200 || response?.includes("SUCCESS")) {
          setSnackInfo({
            type: "success",
            key: Date.now(),
            message:
              "Passwort erfolgreich zurückgesetzt. Du kannst dich jetzt anmelden.",
          });
          setSnackbar(true);

          setServerMessage({
            type: "success",
            message: "Passwort erfolgreich zurückgesetzt!",
          });

          setTimeout(() => {
            navigate("/user/login");
          }, 3000);
        } else {
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
        console.error("Reset Password Error:", error);
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
          <Button variant="outlined" onClick={() => navigate("/user/login")}>
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
