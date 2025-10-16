import React, { useEffect, useRef } from "react";
import "@blockly/block-plus-minus";
import { TypedVariableModal } from "@blockly/plugin-typed-variable-modal";
import * as Blockly from "blockly/core";
import { useSelector } from "react-redux";
import { ToolboxMcu } from "./ToolboxMcu";
import { ToolboxEsp } from "./ToolboxEsp";
import { useEmbeddedToolbox } from "./useEmbeddedToolbox";
import "./toolbox_styles.css";

const Toolbox = ({ workspace, toolbox }) => {
  const selectedBoard = useSelector((state) => state.board.board);
  const language = useSelector((state) => state.general.language);
  const isEmbedded = useSelector((state) => state.general.embeddedMode);
  const previousBoard = useRef(null);

  // Register typed variable flyout on board change or mount
  useEffect(() => {
    if (!workspace || !toolbox?.current) return;

    // Check if workspace is still valid (not disposed)
    if (workspace.isDisposed && workspace.isDisposed()) {
      return;
    }

    // Register callback
    workspace.registerToolboxCategoryCallback(
      "CREATE_TYPED_VARIABLE",
      createFlyout,
    );

    // Init modal
    const typedVarModal = new TypedVariableModal(workspace, "callbackName", [
      [Blockly.Msg.variable_NUMBER, "int"],
      [Blockly.Msg.variable_LONG, "long"],
      [Blockly.Msg.variable_DECIMAL, "float"],
      [Blockly.Msg.variables_TEXT, "String"],
      [Blockly.Msg.variables_CHARACTER, "char"],
      [Blockly.Msg.variables_BOOLEAN, "boolean"],
      [Blockly.Msg.variable_BITMAP, "bitmap"],
    ]);
    typedVarModal.init();

    // Log board change
    if (previousBoard.current !== selectedBoard) {
      previousBoard.current = selectedBoard;
    }
    if (workspace.toolbox) {
      workspace.updateToolbox(toolbox.current);
    }

  }, [workspace, toolbox, selectedBoard, language]);

  useEmbeddedToolbox(workspace, isEmbedded);

  return (
    <xml
      xmlns="https://developers.google.com/blockly/xml"
      id="blockly"
      style={{ display: "none" }}
      ref={toolbox}
      className={isEmbedded ? "embedded-mode" : ""}
    >
      {selectedBoard === "MCU" || selectedBoard === "MCU:mini" ? (
        <ToolboxMcu />
      ) : (
        <ToolboxEsp />
      )}
    </xml>
  );
};

// --- Static helper for flyout ---
const createFlyout = (workspace) => {
  let xmlList = [];

  const button = document.createElement("button");
  button.setAttribute("text", Blockly.Msg.button_createVariable);
  button.setAttribute("callbackKey", "callbackName");

  xmlList.push(button);

  const blockList = Blockly.VariablesDynamic.flyoutCategoryBlocks(workspace);
  return xmlList.concat(blockList);
};

export default Toolbox;
