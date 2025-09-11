import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import * as Blockly from "blockly/core";
import "./blocks/index";
import "@/components/Blockly/generator/arduino/index";

import Toolbox from "./toolbox/Toolbox";
import { reservedWords } from "./helpers/reservedWords";
import Snackbar from "../Snackbar";

import "blockly/blocks";
import "@blockly/toolbox-search"; // auto-registers
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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "info",
    key: 0,
  });

  // Inject Blockly once on mount
  useEffect(() => {
    const ws = Blockly.inject(blocklyDivRef.current, {
      toolbox: toolboxRef.current,
      plugins: {
        blockDragger: ScrollBlockDragger,
        metricsManager: ScrollMetricsManager,
      },
      ...rest,
    });

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

    // Load initial XML
    if (initialXml) {
      Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(initialXml), ws);
    }

    // Cleanup on unmount
    return () => {
      if (ws && validateVar) ws.removeChangeListener(validateVar);
      // dispose workspace (plugins tied to workspace are disposed automatically)
      ws?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Card ref={blocklyDivRef} id="blocklyDiv" style={style ? style : {}} />
      <Toolbox toolbox={toolboxRef} workspace={workspace} />
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
