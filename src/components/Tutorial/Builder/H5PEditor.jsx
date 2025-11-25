import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Paper,
} from "@mui/material";

const H5PEditor = ({ h5psrc, seth5psrc }) => {
  const [rawEmbed, setRawEmbed] = useState(h5psrc || "");
  const [width, setWidth] = useState(() => {
    const match = h5psrc?.match(/width="([^"]+)"/);
    return match ? match[1] : "800";
  });
  const [height, setHeight] = useState(() => {
    const match = h5psrc?.match(/height="([^"]+)"/);
    return match ? match[1] : "450";
  });
  const [title, setTitle] = useState("H5P Content");
  const [radius, setRadius] = useState("8");

  const extractIframeSrc = (input) => {
    const srcMatch = input?.match(/src="([^"]+)"/);
    if (srcMatch) return srcMatch[1];
    if (input?.startsWith("http")) return input;
    return "";
  };

  const iframeSrc = useMemo(() => extractIframeSrc(rawEmbed), [rawEmbed]);

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

  useEffect(() => {
    if (fullEmbedString) seth5psrc(fullEmbedString);
  }, [fullEmbedString]);

  const previewIframe = useMemo(() => {
    if (!iframeSrc) return null;
    return (
      <iframe
        src={iframeSrc}
        width={width}
        height={height}
        allow="geolocation *; microphone *; camera *; midi *; encrypted-media *"
        allowFullScreen
        title={title}
      />
    );
  }, [iframeSrc, width, height, radius, title]);

  return (
    <Card sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <CardContent>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          H5P Embed Editor
        </Typography>

        {/* INPUT FIELD */}
        <TextField
          label="H5P Embed Code oder URL"
          value={rawEmbed}
          onChange={(e) => setRawEmbed(e.target.value)}
          multiline
          minRows={4}
          fullWidth
          placeholder="<iframe ...> oder https://h5p.org/..."
          sx={{ mt: 2 }}
        />

        {/* SETTINGS */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Breite (px)"
              type="number"
              fullWidth
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Höhe (px)"
              type="number"
              fullWidth
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </Grid>
        </Grid>

        {/* PREVIEW */}
        <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
          Vorschau
        </Typography>

        <Paper
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 2,
            minHeight: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f7f7f7",
          }}
        >
          {previewIframe || (
            <Typography sx={{ color: "grey.600" }}>
              Noch kein gültiger H5P-Code
            </Typography>
          )}
        </Paper>
      </CardContent>
    </Card>
  );
};

export default H5PEditor;
