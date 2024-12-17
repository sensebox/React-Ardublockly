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
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              {store.getState().workspace.code.data && (
                <Button
                  label="Mehr" //TODO language
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    this.openDialog();
                  }}
                >
                  {/* TODO language} */}
                  Sensor Informationen
                </Button>
              )}
              {this.props.helpurl && (
                <Button
                  label="helper"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    window.open(
                      this.props.helpurl,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                  title={this.props.helpurl}
                >
                  {Blockly.Msg.tooltip_moreInformation}
                </Button>
              )}
            </div>
          </Typography>
        </CardContent>
        {store.getState().workspace.code.data ? (
          <Dialog
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
              <Button
                onClick={() => {
                  this.toggleDialog();
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}
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
  language: state.general.language,
});

export default connect(mapStateToProps, null)(withWidth()(TooltipViewer));
