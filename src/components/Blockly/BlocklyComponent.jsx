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

import Blockly from "blockly/core";
import "blockly/blocks";
import Toolbox from "./toolbox/Toolbox";

import { Card } from "@material-ui/core";
import {
  ScrollOptions,
  ScrollBlockDragger,
  ScrollMetricsManager,
} from "@blockly/plugin-scroll-options";

class BlocklyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.blocklyDiv = React.createRef();
    this.toolbox = React.createRef();
    this.state = { workspace: undefined };
  }

  componentDidMount() {
    const { initialXml, children, ...rest } = this.props;
    this.primaryWorkspace = Blockly.inject(this.blocklyDiv.current, {
      toolbox: this.toolbox.current,
      plugins: {
        // These are both required.
        blockDragger: ScrollBlockDragger,
        metricsManager: ScrollMetricsManager,
      },
      ...rest,
    });
    // Initialize plugin.

    this.setState({ workspace: this.primaryWorkspace });
    const plugin = new ScrollOptions(this.workspace);
    plugin.init({ enableWheelScroll: true, enableEdgeScroll: false });
    if (initialXml) {
      Blockly.Xml.domToWorkspace(
        Blockly.Xml.textToDom(initialXml),
        this.primaryWorkspace
      );
    }
  }

  get workspace() {
    return this.primaryWorkspace;
  }

  setXml(xml) {
    Blockly.Xml.domToWorkspace(
      Blockly.Xml.textToDom(xml),
      this.primaryWorkspace
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
        <Toolbox toolbox={this.toolbox} workspace={this.state.workspace} />
      </React.Fragment>
    );
  }
}

export default BlocklyComponent;
