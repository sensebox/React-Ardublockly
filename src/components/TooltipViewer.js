import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import withWidth from "@material-ui/core/withWidth";
import { Button, Card } from "@material-ui/core";
import * as Blockly from "blockly";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ReactMarkdown from "react-markdown";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import SensorInfo from "./SensorInfo";
import store from "../store";

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
        className="tooltipViewer"
        style={{
          height: "100%",
          margin: "1vH 0 0 0",
          maxHeight: "19vH",
          overflow: "auto",
        }}
        ref={this.myDiv}
      >
        <CardContent>
          <Typography variant="h5" component="h2">
            {Blockly.Msg.tooltip_viewer}
          </Typography>

          <Typography variant="body2" component="span">
            <ReactMarkdown linkTarget="_blank">
              {this.props.tooltip}
            </ReactMarkdown>
            {store.getState().workspace.code.data ? (
              <Button
                label="Mehr"
                variant="contained"
                color="primary"
                onClick={() => {
                  this.openDialog();
                }}
              >
                Sensor Informationen
              </Button>
            ) : (
              <ReactMarkdown>{`${Blockly.Msg.tooltip_moreInformation} [${Blockly.Msg.labels_here}](${this.props.helpurl})`}</ReactMarkdown>
            )}
          </Typography>
        </CardContent>
        {store.getState().workspace.code.data ? (<Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
          onClose={() => {
            this.toggleDialog();
          }}
          maxWidth={"md"}
          fullWidth={true}
        >
          <DialogContent>
            <SensorInfo></SensorInfo>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              this.toggleDialog();
            }}>Close</Button>
          </DialogActions>
        </Dialog>) : (null)}
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
