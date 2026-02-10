// src/components/BasicPage/BlocklyCard.jsx
import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import { onChangeCode, onChangeWorkspace } from "@/actions/workspaceActions";
import { useDispatch } from "react-redux";
import { toolboxBasicObject } from "@/components/Blockly/toolbox/ToolboxBasic";
import { ScrollBlockDragger } from "@blockly/plugin-scroll-options";

const BlocklyCard = ({
  toolboxXml,
  initialXml,
  onWorkspaceChanged,
  blocklyCSS,
  themeMode = "light",
  generatorName = "Basic",
}) => {
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!containerRef.current) return;

    // Toolbox normalisieren
    let toolboxConfig = toolboxXml;
    if (typeof toolboxXml === "string") {
      toolboxConfig = new DOMParser().parseFromString(
        toolboxXml,
        "text/xml",
      ).documentElement;
    }

    const ws = Blockly.inject(containerRef.current, {
      toolbox: toolboxBasicObject,
      renderer: "Thrasos",
      theme: "light",
      trashcan: true,
      collapse: true,
      zoom: {
        wheel: false,
        startScale: 1,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.1,
        pinch: true,
      },
      plugins: {
        blockDragger: ScrollBlockDragger,
      },
      move: { scrollbars: true, drag: true, wheel: true },
      sounds: false,
    });

    // Startblock erzeugen
    const startBlock = ws.newBlock("sensebox_start"); // <-- dein Blocktyp
    startBlock.initSvg();
    startBlock.render();

    startBlock.moveBy(50, 100);

    // Optional: Block fixieren (nicht löschbar)
    startBlock.setDeletable(false);
    startBlock.setMovable(false);
    // Initial XML
    if (initialXml) {
      try {
        const xml = Blockly.Xml.textToDom(initialXml);
        Blockly.Xml.domToWorkspace(xml, ws);
      } catch {}
    }
    const generator = Blockly.Generator.Basic;

    const fire = () => {
      onWorkspaceChanged && onWorkspaceChanged(ws, code);
    };
    ws.addChangeListener(fire);
    ws.addChangeListener((event) => {
      dispatch(onChangeWorkspace(event));
      dispatch(onChangeCode());
    });
    const ro = new ResizeObserver(() => Blockly.svgResize(ws));
    ro.observe(containerRef.current);

    // initial feuern
    fire();

    return () => {
      try {
        ws.removeChangeListener(fire);
        ro.disconnect();
      } catch {}
      ws.dispose();
    };
  }, [toolboxXml, themeMode, initialXml, onWorkspaceChanged, generatorName]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "99%",
        height: "99%",
        ...blocklyCSS,
      }}
    />
  );
};

export default BlocklyCard;
