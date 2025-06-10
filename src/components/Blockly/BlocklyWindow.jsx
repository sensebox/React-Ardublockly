import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { onChangeWorkspace, clearStats } from "../../actions/workspaceActions";
import "../../components/Workspace/BackpackAnimation.css";
import { Alert, Snackbar } from "@mui/material";

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
    this.backpackBlockPosition = null;
    this.allowNewArduinoFunction = true;
    this.backpack = null;
    this.backpackInitialized = false;
    this.state = {
      alertOpen: false,
      alertMessage: "",
      alertSeverity: "success",
    };
  }

  handleAlertClose = () => {
    this.setState({ alertOpen: false });
  };

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

  monitorBackpackChanges = () => {
    let previousContent = this.backpack.getContents().length;

    Blockly.getMainWorkspace().addChangeListener(() => {
      const currentContent = this.backpack.getContents().length;

      if (currentContent > previousContent) {
        this.setState({
          alertOpen: true,
          alertMessage: Blockly.Msg.COPY_TO_BACKPACK,
          alertSeverity: "success",
        });

        if (this.backpackImg) {
          this.backpackImg.classList.remove("rucksack-wiggle-once");
          void this.backpackImg.offsetWidth;
          this.backpackImg.classList.add("rucksack-wiggle-once");
        }
      } else if (currentContent < previousContent) {
        this.setState({
          alertOpen: true,
          alertMessage: Blockly.Msg.REMOVE_FROM_BACKPACK,
          alertSeverity: "info",
        });
      }

      previousContent = currentContent;
    });
  };

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

  initializeBackpack = (workspace) => {
    if (this.backpackInitialized) {
      if (process.env.NODE_ENV === "development") {
        console.log("Backpack already initialized, updating translations only");
      }
      this.updateBackpackUI();
      return;
    }
    // if (this.backpackImg) {
    //   this.backpackImg.classList.remove("rucksack-wiggle-once");
    //   void this.backpackImg.offsetWidth;
    //   this.backpackImg.classList.add("rucksack-wiggle-once");
    // }

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
        this.setState({
          alertOpen: true,
          alertMessage: Blockly.Msg.ARDUINO_FUNCTION_BLOCK_WARNING,
          alertSeverity: "warning",
        });
        return false;
      }
      return true;
    };

    this.backpack.onDrop = (block) => {
      if (block) {
        this.backpack.addBlock(block);
        this.setState({
          alertOpen: true,
          alertMessage: Blockly.Msg.COPY_TO_BACKPACK,
          alertSeverity: "success",
        });

        if (this.backpackImg) {
          this.backpackImg.classList.remove("rucksack-wiggle-once");
          void this.backpackImg.offsetWidth;
          this.backpackImg.classList.add("rucksack-wiggle-once");
        }
      }
    };

    this.backpack.onRemove = (block) => {
      if (block) {
        this.backpack.removeBlock(block);
        this.setState({
          alertOpen: true,
          alertMessage: Blockly.Msg.REMOVE_FROM_BACKPACK,
          alertSeverity: "info",
        });
      }
    };

    this.backpack.onEmpty = () => {
      this.backpack.empty();
      this.setState({
        alertOpen: true,
        alertMessage: Blockly.Msg.EMPTY_BACKPACK,
        alertSeverity: "info",
      });
    };

    const originalCopyToBackpack = this.backpack.copyToBackpack;
    this.backpack.copyToBackpack = (block) => {
      if (block.type === "arduino_functions") {
        this.setState({
          alertOpen: true,
          alertMessage: Blockly.Msg.ARDUINO_FUNCTION_BLOCK_WARNING,
          alertSeverity: "warning",
        });

        return;
      }
      const result = originalCopyToBackpack.call(this.backpack, block);
      if (result) {
        this.backpack.addBlock(block);
        this.setState({
          alertOpen: true,
          alertMessage: Blockly.Msg.COPY_TO_BACKPACK,
          alertSeverity: "success",
        });
      }
      return result;
    };

    const originalCopyAllToBackpack = this.backpack.copyAllToBackpack;
    this.backpack.copyAllToBackpack = (blocks) => {
      const filteredBlocks = blocks.filter(
        (block) => block.type !== "arduino_functions",
      );
      if (filteredBlocks.length < blocks.length) {
        this.setState({
          alertOpen: true,
          alertMessage: Blockly.Msg.ARDUINO_FUNCTION_BLOCKS_SKIPPED,
          alertSeverity: "warning",
        });
      }
      const result = originalCopyAllToBackpack.call(
        this.backpack,
        filteredBlocks,
      );
      if (result && filteredBlocks.length > 0) {
        this.backpack.addBlocks(filteredBlocks);
        this.setState({
          alertOpen: true,
          alertMessage: Blockly.Msg.BLOCKS_ADDED_TO_BACKPACK.replace(
            "%1",
            filteredBlocks.length,
          ),
          alertSeverity: "success",
        });
      }
      return result;
    };

    const originalPasteAllFromBackpack = this.backpack.pasteAllFromBackpack;
    this.backpack.pasteAllFromBackpack = (blocks) => {
      const filteredBlocks = blocks.filter(
        (block) => block.type !== "arduino_functions",
      );
      const result = originalPasteAllFromBackpack.call(
        this.backpack,
        filteredBlocks,
      );
      if (result && filteredBlocks.length > 0) {
        this.setState({
          alertOpen: true,
          alertMessage: Blockly.Msg.BLOCKS_PASTED_FROM_BACKPACK.replace(
            "%1",
            filteredBlocks.length,
          ),
          alertSeverity: "success",
        });
      }
      return result;
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

    this.initializeBackpack(workspace);
    this.monitorBackpackChanges();
  }

  componentWillUnmount() {
    if (this.backpack) {
      this.backpack.dispose();
      this.backpackInitialized = false;
    }
  }

  componentDidUpdate(prevProps) {
    const workspace = Blockly.getMainWorkspace();
    let xml = this.props.initialXml;
    if (prevProps.selectedBoard !== this.props.selectedBoard) {
      xml = localStorage.getItem("autoSaveXML") || initialXml;
      if (!xml) xml = initialXml;
      var xmlDom = Blockly.utils.xml.textToDom(xml);
      Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, workspace);
    }

    if (prevProps.initialXml !== this.props.initialXml && !this.props.svg) {
      workspace.clear();
      xml = this.props.initialXml || initialXml;
      Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(xml), workspace);
    }

    if (prevProps.language !== this.props.language) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "Language changed from",
          prevProps.language,
          "to",
          this.props.language,
        );
      }

      this.updateBackpackUI();

      xml = localStorage.getItem("autoSaveXML") || initialXml;
      if (!xml) xml = initialXml;
      xmlDom = Blockly.utils.xml.textToDom(xml);
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

        <Snackbar
          open={this.state.alertOpen}
          autoHideDuration={3000}
          onClose={this.handleAlertClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={this.handleAlertClose}
            severity={this.state.alertSeverity}
            sx={{ width: "100%" }}
          >
            {this.state.alertMessage}
          </Alert>
        </Snackbar>
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
