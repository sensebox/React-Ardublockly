import React, { useEffect, useRef } from "react";
import "@blockly/block-plus-minus";
import { TypedVariableModal } from "@blockly/plugin-typed-variable-modal";
import * as Blockly from "blockly/core";
import { useSelector } from "react-redux";
import { ToolboxMcu } from "./ToolboxMcu";
import { ToolboxEsp } from "./ToolboxEsp";
import "./horizontal_toolbox_styles.css";
import { registerBlocklyContextMenu } from "../helpers/blocklyContextMenu";

const HorizontalToolbox = ({ workspace, toolbox }) => {
  const selectedBoard = useSelector((state) => state.board.board);
  const language = useSelector((state) => state.general.language);
  const previousBoard = useRef(null);
  const previousLanguage = useRef(null);
  const isInitialMount = useRef(true);

  // Register typed variable flyout on board change or mount
  useEffect(() => {
    if (!workspace || !toolbox?.current) return;

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

    // Update toolbox only when board or language actually changes, not on initial mount
    const boardChanged = previousBoard.current !== null && previousBoard.current !== selectedBoard;
    const languageChanged = previousLanguage.current !== null && previousLanguage.current !== language;
    
    if (!isInitialMount.current && (boardChanged || languageChanged) && workspace.toolbox) {
      workspace.updateToolbox(toolbox.current);
    }
    
    previousBoard.current = selectedBoard;
    previousLanguage.current = language;
    isInitialMount.current = false;
  }, [workspace, toolbox, selectedBoard, language]);

  return (
    <xml
      xmlns="https://developers.google.com/blockly/xml"
      id="blockly"
      style={{ display: "none" }}
      ref={toolbox}
      className="embedded-mode"
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

export default HorizontalToolbox;
