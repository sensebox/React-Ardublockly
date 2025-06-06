import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import withStyles from "@mui/styles/withStyles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { Card, Chip } from "@mui/material";
import * as Blockly from "blockly";
import { default as MonacoEditor } from "@monaco-editor/react";
import { faInfoCircle, faMicrochip } from "@fortawesome/free-solid-svg-icons";
import Simulator from "./Simulator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TooltipViewer from "./TooltipViewer";


// FIXME checkout https://mui.com/components/use-media-query/#migrating-from-withwidth
const withWidth = () => (WrappedComponent) => (props) => (
  <WrappedComponent {...props} width="xs" />
);

const Accordion = withStyles((theme) => ({
  root: {
    border: `1px solid ${theme.palette.secondary.main}`,
    boxShadow: "none",
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
}))(MuiAccordion);

const AccordionSummary = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    borderBottom: `1px solid white`,
    marginBottom: "-1px",
    minHeight: "50px",
    "&$expanded": {
      minHeight: "50px",
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
}))(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

class CodeViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: this.props.arduino,
      changed: false,
      expanded: "code",
      componentHeight: null,
    };
    this.myDiv = React.createRef();
  }

  componentDidMount() {
    this.setState({
      componentHeight: this.myDiv.current.offsetHeight + "px",
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // if (this.props.arduino !== prevProps.arduino) {
    //   this.setState({ changed: true });

    //   console.log(`code changed: ${this.state.changed}`);
    //   if (this.state.changed && prevState.code !== this.props.arduino) {
    //     this.setState({ code: this.props.arduino });
    //     this.setState({ changed: false });
    //   }

    // if (this.state.code !== prevState.code && this.state.changed) {
    //   this.setState({ changed: false });
    // }

    // if (this.props.arduino !== this.state.code) {
    //   this.setState({ changed: true });
    //   //this.setState({ code: this.props.arduino });
    // }

    if (
      this.myDiv.current &&
      this.myDiv.current.offsetHeight + "px" !== this.state.componentHeight
    ) {
      this.setState({
        componentHeight: this.myDiv.current.offsetHeight + "px",
      });
    }
  }

  onChange = (panel) => (event, newExpanded) => {
    this.setState({
      ...this.state,
      expanded: newExpanded ? panel : false,
    });

  };

  render() {
    var curlyBrackets = "{ }";
    var unequal = "<>";
    return (
      <Card style={{ height: "100%", maxHeight: "80vH" }} ref={this.myDiv}>
        {/* Simulator Accordion  */}
        <Accordion
          square={true}
          style={{ margin: 0 }}
          expanded={this.state.expanded === "simulator"}
          onChange={this.onChange("simulator")}
        >
          <AccordionSummary>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon icon={faMicrochip} size="lg" />
              <div style={{ margin: "auto 5px 2px 0px" }}>Simulator</div>
              {this.props.isSimulatorRunning &&
                this.state.expanded !== "simulator" && (
                  <Chip size="small" label="Running" color="success" />
                )}
            </div>
          </AccordionSummary>
          <AccordionDetails
            style={{
              padding: 0,
              height: `calc(${this.state.componentHeight} - 50px  - 50px)`,
              backgroundColor: "white",
            }}
          >
            <Simulator />
          </AccordionDetails>
        </Accordion>
        {/* Source Code Accordion */}
        
      
        {/* Tooltip Viewer Accordion */}
        <Accordion
          square={true}
          style={{ margin: 0 }}
          expanded={this.state.expanded === "tooltip"}
          onChange={this.onChange("tooltip")}
        >
        <AccordionSummary>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <FontAwesomeIcon icon={faInfoCircle} size="lg" />
            <div style={{ margin: "auto 5px 2px 0px" }}>
              Hilfe
              </div>
          </div>
        </AccordionSummary>
        <AccordionDetails
          style={{
            padding: 0,
            height: `calc(${this.state.componentHeight} - 50px - 50px)`,
            backgroundColor: "white",
          }}>
          <TooltipViewer />
          </AccordionDetails>

        </Accordion>
      </Card>
    );
  }
}

CodeViewer.propTypes = {
  arduino: PropTypes.string.isRequired,
  xml: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  arduino: state.workspace.code.arduino,
  xml: state.workspace.code.xml,
  tooltip: state.workspace.code.tooltip,
  isSimulatorRunning: state.simulator.isRunning,
});

export default connect(mapStateToProps, null)(withWidth()(CodeViewer));

