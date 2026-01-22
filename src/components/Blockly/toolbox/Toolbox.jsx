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
  const setupIntervalRef = useRef(null);

  useEffect(() => {
    if (!workspace || !toolbox?.current) return;

    // --- Typed Variable Modal Setup ---
    workspace.registerToolboxCategoryCallback(
      "CREATE_TYPED_VARIABLE",
      createFlyout,
    );

    workspace.registerToolboxCategoryCallback(
      "CUSTOM_PROCEDURES",
      function (workspace) {
        const xmlList = [];

        const procedures = Blockly.Procedures.allProcedures(workspace)[0];

        for (const proc of procedures) {
          const block = document.createElement("block");
          block.setAttribute("type", "procedures_callnoreturn");

          const mutation = document.createElement("mutation");
          mutation.setAttribute("name", proc[0]);
          block.appendChild(mutation);

          xmlList.push(block);
        }

        return xmlList;
      },
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

    // --- Prevent flyout from closing when variable is created ---
    let variableCreatedRecently = false;
    let flyoutOriginalHide = null;

    // Listen for variable creation and prevent flyout closing
    const variableCreationListener = (event) => {
      if (event.type === Blockly.Events.VAR_CREATE) {
        variableCreatedRecently = true;
        setTimeout(() => {
          variableCreatedRecently = false;
        }, 1000);
      }
    };
    workspace.addChangeListener(variableCreationListener);

    const maxAttempts = 100; // 10 seconds max (100 * 100ms)
    let attempts = 0;
    
    const setupFlyoutOverride = () => {
      const flyout = workspace.toolbox_?.flyout_;
      if (flyout && !flyoutOriginalHide) {
        flyoutOriginalHide = flyout.hide.bind(flyout);
        flyout.hide = function() {
          if (variableCreatedRecently) return;
          flyoutOriginalHide();
        };
        if (setupIntervalRef.current) {
          clearInterval(setupIntervalRef.current);
          setupIntervalRef.current = null;
        }
        return true; // Success
      }
      return false; // Not ready yet
    };

    // Try immediately first
    if (!setupFlyoutOverride()) {
      // If not ready, poll with interval
      setupIntervalRef.current = setInterval(() => {
        attempts++;
        if (setupFlyoutOverride() || attempts >= maxAttempts) {
          if (setupIntervalRef.current) {
            clearInterval(setupIntervalRef.current);
            setupIntervalRef.current = null;
          }
          if (attempts >= maxAttempts) {
            console.warn('Failed to setup flyout override: timeout after 10 seconds');
          }
        }
      }, 100);
    }

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
        } catch (err) {
          console.warn("⚠️ toolbox-search konnte nicht geladen werden:", err);
        }
      } else if (++tries > 50) {
        clearInterval(waitForToolbox);
        console.warn("⌛ toolbox-search Init Timeout (Toolbox nie bereit)");
      }
    }, 1000);

    // --- Cleanup ---
    return () => {
      // Clear intervals only if they're still active
      if (setupIntervalRef.current) {
        clearInterval(setupIntervalRef.current);
        setupIntervalRef.current = null;
      }
      clearInterval(waitForToolbox);
      workspace.removeChangeListener(variableCreationListener);
      // Restore original flyout hide method if override was applied
      const flyout = workspace.toolbox_?.flyout_;
      if (flyout && flyoutOriginalHide) {
        flyout.hide = flyoutOriginalHide;
      }
    };
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
