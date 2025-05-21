import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../../actions/authActions";
import { clearMessages } from "../../actions/messageActions";

import { withRouter } from "react-router-dom";

import Snackbar from "../Snackbar";
import Alert from "../Alert";
import Breadcrumbs from "../Breadcrumbs";

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
import ClassroomLogin from "./ClassroomLogin";
import { classroomLogin } from '../../actions/classroomAuthActions';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: props.location.state
        ? props.location.state.from.pathname
        : null,
      email: "",
      password: "",
      snackbar: false,
      type: "",
      key: "",
      message: "",
      showPassword: false,
    };
  }

  componentDidMount() {
    if (this.props.message.id === "LOGIN_FAIL") {
      this.setState({
        email: "",
        password: "",
        snackbar: true,
        key: Date.now(),
        message: Blockly.Msg.messages_LOGIN_FAIL,
        type: "error",
      });
    }
  }

  componentDidUpdate(props) {
    const { message } = this.props;
    if (message !== props.message) {
      if (message.id === "LOGIN_SUCCESS") {
        if (this.state.redirect) {
          this.props.history.push(this.state.redirect);
        } else {
          this.props.history.goBack();
        }
      }
      // Check for login error
      else if (message.id === "LOGIN_FAIL") {
        this.setState({
          email: "",
          password: "",
          snackbar: true,
          key: Date.now(),
          message: Blockly.Msg.messages_LOGIN_FAIL,
          type: "error",
        });
      }
    }
  }

  handleClassroomLogin = (credentials) => {
    this.props.classroomLogin(credentials.classroomCode, credentials.nickname);
    console.log(this.props.isAuthenticated)
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    if (email !== "" && password !== "") {
      // create user object
      const user = {
        email,
        password,
      };
      this.props.login(user);
    } else {
      this.setState({
        snackbar: true,
        key: Date.now(),
        message: Blockly.Msg.messages_login_error,
        type: "error",
      });
    }
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  render() {
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
              href={"https://opensensemap.org/"}
              underline="hover">
              openSenseMap
            </Link>{" "}
            {Blockly.Msg.login_osem_account_02}.
          </Alert>
          <Snackbar
            open={this.state.snackbar}
            message={this.state.message}
            type={this.state.type}
            key={this.state.key}
          />
          <form onSubmit={this.onSubmit}>
            <TextField
              variant="standard"
              style={{ marginBottom: "10px" }}
              // variant='outlined'
              type="text"
              label={Blockly.Msg.labels_username}
              name="email"
              value={this.state.email}
              onChange={this.onChange}
              fullWidth={true} />
            <TextField
              variant="standard"
              // variant='outlined'
              type={this.state.showPassword ? "text" : "password"}
              label={Blockly.Msg.labels_password}
              name="password"
              value={this.state.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                      edge="end"
                      size="large">
                      <FontAwesomeIcon
                        size="xs"
                        icon={this.state.showPassword ? faEyeSlash : faEye}
                        
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={this.onChange}
              fullWidth={true} />
            <p>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                style={{ width: "100%" }}
              >
                {this.props.progress ? (
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
              href={"https://opensensemap.org/"}
              color="primary"
              underline="hover">
              {Blockly.Msg.login_lostpassword}
            </Link>
          </p>
          <Divider variant="fullWidth" />
          <p
            style={{
              textAlign: "center",
              paddingRight: "34px",
              paddingLeft: "34px",
            }}
          >
            {Blockly.Msg.login_createaccount}
            <Link
              rel="noreferrer"
              target="_blank"
              href={"https://opensensemap.org/"}
              underline="hover">
              openSenseMap
            </Link>
            .
          </p>
        </div>
        <ClassroomLogin onLogin={this.handleClassroomLogin}/>
      </div>
    );
  }
}

Login.propTypes = {
  message: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  progress: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  classroomLogin: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  message: state.message,
  progress: state.auth.progress,
  isAuthenticated: state.classroomAuth.isAuthenticated,
});

export default connect(mapStateToProps, { login, clearMessages, classroomLogin })(
  withRouter(Login)
);
