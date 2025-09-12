// src/components/BasicPage/BlocklyCard.jsx
import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import { onChangeWorkspace } from "@/actions/workspaceActions";
import { useDispatch } from "react-redux";
import { BasicTheme } from "@/components/Blockly/themes/basicTheme";
const getGeneratorByName = (name) => {
  if (!name) return Blockly.Basic;
  // bevorzugt den Pfad, den du schon nutzt:
  if (
    Blockly.Generator &&
    Blockly.Generator[name?.charAt(0).toUpperCase() + name.slice(1)]
  ) {
    return Blockly.Generator[name.charAt(0).toUpperCase() + name.slice(1)];
  }
  // alternativ: direkt auf Blockly[name]
  return Blockly[name] || Blockly.JavaScript;
};

const BlocklyCard = ({
  toolboxXml,
  initialXml,
  onWorkspaceChanged,
  blocklyCSS,
  themeMode = "light",
  generatorName = "javascript", // ⬅️ NEU
}) => {
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!containerRef.current) return;

    const theme =
      themeMode === "dark" ? Blockly.Themes.Dark : Blockly.Themes.Classic;

    // Toolbox normalisieren
    let toolboxConfig = toolboxXml;
    if (typeof toolboxXml === "string") {
      toolboxConfig = new DOMParser().parseFromString(
        toolboxXml,
        "text/xml",
      ).documentElement;
    }

    const ws = Blockly.inject(containerRef.current, {
      toolbox: toolboxConfig,
      renderer: "Thrasos",
      theme: BasicTheme,
      trashcan: true,
      collapse: true,
      zoom: {
        wheel: true,
        startScale: 1,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.1,
        pinch: true,
      },
      grid: { spacing: 20, length: 3, colour: "#ddd", snap: true },
      move: { scrollbars: false, drag: true, wheel: true },
      sounds: false,
    });

    // Initial XML
    if (initialXml) {
      try {
        const xml = Blockly.Xml.textToDom(initialXml);
        Blockly.Xml.domToWorkspace(xml, ws);
      } catch {}
    }

    const generator = getGeneratorByName(generatorName);
    const fire = () => {
      const code =
        generator && generator.workspaceToCode
          ? generator.workspaceToCode(ws)
          : "";
      onWorkspaceChanged && onWorkspaceChanged(ws, code);
    };

    ws.addChangeListener(fire);
    ws.addChangeListener((event) => {
      dispatch(onChangeWorkspace(event));
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
        width: "100%",
        height: "100%",
        ...blocklyCSS,
      }}
    />
  );
};

export default BlocklyCard;
