import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { login, loginOpenSenseMap } from "../../actions/authActions"; // ✅ beide Actions

import Snackbar from "../Snackbar";
import Alert from "../ui/Alert";
import Breadcrumbs from "../ui/Breadcrumbs";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import * as Blockly from "blockly";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
// 🔥 Importiere die neue Komponente
import PasswordResetRequest from "./PasswordResetRequest";

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const message = useSelector((s) => s.message);
  const progress = useSelector((s) => s.auth.progress);

  const redirectPath = location.state?.from?.pathname || null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authProvider, setAuthProvider] = useState("native"); // ✅ Standard: native
  const [snackbar, setSnackbar] = useState(false);
  const [snackInfo, setSnackInfo] = useState({
    type: "",
    key: "",
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // 🔥 Zustand für Passwort-Vergessen-View
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  // Fehler bei Mount anzeigen
  useEffect(() => {
    if (message.id === "LOGIN_FAIL") {
      setEmail("");
      setPassword("");
      setSnackInfo({
        type: "error",
        key: Date.now(),
        message: Blockly.Msg.messages_LOGIN_FAIL,
      });
      setSnackbar(true);
    }
  }, []);

  // Erfolg/Fehler behandeln
  useEffect(() => {
    if (message.id === "LOGIN_SUCCESS") {
      if (redirectPath) {
        history.push(redirectPath);
      } else {
        history.goBack();
      }
    } else if (message.id === "LOGIN_FAIL") {
      setEmail("");
      setPassword("");
      setSnackInfo({
        type: "error",
        key: Date.now(),
        message: Blockly.Msg.messages_LOGIN_FAIL,
      });
      setSnackbar(true);
    }
  }, [message, history, redirectPath]);

  const handleChange = (setter) => (e) => setter(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setSnackInfo({
        type: "error",
        key: Date.now(),
        message: Blockly.Msg.messages_login_error,
      });
      setSnackbar(true);
      return;
    }

    if (authProvider === "native") {
      dispatch(login({ email, password })); // ✅ native
    } else {
      dispatch(loginOpenSenseMap({ email, password })); // ✅ openSenseMap
    }
  };

  const handleClickShowPassword = () => setShowPassword((v) => !v);
  const handleMouseDownPassword = (e) => e.preventDefault();

  // 🔥 Funktion, um zur Login-Ansicht zurückzukehren
  const handleBackToLogin = () => {
    setShowPasswordReset(false);
  };

  // 🔥 Zeige entweder Login- oder Passwort-Reset-Formular
  if (showPasswordReset) {
    return (
      <div>
        <Breadcrumbs
          content={[{ link: "/user/login", title: Blockly.Msg.button_login }]}
        />

        <div
          style={{ maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}
        >
          <h1>Passwort vergessen?</h1>
          <PasswordResetRequest onBackToLogin={handleBackToLogin} />
        </div>
      </div>
    );
  }

  // 🔥 Ursprüngliche Login-Ansicht
  return (
    <div>
      <Breadcrumbs
        content={[{ link: "/user/login", title: Blockly.Msg.button_login }]}
      />

      <div
        style={{ maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}
      >
        <h1>{Blockly.Msg.login_head}</h1>

        {/* 🔘 Auth Provider Auswahl */}
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Login mit</FormLabel>
          <RadioGroup
            row
            value={authProvider}
            onChange={(e) => setAuthProvider(e.target.value)}
          >
            <FormControlLabel
              value="native"
              control={<Radio />}
              label="Eigenes Konto"
            />
            <FormControlLabel
              value="opensensemap"
              control={<Radio />}
              label="openSenseMap"
            />
          </RadioGroup>
        </FormControl>
        {authProvider === "native" && (
          <div style={{ textAlign: "center" }}>
            {Blockly.Msg.no_account || "No account yet?"}{" "}
            <Link to="/user/register">
              {Blockly.Msg.button_register || "Register now"}
            </Link>
          </div>
        )}

        {authProvider === "opensensemap" && (
          <Alert>
            {Blockly.Msg.login_osem_account_01}{" "}
            <Link
              color="primary"
              rel="noreferrer"
              target="_blank"
              href="https://opensensemap.org/  "
              underline="hover"
            >
              openSenseMap
            </Link>{" "}
            {Blockly.Msg.login_osem_account_02}.
          </Alert>
        )}

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
            style={{ marginBottom: "10px" }}
            type="text"
            label={Blockly.Msg.labels_username}
            name="email"
            value={email}
            onChange={handleChange(setEmail)}
            fullWidth
          />
          <TextField
            variant="standard"
            type={showPassword ? "text" : "password"}
            label={Blockly.Msg.labels_password}
            name="password"
            value={password}
            onChange={handleChange(setPassword)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      size="xs"
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            style={{ marginBottom: "10px" }}
          />
          <p>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              style={{ width: "100%" }}
            >
              {progress ? (
                <div style={{ height: "24.5px" }}>
                  <CircularProgress color="inherit" size={20} />
                </div>
              ) : (
                Blockly.Msg.button_login
              )}
            </Button>
          </p>
        </form>

        {/* 🔥 Neuer Link/Button für "Passwort vergessen" */}
        {authProvider === "native" && (
          <p style={{ textAlign: "center", fontSize: "0.8rem" }}>
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={() => setShowPasswordReset(true)}
            >
              Passwort vergessen?
            </Button>
          </p>
        )}

        {authProvider === "opensensemap" && (
          <>
            <p style={{ textAlign: "center", fontSize: "0.8rem" }}>
              <Link
                rel="noreferrer"
                target="_blank"
                href="https://opensensemap.org/  "
                color="primary"
                underline="hover"
              >
                {Blockly.Msg.login_lostpassword}
              </Link>
            </p>
            <Divider variant="fullWidth" />
            <p style={{ textAlign: "center", padding: "0 34px" }}>
              {Blockly.Msg.login_createaccount}{" "}
              <Link
                rel="noreferrer"
                target="_blank"
                href="https://opensensemap.org/  "
                underline="hover"
              >
                openSenseMap
              </Link>
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
}
