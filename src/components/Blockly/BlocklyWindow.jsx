import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import * as Blockly from "blockly/core";
import "./blocks/index";
import "@/components/Blockly/generator/index";

import { onChangeWorkspace, clearStats } from "../../actions/workspaceActions";
import { ZoomToFitControl } from "@blockly/zoom-to-fit";
import { Backpack } from "@blockly/workspace-backpack";
import { initialXml } from "./initialXml.js";
import { getMaxInstances } from "./helpers/maxInstances";
import {
  EMBEDDED_BLOCKLY_CONFIG,
  DEFAULT_BLOCKLY_CONFIG,
} from "../../config/embeddedConfig";

import BlocklySvg from "./BlocklySvg";

import "blockly/blocks";
import "@blockly/toolbox-search"; // auto-registers
import { BlocklyComponent } from "./BlocklyComponent";
import { registerBlocklyContextMenu } from "./helpers/blocklyContextMenu";

export default function BlocklyWindow(props) {
  const dispatch = useDispatch();
  const renderer = useSelector((state) => state.general.renderer);
  const sounds = useSelector((state) => state.general.sounds);
  const language = useSelector((state) => state.general.language);
  const selectedBoard = useSelector((state) => state.board.board);
  const isEmbedded = useSelector((state) => state.general.embeddedMode);

  const {
    svg,
    blockDisabled,
    blocklyCSS,
    initialXml: initialXmlProp,
    zoomControls,
    zoom,
    grid,
    move,
    readOnly,
    tutorial,
    onWorkspaceChanged,
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

    // 🔥 NEU: Listener für Workspace-Änderungen, die ein Speichern auslösen
    const onWorkspaceChangedListener = (event) => {
      // 🔥 Reagiere nur auf Events, die eine *beendete* Änderung anzeigen
      if (
        // Ziehen beendet
        // Block erstellt/gelöscht
        event.type === Blockly.Events.BLOCK_CREATE ||
        event.type === Blockly.Events.BLOCK_DELETE
      ) {
        // 🔥 Rufe das Callback auf
        if (onWorkspaceChanged) {
          // Kein setTimeout 0 nötig, da END_DRAG nur einmal am Ende kommt
          onWorkspaceChanged();
        }
      }
      // Alles andere (z.B. BLOCK_MOVE, SELECT, UI) wird ignoriert
    };
    ws.addChangeListener(onWorkspaceChangedListener);

    // UI helpers
    Blockly.svgResize(ws);

    if (isEmbedded) {
      registerBlocklyContextMenu();
    }

    if (!isEmbedded) {
      const zoomToFit = new ZoomToFitControl(ws);
      zoomToFit.init();
    }
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
  const zoomConfig = useMemo(() => {
    if (zoom !== undefined) return zoom;

    // Use embedded config for embedded mode, default config otherwise
    const baseConfig = isEmbedded
      ? EMBEDDED_BLOCKLY_CONFIG.zoom
      : DEFAULT_BLOCKLY_CONFIG.zoom;

    return {
      ...baseConfig,
      controls: zoomControls !== undefined ? zoomControls : baseConfig.controls,
    };
  }, [zoom, zoomControls, isEmbedded]);

  const gridConfig = useMemo(() => {
    if (grid === undefined || grid === false) return {};

    if (typeof grid === "object") return grid;

    return isEmbedded
      ? EMBEDDED_BLOCKLY_CONFIG.grid
      : DEFAULT_BLOCKLY_CONFIG.grid;
  }, [grid, isEmbedded]);

  const moveConfig = useMemo(() => {
    if (move === undefined || move === false) return {};

    if (typeof move === "object") return move;

    return isEmbedded
      ? EMBEDDED_BLOCKLY_CONFIG.move
      : DEFAULT_BLOCKLY_CONFIG.move;
  }, [move, isEmbedded]);

  const containerStyles = isEmbedded
    ? {
        height: "100%",
        width: "100%",
      }
    : {};

  return (
    <div
      style={
        tutorial
          ? {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }
          : { containerStyles }
      }
    >
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
  zoom: PropTypes.object,
  grid: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  move: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  readOnly: PropTypes.bool,
};
