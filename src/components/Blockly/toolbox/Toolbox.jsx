import React, { useEffect, useRef } from "react";
import "@blockly/block-plus-minus";
import { TypedVariableModal } from "@blockly/plugin-typed-variable-modal";
import * as Blockly from "blockly/core";
import { useSelector } from "react-redux";
import { ToolboxMcu } from "./ToolboxMcu";
import { ToolboxEsp } from "./ToolboxEsp";
import "./toolbox_styles.css";

const Toolbox = ({ workspace, toolbox }) => {
  const selectedBoard = useSelector((state) => state.board.board);
  const language = useSelector((state) => state.general.language);
  const previousBoard = useRef(null);

  useEffect(() => {
    if (!workspace || !toolbox?.current) return;

    // --- Typed Variable Modal Setup ---
    workspace.registerToolboxCategoryCallback(
      "CREATE_TYPED_VARIABLE",
      createFlyout,
    );

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

    // --- Toolbox aktualisieren ---
    workspace.updateToolbox(toolbox.current);

    // --- Dynamisch das toolbox-search-Plugin laden, sobald alles bereit ist ---
    let tries = 0;
    const waitForToolbox = setInterval(async () => {
      const tb = workspace.toolbox_;
      if (tb && tb.getToolboxItems && tb.getToolboxItems().length > 0) {
        clearInterval(waitForToolbox);
        try {
          // Lazy Import -> wird erst hier geladen
          await import("@blockly/toolbox-search");
          tb.refreshSelection(); // "nudge" das Plugin
          console.log("🔍 toolbox-search Plugin erfolgreich initialisiert");
        } catch (err) {
          console.warn("⚠️ toolbox-search konnte nicht geladen werden:", err);
        }
      } else if (++tries > 50) {
        clearInterval(waitForToolbox);
        console.warn("⌛ toolbox-search Init Timeout (Toolbox nie bereit)");
      }
    }, 1000);

    // --- Cleanup ---
    return () => clearInterval(waitForToolbox);
  }, [workspace, toolbox, selectedBoard, language]);

  return (
    <xml
      xmlns="https://developers.google.com/blockly/xml"
      id="blockly"
      style={{ display: "none" }}
      ref={toolbox}
    >
      {selectedBoard === "MCU" || selectedBoard === "MCU:MINI" ? (
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
