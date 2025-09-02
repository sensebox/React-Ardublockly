import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { onChangeWorkspace, clearStats } from "../../actions/workspaceActions";

import BlocklyComponent from "./BlocklyComponent";
import BlocklySvg from "./BlocklySvg";

import * as Blockly from "blockly/core";
import "@/components/Blockly/blocks/index";
import "@/components/Blockly/generator/javascript/index";
import "@/components/Blockly/generator/arduino/index";
import { ZoomToFitControl } from "@blockly/zoom-to-fit";
import { initialXml } from "./initialXml.js";
import { getMaxInstances } from "./helpers/maxInstances";
import { Backpack } from "@blockly/workspace-backpack";
import { De } from "@/components/Blockly/msg/de";
import { En } from "@/components//Blockly/msg/en";

class BlocklyWindow extends Component {
  constructor(props) {
    super(props);
    this.simpleWorkspace = React.createRef();
  }

  componentDidMount() {
    const workspace = Blockly.getMainWorkspace();
    this.props.onChangeWorkspace({});
    this.props.clearStats();
    workspace.addChangeListener(Blockly.Events.disableOrphans);
    workspace.addChangeListener((event) => {
      this.props.onChangeWorkspace(event);

      // switch on that a block is displayed disabled or not depending on whether it is correctly connected
      // for SVG display, a deactivated block in the display is undesirable
      if (this.props.blockDisabled) {
        Blockly.Events.disableOrphans(event);
      }
    });
    Blockly.svgResize(workspace);
    const zoomToFit = new ZoomToFitControl(workspace);
    zoomToFit.init();

    // Initialize plugin.
    const backpack = new Backpack(workspace);

    backpack.init();
  }

  componentDidUpdate(props) {
    const workspace = Blockly.getMainWorkspace();
    var xml = this.props.initialXml;
    if (props.selectedBoard !== this.props.selectedBoard) {
      xml = localStorage.getItem("autoSaveXML");
      // change board
      if (!xml) xml = initialXml;
      var xmlDom = Blockly.utils.xml.textToDom(xml);
      Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, workspace);
    }

    // if svg is true, then the update process is done in the BlocklySvg component
    if (props.initialXml !== xml && !this.props.svg) {
      // guarantees that the current xml-code (this.props.initialXml) is rendered
      workspace.clear();
      if (!xml) xml = initialXml;
      Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(xml), workspace);
    }
    if (props.language !== this.props.language) {
      xml = localStorage.getItem("autoSaveXML");
      if (!xml) xml = initialXml;
      xmlDom = Blockly.utils.xml.textToDom(xml);
      Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, workspace);
      // var toolbox = workspace.getToolbox();
      // workspace.updateToolbox(toolbox.toolboxDef_);
    }
    Blockly.svgResize(workspace);
  }

  render() {
    return (
      <div>
        <BlocklyComponent
          ref={this.simpleWorkspace}
          style={this.props.svg ? { height: 0 } : this.props.blocklyCSS}
          readOnly={
            this.props.readOnly !== undefined ? this.props.readOnly : false
          }
          trashcan={
            this.props.trashcan !== undefined ? this.props.trashcan : true
          }
          renderer={this.props.renderer}
          sounds={this.props.sounds}
          maxInstances={getMaxInstances()}
          zoom={{
            // https://developers.google.com/blockly/guides/configure/web/zoom
            controls:
              this.props.zoomControls !== undefined
                ? this.props.zoomControls
                : true,
            wheel: false,
            startScale: 1,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2,
          }}
          grid={
            this.props.grid !== undefined && !this.props.grid
              ? {}
              : {
                  // https://developers.google.com/blockly/guides/configure/web/grid
                  spacing: 20,
                  length: 1,
                  colour: "#4EAF47", // senseBox-green
                  snap: false,
                }
          }
          media={"/media/blockly/"}
          move={
            this.props.move !== undefined && !this.props.move
              ? {}
              : {
                  // https://developers.google.com/blockly/guides/configure/web/move
                  scrollbars: true,
                  drag: true,
                  wheel: true,
                }
          }
          initialXml={
            this.props.initialXml ? this.props.initialXml : initialXml
          }
        ></BlocklyComponent>
        {this.props.svg && this.props.initialXml ? (
          <BlocklySvg initialXml={this.props.initialXml} />
        ) : null}
      </div>
    );
  }
}

BlocklyWindow.propTypes = {
  onChangeWorkspace: PropTypes.func.isRequired,
  clearStats: PropTypes.func.isRequired,
  renderer: PropTypes.string.isRequired,
  sounds: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired,
  selectedBoard: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  renderer: state.general.renderer,
  sounds: state.general.sounds,
  language: state.general.language,
  selectedBoard: state.board.board,
});

export default connect(mapStateToProps, { onChangeWorkspace, clearStats })(
  BlocklyWindow,
);
