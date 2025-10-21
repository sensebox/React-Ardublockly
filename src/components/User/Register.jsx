// src/components/Auth/Register.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { register } from "../../actions/authActions";

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
  const dispatch = useDispatch();
  const history = useHistory();

  const message = useSelector((s) => s.message);
  const progress = useSelector((s) => s.auth.progress);

  // Zustand: Zeige Success-Seite?
  const [showSuccess, setShowSuccess] = useState(false);

  // Formular-Zustände (nur wenn nicht erfolgreich)
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

  // Fehler bei Mount anzeigen
  useEffect(() => {
    if (message.id === "REGISTER_FAIL" && !showSuccess) {
      setSnackInfo({
        type: "error",
        key: Date.now(),
        message: Blockly.Msg.messages_REGISTER_FAIL || "Registration failed.",
      });
      setSnackbar(true);
    }
  }, [message, showSuccess]);

  // Erfolg: Zeige Success-Seite
  useEffect(() => {
    if (message.id === "REGISTER_SUCCESS") {
      setShowSuccess(true);
    }
  }, [message]);

  const handleChange = (setter) => (e) => setter(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setSnackInfo({
        type: "error",
        key: Date.now(),
        message:
          Blockly.Msg.messages_register_error ||
          "Email and password are required.",
      });
      setSnackbar(true);
      return;
    }

    if (password !== confirmPassword) {
      setSnackInfo({
        type: "error",
        key: Date.now(),
        message:
          Blockly.Msg.messages_password_mismatch || "Passwords do not match.",
      });
      setSnackbar(true);
      return;
    }

    if (password.length < 6) {
      setSnackInfo({
        type: "error",
        key: Date.now(),
        message:
          Blockly.Msg.messages_password_too_short ||
          "Password must be at least 6 characters.",
      });
      setSnackbar(true);
      return;
    }

    dispatch(register({ email, password }));
  };

  const handleClickShowPassword = () => setShowPassword((v) => !v);
  const handleMouseDownPassword = (e) => e.preventDefault();
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((v) => !v);

  // Success-Seite anzeigen
  if (showSuccess) {
    return (
      <div>
        <Breadcrumbs
          content={[
            { link: "/user/register", title: Blockly.Msg.button_register },
          ]}
        />
        <div
          style={{
            maxWidth: "500px",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
          }}
        >
          <h1>{Blockly.Msg.register_success_head || "Account created!"}</h1>
          <p style={{ fontSize: "1.1rem", color: "#4EAF47" }}>
            {Blockly.Msg.register_success_message ||
              "Your account has been successfully created."}
          </p>
          <p>
            {Blockly.Msg.register_success_login_prompt ||
              "You can now log in with your credentials."}
          </p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push("/user/login")}
            style={{ marginTop: "20px" }}
          >
            {Blockly.Msg.button_login || "Go to Login"}
          </Button>
        </div>
      </div>
    );
  }

  // Normales Registrierungsformular
  return (
    <div>
      <Breadcrumbs
        content={[
          { link: "/user/register", title: Blockly.Msg.button_register },
        ]}
      />

      <div
        style={{ maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}
      >
        <h1>{Blockly.Msg.register_head || "Create Account"}</h1>

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
            label={Blockly.Msg.labels_email || "Email"}
            name="email"
            value={email}
            onChange={handleChange(setEmail)}
            fullWidth
          />
          <TextField
            variant="standard"
            type={showPassword ? "text" : "password"}
            label={Blockly.Msg.labels_password || "Password"}
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
          <TextField
            variant="standard"
            type={showConfirmPassword ? "text" : "password"}
            label={Blockly.Msg.labels_confirm_password || "Confirm Password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange(setConfirmPassword)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                      size="xs"
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            style={{ marginBottom: "20px" }}
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
                Blockly.Msg.button_register || "Register"
              )}
            </Button>
          </p>
        </form>

        <p style={{ textAlign: "center" }}>
          {Blockly.Msg.already_have_account || "Already have an account?"}{" "}
          <Link to="/user/login" underline="hover">
            {Blockly.Msg.button_login || "Log in"}
          </Link>
        </p>
      </div>
    </div>
  );
}
