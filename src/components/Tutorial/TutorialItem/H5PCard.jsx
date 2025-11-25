import React, { useMemo } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const extractIframe = (embed) => {
  if (!embed) return "";

  // Script entfernen (React rendert das nicht und wäre potenziell gefährlich)
  const cleaned = embed.replace(/<script[\s\S]*?<\/script>/gi, "");

  // Iframe extrahieren
  const match = cleaned.match(/<iframe[\s\S]*?<\/iframe>/i);
  return match ? match[0] : "";
};

const H5PCard = ({ h5psrc }) => {
  const iframeHtml = useMemo(() => extractIframe(h5psrc), [h5psrc]);
  console.log("Rendering H5PCard with iframeHtml:", h5psrc);
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        p: 2,
        background: "#fafafa",
      }}
    >
      <CardContent>
        {iframeHtml ? (
          <Box
            sx={{
              mt: 2,
              width: "100%",
              overflow: "hidden",
              borderRadius: 2,
              border: "1px solid #ddd",
            }}
            dangerouslySetInnerHTML={{ __html: iframeHtml }}
          />
        ) : (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Kein gültiger H5P-Inhalt vorhanden.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default H5PCard;
