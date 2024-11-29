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

import { TypedVariableModal } from "@blockly/plugin-typed-variable-modal";

import {
  blocks,
  unregisterProcedureBlocks,
} from "@blockly/block-shareable-procedures";

import { CategoryBuilder, ToolboxBuilder } from "./toolbox/builder";
import { getColour } from "./helpers/colour";
import sensors from "./toolbox/modules/sensors";
import wifi from "./toolbox/modules/wifi";
import espnow from "./toolbox/modules/espnow";
import ethernet from "./toolbox/modules/ethernet";
import sd from "./toolbox/modules/sd";
import led from "./toolbox/modules/led";
import ledMatrix from "./toolbox/modules/led-matrix";
import display from "./toolbox/modules/display";
import opensensemap from "./toolbox/modules/opensensemap";
import lora from "./toolbox/modules/lora";
import phyphox from "./toolbox/modules/phyphox";
import webserver from "./toolbox/modules/webserver";
import mqtt from "./toolbox/modules/mqtt";
import logic from "./toolbox/modules/logic";
import loops from "./toolbox/modules/loops";
import text from "./toolbox/modules/text";
import time from "./toolbox/modules/time";
import math from "./toolbox/modules/math";
import audio from "./toolbox/modules/audio";
import serial from "./toolbox/modules/serial";
import io from "./toolbox/modules/io";
import motors from "./toolbox/modules/motors";
import watchdog from "./toolbox/modules/watchdog";

class BlocklyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.blocklyDiv = React.createRef();
    this.toolbox = React.createRef();
    this.state = { workspace: undefined };
  }

  getToolbox(board) {
    if (!board) {
      return new ToolboxBuilder().buildToolbox();
    }
    const senseBoxColor = getColour().sensebox;

    // Create the advanced categories
    const serialCategory = new CategoryBuilder(
      Blockly.Msg.toolbox_serial,
      getColour().serial,
    )
      .addBlocks(serial[board])
      .buildCategory();
    const ioCategory = new CategoryBuilder(
      Blockly.Msg.toolbox_io,
      getColour().io,
    )
      .addBlocks(io[board])
      .buildCategory();
    const motorsCategory = new CategoryBuilder(
      Blockly.Msg.toolbox_motors,
      getColour().motors,
    )
      .addBlocks(motors[board])
      .buildCategory();
    const watchdogCategory = new CategoryBuilder("Watchdog", getColour().io)
      .addBlocks(watchdog[board])
      .buildCategory();

    return (
      new ToolboxBuilder()
        .addCategory(Blockly.Msg.toolbox_sensors, senseBoxColor, sensors[board])
        .addCategory("WIFI", senseBoxColor, wifi[board])
        .addCategory("ESP-NOW", senseBoxColor, espnow[board])
        .addCategory("Ethernet", senseBoxColor, ethernet[board])
        .addCategory("SD", senseBoxColor, sd[board])
        .addCategory("LED", senseBoxColor, led[board])
        .addCategory("LED Matrix", senseBoxColor, ledMatrix[board])
        .addCategory("Display", senseBoxColor, display[board])
        .addCategory("openSenseMap", senseBoxColor, opensensemap[board])
        .addCategory("LoRa", senseBoxColor, lora[board])
        .addCategory("Phyphox", getColour().phyphox, phyphox[board])
        .addCategory("Webserver", getColour().webserver, webserver[board])
        .addCategory("MQTT", getColour().mqtt, mqtt[board])
        .addCategory(Blockly.Msg.toolbox_logic, getColour().logic, logic[board])
        .addCategory(Blockly.Msg.toolbox_loops, getColour().loops, loops[board])
        .addCategory("Text", getColour().text, text[board])
        .addCategory(Blockly.Msg.toolbox_time, getColour().time, time[board])
        .addCategory(Blockly.Msg.toolbox_math, getColour().math, math[board])
        .addCategory("Audio", getColour().audio, audio[board])
        .addCustomCategory(
          Blockly.Msg.toolbox_variables,
          getColour().variables,
          "CREATE_TYPED_VARIABLE",
        )
        // .addCustomCategory(Blockly.Msg.toolbox_functions, getColour().procedures, "PROCEDURE")   // TODO: This is not working
        .addNestedCategory(Blockly.Msg.toolbox_advanced, getColour().io, [
          serialCategory,
          ioCategory,
          motorsCategory,
          watchdogCategory,
        ])

        .buildToolbox()
    );
  }

  componentDidMount() {
    const { initialXml, children, ...rest } = this.props;

    const toolbox = this.getToolbox(this.props.selectedBoard);

    const workspace = Blockly.inject(this.blocklyDiv.current, {
      toolbox: toolbox,
      plugins: {
        // These are both required.
        blockDragger: ScrollBlockDragger,
        metricsManager: ScrollMetricsManager,
      },
      ...rest,
    });

    unregisterProcedureBlocks();
    Blockly.common.defineBlocks(blocks);

    workspace.registerToolboxCategoryCallback(
      "CREATE_TYPED_VARIABLE",
      this.createFlyout,
    );

    const typedVarModal = new TypedVariableModal(workspace, "callbackName", [
      [`${Blockly.Msg.variable_NUMBER}`, "int"],
      [`${Blockly.Msg.variable_LONG}`, "long"],
      [`${Blockly.Msg.variable_DECIMAL}`, "float"],
      [`${Blockly.Msg.variables_TEXT}`, "String"],
      [`${Blockly.Msg.variables_CHARACTER}`, "char"],
      [`${Blockly.Msg.variables_BOOLEAN}`, "boolean"],
    ]);
    typedVarModal.init();
    // workspace.updateToolbox(this.props.toolbox.current);

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

  createFlyout(workspace) {
    let xmlList = [];

    // Add your button and give it a callback name.
    const button = document.createElement("button");
    button.setAttribute("text", Blockly.Msg.button_createVariable);
    button.setAttribute("callbackKey", "callbackName");

    xmlList.push(button);

    // This gets all the variables that the user creates and adds them to the
    // flyout.
    const blockList = Blockly.VariablesDynamic.flyoutCategoryBlocks(workspace);
    console.log(blockList);
    xmlList = xmlList.concat(blockList);
    return xmlList;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedBoard !== this.props.selectedBoard) {
      const senseBoxColor = getColour().sensebox;

      const toolbox = this.getToolbox(this.props.selectedBoard);

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
