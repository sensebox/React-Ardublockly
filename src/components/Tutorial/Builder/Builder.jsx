import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  checkError,
  readJSON,
  jsonString,
  progress,
  tutorialId,
  resetTutorial as resetTutorialBuilder,
} from "../../../actions/tutorialBuilderActions";
import {
  getAllTutorials,
  getUserTutorials,
  getTutorials,
  resetTutorial,
  deleteTutorial,
  tutorialProgress,
} from "../../../actions/tutorialActions";
import { clearMessages } from "../../../actions/messageActions";

import axios from "axios";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faUserCheck } from "@fortawesome/free-solid-svg-icons";

import Breadcrumbs from "../../ui/Breadcrumbs";
import Textfield from "./Textfield";
import Difficulty from "./Difficulty";
import Step from "./Step";
import Dialog from "../../ui/Dialog";
import Snackbar from "../../Snackbar";
import Public from "./Public";
import Review from "./Review";

import withStyles from "@mui/styles/withStyles";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormHelperText from "@mui/material/FormHelperText";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import * as Blockly from "blockly";

const styles = (theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  errorColor: {
    color: theme.palette.error.dark,
  },
  errorButton: {
    marginTop: "5px",
    height: "40px",
    backgroundColor: theme.palette.error.dark,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
});

