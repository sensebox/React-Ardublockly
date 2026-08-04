// src/components/BasicPage/BlocklyCard.jsx
import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import "blockly/blocks";
import { onChangeWorkspace } from "@/actions/workspaceActions";
import { useDispatch } from "react-redux";
import { toolboxBasicObject } from "@/components/Blockly/toolbox/ToolboxBasic";

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
        controls: true,
        wheel: false,
        startScale: 1.2,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.1,
        pinch: true,
      },
      move: { scrollbars: true, drag: true, wheel: true },
      sounds: false,
    });

    // Startblock erzeugen
    const startBlock = ws.newBlock("sensebox_start"); // <-- dein Blocktyp
    startBlock.initSvg();
    startBlock.render();

    startBlock.moveBy(400, 100);

    // Optional: Block fixieren (nicht löschbar)
    startBlock.setDeletable(false);
    startBlock.setMovable(false);
    // Initial XML
    if (initialXml) {
      try {
        const xmlDom = Blockly.utils.xml.textToDom(initialXml);
        Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, ws);
        ws.setScale(1.2);
        ws.scrollCenter();
      } catch {}
    }
    const generator = Blockly.Generator.Basic;

    const fire = () => {
      onWorkspaceChanged && onWorkspaceChanged(ws, code);
    };
    ws.addChangeListener(fire);
    ws.addChangeListener((event) => {
      dispatch(onChangeWorkspace(event));
    });

    // Wenn eine neue Variable erstellt wird, automatisch den
    // "Vor dem Start"-Block anlegen (falls noch nicht vorhanden) und dort
    // einen "setze Variable"-Block mit der neuen Variable einfügen.
    ws.addChangeListener((event) => {
      if (event.type !== Blockly.Events.VAR_CREATE) return;

      // Nur reagieren, wenn die Variable im aktuellen Workspace angelegt wurde.
      if (event.workspaceId && event.workspaceId !== ws.id) return;

      // Beim Laden eines gespeicherten Projekts werden alle Variablen in einer
      // Event-Gruppe erzeugt. Diese sollen NICHT automatisch Set-Blöcke
      // bekommen – nur die tatsächlich vom Benutzer neu erstellte Variable.
      if (Blockly.Events.getGroup()) return;

      // Kein zweiter Set-Block, falls für die Variable bereits einer existiert.
      const alreadyHasSetBlock = ws
        .getBlocksByType("variables_set", false)
        .some((b) => b.getFieldValue("VAR") === event.varId);
      if (alreadyHasSetBlock) return;

      Blockly.Events.setGroup(true);
      try {
        // Vorhandenen Setup-Block finden oder neuen erstellen
        let setupBlock = ws.getBlocksByType("basic_setup", false)[0];
        if (!setupBlock) {
          setupBlock = ws.newBlock("basic_setup");
          setupBlock.initSvg();
          setupBlock.render();

          // Setup-Block oberhalb des Startblocks platzieren
          const startBlock = ws.getBlocksByType("sensebox_start", false)[0];
          if (startBlock) {
            const startXY = startBlock.getRelativeToSurfaceXY();
            const setupXY = setupBlock.getRelativeToSurfaceXY();
            const setupHeight = setupBlock.getHeightWidth().height;
            setupBlock.moveBy(
              startXY.x - setupXY.x,
              startXY.y - setupXY.y - setupHeight - 40,
            );
          } else {
            setupBlock.moveBy(50, 100);
          }
        }

        // Set-Block mit XML erstellen, um die Variable korrekt zu setzen
        // Wichtig: Variable abrufen um den Namen (nicht die ID) zu bekommen
        const variable = ws.getVariableById(event.varId);
        if (!variable) return; // Variable sollte existieren

        const setBlockXml = Blockly.utils.xml.createElement("block");
        setBlockXml.setAttribute("type", "variables_set");

        // Field mit dem Variablennamen hinzufügen
        const fieldXml = Blockly.utils.xml.createElement("field");
        fieldXml.setAttribute("name", "VAR");
        fieldXml.appendChild(Blockly.utils.xml.createTextNode(variable.name));
        setBlockXml.appendChild(fieldXml);

        // Block aus XML erstellen
        const setBlock = Blockly.Xml.domToBlock(setBlockXml, ws);

        // An das Ende des DO-Statements des Setup-Blocks anhängen
        let lastConnection = setupBlock.getInput("DO").connection;
        let nextBlock = lastConnection.targetBlock();
        while (nextBlock) {
          const nextConn = nextBlock.nextConnection;
          if (!nextConn) break;
          lastConnection = nextConn;
          nextBlock = nextConn.targetBlock();
        }
        lastConnection.connect(setBlock.previousConnection);
      } finally {
        Blockly.Events.setGroup(false);
      }

      // Ansicht an alle Blöcke anpassen
      // ws.zoomToFit();
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
