import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { onChangeWorkspace, clearStats } from '../../actions/workspaceActions';
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
    this.props.clearStats();
    workspace.addChangeListener((event) => {
      this.props.onChangeWorkspace(event);
      Blockly.Events.disableOrphans(event);
    });
    Blockly.svgResize(workspace);
  }

  componentDidUpdate(props) {
    const workspace = Blockly.getMainWorkspace();
    var initialXML = this.props.initialXml
    if(props.initialXml !== initialXml){
      // guarantees that the current xml-code (this.props.initialXml) is rendered
      workspace.clear();
      if(!initialXML) initialXML = initialXml;
      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(initialXML), workspace) ;
    }
    Blockly.svgResize(workspace);
  }

  render() {
    return (
      <BlocklyComponent ref={this.simpleWorkspace}
        style={this.props.blocklyCSS}
        readOnly={this.props.readOnly !== undefined ? this.props.readOnly : false}
        trashcan={this.props.trashcan !== undefined ? this.props.trashcan : true}
        renderer='zelos'
        zoom={{ // https://developers.google.com/blockly/guides/configure/web/zoom
          controls: this.props.zoomControls !== undefined ? this.props.zoomControls : true,
          wheel: false,
          startScale: 0.8,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        }}
        grid={this.props.grid !== undefined && !this.props.grid ? {} :
          { // https://developers.google.com/blockly/guides/configure/web/grid
            spacing: 20,
            length: 1,
            colour: '#4EAF47', // senseBox-green
            snap: false
        }}
        media={'/media/blockly/'}
        move={this.props.move !== undefined && !this.props.move ? {} :
          { // https://developers.google.com/blockly/guides/configure/web/move
            scrollbars: true,
            drag: true,
            wheel: false
        }}
        initialXml={this.props.initialXml ? this.props.initialXml : initialXml}
      >

      </BlocklyComponent >
    );
  };
}

BlocklyWindow.propTypes = {
  onChangeWorkspace: PropTypes.func.isRequired,
  clearStats: PropTypes.func.isRequired
};


export default connect(null, { onChangeWorkspace, clearStats })(BlocklyWindow);
