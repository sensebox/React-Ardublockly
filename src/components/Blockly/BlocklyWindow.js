import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { onChangeWorkspace } from '../../actions/workspaceActions';
import * as De from './msg/de';
import BlocklyComponent from './';
import * as Blockly from 'blockly/core';
import './blocks/index';
import './generator/index';
import { initialXml } from './initialXml.js';



class BlocklyWindow extends Component {

  constructor(props) {
    super(props);
    this.simpleWorkspace = React.createRef();
    Blockly.setLocale(De);
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
        initialXml={initialXml}
      >

      </BlocklyComponent >
    );
  };
}

BlocklyWindow.propTypes = {
  onChangeWorkspace: PropTypes.func.isRequired
};


export default connect(null, { onChangeWorkspace })(BlocklyWindow);