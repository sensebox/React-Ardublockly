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
        height: "auto",
        marginTop: "1vh",
        padding: "1rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        border: "1px solid #ddd",
      }}
      >
      <CardContent>
        <Typography variant="h6" component="h2" style={{ marginBottom: "0.5rem" }}>
        Sensor Informationen
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
  tooltip: PropTypes.string.isRequired,
  helpurl: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  tooltip: state.workspace.code.tooltip,
  helpurl: state.workspace.code.helpurl,
});

export default connect(mapStateToProps, null)(withWidth()(TooltipViewer));
