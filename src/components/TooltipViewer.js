import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import withWidth from "@material-ui/core/withWidth";

import { Button, Card } from "@material-ui/core";
import * as Blockly from "blockly";
import CardContent from "@material-ui/core/CardContent";

import Typography from "@material-ui/core/Typography";
import ReactMarkdown from "react-markdown";
import Dialog from "./Dialog";

const markdown = `
# Feinstaubsensor

![](https://radosgw.public.os.wwu.de/pad/uploads/upload_d6381b0e839a5aa8abebb7a23d5678a4.png)

## Technische Details
- Schnelle Reaktionszeit von weniger als 10 Sekunden
- "Plug-in-and-Go" senseBox kompatibel
- Hohe Auflösung bis zu 0.3µg/m3

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
`;

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
          borderStyle: this.props.helpurl !== "" ? "solid" : "none",
          borderColor: "rgb(254, 197, 66 )",
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
          <Typography variant="body2" component="p">
            <ReactMarkdown linkTarget="_blank">
              {this.props.tooltip}
            </ReactMarkdown>

            {this.props.helpurl !== "" &&
            this.props.helpurl.includes("api.sensor-wiki.org") ? (
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
        <Dialog
          open={this.state.open}
          maxWidth={"md"}
          fullWidth={true}
          title="Informationen zum Sensor"
          onClose={() => {
            this.toggleDialog();
          }}
          onClick={() => {
            this.toggleDialog();
          }}
          button="Schließen"
        >
          <ReactMarkdown className={"tutorial"}>{markdown}</ReactMarkdown>
        </Dialog>
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