class Builder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tutorial: "new",
      open: false,
      title: "",
      public: false,
      difficulty: "",
      content: "",
      string: false,
      snackbar: false,
      key: "",
      message: "",
    };
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.props.tutorialProgress();
    // retrieve tutorials only if a potential user is loaded - authentication
    // is finished (success or failed)
    if (!this.props.authProgress) {
      if (this.props.user.role === "admin") {
        this.props.getAllTutorials();
      } else {
        this.props.getUserTutorials();
      }
    }
  }

  componentDidUpdate(props, state) {
    if (
      props.authProgress !== this.props.authProgress &&
      !this.props.authProgress
    ) {
      if (this.props.user.role === "admin") {
        // authentication is completed
        this.props.getAllTutorials();
      } else {
        this.props.getUserTutorials();
      }
    }
    if (props.message !== this.props.message) {
      if (this.props.message.id === "GET_TUTORIALS_FAIL") {
        // alert(this.props.message.msg);
        this.props.clearMessages();
      } else if (this.props.message.id === "TUTORIAL_DELETE_SUCCESS") {
        this.onChange("new");
        this.setState({
          snackbar: true,
          key: Date.now(),
          message: `Das Tutorial wurde erfolgreich gelöscht.`,
          type: "success",
        });
      } else if (this.props.message.id === "TUTORIAL_DELETE_FAIL") {
        this.setState({
          snackbar: true,
          key: Date.now(),
          message: `Fehler beim Löschen des Tutorials. Versuche es noch einmal.`,
          type: "error",
        });
      }
    }
  }

  componentWillUnmount() {
    this.resetFull();
    this.props.resetTutorial();
    if (this.props.message.msg) {
      this.props.clearMessages();
    }
  }

  uploadJsonFile = (jsonFile) => {
    this.props.progress(true);
    if (jsonFile.type !== "application/json") {
      this.props.progress(false);
      this.setState({
        open: true,
        string: false,
        title: "Unzulässiger Dateityp",
        content:
          "Die übergebene Datei entspricht nicht dem geforderten Format. Es sind nur JSON-Dateien zulässig.",
      });
    } else {
      var reader = new FileReader();
      reader.readAsText(jsonFile);
      reader.onloadend = () => {
        this.readJson(reader.result, true);
      };
    }
  };

  uploadJsonString = () => {
    this.setState({
      open: true,
      string: true,
      title: "JSON-String einfügen",
      content: "",
    });
  };

  readJson = (jsonString, isFile) => {
    try {
      var result = JSON.parse(jsonString);
      if (!this.checkSteps(result.steps)) {
        result.steps = [{}];
      }
      this.props.readJSON(result);
      this.setState({
        snackbar: true,
        key: Date.now(),
        message: `${
          isFile ? "Die übergebene JSON-Datei" : "Der übergebene JSON-String"
        } wurde erfolgreich übernommen.`,
        type: "success",
      });
    } catch (err) {
      this.props.progress(false);
      this.props.jsonString("");
      this.setState({
        open: true,
        string: false,
        title: "Ungültiges JSON-Format",
        content: `${
          isFile ? "Die übergebene Datei" : "Der übergebene String"
        } enthält nicht valides JSON. Bitte überprüfe ${
          isFile ? "die JSON-Datei" : "den JSON-String"
        } und versuche es erneut.`,
      });
    }
  };

  checkSteps = (steps) => {
    if (!(steps && steps.length > 0)) {
      return false;
    }
    return true;
  };

  toggle = () => {
    this.setState({ open: !this.state });
  };

  onChange = (value) => {
    this.props.resetTutorialBuilder();
    this.props.tutorialId("");
    this.setState({ tutorial: value });
  };

  onChangeId = (value) => {
    this.props.tutorialId(value);
    if (this.state.tutorial === "change") {
      this.props.progress(true);
      var tutorial = this.props.tutorials.filter(
        (tutorial) => tutorial._id === value,
      )[0];
      this.props.readJSON(tutorial);
      this.setState({
        snackbar: true,
        key: Date.now(),
        message: `Das ausgewählte Tutorial "${tutorial.title}" wurde erfolgreich übernommen.`,
        type: "success",
      });
    }
  };

  resetFull = () => {
    this.props.resetTutorialBuilder();
    this.setState({
      snackbar: true,
      key: Date.now(),
      message: `Das Tutorial wurde erfolgreich zurückgesetzt.`,
      type: "success",
    });
    window.scrollTo(0, 0);
  };

  resetTutorial = () => {
    var tutorial = this.props.tutorials.filter(
      (tutorial) => tutorial._id === this.props.id,
    )[0];
    this.props.readJSON(tutorial);
    this.setState({
      snackbar: true,
      key: Date.now(),
      message: `Das Tutorial ${tutorial.title} wurde erfolgreich auf den ursprünglichen Stand zurückgesetzt.`,
      type: "success",
    });
    window.scrollTo(0, 0);
  };

  submit = () => {
    var isError = this.props.checkError();
    if (isError) {
      this.setState({
        snackbar: true,
        key: Date.now(),
        message: `Die Angaben für das Tutorial sind nicht vollständig.`,
        type: "error",
      });
      window.scrollTo(0, 0);
      return false;
    } else {
      // export steps without attribute 'url'
      var steps = this.props.steps;
      var newTutorial = new FormData();
      newTutorial.append("title", this.props.title);
      newTutorial.append("difficulty", this.props.difficulty);
      newTutorial.append("public", this.props.public);
      newTutorial.append("review", this.props.review);
      steps.forEach((step, i) => {
        if (step._id) {
          newTutorial.append(`steps[${i}][_id]`, step._id);
        }
        newTutorial.append(`steps[${i}][type]`, step.type);
        newTutorial.append(`steps[${i}][headline]`, step.headline);
        newTutorial.append(`steps[${i}][text]`, step.text);
        if (i === 0 && step.type === "instruction") {
          if (step.requirements) {
            // optional
            step.requirements.forEach((requirement, j) => {
              newTutorial.append(
                `steps[${i}][requirements][${j}]`,
                requirement,
              );
            });
          }
          step.hardware.forEach((hardware, j) => {
            newTutorial.append(`steps[${i}][hardware][${j}]`, hardware);
          });
        }
        if (step.xml) {
          // optional
          newTutorial.append(`steps[${i}][xml]`, step.xml);
        }
      });
      return newTutorial;
    }
  };

  submitNew = () => {
    var newTutorial = this.submit();
    if (newTutorial) {
      const config = {
        success: (res) => {
          var tutorial = res.data.tutorial;
          this.props.history.push(`/tutorial/${tutorial._id}`);
        },
        error: (err) => {
          this.setState({
            snackbar: true,
            key: Date.now(),
            message: `Fehler beim Erstellen des Tutorials. Versuche es noch einmal.`,
            type: "error",
          });
          window.scrollTo(0, 0);
        },
      };
      axios
        .post(
          `${import.meta.env.VITE_BLOCKLY_API}/tutorial/`,
          newTutorial,
          config,
        )
        .then((res) => {
          res.config.success(res);
        })
        .catch((err) => {
          err.config.error(err);
        });
    }
  };

  submitUpdate = () => {
    var updatedTutorial = this.submit();
    if (updatedTutorial) {
      const config = {
        success: (res) => {
          var tutorial = res.data.tutorial;
          this.props.history.push(`/tutorial/${tutorial._id}`);
        },
        error: (err) => {
          this.setState({
            snackbar: true,
            key: Date.now(),
            message: `Fehler beim Ändern des Tutorials. Versuche es noch einmal.`,
            type: "error",
          });
          window.scrollTo(0, 0);
        },
      };
      axios
        .put(
          `${import.meta.env.VITE_BLOCKLY_API}/tutorial/${this.props.id}`,
          updatedTutorial,
          config,
        )
        .then((res) => {
          res.config.success(res);
        })
        .catch((err) => {
          err.config.error(err);
        });
    }
  };

  render() {
    if (this.props.user.role === "admin") {
      var filteredTutorials = this.props.tutorials;
    } else {
      filteredTutorials = this.props.tutorials.filter(
        (tutorial) => tutorial.creator === this.props.user.email,
      );
    }

    // } else {
    //   filteredTutorials = this.props.userTutorials.filter(
    //     (tutorial) => tutorial.creator === this.props.user.email
    //   );

    return (
      <div>
        <Breadcrumbs
          content={[
            { link: "/tutorial", title: "Tutorial" },
            { link: "/tutorial/builder", title: "Builder" },
          ]}
        />

        <h1>Tutorial-Builder</h1>

        <RadioGroup
          row
          value={this.state.tutorial}
          onChange={(e) => this.onChange(e.target.value)}
        >
          <FormControlLabel
            style={{ color: "black" }}
            value="new"
            control={<Radio />}
            label={Blockly.Msg.builder_createNew}
            labelPlacement="end"
          />
          {filteredTutorials.length > 0 ? (
            <div>
              <FormControlLabel
                style={{ color: "black" }}
                disabled={this.props.index === 0}
                value="change"
                control={<Radio />}
                label={Blockly.Msg.builder_changeExisting}
                labelPlacement="end"
              />
              <FormControlLabel
                style={{ color: "black" }}
                disabled={this.props.index === 0}
                value="delete"
                control={<Radio />}
                label={Blockly.Msg.builder_deleteExisting}
                labelPlacement="end"
              />
            </div>
          ) : null}
        </RadioGroup>

        <Divider variant="fullWidth" style={{ margin: "10px 0 15px 0" }} />

        {this.state.tutorial === "new" ? (
          /*upload JSON*/
          <div ref={this.inputRef}>
            <input
              style={{ display: "none" }}
              accept="application/json"
              onChange={(e) => {
                this.uploadJsonFile(e.target.files[0]);
              }}
              id="open-json"
              type="file"
            />
            <label htmlFor="open-json">
              <Button
                component="span"
                style={{
                  marginRight: "10px",
                  marginBottom: "10px",
                }}
                variant="contained"
                color="primary"
              >
                Datei laden
              </Button>
            </label>
            <Button
              style={{
                marginRight: "10px",
                marginBottom: "10px",
              }}
              variant="contained"
              color="primary"
              onClick={() => this.uploadJsonString()}
            >
              String laden
            </Button>
          </div>
        ) : (
          <FormControl variant="outlined" style={{ width: "100%" }}>
            <InputLabel id="select-outlined-label">Tutorial</InputLabel>
            <Select
              variant="standard"
              color="primary"
              labelId="select-outlined-label"
              value={this.props.id}
              onChange={(e) => this.onChangeId(e.target.value)}
              label="Tutorial"
            >
              {filteredTutorials.map((tutorial) => (
                <MenuItem value={tutorial._id}>
                  {tutorial.title}{" "}
                  {tutorial.review && tutorial.public === false ? (
                    <div>
                      <FontAwesomeIcon icon={faUserCheck} />
                      <FontAwesomeIcon icon={faEyeSlash} />
                    </div>
                  ) : tutorial.public === false ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : null}
                </MenuItem>
                /* ) : tutorial.public === false ? (
                    <MenuItem value={tutorial._id}>
                      {tutorial.title} <FontAwesomeIcon icon={faEyeSlash} />
                    </MenuItem>
                  ) : (
                    <MenuItem value={tutorial._id}>{tutorial.title}</MenuItem>
                  )} */
              ))}
            </Select>
          </FormControl>
        )}

        <Divider variant="fullWidth" style={{ margin: "10px 0 15px 0" }} />

        {this.state.tutorial === "new" ||
        (this.state.tutorial === "change" && this.props.id !== "") ? (
          /*Tutorial-Builder-Form*/
          <div>
            {this.props.error.type ? (
              <FormHelperText
                style={{ lineHeight: "initial" }}
                className={this.props.classes.errorColor}
              >{`Ein Tutorial muss mindestens jeweils eine Instruktion und eine Aufgabe enthalten.`}</FormHelperText>
            ) : null}
            {/* <Id error={this.props.error.id} value={this.props.id} /> */}
            <Textfield
              value={this.props.title}
              property={"title"}
              label={"Titel"}
              error={this.props.error.title}
            />
            <div
              style={{
                borderRadius: "25px",
                border: "1px solid lightgrey",
                padding: "10px 14px 10px 10px",
                marginBottom: "20px",
              }}
            >
              <Difficulty
                value={this.props.difficulty}
                property={"difficulty"}
                label={"difficulty"}
                error={this.props.error.difficulty}
              />
              <Divider
                variant="fullWidth"
                style={{ margin: "30px 0 10px 0" }}
              />

              <Review
                value={this.props.review}
                property={"review"}
                label={"review"}
                error={this.props.error.review}
              />
              <Divider
                variant="fullWidth"
                style={{ margin: "30px 0 10px 0" }}
              />

              {this.props.user.blocklyRole === "admin" ? (
                <Public
                  value={this.props.public}
                  property={"public"}
                  label={"public"}
                  error={this.props.error.public}
                />
              ) : null}
            </div>

            {this.props.steps.map((step, i) => (
              <Step step={step} index={i} key={i} />
            ))}

            {/*submit or reset*/}
            {this.state.tutorial !== "delete" ? (
              <div>
                <Divider
                  variant="fullWidth"
                  style={{ margin: "30px 0 10px 0" }}
                />
                {this.state.tutorial === "new" ? (
                  <div>
                    <Button
                      style={{
                        marginRight: "10px",
                        marginTop: "10px",
                      }}
                      variant="contained"
                      color="primary"
                      onClick={() => this.submitNew()}
                    >
                      Tutorial erstellen
                    </Button>
                    <Button
                      style={{ marginTop: "10px" }}
                      variant="contained"
                      onClick={() => this.resetFull()}
                    >
                      {Blockly.Msg.reset_text}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      style={{
                        marginRight: "10px",
                        marginTop: "10px",
                      }}
                      variant="contained"
                      color="primary"
                      onClick={() => this.submitUpdate()}
                    >
                      Tutorial ändern
                    </Button>
                    <Button
                      style={{ marginTop: "10px" }}
                      variant="contained"
                      onClick={() => this.resetTutorial()}
                    >
                      {Blockly.Msg.reset_text}
                    </Button>
                  </div>
                )}
              </div>
            ) : null}

            <Backdrop
              className={this.props.classes.backdrop}
              open={this.props.isProgress}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </div>
        ) : null}

        {this.state.tutorial === "delete" && this.props.id !== "" ? (
          <Button
            className={this.props.classes.errorButton}
            variant="contained"
            color="primary"
            onClick={() => this.props.deleteTutorial()}
          >
            Tutorial löschen
          </Button>
        ) : null}

        <Dialog
          open={this.state.open}
          maxWidth={this.state.string ? "md" : "sm"}
          fullWidth={this.state.string}
          title={this.state.title}
          content={this.state.content}
          onClose={this.toggle}
          onClick={this.toggle}
          button={"Schließen"}
          actions={
            this.state.string ? (
              <div>
                <Button
                  disabled={this.props.error.json || this.props.json === ""}
                  variant="contained"
                  onClick={() => {
                    this.toggle();
                    this.props.progress(true);
                    this.readJson(this.props.json, false);
                  }}
                  color="primary"
                >
                  Bestätigen
                </Button>
                <Button
                  onClick={() => {
                    this.toggle();
                    this.props.jsonString("");
                  }}
                  color="primary"
                >
                  Abbrechen
                </Button>
              </div>
            ) : null
          }
        >
          {this.state.string ? (
            <Textfield
              value={this.props.json}
              property={"json"}
              label={"JSON"}
              multiline
              error={this.props.error.json}
            />
          ) : null}
        </Dialog>

        <Snackbar
          open={this.state.snackbar}
          message={this.state.message}
          type={this.state.type}
          key={this.state.key}
        />
      </div>
    );
  }
}

