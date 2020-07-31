import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { onChangeWorkspace } from '../../actions/workspaceActions';

import BlocklyComponent from './';
import * as Blockly from 'blockly/core';
import './blocks/index';
import './generator/index';



class BlocklyWindow extends Component {

  constructor(props) {
    super(props);
    this.simpleWorkspace = React.createRef();
  }

  componentDidMount() {
    const workspace = Blockly.getMainWorkspace();
    this.props.onChangeWorkspace({});
    workspace.addChangeListener((event) => {
      this.props.onChangeWorkspace(event);
      Blockly.Events.disableOrphans(event);
    });
  }

  render() {
    return (
      <BlocklyComponent ref={this.simpleWorkspace}
        readOnly={false}
        trashcan={true}
        renderer='zelos'
        zoom={{ // https://developers.google.com/blockly/guides/configure/web/zoom
          controls: true,
          wheel: false,
          startScale: 0.8,
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
        initialXml={`<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="arduino_functions" id="QWW|$jB8+*EL;}|#uA" x="27" y="16"></block></xml>`}
      >

      </BlocklyComponent >
    );
  };
}

BlocklyWindow.propTypes = {
  onChangeWorkspace: PropTypes.func.isRequired
};


export default connect(null, { onChangeWorkspace })(BlocklyWindow);
