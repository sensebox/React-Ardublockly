import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { workspaceName } from "../../actions/workspaceActions";

import BlocklyWindow from "../Blockly/BlocklyWindow";
import WorkspaceFunc from "../Workspace/WorkspaceFunc";

import withWidth, { isWidthDown } from "@material-ui/core/withWidth";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import * as Blockly from "blockly";
import { initialXml } from "../Blockly/initialXml";
import IconButton from "@material-ui/core/IconButton";
import CodeViewer from "../CodeViewer";
import TooltipViewer from "../TooltipViewer";
import Tooltip from "@material-ui/core/Tooltip";
import ReactMarkdown from "react-markdown";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  codeOn: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.contrastText,
      color: theme.palette.primary.main,
      border: `1px solid ${theme.palette.secondary.main}`,
    },
  },
  codeOff: {
    backgroundColor: theme.palette.primary.contrastText,
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.secondary.main}`,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
});

import ReactMarkdown from 'react-markdown'

class Assessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codeOn: false,
    };
  }

  componentDidMount() {
    this.props.workspaceName(this.props.name);
  }

  componentDidUpdate(props) {
    if (props.name !== this.props.name) {
      this.props.workspaceName(this.props.name);
    }
  }

  onChange = () => {
    this.setState({ codeOn: !this.state.codeOn });
  };

  render() {
    var tutorialId = this.props.tutorial._id;
    var currentTask = this.props.step;
    var status = this.props.status.filter(
      (status) => status._id === tutorialId
    )[0];
    var taskIndex = status.tasks.findIndex(
      (task) => task._id === currentTask._id
    );
    var statusTask = status.tasks[taskIndex];

    return (
      <div className="assessmentDiv" style={{ width: "100%" }}>
        <div style={{ float: "right", height: "40px" }}>
          <WorkspaceFunc assessment />
        </div>
        <Grid container spacing={2} style={{ marginBottom: "5px" }}>
          <Grid
            item
            xs={12}
            md={6}
            lg={3}
            style={{
              position: "relative",
              // isWidthDown("sm", this.props.width)
              //   ? { height: "max-content" }
              //   : {}
            }}
          >
            <Card
              style={{
                height: "calc(45vH - 30px)",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <Typography>
                <ReactMarkdown>{currentTask.text}</ReactMarkdown>
              </Typography>
 </Card>
            <Card
              style={{
                height: "20vH",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <TooltipViewer />
            </Card>
            <div
              style={
                isWidthDown("sm", this.props.width)
                  ? { height: "500px" }
                  : { height: "50%" }
              }
            ></div>
          </Grid>
          <Grid
            item
            xs={12}
            md={this.state.codeOn ? 6 : 6}
            lg={this.state.codeOn ? 6 : 9}
            style={{ position: "relative" }}
          >
            <Tooltip
              title={
                this.state.codeOn
                  ? Blockly.Msg.tooltip_hide_code
                  : Blockly.Msg.tooltip_show_code
              }
            >
              <IconButton
                className={`showCode ${
                  this.state.codeOn
                    ? this.props.classes.codeOn
                    : this.props.classes.codeOff
                }`}
                style={{
                  width: "40px",
                  height: "40px",
                  position: "absolute",
                  top: 6,
                  right: 8,
                  zIndex: 21,
                }}
                onClick={() => this.onChange()}
              >
                <FontAwesomeIcon icon={faCode} size="xs" />
              </IconButton>
            </Tooltip>
            <BlocklyWindow
              initialXml={initialXml}
              blockDisabled
              blocklyCSS={{ height: "65vH" }}
            />
          </Grid>
          {this.state.codeOn ? (
            <Grid item xs={12} md={4} lg={3}>
              <CodeViewer />
            </Grid>
          ) : null}
        </Grid>
      </div>
    );
  }
}

Assessment.propTypes = {
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  workspaceName: PropTypes.func.isRequired,
  tutorial: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  change: state.tutorial.change,
  status: state.tutorial.status,
  tutorial: state.tutorial.tutorials[0],
});

export default connect(mapStateToProps, { workspaceName })(
  withWidth()(withStyles(styles, { withTheme: true })(Assessment))
);
