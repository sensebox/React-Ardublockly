import React from "react";

import * as Blockly from "blockly/core";
import "blockly/blocks";
import "@blockly/toolbox-search"; // search plugin auto-registers here

import Toolbox from "./toolbox/Toolbox";

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
    this.state = { workspace: undefined };
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

    const plugin = new ScrollOptions(workspace);
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
      </>
    );
  }
}

export default BlocklyComponent;
