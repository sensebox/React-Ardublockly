import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import * as Blockly from "blockly/core";
import "./blocks/index";
import "@/components/Blockly/generator/basic/index";
import "@/components/Blockly/generator/arduino/index";

import "@/components/Blockly/generator/index";

import { onChangeWorkspace, clearStats } from "../../actions/workspaceActions";
import { ZoomToFitControl } from "@blockly/zoom-to-fit";
import { Backpack } from "@blockly/workspace-backpack";
import { initialXml } from "./initialXml.js";
import { getMaxInstances } from "./helpers/maxInstances";

import Toolbox from "./toolbox/Toolbox";
import BlocklySvg from "./BlocklySvg";
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

// -------------------------------
// BlocklyWindow (Hooks)
// -------------------------------
export default function BlocklyWindow(props) {
  const dispatch = useDispatch();
  const renderer = useSelector((state) => state.general.renderer);
  const sounds = useSelector((state) => state.general.sounds);
  const language = useSelector((state) => state.general.language);
  const selectedBoard = useSelector((state) => state.board.board);

  const {
    svg,
    blockDisabled,
    blocklyCSS,
    initialXml: initialXmlProp,
    zoomControls,
    grid,
    move,
    readOnly,
  } = props;

  // One-time workspace setup
  useEffect(() => {
    const ws = Blockly.getMainWorkspace();
    if (!ws) return;

    dispatch(onChangeWorkspace({}));
    dispatch(clearStats());

    const orphanDisabler = Blockly.Events.disableOrphans;
    ws.addChangeListener(orphanDisabler);

    const onAnyChange = (event) => {
      dispatch(onChangeWorkspace(event));
      if (blockDisabled) {
        Blockly.Events.disableOrphans(event);
      }
    };
    ws.addChangeListener(onAnyChange);

    // UI helpers
    Blockly.svgResize(ws);
    const zoomToFit = new ZoomToFitControl(ws);
    zoomToFit.init();

    const backpack = new Backpack(ws);
    backpack.init();

    // Cleanup: remove listeners
    return () => {
      if (ws && onAnyChange) ws.removeChangeListener(onAnyChange);
      if (ws && orphanDisabler) ws.removeChangeListener(orphanDisabler);
      // zoomToFit/backpack are tied to workspace; disposed with ws
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle board change → reload XML (from localStorage or fallback)
  useEffect(() => {
    const ws = Blockly.getMainWorkspace();
    if (!ws) return;
    let xml = localStorage.getItem("autoSaveXML");
    if (!xml) xml = initialXml;
    try {
      const xmlDom = Blockly.utils.xml.textToDom(xml);
      Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, ws);
    } catch (e) {
      console.warn("Failed to load XML on board change:", e);
      ws.clear();
    }
    Blockly.svgResize(ws);
  }, [selectedBoard]);

  // Ensure current XML is rendered when initialXml changes and SVG mode is off
  useEffect(() => {
    if (svg) return; // in SVG mode, BlocklySvg übernimmt Render-Update
    const ws = Blockly.getMainWorkspace();
    if (!ws) return;
    const xml = initialXmlProp || initialXml;
    try {
      ws.clear();
      Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(xml), ws);
    } catch (e) {
      console.warn("Failed to apply initialXml:", e);
    }
    Blockly.svgResize(ws);
  }, [initialXmlProp, svg]);

  // Language change → rehydrate XML (preserve current or autosave)
  useEffect(() => {
    const ws = Blockly.getMainWorkspace();
    if (!ws) return;
    let xml = localStorage.getItem("autoSaveXML");
    if (!xml) xml = initialXml;
    try {
      const xmlDom = Blockly.utils.xml.textToDom(xml);
      Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, ws);
    } catch (e) {
      console.warn("Failed to reload on language change:", e);
      ws.clear();
    }
    Blockly.svgResize(ws);
  }, [language]);

  // Debounced window resize → svgResize
  useEffect(() => {
    const ws = Blockly.getMainWorkspace();
    if (!ws) return;
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => Blockly.svgResize(ws), 150);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Compute zoom/grid/move config with sensible defaults
  const zoomConfig = useMemo(
    () => ({
      controls: zoomControls !== undefined ? zoomControls : true,
      wheel: false,
      startScale: 1,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2,
    }),
    [zoomControls],
  );

  const gridConfig = useMemo(
    () =>
      grid !== undefined && !grid
        ? {}
        : {
            spacing: 20,
            length: 1,
            colour: "#4EAF47", // senseBox-green
            snap: false,
          },
    [grid],
  );

  const moveConfig = useMemo(
    () =>
      move !== undefined && !move
        ? {}
        : { scrollbars: true, drag: true, wheel: true },
    [move],
  );

  return (
    <div>
      <BlocklyComponent
        style={svg ? { height: 0 } : blocklyCSS}
        readOnly={readOnly !== undefined ? readOnly : false}
        renderer={renderer}
        sounds={sounds}
        maxInstances={getMaxInstances()}
        zoom={zoomConfig}
        grid={gridConfig}
        media={"/media/blockly/"}
        move={moveConfig}
        initialXml={initialXmlProp ? initialXmlProp : initialXml}
      />
      {svg && initialXmlProp ? (
        <BlocklySvg initialXml={initialXmlProp} />
      ) : null}
    </div>
  );
}

BlocklyWindow.propTypes = {
  svg: PropTypes.bool,
  blockDisabled: PropTypes.bool,
  blocklyCSS: PropTypes.object,
  initialXml: PropTypes.string,
  zoomControls: PropTypes.bool,
  grid: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  move: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  readOnly: PropTypes.bool,
};
