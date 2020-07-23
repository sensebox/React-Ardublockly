import React, { Component } from 'react';

import WorkspaceStats from './WorkspaceStats';
import WorkspaceFunc from './WorkspaceFunc';

import BlocklyComponent, { Block, Value, Field, Shadow, Category } from './Blockly';
import * as Blockly from 'blockly/core';
import * as De from './Blockly/msg/de'; // de locale files
//import * as En from './Blockly/msg/en'; // de locale files
import './Blockly/blocks/';
import './Blockly/generator/';




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
          initialXml={''} />
        <WorkspaceFunc generateCode={this.generateCode} />
      </div>
    );
  };
}

export default Home;
