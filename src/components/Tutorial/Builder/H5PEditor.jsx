import React, { useState, useMemo, useEffect } from "react";

const H5PEditor = ({ h5psrc, seth5psrc }) => {
  const [rawEmbed, setRawEmbed] = useState("");
  const [width, setWidth] = useState("800");
  const [height, setHeight] = useState("450");
  const [title, setTitle] = useState("H5P Content");
  const [radius, setRadius] = useState("8");

  // --- Extract src from full embed or raw URL ---
  const extractIframeSrc = (input) => {
    const srcMatch = input.match(/src="([^"]+)"/);
    if (srcMatch) return srcMatch[1];

    if (input.startsWith("http")) return input;

    return "";
  };

  const iframeSrc = useMemo(() => extractIframeSrc(rawEmbed), [rawEmbed]);

  // --- Build the FULL embed code string dynamically ---
  const fullEmbedString = useMemo(() => {
    if (!iframeSrc) return "";

    return `
<iframe 
  src="${iframeSrc}" 
  width="${width}" 
  height="${height}" 
  frameborder="0" 
  allow="geolocation *; microphone *; camera *; midi *; encrypted-media *" 
  allowfullscreen="allowfullscreen"
  style="border-radius:${radius}px"
  title="${title}"
></iframe>
<script src="https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js" charset="UTF-8"></script>
`.trim();
  }, [iframeSrc, width, height, title, radius]);

  // Push final embed string to parent
  useEffect(() => {
    if (fullEmbedString) seth5psrc(fullEmbedString);
  }, [fullEmbedString]);

  // --- Preview iframe ---
  const previewIframe = useMemo(() => {
    if (!iframeSrc) return null;

    return (
      <iframe
        src={iframeSrc}
        width={width}
        height={height}
        style={{
          border: "1px solid #ccc",
          borderRadius: `${radius}px`,
        }}
        allow="geolocation *; microphone *; camera *; midi *; encrypted-media *"
        allowFullScreen
        title={title}
      ></iframe>
    );
  }, [iframeSrc, width, height, radius, title]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <h2>H5P Embed Editor</h2>

      <label>
        <b>H5P Embed Code oder URL:</b>
      </label>
      <textarea
        value={rawEmbed}
        onChange={(e) => setRawEmbed(e.target.value)}
        rows={4}
        placeholder="<iframe ...> oder https://h5p.org/... "
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
        <div>
          <label>Breite (px)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            style={{ width: "100%", padding: 6 }}
          />
        </div>
        <div>
          <label>Höhe (px)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            style={{ width: "100%", padding: 6 }}
          />
        </div>
      </div>

      <div>
        <h3>Vorschau</h3>
        <div
          style={{
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          {previewIframe || (
            <div style={{ color: "#888" }}>Noch kein gültiger H5P-Code</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default H5PEditor;
