import * as Blockly from "blockly/core";
import "@/components/Blockly/blocks/index";
import "@/components/Blockly/generator/basic/index";
import "@/components/Blockly/generator/arduino/index";

/**
 * Generiert asynchron ein SVG aus Blockly XML
 * Nützlich für Server-Side-Rendering oder API-Uploads
 *
 * @param {string} xml - Blockly XML String
 * @param {number} width - Optionale feste Breite (wenn nicht gesetzt: flexible Breite)
 * @param {number} height - Optionale feste Höhe (wenn nicht gesetzt: flexible Höhe)
 * @returns {Promise<string>} SVG String
 */
export const generateBlocklySvg = async (xml, width, height) => {
  return new Promise((resolve, reject) => {
    try {
      if (!xml) {
        reject(new Error("XML string is required"));
        return;
      }

      // Erstelle einen unsichtbaren Container
      const container = document.createElement("div");
      container.style.display = "none";
      document.body.appendChild(container);

      try {
        // Injiziere Blockly
        const workspace = Blockly.inject(container, {
          media: "/media/blockly/",
          renderer: "geras",
        });

        // Lade XML
        const dom = Blockly.utils.xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(dom, workspace);

        // Hole Canvas
        const canvas = workspace.svgBlockCanvas_;
        if (!canvas) {
          throw new Error("Canvas nicht gefunden");
        }

        const clonedCanvas = canvas.cloneNode(true);
        clonedCanvas.removeAttribute("transform");

        // Sammle CSS
        let cssContent = "";
        const styles = document.getElementsByTagName("style");
        for (let i = 0; i < styles.length; i++) {
          if (/^blockly.*$/.test(styles[i].id)) {
            cssContent += styles[i].firstChild.data.replace(/\..* \./g, ".");
          }
        }

        cssContent += `
          .blocklyPath { fill-opacity: 1; }
          .blocklyPathDark { display: flex; }
          .blocklyPathLight { display: flex; }
          .blocklyText { font-family: sans-serif; font-size: 6pt; }
          .blocklyNonEditableText { font-family: sans-serif; font-size: 6pt; }
        `;

        const css = `<defs><style type="text/css" xmlns="http://www.w3.org/1999/xhtml"><![CDATA[${cssContent}]]></style></defs>`;

        // Berechne Bounds
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

        const padding = 5;
        const finalX = bbox.x - padding;
        const finalY = bbox.y - padding;
        const finalWidth = bbox.width + padding * 2;
        const finalHeight = bbox.height + padding * 2;

        const content = new XMLSerializer().serializeToString(clonedCanvas);

        // Erstelle SVG mit optionalen festen Dimensionen
        const widthAttr = width ? `width="${width}"` : "";
        const heightAttr = height ? `height="${height}"` : "";

        const svgString = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
          ${widthAttr}
          ${heightAttr}
          viewBox="${finalX} ${finalY} ${finalWidth} ${finalHeight}"
          preserveAspectRatio="xMidYMid meet">
          ${css}
          ${content}
        </svg>`;

        workspace.dispose();
        resolve(svgString);
      } finally {
        document.body.removeChild(container);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Konvertiert SVG zu PNG als Blob
 *
 * @param {string} svgString - SVG als String
 * @param {number} width - PNG Breite (optional)
 * @param {number} height - PNG Höhe (optional)
 * @returns {Promise<Blob>} PNG als Blob
 */
export const svgToPngBlob = async (svgString, width, height) => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      const img = new Image();

      img.onload = () => {
        canvas.width = width || img.width;
        canvas.height = height || img.height;
        const ctx = canvas.getContext("2d");

        // Weißer Hintergrund
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Zeichne das Bild
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/png");
      };

      img.onerror = () => {
        reject(new Error("Fehler beim Laden des SVG-Bildes"));
      };

      const blob = new Blob([svgString], { type: "image/svg+xml" });
      img.src = URL.createObjectURL(blob);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generiert SVG und konvertiert direkt zu PNG Blob
 *
 * @param {string} xml - Blockly XML
 * @param {number} width - PNG Breite (optional)
 * @param {number} height - PNG Höhe (optional)
 * @returns {Promise<Blob>} PNG Blob
 */
export const generateBlocklyPngBlob = async (xml, width, height) => {
  const svgString = await generateBlocklySvg(xml, width, height);
  return svgToPngBlob(svgString, width, height);
};

/**
 * Generiert SVG als Base64-String (für URLs oder APIs)
 *
 * @param {string} xml - Blockly XML
 * @returns {Promise<string>} Base64-encodierter SVG
 */
export const generateBlocklySvgBase64 = async (xml) => {
  const svgString = await generateBlocklySvg(xml);
  return btoa(unescape(encodeURIComponent(svgString)));
};