Builder.propTypes = {
  getAllTutorials: PropTypes.func.isRequired,
  getUserTutorials: PropTypes.func.isRequired,
  getTutorials: PropTypes.func.isRequired,
  resetTutorial: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  tutorialId: PropTypes.func.isRequired,
  checkError: PropTypes.func.isRequired,
  readJSON: PropTypes.func.isRequired,
  jsonString: PropTypes.func.isRequired,
  progress: PropTypes.func.isRequired,
  deleteTutorial: PropTypes.func.isRequired,
  resetTutorialBuilder: PropTypes.func.isRequired,
  tutorialProgress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  difficulty: PropTypes.number.isRequired,
  public: PropTypes.bool.isRequired,
  review: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  steps: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  error: PropTypes.object.isRequired,
  json: PropTypes.string.isRequired,
  isProgress: PropTypes.bool.isRequired,
  tutorials: PropTypes.array.isRequired,
  message: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  authProgress: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  title: state.builder.title,
  difficulty: state.builder.difficulty,
  review: state.builder.review,
  public: state.builder.public,
  id: state.builder.id,
  steps: state.builder.steps,
  change: state.builder.change,
  error: state.builder.error,
  json: state.builder.json,
  isProgress: state.builder.progress,
  userTutorials: state.tutorial.userTutorials,
  tutorials: state.tutorial.tutorials,
  message: state.message,
  user: state.auth.user,
  authProgress: state.auth.progress,
});

export default connect(mapStateToProps, {
  checkError,
  readJSON,
  jsonString,
  progress,
  tutorialId,
  resetTutorialBuilder,
  getTutorials,
  getUserTutorials,
  getAllTutorials,
  resetTutorial,
  tutorialProgress,
  clearMessages,
  deleteTutorial,
})(withStyles(styles, { withTheme: true })(withRouter(Builder)));
