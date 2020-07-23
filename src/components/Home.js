import React, { Component } from 'react';

import WorkspaceStats from './WorkspaceStats';
import WorkspaceFunc from './WorkspaceFunc';

import BlocklyComponent, { Block, Value, Field, Shadow, Category } from './Blockly';
import * as Blockly from 'blockly/core';
import * as De from './Blockly/msg/de'; // de locale files
//import * as En from './Blockly/msg/en'; // de locale files
import './Blockly/blocks/index';
import './Blockly/generator/index';



class Home extends React.Component {
  constructor(props) {
    super(props);

    this.simpleWorkspace = React.createRef();
    this.state = { generatedCode: 'Click text' }
  }

  componentDidMount() {

    let workspace = Blockly.getMainWorkspace();
    workspace.addChangeListener(this.generateCode);
  }

  generateCode = () => {
    var code = Blockly.Arduino.workspaceToCode(this.workspace);
    console.log(code);
    this.setState({ generatedCode: code })
  }

  render() {
    return (
      <div>
        <WorkspaceStats />
        <BlocklyComponent ref={this.simpleWorkspace}
          readOnly={false} trashcan={true} media={'media/'}
          move={{
            scrollbars: true,
            drag: true,
            wheel: true
          }}
          initialXml={''}>
          <Category name="loops" >
            <Block type="controls_for" />
            <Block type="controls_repeat_ext" />
            <Block type="controls_whileUntil" />
          </Category>
          <Category name="senseBox" colour="120" >
            <Category name="Sensoren" colour="120" >
              <Block type="sensebox_sensor_temp_hum"></Block>
            </Category>
            <Block type="sensebox_telegram" />
          </Category>
          <Category name="Logic" colour="#b063c5">
            <Block type="control_if"></Block>
            <Block type="controls_ifelse"></Block>
            <Block type="logic_compare"></Block>
            <Block type="logic_operation"></Block>
            <Block type="logic_negate"></Block>
            <Block type="logic_boolean"></Block>
          </Category>
        </BlocklyComponent>
        <WorkspaceFunc generateCode={this.generateCode} />
      </div>
    );
  };
}

export default Home;
