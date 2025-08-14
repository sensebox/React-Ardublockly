import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { login } from "../../actions/authActions";

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
import Link from "@mui/material/Link";
import * as Blockly from "blockly";

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const message = useSelector((s) => s.message);
  const progress = useSelector((s) => s.auth.progress);

  const redirectPath = location.state?.from?.pathname || null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState(false);
  const [snackInfo, setSnackInfo] = useState({
    type: "",
    key: "",
    message: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // on mount, if previous login failed, show error
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
  }, []); // run once on mount

  // on message change, handle success or failure
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
  }, [message]); // re-run when message changes

  const handleChange = (setter) => (e) => setter(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      dispatch(login({ email, password }));
    } else {
      setSnackInfo({
        type: "error",
        key: Date.now(),
        message: Blockly.Msg.messages_login_error,
      });
      setSnackbar(true);
    }
  };

  const handleClickShowPassword = () => setShowPassword((v) => !v);
  const handleMouseDownPassword = (e) => e.preventDefault();

  return (
    <div>
      <Breadcrumbs
        content={[{ link: "/user/login", title: Blockly.Msg.button_login }]}
      />

      <div
        style={{ maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}
      >
        <h1>{Blockly.Msg.login_head}</h1>
        <Alert>
          {Blockly.Msg.login_osem_account_01}{" "}
          <Link
            color="primary"
            rel="noreferrer"
            target="_blank"
            href="https://opensensemap.org/"
            underline="hover"
          >
            openSenseMap
          </Link>{" "}
          {Blockly.Msg.login_osem_account_02}.
        </Alert>

        <Snackbar
          open={snackbar}
          message={snackInfo.message}
          type={snackInfo.type}
          key={snackInfo.key}
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

        <p style={{ textAlign: "center", fontSize: "0.8rem" }}>
          <Link
            rel="noreferrer"
            target="_blank"
            href="https://opensensemap.org/"
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
            href="https://opensensemap.org/"
            underline="hover"
          >
            openSenseMap
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
