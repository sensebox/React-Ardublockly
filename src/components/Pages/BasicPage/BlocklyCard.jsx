// src/components/BasicPage/BlocklyCard.jsx
import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import { onChangeCode, onChangeWorkspace } from "@/actions/workspaceActions";
import { useDispatch } from "react-redux";
import { BasicTheme } from "@/components/Blockly/themes/basicTheme";
import { toolboxBasicObject } from "@/components/Blockly/toolbox/ToolboxBasic";
import { ScrollBlockDragger } from "@blockly/plugin-scroll-options";
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
  generatorName = "Basic", // ⬅️ NEU
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
      toolbox: toolboxBasicObject,
      renderer: "Thrasos",
      theme: BasicTheme,
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

    // Optional: Block genau in die Mitte setzen
    // try {
    //   const metrics = ws.getMetrics();
    //   const targetX = metrics.viewLeft + metrics.viewWidth / 2;
    //   const targetY = metrics.viewTop + metrics.viewHeight / 2;
    //   const current = startBlock.getRelativeToSurfaceXY();
    //   startBlock.moveBy(
    //     targetX - (current?.x || 0),
    //     targetY - (current?.y || 0),
    //   );
    // } catch (e) {
    //   // fallback: leichte Verschiebung, falls Mitte nicht berechnet werden kann
    //   startBlock.moveBy(0, 50);
    // }

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
