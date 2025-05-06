import React from "react";

import * as Blockly from "blockly/core";
import "blockly/blocks";
import "@blockly/toolbox-search"; // search plugin auto-registers here

import Toolbox from "./toolbox/Toolbox";
import { reservedWords } from "./helpers/reservedWords";
import Snackbar from "../Snackbar";

import { Card } from "@mui/material";
import {
  ScrollOptions,
  ScrollBlockDragger,
  ScrollMetricsManager,
} from "@blockly/plugin-scroll-options";

import { PositionedMinimap } from "@blockly/workspace-minimap";

class BlocklyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.blocklyDiv = React.createRef();
    this.toolbox = React.createRef();
    this.primaryWorkspace = null;
    this.state = { workspace: undefined, snackbar: false };
  }

  componentDidMount() {
    const { initialXml, children, ...rest } = this.props;

    const workspace = Blockly.inject(this.blocklyDiv.current, {
      toolbox: this.toolbox.current,
      plugins: {
        blockDragger: ScrollBlockDragger,
        metricsManager: ScrollMetricsManager,
      },
      ...rest,
    });

    this.primaryWorkspace = workspace;
    this.setState({ workspace });

    workspace.addChangeListener((event) => {
      if (event.type === Blockly.Events.VAR_CREATE) {
        const variable = workspace.getVariableById(event.varId);
        const newName = variable.name;

        // Check if the new variable name is in the reserved words list
        if (reservedWords.has(newName)) {
          // Show a snackbar or alert to inform the user
          this.setState({
            snackbar: true,
            key: Date.now(),
            type: "error",
            message: `"${newName}" ${Blockly.Msg.messages_reserve_word}`,
          });
          // // Optionally, you can use a snackbar component from Material-UI
          // alert(
          //   `"${newName}" is a reserved word and cannot be used as a variable name.`,
          // );
          // Delete the variable
          workspace.deleteVariableById(event.varId);
        }
      }
    });

    this.setState({ workspace: this.primaryWorkspace });
    const plugin = new ScrollOptions(this.workspace);
    plugin.init({ enableWheelScroll: true, enableEdgeScroll: false });

    if (initialXml) {
      Blockly.Xml.domToWorkspace(
        Blockly.utils.xml.textToDom(initialXml),
        workspace,
      );
    }
  }

  // Properly dispose the workspace on unmount
  componentWillUnmount() {
    if (this.primaryWorkspace) {
      this.primaryWorkspace.dispose();
      this.primaryWorkspace = null;
    }
  }

  get workspace() {
    return this.primaryWorkspace;
  }

  setXml(xml) {
    Blockly.Xml.domToWorkspace(
      Blockly.utils.xml.textToDom(xml),
      this.primaryWorkspace,
    );
  }

  render() {
    return (
      <>
        <Card
          ref={this.blocklyDiv}
          id="blocklyDiv"
          style={this.props.style ? this.props.style : {}}
        />
        <Toolbox toolbox={this.toolbox} workspace={this.state.workspace} />
        <Snackbar
          open={this.state.snackbar}
          message={this.state.message}
          type={this.state.type}
          key={this.state.key}
        />
      </>
    );
  }
}

export default BlocklyComponent;
