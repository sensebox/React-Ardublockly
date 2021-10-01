import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { workspaceName } from "../../actions/workspaceActions";

import { detectWhitespacesAndReturnReadableResult } from "../../helpers/whitespace";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Blockly from "blockly/core";
import Copy from "../copy.svg";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import MuiDrawer from "@material-ui/core/Drawer";
import Dialog from "../Dialog";

const styles = (theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  iconButton: {
    backgroundColor: theme.palette.button.compile,
    color: theme.palette.primary.contrastText,
    width: "40px",
    height: "40px",
    "&:hover": {
      backgroundColor: theme.palette.button.compile,
      color: theme.palette.primary.contrastText,
    },
  },
  button: {
    backgroundColor: theme.palette.button.compile,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.button.compile,
      color: theme.palette.primary.contrastText,
    },
  },
});

const Drawer = withStyles((theme) => ({
  paperAnchorBottom: {
    backgroundColor: "black",
    height: "20vH",
  },
}))(MuiDrawer);

class Compile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: false,
      open: false,
      file: false,
      title: "",
      content: "",
      name: props.name,
      error: "",
      appLink: "",
      appDialog: false,
    };
  }

  componentDidMount() {
    Prism.highlightAll();
  }

  componentDidUpdate(props) {
    if (props.name !== this.props.name) {
      this.setState({ name: this.props.name });
    }
    Prism.highlightAll();
  }

  compile = () => {
    this.setState({ progress: true });
    const data = {
      board: process.env.REACT_APP_BOARD,
      sketch: this.props.arduino,
    };
    fetch(`${process.env.REACT_APP_COMPILER_URL}/compile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.code === "Internal Server Error") {
          this.setState({
            progress: false,
            file: false,
            open: true,
            title: Blockly.Msg.compiledialog_headline,
            content: Blockly.Msg.compiledialog_text,
            error: data.message,
          });
        }
        this.setState({ id: data.data.id }, () => {
          this.createFileName();
        });
      })
      .catch((err) => {
        console.log(err);
        //this.setState({ progress: false, file: false, open: true, title: Blockly.Msg.compiledialog_headline, content: Blockly.Msg.compiledialog_text });
      });
  };

  download = () => {
    const id = this.state.id;
    const filename = detectWhitespacesAndReturnReadableResult(this.state.name);
    this.toggleDialog();
    this.props.workspaceName(this.state.name);
    window.open(
      `${process.env.REACT_APP_COMPILER_URL}/download?id=${id}&board=${process.env.REACT_APP_BOARD}&filename=${filename}`,
      "_self"
    );
    this.setState({ progress: false });
  };

  toggleDialog = () => {
    this.setState({ open: !this.state, progress: false, appDialog: false });
  };

  createFileName = () => {
    if (this.props.platform === "iOS") {
      this.setState({
        link: `blocklyconnect-app://${this.state.name}/${this.state.id}`,
      });
      this.setState({ appDialog: true });
    } else {
      if (this.state.name) {
        this.download();
      } else {
        this.setState({
          file: true,
          open: true,
          title: "Projekt kompilieren",
          content:
            "Bitte gib einen Namen für die Bennenung des zu kompilierenden Programms ein und bestätige diesen mit einem Klick auf 'Eingabe'.",
        });
      }
    }

    // if (this.state.name) {
    //   this.download();
    // } else {
    //   this.setState({
    //     file: true,
    //     open: true,
    //     title: "Projekt kompilieren",
    //     content:
    //       "Bitte gib einen Namen für die Bennenung des zu kompilierenden Programms ein und bestätige diesen mit einem Klick auf 'Eingabe'.",
    //   });
    // }
  };

  setFileName = (e) => {
    this.setState({ name: e.target.value });
  };

  toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    return (
      <div style={{}}>
        {this.props.iconButton ? (
          <Tooltip
            title={Blockly.Msg.tooltip_compile_code}
            arrow
            style={{ marginRight: "5px" }}
          >
            <IconButton
              className={`compileBlocks ${this.props.classes.iconButton}`}
              onClick={() => this.compile()}
            >
              <FontAwesomeIcon icon={faClipboardCheck} size="l" />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            style={{ float: "right", color: "white" }}
            variant="contained"
            className={this.props.classes.button}
            onClick={() => this.compile()}
          >
            <FontAwesomeIcon
              icon={faClipboardCheck}
              style={{ marginRight: "5px" }}
            />{" "}
            Kompilieren
          </Button>
        )}
        <Backdrop
          className={this.props.classes.backdrop}
          open={this.state.progress}
        >
          <div className="overlay">
            <img src={Copy} width="400" alt="copyimage"></img>
            <h2>{Blockly.Msg.compile_overlay_head}</h2>
            <p>{Blockly.Msg.compile_overlay_text}</p>
            <p>
              {Blockly.Msg.compile_overlay_help}
              <a href="/faq" target="_blank">
                FAQ
              </a>
            </p>
            <CircularProgress color="inherit" />
          </div>
        </Backdrop>
        <Drawer
          anchor={"bottom"}
          open={this.state.open}
          onClose={this.toggleDrawer("bottom", false)}
        >
          <h2
            style={{
              color: "#4EAF47",
              paddingLeft: "1rem",
              paddingRight: "1rem",
            }}
          >
            {Blockly.Msg.drawer_ideerror_head}
          </h2>
          <p
            style={{
              color: "#4EAF47",
              paddingLeft: "1rem",
              paddingRight: "1rem",
            }}
          >
            {Blockly.Msg.drawer_ideerror_text}
          </p>
          <Divider style={{ backgroundColor: "white" }} />
          <p
            style={{
              backgroundColor: "black",
              color: "#E47128",
              padding: "1rem",
            }}
          >
            {" "}
            {`${this.state.error}`}{" "}
          </p>
        </Drawer>
        <Dialog
          style={{ zIndex: 9999999 }}
          fullWidth
          maxWidth={"sm"}
          open={this.state.appDialog}
          title=""
          content={""}
          onClose={this.toggleDialog}
          onClick={this.toggleDialog}
          button={Blockly.Msg.button_close}
        >
          <div>Du verwendest: {this.props.platform}</div>
          <div>Lade die App hier herunter: </div>
          <div>
            Testlink: <a href={this.state.link}>Öffne App</a>
          </div>
        </Dialog>

        {/* <Dialog
          open={this.state.open}
          title={this.state.title}
          content={this.state.content}
          onClose={this.toggleDialog}
          onClick={this.state.file ? () => { this.toggleDialog(); this.setState({ name: this.props.name }) } : this.toggleDialog}
          button={this.state.file ? Blockly.Msg.button_cancel : Blockly.Msg.button_close}
        >
          {this.state.file ?
            <div style={{ marginTop: '10px' }}>
              <TextField autoFocus placeholder='Dateiname' value={this.state.name} onChange={this.setFileName} style={{ marginRight: '10px' }} />
              <Button disabled={!this.state.name} variant='contained' color='primary' onClick={() => this.download()}>Eingabe</Button>
            </div>
            : 
           
        <pre className="line-numbers" style={{ paddingBottom: 0, width: '100%', overflow: 'auto', scrollbarWidth: 'thin', height: '100%', margin: '15px 0', paddingTop: 0, whiteSpace: 'pre-wrap', backgroundColor: 'white' }}><code className="language-json">
                {`${this.state.error}`}
              </code></pre>
        </AccordionDetails>
      </Accordion>
      
            }
        </Dialog> */}
      </div>
    );
  }
}

Compile.propTypes = {
  arduino: PropTypes.string.isRequired,
  name: PropTypes.string,
  workspaceName: PropTypes.func.isRequired,
  platform: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  arduino: state.workspace.code.arduino,
  name: state.workspace.name,
  platform: state.general.platform,
});

export default connect(mapStateToProps, { workspaceName })(
  withStyles(styles, { withTheme: true })(Compile)
);
