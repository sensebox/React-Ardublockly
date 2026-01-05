import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login, loginOpenSenseMap } from "../../actions/authActions";

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
import PasswordResetRequest from "./PasswordResetRequest";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const message = useSelector((s) => s.message);
  const progress = useSelector((s) => s.auth.progress);

  const redirectPath = location.state?.from?.pathname || null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authProvider, setAuthProvider] = useState("native");
  const [snackbar, setSnackbar] = useState(false);
  const [snackInfo, setSnackInfo] = useState({
    type: "",
    key: "",
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  // Initialer Fehler
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
  }, []); // bewusst nur beim Mount

  // Erfolg / Fehler
  useEffect(() => {
    if (message.id === "LOGIN_SUCCESS") {
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else {
        navigate(-1);
      }
    }

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
  }, [message, redirectPath, navigate]);

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
      dispatch(login({ email, password }));
    } else {
      dispatch(loginOpenSenseMap({ email, password }));
    }
  };

  if (showPasswordReset) {
    return (
      <div>
        <Breadcrumbs
          content={[{ link: "/user/login", title: Blockly.Msg.button_login }]}
        />
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <h1>Passwort vergessen?</h1>
          <PasswordResetRequest
            onBackToLogin={() => setShowPasswordReset(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs
        content={[{ link: "/user/login", title: Blockly.Msg.button_login }]}
      />

      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h1>{Blockly.Msg.login_head}</h1>

        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel>Login mit</FormLabel>
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
            label={Blockly.Msg.labels_username}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />

          <TextField
            variant="standard"
            type={showPassword ? "text" : "password"}
            label={Blockly.Msg.labels_password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((v) => !v)}>
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      size="xs"
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button color="primary" variant="contained" type="submit" fullWidth>
            {progress ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              Blockly.Msg.button_login
            )}
          </Button>
        </form>

        {authProvider === "native" && (
          <p style={{ textAlign: "center", fontSize: "0.8rem" }}>
            <Button
              variant="text"
              size="small"
              onClick={() => setShowPasswordReset(true)}
            >
              Passwort vergessen?
            </Button>
          </p>
        )}
      </div>
    </div>
  );
}
