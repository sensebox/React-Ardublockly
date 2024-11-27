/**
 * @license
 *
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Blockly React Component.
 * @author samelh@google.com (Sam El-Husseini)
 */

import React from "react";

import * as Blockly from "blockly/core";
import "blockly/blocks";

import { Card } from "@mui/material";
import {
  ScrollOptions,
  ScrollBlockDragger,
  ScrollMetricsManager,
} from "@blockly/plugin-scroll-options";

import { connect } from "react-redux";

import { PositionedMinimap } from "@blockly/workspace-minimap";

import { ToolboxBuilder } from "./toolbox/builder";
import { getColour } from "./helpers/colour";
import sensors from "./toolbox/modules/sensors";
import wifi from "./toolbox/modules/wifi";
import espnow from "./toolbox/modules/espnow";
import ethernet from "./toolbox/modules/ethernet";
import sd from "./toolbox/modules/sd";

class BlocklyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.blocklyDiv = React.createRef();
    this.toolbox = React.createRef();
    this.state = { workspace: undefined };
  }

  componentDidMount() {
    const { initialXml, children, ...rest } = this.props;

    const senseBoxColor = getColour().sensebox;

    const toolbox = new ToolboxBuilder()
      .addCategory(Blockly.Msg.toolbox_sensors, senseBoxColor, sensors[this.props.selectedBoard])
      .addCategory("WIFI", senseBoxColor, wifi[this.props.selectedBoard])
      .addCategory("ESP-NOW", senseBoxColor, espnow[this.props.selectedBoard])
      .addCategory("Ethernet", senseBoxColor, ethernet[this.props.selectedBoard])
      .addCategory("SD", senseBoxColor, sd[this.props.selectedBoard])
      .buildToolbox();

    const workspace = Blockly.inject(this.blocklyDiv.current, {
      toolbox: toolbox,
      plugins: {
        // These are both required.
        blockDragger: ScrollBlockDragger,
        metricsManager: ScrollMetricsManager,
      },
      ...rest,
    });
    // Initialize plugin.

    // Initialize plugin.
    // const minimap = new PositionedMinimap(workspace);
    // minimap.init();

    this.primaryWorkspace = workspace;

    this.setState({ workspace: this.primaryWorkspace });
    const plugin = new ScrollOptions(this.workspace);
    plugin.init({ enableWheelScroll: true, enableEdgeScroll: false });
    if (initialXml) {
      Blockly.Xml.domToWorkspace(
        Blockly.utils.xml.textToDom(initialXml),
        this.primaryWorkspace,
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedBoard !== this.props.selectedBoard) {
      const senseBoxColor = getColour().sensebox;

      const toolbox = new ToolboxBuilder()
        .addCategory(Blockly.Msg.toolbox_sensors, senseBoxColor, sensors[this.props.selectedBoard])
        .addCategory("WIFI", senseBoxColor, wifi[this.props.selectedBoard])
        .addCategory("ESP-NOW", senseBoxColor, espnow[this.props.selectedBoard])
        .addCategory("Ethernet", senseBoxColor, ethernet[this.props.selectedBoard])
        .addCategory("SD", senseBoxColor, sd[this.props.selectedBoard])
        .buildToolbox();

      this.primaryWorkspace.updateToolbox(toolbox);
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
      <React.Fragment>
        <Card
          ref={this.blocklyDiv}
          id="blocklyDiv"
          style={this.props.style ? this.props.style : {}}
        />
        {/* <Toolbox toolbox={this.toolbox} workspace={this.state.workspace} /> */}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedBoard: state.board.board,
});

export default connect(mapStateToProps)(BlocklyComponent);
