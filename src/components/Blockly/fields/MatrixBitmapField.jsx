import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as Blockly from "blockly/core";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

const WIDTH = 12;
const HEIGHT = 8;
const BLACK = "#000000";
const PALETTE = [
  "#ff0000",
  "#ff924c",
  "#ffca3a",
  "#00ff00",
  "#52b788",
  "#0000ff",
  "#4267ac",
  "#6a4c93",
  "#ffffff",
  BLACK,
];
const fieldName = (index) =>
  `${Math.floor(index / WIDTH) + 1},${(index % WIDTH) + 1}`;
const message = (key) => Blockly.Msg[`senseBox_matrix_editor_${key}`];

function MatrixBitmapEditor({ block, onClose }) {
  const [pixels, setPixels] = useState(() =>
    Array.from({ length: WIDTH * HEIGHT }, (_, index) =>
      block.getFieldValue(fieldName(index)),
    ),
  );
  const [color, setColor] = useState("#ff0000");
  const [erasing, setErasing] = useState(false);
  const drawing = useRef(false);
  const grid = useRef(null);
  const paint = (index) =>
    setPixels((previous) => {
      const next = [...previous];
      next[index] = erasing ? BLACK : color;
      return next;
    });
  const paintAt = (event) => {
    const rect = grid.current.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * WIDTH);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * HEIGHT);
    if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) paint(y * WIDTH + x);
  };
  const save = () => {
    const previousGroup = Blockly.Events.getGroup();
    Blockly.Events.setGroup(true);
    try {
      pixels.forEach((pixel, index) =>
        block.setFieldValue(pixel, fieldName(index)),
      );
    } finally {
      Blockly.Events.setGroup(previousGroup);
    }
    onClose();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="matrix-editor-title"
    >
      <DialogTitle id="matrix-editor-title">
        {message("title")} — {block.getFieldValue("name")}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography>{message("hint")}</Typography>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
          >
            <label>
              {message("color")}{" "}
              <input
                type="color"
                aria-label={message("color")}
                value={color}
                onChange={(event) => {
                  setColor(event.target.value);
                  setErasing(false);
                }}
              />
            </label>
            <Button
              variant={erasing ? "contained" : "outlined"}
              aria-pressed={erasing}
              onClick={() => setErasing(!erasing)}
            >
              {message("eraser")}
            </Button>
            <Button
              onClick={() => setPixels(Array(WIDTH * HEIGHT).fill(BLACK))}
            >
              {message("clear")}
            </Button>
          </Stack>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {PALETTE.map((value) => (
              <button
                key={value}
                type="button"
                aria-label={value}
                aria-pressed={!erasing && color === value}
                onClick={() => {
                  setColor(value);
                  setErasing(false);
                }}
                style={{
                  backgroundColor: value,
                  width: 32,
                  height: 32,
                  border:
                    color === value && !erasing
                      ? "3px solid #555"
                      : "1px solid #aaa",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              />
            ))}
          </Box>
          <Box
            ref={grid}
            aria-label={message("title")}
            data-testid="matrix-pixel-grid"
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${WIDTH}, 1fr)`,
              width: "100%",
              aspectRatio: `${WIDTH} / ${HEIGHT}`,
              touchAction: "none",
              userSelect: "none",
            }}
            onPointerDown={(event) => {
              if (event.button !== 0) return;
              drawing.current = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              paintAt(event);
            }}
            onPointerMove={(event) => {
              if (drawing.current) paintAt(event);
            }}
            onPointerUp={() => {
              drawing.current = false;
            }}
            onPointerCancel={() => {
              drawing.current = false;
            }}
            onLostPointerCapture={() => {
              drawing.current = false;
            }}
          >
            {pixels.map((pixel, index) => (
              <button
                key={index}
                type="button"
                data-pixel={index}
                aria-label={`${(index % WIDTH) + 1}, ${Math.floor(index / WIDTH) + 1}: ${pixel}`}
                onClick={() => paint(index)}
                style={{
                  backgroundColor: pixel,
                  border: "1px solid #777",
                  padding: 0,
                  minWidth: 0,
                  cursor: "crosshair",
                }}
              />
            ))}
          </Box>
          <Typography variant="caption">12 × 8 · {message("black")}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{message("cancel")}</Button>
        <Button variant="contained" onClick={save}>
          {message("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default class MatrixBitmapField extends Blockly.Field {
  constructor() {
    super(Blockly.Msg.senseBox_matrix_editor_open);
    this.SERIALIZABLE = false;
    this.CURSOR = "pointer";
  }

  isSerializable() {
    return false;
  }

  showEditor_() {
    if (this.editorRoot_) return;
    this.editorContainer_ = document.createElement("div");
    document.body.appendChild(this.editorContainer_);
    this.editorRoot_ = createRoot(this.editorContainer_);
    this.editorRoot_.render(
      <MatrixBitmapEditor
        block={this.getSourceBlock()}
        onClose={() => this.closeEditor_()}
      />,
    );
  }

  closeEditor_() {
    this.editorRoot_?.unmount();
    this.editorContainer_?.remove();
    this.editorRoot_ = null;
    this.editorContainer_ = null;
  }

  dispose() {
    this.closeEditor_();
    super.dispose();
  }
}
