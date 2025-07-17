import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { onChangeWorkspace, clearStats } from "../../actions/workspaceActions";

import BlocklyComponent from "./BlocklyComponent";
import BlocklySvg from "./BlocklySvg";

import * as Blockly from "blockly/core";
import "./blocks/index";
import "./generator/index";
import { ZoomToFitControl } from "@blockly/zoom-to-fit";
import { initialXml } from "./initialXml.js";
import { getMaxInstances } from "./helpers/maxInstances";
import { Backpack } from "@blockly/workspace-backpack";
import Snackbar from "../Snackbar";

const BlocklyWindow = ({
  blockDisabled,
  readOnly = false,
  trashcan = true,
  zoomControls = true,
  grid: gridEnabled = true,
  move: moveEnabled = true,
  blocklyCSS,
  svg,
  initialXml: propsInitialXml,
}) => {
  const dispatch = useDispatch();
  const renderer = useSelector((state) => state.general.renderer);
  const sounds = useSelector((state) => state.general.sounds);
  const language = useSelector((state) => state.general.language);
  const selectedBoard = useSelector((state) => state.board.board);

  const simpleWorkspaceRef = useRef(null);
  const backpackRef = useRef(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackInfo, setSnackInfo] = useState({
    type: "success",
    message: "",
  });
  const onBackPackChange = (event) => {
    if (event.type !== "backpack_change") {
      return;
    }
    setSnackInfo({
      type: "success",
      message: "Backpack changed",
    });
    setSnackbarOpen(true);
  };
  // Mount: setup workspace, listeners, zoom & backpack
  useEffect(() => {
    const workspace = Blockly.getMainWorkspace();

    dispatch(onChangeWorkspace({}));
    dispatch(clearStats());

    // Disable orphan blocks on every change
    workspace.addChangeListener(Blockly.Events.disableOrphans);
    workspace.addChangeListener((event) => {
      dispatch(onChangeWorkspace(event));
      if (blockDisabled) {
        Blockly.Events.disableOrphans(event);
      }
    });

    // Resize & zoom-to-fit
    Blockly.svgResize(workspace);
    const zoomToFit = new ZoomToFitControl(workspace);
    zoomToFit.init();

    const backpack = new Backpack(workspace);
    backpack.init();
    workspace.addChangeListener(onBackPackChange);
  }, [dispatch, blockDisabled]);

  // Update on board, initialXml or language change
  useEffect(() => {
    const workspace = Blockly.getMainWorkspace();
    let xml = propsInitialXml;

    // Board gewechselt?
    if (selectedBoard) {
      const saved = localStorage.getItem("autoSaveXML");
      xml = saved || initialXml;
      const dom = Blockly.utils.xml.textToDom(xml);
      Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, workspace);
    }

    // Wenn wir nicht im SVG-Modus sind und initialXml sich geändert hat
    if (!svg && propsInitialXml) {
      workspace.clear();
      const dom = Blockly.utils.xml.textToDom(propsInitialXml);
      Blockly.Xml.domToWorkspace(dom, workspace);
    }

    // Sprache geändert?
    if (language) {
      const saved = localStorage.getItem("autoSaveXML");
      xml = saved || initialXml;
      const dom = Blockly.utils.xml.textToDom(xml);
      Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, workspace);
    }

    // Immer nach Update neu skalieren
    Blockly.svgResize(workspace);
  }, [selectedBoard, propsInitialXml, language, svg]);

  // Grid- und Move-Konfiguration
  const gridConfig = gridEnabled
    ? {
        spacing: 20,
        length: 1,
        colour: "#4EAF47",
        snap: false,
      }
    : {};
  const moveConfig = moveEnabled
    ? {
        scrollbars: true,
        drag: true,
        wheel: true,
      }
    : {};

  return (
    <div>
      <BlocklyComponent
        ref={simpleWorkspaceRef}
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
        grid={gridConfig}
        media="/media/blockly/"
        move={moveConfig}
        initialXml={propsInitialXml || initialXml}
      />
      {svg && propsInitialXml && <BlocklySvg initialXml={propsInitialXml} />}
      <Snackbar
        open={snackbarOpen}
        message={snackInfo.message}
        type={snackInfo.type}
        key={snackInfo.key}
      />
    </div>
  );
};

BlocklyWindow.propTypes = {
  blockDisabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  trashcan: PropTypes.bool,
  zoomControls: PropTypes.bool,
  grid: PropTypes.bool,
  move: PropTypes.bool,
  blocklyCSS: PropTypes.object,
  svg: PropTypes.bool,
  initialXml: PropTypes.string,
};

export default BlocklyWindow;
