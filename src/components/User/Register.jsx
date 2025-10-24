// src/components/Auth/Register.jsx
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Snackbar from "../Snackbar";
import Breadcrumbs from "../ui/Breadcrumbs";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import * as Blockly from "blockly";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

export default function Register() {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbar, setSnackbar] = useState(false);
  const [snackInfo, setSnackInfo] = useState({
    type: "",
    key: "",
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showError("Bitte E-Mail und Passwort eingeben.");
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwörter stimmen nicht überein.");
      return;
    }

    if (password.length < 6) {
      showError("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_BLOCKLY_API}/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        // ✅ Weiterleiten zum Success Screen
        history.push("/user/register/success");
      } else {
        showError(data.message || "Registrierung fehlgeschlagen.");
      }
    } catch (err) {
      console.error(err);
      showError("Serverfehler bei der Registrierung.");
    } finally {
      setLoading(false);
    }
  };

  const showError = (msg) => {
    setSnackInfo({
      type: "error",
      key: Date.now(),
      message: msg,
    });
    setSnackbar(true);
  };

  return (
    <div>
      <Breadcrumbs
        content={[{ link: "/user/register", title: "Registrieren" }]}
      />

      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h1>Konto erstellen</h1>

        <Snackbar
          open={snackbar}
          message={snackInfo.message}
          type={snackInfo.type}
          key={snackInfo.key}
          onClose={() => setSnackbar(false)}
        />

        <form onSubmit={handleSubmit}>
          <TextField
            variant="standard"
            label="E-Mail"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            variant="standard"
            label="Passwort"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      size="xs"
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            variant="standard"
            label="Passwort bestätigen"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                      size="xs"
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Button variant="contained" color="primary" type="submit" fullWidth>
            {loading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Registrieren"
            )}
          </Button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Bereits ein Konto? <Link to="/user/login">Anmelden</Link>
        </p>
      </div>
    </div>
  );
}
