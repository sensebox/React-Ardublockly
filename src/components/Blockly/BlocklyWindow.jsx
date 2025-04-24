import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { onChangeWorkspace, clearStats } from "../../actions/workspaceActions";
import "./blockly-animations.css";
import BlocklyComponent from "./BlocklyComponent";
import BlocklySvg from "./BlocklySvg";

import * as Blockly from "blockly/core";
import "./blocks/index";
import "./generator/index";
import { ZoomToFitControl } from "@blockly/zoom-to-fit";
import { initialXml } from "./initialXml.js";
import { getMaxInstances } from "./helpers/maxInstances";
import { Backpack } from "@blockly/workspace-backpack";

class BlocklyWindow extends Component {
  constructor(props) {
    super(props);
    this.simpleWorkspace = React.createRef();
    this.backpackImg = null;
  }

  componentDidMount() {
    const workspace = Blockly.getMainWorkspace();
    this.props.onChangeWorkspace({});
    this.props.clearStats();

    workspace.addChangeListener(Blockly.Events.disableOrphans);
    workspace.addChangeListener((event) => {
      this.props.onChangeWorkspace(event);
      if (this.props.blockDisabled) {
        Blockly.Events.disableOrphans(event);
      }
    });
    Blockly.svgResize(workspace);

    const zoomToFit = new ZoomToFitControl(workspace);
    zoomToFit.init();

    const backpack = new Backpack(workspace);
    backpack.init();

    const waitForBackpackImage = (cb, retries = 5) => {
      const img = document.querySelector("image.blocklyBackpack");
      if (img) return cb(img);
      if (retries > 0) {
        setTimeout(() => waitForBackpackImage(cb, retries - 1), 100);
      }
    };

    waitForBackpackImage((img) => {
      this.backpackImg = img;
      img.addEventListener("animationend", () => {
        img.classList.remove("rucksack-wiggle-once");
      });
    });

    const originalOnDrop = backpack.onDrop.bind(backpack);
    backpack.onDrop = (dragElement) => {
      originalOnDrop(dragElement);

      if (this.backpackImg) {
        this.backpackImg.classList.remove("rucksack-wiggle-once");

        void this.backpackImg.offsetWidth;
        this.backpackImg.classList.add("rucksack-wiggle-once");
      }
    };
  }

  componentDidUpdate(prevProps) {
    const workspace = Blockly.getMainWorkspace();
    let xml = this.props.initialXml;

    if (prevProps.selectedBoard !== this.props.selectedBoard) {
      xml = localStorage.getItem("autoSaveXML") || initialXml;
      const xmlDom = Blockly.utils.xml.textToDom(xml);
      Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, workspace);
    }

    if (prevProps.initialXml !== this.props.initialXml && !this.props.svg) {
      workspace.clear();
      xml = this.props.initialXml || initialXml;
      Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(xml), workspace);
    }

    if (prevProps.language !== this.props.language) {
      xml = localStorage.getItem("autoSaveXML") || initialXml;
      const xmlDom = Blockly.utils.xml.textToDom(xml);
      Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, workspace);
    }

    Blockly.svgResize(workspace);
  }

  render() {
    return (
      <div>
        <BlocklyComponent
          ref={this.simpleWorkspace}
          style={this.props.svg ? { height: 0 } : this.props.blocklyCSS}
          readOnly={this.props.readOnly ?? false}
          trashcan={this.props.trashcan ?? true}
          renderer={this.props.renderer}
          sounds={this.props.sounds}
          maxInstances={getMaxInstances()}
          zoom={{
            controls: this.props.zoomControls ?? true,
            wheel: false,
            startScale: 1,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2,
          }}
          grid={
            this.props.grid === false
              ? {}
              : {
                  spacing: 20,
                  length: 1,
                  colour: "#4EAF47",
                  snap: false,
                }
          }
          media="/media/blockly/"
          move={
            this.props.move === false
              ? {}
              : {
                  scrollbars: true,
                  drag: true,
                  wheel: true,
                }
          }
          initialXml={this.props.initialXml || initialXml}
        />
        {this.props.svg && this.props.initialXml && (
          <BlocklySvg initialXml={this.props.initialXml} />
        )}
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

export default connect(mapStateToProps, {
  onChangeWorkspace,
  clearStats,
})(BlocklyWindow);
