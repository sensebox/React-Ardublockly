import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import * as Blockly from "blockly/core";
import "./blocks/index";
import "@/components/Blockly/generator/index";

import Toolbox from "./toolbox/Toolbox";
import HorizontalToolbox from "./toolbox/HorizontalToolbox";
import { useHorizontalToolbox } from "./toolbox/useHorizontalToolbox";
import { reservedWords } from "./helpers/reservedWords";
import Snackbar from "../Snackbar";

import "blockly/blocks";
import {
  ScrollOptions,
  ScrollBlockDragger,
  ScrollMetricsManager,
} from "@blockly/plugin-scroll-options";

import { Card } from "@mui/material";

// -------------------------------
// BlocklyComponent (Hooks)
// -------------------------------
export function BlocklyComponent({ initialXml, style, ...rest }) {
  const blocklyDivRef = useRef(null);
  const toolboxRef = useRef(null);
  const [workspace, setWorkspace] = useState(undefined);
  const isEmbedded = useSelector((state) => state.general.embeddedMode);
  const { isHorizontalToolbox } = useHorizontalToolbox();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "info",
    key: 0,
  });

  // Inject Blockly once on mount
  useEffect(() => {
    const blocklyOptions = {
      toolbox: toolboxRef.current,
      plugins: {
        blockDragger: ScrollBlockDragger,
        metricsManager: ScrollMetricsManager,
      },
      ...rest,
    };

    // Only apply mobile layout options when in embedded mode
    // These must override any options from ...rest, so set them after
    if (isHorizontalToolbox) {
      blocklyOptions.horizontalLayout = true;
      blocklyOptions.toolboxPosition = 'end';
      // Ensure toolbox icon sprites and other assets load correctly in embedded view
      if (!blocklyOptions.media) {
        blocklyOptions.media = '/media/blockly/';
      }
    }

    const ws = Blockly.inject(blocklyDivRef.current, blocklyOptions);

    if (isEmbedded && ws.trashcan) {
      const originalGetClientRect = ws.trashcan.getClientRect.bind(ws.trashcan);
      const originalGetBoundingRectangle = ws.trashcan.getBoundingRectangle.bind(ws.trashcan);

      ws.trashcan.getClientRect = function() {
        const originalRect = originalGetClientRect();
        if (!originalRect) return null;

        return new Blockly.utils.Rect(
          originalRect.top - 80,
          originalRect.bottom + 80,
          originalRect.left - 80,
          originalRect.right + 80
        );
      };

      ws.trashcan.getBoundingRectangle = function() {
        const originalRect = originalGetBoundingRectangle();
        if (!originalRect) return null;

        return new Blockly.utils.Rect(
          originalRect.top - 80,
          originalRect.bottom + 80,
          originalRect.left - 80,
          originalRect.right + 80
        );
      };
    }

    setWorkspace(ws);

    // Variable rename/create validation
    const validateVar = (event) => {
      if (
        event.type === Blockly.Events.VAR_CREATE ||
        event.type === Blockly.Events.VAR_RENAME
      ) {
        const variable = ws.getVariableMap().getVariableById(event.varId);
        if (!variable) return;
        const newName = variable.name;
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(newName)) {
          setSnackbar({
            open: true,
            key: Date.now(),
            type: "error",
            message: `${Blockly.Msg.messages_invalid_variable_name}`,
          });
          ws.getVariableMap().deleteVariableById(event.varId);
        } else if (reservedWords.has(newName)) {
          setSnackbar({
            open: true,
            key: Date.now(),
            type: "error",
            message: `"${newName}" ${Blockly.Msg.messages_reserve_word}`,
          });
          ws.getVariableMap().deleteVariableById(event.varId);
        }
      }
    };
    ws.addChangeListener(validateVar);

    // ScrollOptions plugin
    const scrollPlugin = new ScrollOptions(ws);
    scrollPlugin.init({ enableWheelScroll: true, enableEdgeScroll: false });
    // 🔥 SAUBERE LÖSUNG: Nutze Promise.resolve().then, um nach der Initialisierung zu laden
    if (initialXml) {
      Promise.resolve().then(() => {
        try {
          const xmlDom = Blockly.utils.xml.textToDom(initialXml);
          Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, ws);
        } catch (e) {}
      });
    }

    // Cleanup on unmount
    return () => {
      if (ws && validateVar) ws.removeChangeListener(validateVar);
      // dispose workspace (plugins tied to workspace are disposed automatically)
      ws?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHorizontalToolbox]);

  const cardStyle = useMemo(() => {
    return isEmbedded ?{
      height: "100%",
      width: "100%",
    } : {};
  }, [isHorizontalToolbox]);

  return (
    <>
      <Card
        ref={blocklyDivRef}
        id="blocklyDiv"
        style={style ? style : cardStyle}
        className={isHorizontalToolbox ? "embedded-mode" : ""}
      />
      {isHorizontalToolbox ? (
        <HorizontalToolbox toolbox={toolboxRef} workspace={workspace} />
      ) : (
        <Toolbox toolbox={toolboxRef} workspace={workspace} />
      )}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        key={snackbar.key}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </>
  );
}

BlocklyComponent.propTypes = {
  initialXml: PropTypes.string,
  style: PropTypes.object,
};
