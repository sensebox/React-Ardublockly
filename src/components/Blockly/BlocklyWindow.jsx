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
    this.backpackBlockPosition = null;
    this.allowNewArduinoFunction = true;
    this.backpack = null;
    this.backpackInitialized = false;
  }

  // Hilfsfunktion für die Block-Validierung
  validateArduinoFunctionBlock = (workspace, newBlock) => {
    const existingBlocks = workspace
      .getAllBlocks()
      .filter((block) => block.type === "arduino_functions");

    if (existingBlocks.length > 0) {
      if (newBlock) {
        const oldBlock = existingBlocks[0];
        const oldPosition = oldBlock.getRelativeToSurfaceXY();
        oldBlock.dispose();
        newBlock.moveTo(oldPosition);
      }
      return false;
    }
    return true;
  };

  // Backpack Event-Handler
  handleBackpackDragStart = (block) => {
    if (block.type === "arduino_functions") {
      this.backpackBlockPosition = block.getRelativeToSurfaceXY();
    }
  };

  handleBackpackDragEnd = (block) => {
    if (block.type === "arduino_functions") {
      const workspace = Blockly.getMainWorkspace();
      const existingBlocks = workspace
        .getAllBlocks()
        .filter((b) => b.type === "arduino_functions");

      if (existingBlocks.length > 1) {
        existingBlocks[0].dispose();
        block.moveTo(this.backpackBlockPosition);
      }
    }
  };

  handleBackpackDrop = (block) => {
    if (block.type === "arduino_functions") {
      const workspace = Blockly.getMainWorkspace();
      this.validateArduinoFunctionBlock(workspace, block);
    }
  };

  // Aktualisiere die Backpack-UI
  updateBackpackUI = () => {
    if (!this.backpack) return;

    try {
      const backpackElement = document.querySelector(".blocklyBackpack");
      if (backpackElement) {
        backpackElement.setAttribute("title", Blockly.Msg["EMPTY_BACKPACK"]);
      }

      if (this.backpack) {
        this.backpack.options.contextMenu = {
          emptyBackpack: true,
          removeFromBackpack: true,
          copyToBackpack: true,
          copyAllToBackpack: true,
          pasteAllToBackpack: true,
          disablePreconditionChecks: false,
        };
      }

      if (process.env.NODE_ENV === "development") {
        console.log("Backpack UI updated");
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error updating Backpack UI:", error);
      }
    }
  };

  // Initialisiere den Backpack
  initializeBackpack = (workspace) => {
    if (this.backpackInitialized) {
      if (process.env.NODE_ENV === "development") {
        console.log("Backpack already initialized, updating translations only");
      }
      this.updateBackpackUI();
      return;
    }

    const backpackOptions = {
      allowEmptyBackpackOpen: true,
      useFilledBackpackImage: true,
      skipSerializerRegistration: false,
      contextMenu: {
        emptyBackpack: true,
        removeFromBackpack: true,
        copyToBackpack: true,
        copyAllToBackpack: true,
        pasteAllToBackpack: true,
        disablePreconditionChecks: false,
      },
    };

    this.backpack = new Backpack(workspace, backpackOptions);

    this.backpack.onDragStart = (block) => {
      if (block.type === "arduino_functions") {
        return false;
      }
      return true;
    };

    const originalCopyToBackpack = this.backpack.copyToBackpack;
    this.backpack.copyToBackpack = (block) => {
      if (block.type === "arduino_functions") {
        return;
      }
      return originalCopyToBackpack.call(this.backpack, block);
    };

    const originalCopyAllToBackpack = this.backpack.copyAllToBackpack;
    this.backpack.copyAllToBackpack = (blocks) => {
      const filteredBlocks = blocks.filter(
        (block) => block.type !== "arduino_functions",
      );
      return originalCopyAllToBackpack.call(this.backpack, filteredBlocks);
    };

    const originalPasteAllFromBackpack = this.backpack.pasteAllFromBackpack;
    this.backpack.pasteAllFromBackpack = (blocks) => {
      const filteredBlocks = blocks.filter(
        (block) => block.type !== "arduino_functions",
      );
      return originalPasteAllFromBackpack.call(this.backpack, filteredBlocks);
    };

    this.backpack.init();
    this.backpackInitialized = true;
    if (process.env.NODE_ENV === "development") {
      console.log("Backpack initialized");
    }

    this.updateBackpackUI();
  };

  componentDidMount() {
    const workspace = Blockly.getMainWorkspace();
    this.props.onChangeWorkspace({});
    this.props.clearStats();

    workspace.addChangeListener(Blockly.Events.disableOrphans);

    workspace.addChangeListener((event) => {
      this.props.onChangeWorkspace(event);

      try {
        if (
          event.type === Blockly.Events.BLOCK_CREATE ||
          event.type === Blockly.Events.BLOCK_PASTE ||
          event.type === Blockly.Events.BACKPACK_DRAG
        ) {
          const allBlocks = workspace.getAllBlocks();
          const arduinoFunctionBlocks = allBlocks.filter(
            (block) => block.type === "arduino_functions",
          );

          if (arduinoFunctionBlocks.length > 1) {
            const firstBlock = arduinoFunctionBlocks[0];
            const position = firstBlock.getRelativeToSurfaceXY();

            arduinoFunctionBlocks.slice(1).forEach((block) => {
              block.dispose();
            });

            firstBlock.moveTo(position);
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error validating blocks:", error);
        }
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
