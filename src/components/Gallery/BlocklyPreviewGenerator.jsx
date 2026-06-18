import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import * as Blockly from "blockly/core";
import "@/components/Blockly/blocks/index";
import "@/components/Blockly/generator/basic/index";
import "@/components/Blockly/generator/arduino/index";

/**
 * BlocklyPreviewGenerator
 * Erstellt ein SVG-Preview eines Blockly-Programms aus XML
 * Skaliert automatisch um in den Parent-Container zu passen (zoom to fit)
 *
 * @param {string} xml - Blockly XML String
 * @param {string} title - Titel des Projekts (wird bei Fehler angezeigt)
 * @param {function} onSvgGenerated - Callback mit dem generierten SVG (optional)
 * @param {number} maxWidth - Maximale Breite des Containers (optional)
 * @param {number} maxHeight - Maximale Höhe des Containers (optional)
 * @returns {React.ReactElement}
 */
const BlocklyPreviewGenerator = ({
  xml,
  title,
  onSvgGenerated,
  maxWidth = 400,
  maxHeight = 300,
}) => {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!xml) {
      setError("XML string is required");
      return;
    }

    try {
      generatePreview();
    } catch (err) {
      console.error("Error generating preview:", err);
      setError(err.message);
    }
  }, [xml]);

  const generatePreview = () => {
    // Erstelle einen isolierten Blockly-Workspace ohne UI
    const container = document.createElement("div");
    container.style.display = "none";
    document.body.appendChild(container);

    try {
      // Injiziere Blockly in den unsichtbaren Container
      const workspace = Blockly.inject(container, {
        media: "/media/blockly/",
        renderer: "geras",
      });

      // Laden des XML mit Error-Handling
      let dom;
      try {
        dom = Blockly.utils.xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(dom, workspace);
      } catch (xmlError) {
        workspace.dispose();
        throw new Error("Ungültiges XML-Format");
      }

      // Hole den SVG Canvas
      const canvas = workspace.svgBlockCanvas_;
      if (!canvas) {
        throw new Error("Canvas nicht gefunden");
      }

      // Klone den Canvas und entferne Transform
      const clonedCanvas = canvas.cloneNode(true);
      clonedCanvas.removeAttribute("transform");

      // Sammle Blockly CSS-Styles
      let cssContent = "";
      const styles = document.getElementsByTagName("style");
      for (let i = 0; i < styles.length; i++) {
        if (/^blockly.*$/.test(styles[i].id)) {
          cssContent += styles[i].firstChild.data.replace(/\..* \./g, ".");
        }
      }

      // Zusätzliche CSS für korrektes Rendering
      cssContent += `
        .blocklyPath {
          fill-opacity: 1;
        }
        .blocklyPathDark {
          display: flex;
        }
        .blocklyPathLight {
          display: flex;
        }
        .blocklyText {
          font-family: sans-serif;
          font-size: 6pt;
        }
        .blocklyNonEditableText {
          font-family: sans-serif;
          font-size: 6pt;
        }
      `;

      const css = `<defs><style type="text/css" xmlns="http://www.w3.org/1999/xhtml"><![CDATA[${cssContent}]]></style></defs>`;

      // Berechne die genauen Bounds des Inhalts
      const tempSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      tempSvg.style.position = "absolute";
      tempSvg.style.left = "-9999px";
      tempSvg.appendChild(clonedCanvas.cloneNode(true));
      document.body.appendChild(tempSvg);

      const bbox = tempSvg.getBBox();
      document.body.removeChild(tempSvg);

      // Padding um die Blöcke
      const padding = 5;
      const finalX = bbox.x - padding;
      const finalY = bbox.y - padding;
      const finalWidth = bbox.width + padding * 2;
      const finalHeight = bbox.height + padding * 2;

      // Serialisiere den Canvas zu SVG
      const content = new XMLSerializer().serializeToString(clonedCanvas);

      // Erstelle das finale SVG - ohne feste Größe, responsive mit viewBox
      const svgString = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="${finalX} ${finalY} ${finalWidth} ${finalHeight}"
        preserveAspectRatio="xMidYMid meet"
        style="width: 100%; height: 100%;">
        ${css}
        ${content}
      </svg>`;

      setSvg(svgString);
      setError(null);

      // Callback mit generiertem SVG
      if (onSvgGenerated) {
        onSvgGenerated(svgString);
      }

      // Dispose Workspace
      workspace.dispose();
    } finally {
      document.body.removeChild(container);
    }
  };

  /**
   * Exportiert das SVG als PNG-Datei
   */
  const exportAsPng = async (filename = "blockly-preview.png") => {
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const img = new Image();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = filename;
      link.click();

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  /**
   * Exportiert das SVG als SVG-Datei
   */
  const exportAsSvg = (filename = "blockly-preview.svg") => {
    if (!svg) return;

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Gibt das SVG als Blob zurück (für API-Upload)
   */
  const getSvgBlob = () => {
    if (!svg) return null;
    return new Blob([svg], { type: "image/svg+xml" });
  };

  /**
   * Gibt das SVG als Data-URL zurück
   */
  const getSvgDataUrl = () => {
    if (!svg) return null;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    return URL.createObjectURL(blob);
  };

  // Exponiere Methoden über ref
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.exportAsPng = exportAsPng;
      containerRef.current.exportAsSvg = exportAsSvg;
      containerRef.current.getSvgBlob = getSvgBlob;
      containerRef.current.getSvgDataUrl = getSvgDataUrl;
    }
  }, [svg]);

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#666",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {title || "Projekt"}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        maxWidth: `${maxWidth}px`,
        maxHeight: `${maxHeight}px`,
        overflow: "hidden",
      }}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(svg) }}
    />
  );
};

BlocklyPreviewGenerator.propTypes = {
  xml: PropTypes.string.isRequired,
  title: PropTypes.string,
  onSvgGenerated: PropTypes.func,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number,
};

export default BlocklyPreviewGenerator;
