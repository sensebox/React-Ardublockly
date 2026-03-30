import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  useTheme,
} from "@mui/material";
import * as Blockly from "blockly";

// Funktion zum Parsen von Markdown-Formatierung in React-Elemente
const parseMarkdownText = (text) => {
  // Safeguards
  if (!text) return null;
  if (typeof text !== 'string') return String(text);
  if (text.trim() === '') return text;
  
  const parts = [];
  let currentIndex = 0;
  let key = 0;
  
  // Pattern für **bold** und *italic*
  const boldPattern = /\*\*(.+?)\*\*/g;
  const italicPattern = /\*(.+?)\*/g;
  
  // Erst bold matchen, dann italic
  let match;
  const segments = [];
  let lastIndex = 0;
  
  try {
    // Bold Patterns finden
    const boldMatches = [...text.matchAll(/\*\*(.+?)\*\*/g)];
    const italicMatches = [...text.matchAll(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g)];
  
  // Alle Matches sammeln und sortieren
  const allMatches = [
    ...boldMatches.map(m => ({ start: m.index, end: m.index + m[0].length, text: m[1], type: 'bold' })),
    ...italicMatches.map(m => ({ start: m.index, end: m.index + m[0].length, text: m[1], type: 'italic' }))
  ].sort((a, b) => a.start - b.start);
  
  // Overlaps entfernen (bold hat Vorrang)
  const filteredMatches = [];
  let lastEnd = 0;
  for (const match of allMatches) {
    if (match.start >= lastEnd) {
      filteredMatches.push(match);
      lastEnd = match.end;
    }
  }
  
  // Text zusammenbauen
  lastIndex = 0;
  for (const match of filteredMatches) {
    // Text vor dem Match
    if (match.start > lastIndex) {
      parts.push(<span key={key++}>{text.substring(lastIndex, match.start)}</span>);
    }
    
    // Formatierter Text
    if (match.type === 'bold') {
      parts.push(<strong key={key++}>{match.text}</strong>);
    } else if (match.type === 'italic') {
      parts.push(<em key={key++}>{match.text}</em>);
    }
    
    lastIndex = match.end;
  }
  
  // Rest des Textes
  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.substring(lastIndex)}</span>);
  }
  
  return parts.length > 0 ? parts : text;
  
  } catch (error) {
    console.error('Error parsing markdown text:', error);
    return text;
  }
};

const TooltipViewer = () => {
  const theme = useTheme();
  const tooltip = useSelector((s) => s.workspace.code.tooltip);
  const helpurl = useSelector((s) => s.workspace.code.helpurl);

  return (
    <Card
      className="helpSection"
      sx={{
        overflowY: "auto",
        maxHeight: "23vh",
        mt: 2,
        p: 2,
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 1,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          component="h2"
          style={{
            marginBottom: "0.5rem",
            position: "relative",
            paddingBottom: "0.3rem",
          }}
        >
          <span style={{ display: "inline-block" }}>
            {Blockly.Msg.tooltip_moreInformation_02}
          </span>
          <span
            style={{
              content: "''",
              display: "block",
              width: "50%",
              height: "4px",
              backgroundColor: "#4caf50",
              position: "absolute",
              bottom: 0,
              left: 0,
              borderRadius: "2px",
            }}
          ></span>
        </Typography>

        <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
          {parseMarkdownText(tooltip)}
        </Typography>

        {helpurl && (
          <Button
            variant="contained"
            color="primary"
            href={helpurl}
            target="_blank"
            sx={{
              mt: 2,
              px: 2,
              py: 1,
              borderRadius: 1,
              fontSize: "0.9rem",
            }}
          >
            Zur Dokumentation
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TooltipViewer;
