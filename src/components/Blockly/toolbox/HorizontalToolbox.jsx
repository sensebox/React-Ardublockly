import React, { useEffect, useRef } from "react";
import "@blockly/block-plus-minus";
import { TypedVariableModal } from "@blockly/plugin-typed-variable-modal";
import * as Blockly from "blockly/core";
import { useSelector } from "react-redux";
import { ToolboxMcu } from "./ToolboxMcu";
import { ToolboxEsp } from "./ToolboxEsp";
import { ToolboxEye } from "./ToolboxEye";
import "./horizontal_toolbox_styles.css";
import { registerBlocklyContextMenu } from "../helpers/blocklyContextMenu";
import { ToolboxEye } from "./ToolboxEye";
mbeddedToolbox.jsx;

const HorizontalToolbox = ({ workspace, toolbox }) => {
  const selectedBoard = useSelector((state) => state.board.board);
  const language = useSelector((state) => state.general.language);
  const aiModel = useSelector((state) => state.general.aiModel);
  const previousBoard = useRef(null);
  const previousLanguage = useRef(null);
  const previousAiModelCode = useRef(undefined);
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
    const boardChanged =
      previousBoard.current !== null && previousBoard.current !== selectedBoard;
    const languageChanged =
      previousLanguage.current !== null &&
      previousLanguage.current !== language;
    const aiModelChanged =
      previousAiModelCode.current !== undefined &&
      previousAiModelCode.current !== aiModel?.code;

    if (
      !isInitialMount.current &&
      (boardChanged || languageChanged || aiModelChanged) &&
      workspace.toolbox
    ) {
      workspace.updateToolbox(toolbox.current);
    }

    previousBoard.current = selectedBoard;
    previousLanguage.current = language;
    previousAiModelCode.current = aiModel?.code;
    isInitialMount.current = false;
  }, [workspace, toolbox, selectedBoard, language, aiModel?.code]);

  return React.createElement(
    "xml",
    {
      is: "blockly",
      xmlns: "https://developers.google.com/blockly/xml",
      id: "blockly",
      style: { display: "none" },
      ref: toolbox,
      class: "embedded-mode",
    },
    selectedBoard === "MCU" || selectedBoard === "MCU:mini" ? (
      <ToolboxMcu />
    ) : selectedBoard === "MCU-S2" ? (
      <ToolboxEsp />
    ) : (
      <ToolboxEye />
    ),
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
