// src/components/User/PasswordResetRequest.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestPasswordReset } from "../../actions/authActions"; // Stelle sicher, dass du diese Action erstellst
import Snackbar from "../Snackbar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";

const PasswordResetRequest = ({ onBackToLogin }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const message = useSelector((s) => s.message);

  const [snackbar, setSnackbar] = useState(false);
  const [snackInfo, setSnackInfo] = useState({
    type: "success",
    key: 0,
    message: "",
  });

  // Optional: Zeige Erfolgsmeldung nach erfolgreicher Anfrage
  React.useEffect(() => {
    if (message.id === "REQUEST_PASSWORD_RESET_SUCCESS") {
      setSnackInfo({
        type: "success",
        key: Date.now(),
        message: "Wenn die E-Mail existiert, wurde ein Link gesendet.",
      });
      setSnackbar(true);
    } else if (message.id === "REQUEST_PASSWORD_RESET_FAIL") {
      setSnackInfo({
        type: "error",
        key: Date.now(),
        message: message.msg || "Fehler beim Senden der E-Mail.",
      });
      setSnackbar(true);
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setSnackInfo({
        type: "error",
        key: Date.now(),
        message: "Bitte gib deine E-Mail-Adresse ein.",
      });
      setSnackbar(true);
      return;
    }

    setLoading(true);
    // 🔥 Dispatche die neue Action
    dispatch(requestPasswordReset({ email }))
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Passwort zurücksetzen
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Gib deine E-Mail-Adresse ein, um einen Link zum Zurücksetzen deines
        Passworts zu erhalten.
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          variant="standard"
          style={{ marginBottom: "10px" }}
          type="email"
          label="E-Mail-Adresse"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        />
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button variant="outlined" onClick={onBackToLogin} disabled={loading}>
            Zurück
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ flex: 1 }}
          >
            {loading ? <CircularProgress size={20} /> : "Link senden"}
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

export default PasswordResetRequest;
