import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Card } from "@mui/material";
import * as Blockly from "blockly";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ReactMarkdown from "react-markdown";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import SensorInfo from "./SensorInfo";
import store from "../store";

// FIXME checkout https://mui.com/components/use-media-query/#migrating-from-withwidth
const withWidth = () => (WrappedComponent) => (props) => (
  <WrappedComponent {...props} width="xs" />
);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class TooltipViewer extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      open: false,
    };
    console.log("TooltipViewer constructor", props);
  }

  toggleDialog = () => {
    this.setState({ open: !this.state });
  };

  openDialog = () => {
    this.setState({ open: true });
  };

  render() {
    return (
      <Card
        className="helpSection"
        style={{
          height: "25vh",
          overflowY: "scroll",
          marginTop: "1vh",
          padding: "1rem",
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          border: "1px solid #ddd",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            component="h2"
            style={{
              marginBottom: "0.5rem",
              position: "relative",
              paddingBottom: "0.3rem",
            }}
          >
            <span style={{ display: "inline-block" }}>
              {Blockly.Msg.tooltip_moreInformation_02}
            </span>
            <span
              style={{
                content: "''",
                display: "block",
                width: "50%",
                height: "4px",
                backgroundColor: "#4caf50",
                position: "absolute",
                bottom: 0,
                left: 0,
                borderRadius: "2px",
              }}
            ></span>
          </Typography>
          <ReactMarkdown linkTarget="_blank">
            {this.props.tooltip}
          </ReactMarkdown>
          {this.props.helpurl && (
            <Button
              variant="contained"
              color="primary"
              href={this.props.helpurl}
              target="_blank"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                fontSize: "0.9rem",
              }}
            >
              Zur Dokumentation
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
}

TooltipViewer.propTypes = {
  tooltip: PropTypes.string,
  helpurl: PropTypes.string,
};

const mapStateToProps = (state) => ({
  tooltip: state.workspace.code.tooltip,
  helpurl: state.workspace.code.helpurl,
  language: state.general.language,
});

export default connect(mapStateToProps, null)(withWidth()(TooltipViewer));
