// src/components/BasicPage/BlocklyCard.jsx
import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import { onChangeCode, onChangeWorkspace } from "@/actions/workspaceActions";
import { useDispatch } from "react-redux";
import { toolboxBasicObject } from "@/components/Blockly/toolbox/ToolboxBasic";
import { ScrollBlockDragger } from "@blockly/plugin-scroll-options";
import { registerContinuousToolbox } from "@blockly/continuous-toolbox";

// Track if continuous toolbox has been registered (use window to persist across HMR)
if (typeof window !== "undefined" && !window.__continuousToolboxRegistered) {
  registerContinuousToolbox();
  window.__continuousToolboxRegistered = true;
}

const BlocklyCard = ({
  toolboxXml,
  initialXml,
  onWorkspaceChanged,
  blocklyCSS,
  themeMode = "light",
  generatorName = "Basic",
  useContinuousToolbox = true,
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

    // Build plugins config based on whether continuous toolbox is used
    const plugins = useContinuousToolbox
      ? {
          blockDragger: ScrollBlockDragger,
          toolbox: "ContinuousToolbox",
          flyoutsVerticalToolbox: "ContinuousFlyout",
          metricsManager: "ContinuousMetrics",
        }
      : {
          blockDragger: ScrollBlockDragger,
        };

    const ws = Blockly.inject(containerRef.current, {
      toolbox: toolboxBasicObject,
      renderer: "Thrasos",
      theme: "light",
      trashcan: true,
      collapse: true,
      zoom: {
        controls: true,
        wheel: false,
        startScale: 0.8,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.1,
        pinch: true,
      },
      plugins,
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
  }, [
    toolboxXml,
    themeMode,
    initialXml,
    onWorkspaceChanged,
    generatorName,
    useContinuousToolbox,
  ]);

  return (
    <div
      ref={containerRef}
      className={useContinuousToolbox ? "blockly-continuous-toolbox" : ""}
      style={{
        width: "100%",
        height: "100%",
        ...blocklyCSS,
      }}
    />
  );
};

export default BlocklyCard;
