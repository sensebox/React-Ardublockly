import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onChangeWorkspace, clearStats } from "../../actions/workspaceActions";

import BlocklyComponent from "./BlocklyComponent";
import BlocklySvg from "./BlocklySvg";

import * as Blockly from "blockly/core";
import "./blocks/index";
import "./generator/index";
import { ZoomToFitControl } from "@blockly/zoom-to-fit";
import { initialXml as defaultXml } from "./initialXml.js";
import { getMaxInstances } from "./helpers/maxInstances";
import { Backpack } from "@blockly/workspace-backpack";
import Snackbar from "../Snackbar";

export default function BlocklyWindow({
  svg = false,
  blockDisabled = false,
  blocklyCSS,
  initialXml = defaultXml,
  readOnly = false,
  trashcan = true,
  zoomControls = true,
  grid = true,
  move = true,
}) {
  const dispatch = useDispatch();
  const renderer = useSelector((s) => s.general.renderer);
  const sounds = useSelector((s) => s.general.sounds);
  const language = useSelector((s) => s.general.language);
  const selectedBoard = useSelector((s) => s.board.board);

  const workspaceRef = useRef(null);
  const backpackRef = useRef(null);
  const prevBoardRef = useRef(selectedBoard);
  const prevXmlRef = useRef(initialXml);
  const prevLangRef = useRef(language);

  // snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackInfo, setSnackInfo] = useState({
    type: "success",
    key: 0,
    message: "",
  });

  // On mount: set up workspace, listeners, plugins
  useEffect(() => {
    const ws = Blockly.getMainWorkspace();
    workspaceRef.current = ws;

    dispatch(onChangeWorkspace({}));
    dispatch(clearStats());

    ws.addChangeListener(Blockly.Events.disableOrphans);
    ws.addChangeListener((evt) => {
      dispatch(onChangeWorkspace(evt));
      if (blockDisabled) {
        Blockly.Events.disableOrphans(evt);
      }
    });

    Blockly.svgResize(ws);
    new ZoomToFitControl(ws).init();
    const backpack = new Backpack(ws);
    backpack.init();
    backpack.onDrop = (block) => {
      backpack.addBlock(block);
      setSnackInfo({
        type: "success",
        key: Date.now(),
        message: "Block dropped in Backpack",
      });
      setSnackbarOpen(true);
    };

    return () => {
      ws.dispose();
      workspaceRef.current = null;
    };
  }, []);

  // On selectedBoard, initialXml, or language change: reload workspace XML
  useEffect(() => {
    const ws = workspaceRef.current;
    if (!ws) return;

    let xmlToLoad = initialXml;

    // Board changed?
    if (prevBoardRef.current !== selectedBoard) {
      xmlToLoad = localStorage.getItem("autoSaveXML") || defaultXml;
      const dom = Blockly.utils.xml.textToDom(xmlToLoad);
      Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, ws);
    }
    // initialXml prop changed (and not in SVG-render mode)
    else if (prevXmlRef.current !== initialXml && !svg) {
      ws.clear();
      const dom = Blockly.utils.xml.textToDom(initialXml || defaultXml);
      Blockly.Xml.domToWorkspace(dom, ws);
    }
    // Language changed?
    else if (prevLangRef.current !== language) {
      xmlToLoad = localStorage.getItem("autoSaveXML") || defaultXml;
      const dom = Blockly.utils.xml.textToDom(xmlToLoad);
      Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, ws);
    }

    Blockly.svgResize(ws);

    prevBoardRef.current = selectedBoard;
    prevXmlRef.current = initialXml;
    prevLangRef.current = language;
  }, [selectedBoard, initialXml, language, svg]);

  return (
    <div>
      <BlocklyComponent
        style={svg ? { height: 0 } : blocklyCSS}
        readOnly={readOnly}
        trashcan={trashcan}
        renderer={renderer}
        sounds={sounds}
        maxInstances={getMaxInstances()}
        zoom={{
          controls: zoomControls,
          wheel: false,
          startScale: 1,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
        }}
        grid={
          !grid
            ? {}
            : {
                spacing: 20,
                length: 1,
                colour: "#4EAF47",
                snap: false,
              }
        }
        move={!move ? {} : { scrollbars: true, drag: true, wheel: true }}
        initialXml={initialXml}
      />
      {svg && initialXml && <BlocklySvg initialXml={initialXml} />}

      <Snackbar
        open={snackbarOpen}
        message={snackInfo.message}
        type={snackInfo.type}
        key={snackInfo.key}
      />
    </div>
  );
}
