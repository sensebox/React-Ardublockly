import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { onChangeWorkspace } from '../../actions/workspaceActions';

import BlocklyComponent, { Block, Value, Field, Shadow, Category } from './';
import * as Blockly from 'blockly/core';
import * as De from './msg/de'; // de locale files
//import * as En from './Blockly/msg/en'; // de locale files
import './blocks/index';
import './generator/index';


class BlocklyWindow extends Component {

  constructor(props) {
    super(props);
    this.simpleWorkspace = React.createRef();
  }

  componentDidMount() {
    const workspace = Blockly.getMainWorkspace();
    workspace.addChangeListener((event) => {
      this.props.onChangeWorkspace(event);
    });
  }

  render() {
    return (
      <BlocklyComponent ref={this.simpleWorkspace}
        readOnly={false}
        trashcan={true}
        zoom={{ // https://developers.google.com/blockly/guides/configure/web/zoom
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        }}
        grid={{ // https://developers.google.com/blockly/guides/configure/web/grid
          spacing: 20,
          length: 1,
          colour: '#4EAF47', // senseBox-green
          snap: false
        }}
        media={'media/'}
        move={{ // https://developers.google.com/blockly/guides/configure/web/move
          scrollbars: true,
          drag: true,
          wheel: false
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
    );
  };
}

BlocklyWindow.propTypes = {
  onChangeWorkspace: PropTypes.func.isRequired
};


export default connect(null, { onChangeWorkspace })(BlocklyWindow);
