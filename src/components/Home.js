import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { onChangeWorkspace, initWorkspace } from '../actions/workspaceActions';

import WorkspaceStats from './WorkspaceStats';
import WorkspaceFunc from './WorkspaceFunc';
import CodeViewer from './CodeViewer';

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
  }

  componentDidMount() {
    let workspace = Blockly.getMainWorkspace();
    this.props.initWorkspace(workspace);
    workspace.addChangeListener((event) => {
      this.props.onChangeWorkspace(event);
    });
  }

  render() {
    return (
      <div>
        <WorkspaceStats />
        <BlocklyComponent ref={this.simpleWorkspace}
          readOnly={false}
          trashcan={true}
          media={'media/'}
          move={{
            scrollbars: true,
            drag: true,
            wheel: true
          }}
          initialXml={''}
        >
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
        <WorkspaceFunc />
      </div>
    );
  };
}

WorkspaceStats.propTypes = {
  workspace: PropTypes.object.isRequired,
  create: PropTypes.number.isRequired,
  change: PropTypes.number.isRequired,
  delete: PropTypes.number.isRequired,
  move: PropTypes.number.isRequired,
  worskpaceChange: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  workspace: state.workspace.workspace,
  create: state.workspace.stats.create,
  change: state.workspace.stats.change,
  delete: state.workspace.stats.delete,
  move: state.workspace.stats.move,
  worskpaceChange: state.workspace.change
});

export default connect(null, { onChangeWorkspace, initWorkspace })(Home);
