import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import * as Blockly from "blockly/core";
import "./blocks/index";
import "@/components/Blockly/generator/arduino/index";
import "@/components/Blockly/generator/javascript/index";

import Toolbox from "./toolbox/Toolbox";
import { reservedWords } from "./helpers/reservedWords";
import Snackbar from "../Snackbar";

import "blockly/blocks";
import {
  ScrollOptions,
  ScrollBlockDragger,
  ScrollMetricsManager,
} from "@blockly/plugin-scroll-options";

import { Card } from "@mui/material";
import { addLog } from "@/reducers/logReducer";
import { connect } from "react-redux";

export function BlocklyComponent({
  initialXml,
  style,
  addLog,
  children,
  ...rest
}) {
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

    // Change listener for logging
    const onBlocklyChange = (event) => {
      const IGNORED_EVENTS = [
        Blockly.Events.VIEWPORT_CHANGE,
        Blockly.Events.FINISHED_LOADING,
        "click",
        "selected",
        Blockly.Events.TOOLBOX_ITEM_SELECT,
        Blockly.Events.MOVE,
        Blockly.Events.BLOCK_DRAG,
        "block_field_intermediate_change",
      ];

      if (IGNORED_EVENTS.includes(event.type)) return;

      let title = "";
      let description = "";

      switch (event.type) {
        case Blockly.Events.CREATE:
          if (event.json?.type === "arduino_functions") return;
          title = "Block erstellt";
          description = `Blocktyp: ${event.json?.type || "Unbekannt"}`;
          break;

        case Blockly.Events.DELETE:
          title = "Block gelöscht";
          description = `Blocktyp: ${event.oldJson?.type || "Unbekannt"}`;
          break;

        case Blockly.Events.CHANGE:
          title = "Block geändert";
          description = event.name
            ? `${event.name} geändert: Von "${event.oldValue}" zu "${event.newValue}"`
            : "Ein Wert wurde geändert.";
          break;

        case Blockly.Events.MOVE:
          title = "Block verschoben";
          description = `Block verschoben (ID: ${event.blockId})`;
          break;

        case Blockly.Events.BLOCK_CREATE:
          title = "Block erstellt (verschachtelt)";
          description = `Innerhalb eines Blocks erstellt: ${event.json?.type || "Unbekannt"}`;
          break;

        case Blockly.Events.BLOCK_DELETE:
          title = "Block gelöscht (verschachtelt)";
          description = `Innerhalb eines Blocks gelöscht: ${event.oldJson?.type || "Unbekannt"}`;
          break;

        case Blockly.Events.BLOCK_CHANGE:
          title = "Block geändert (verschachtelt)";
          description = `Innerhalb eines Blocks geändert: ${event.json?.type || "Unbekannt"}`;
          break;

        default:
          title = "Unbekanntes Event";
          description = `Ein unbekanntes Event wurde empfangen: ${event.type}`;
          break;
      }

      addLog({
        type: "blockly",
        title,
        description,
      });
    };

    ws.addChangeListener(onBlocklyChange);

    // Variable validation listener
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
            message: Blockly.Msg.messages_invalid_variable_name,
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
      ws?.removeChangeListener(onBlocklyChange);
      ws?.removeChangeListener(validateVar);
      ws?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialXml, addLog]);

  return (
    <>
      <Card ref={blocklyDivRef} id="blocklyDiv" style={style || {}} />
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
  addLog: PropTypes.func.isRequired,
  children: PropTypes.node,
};
