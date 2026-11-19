import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComputerMouse,
  faHandPointer,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

// A key cap, e.g. ⇧ or ←.
const Key = ({ children }) => (
  <Box
    component="kbd"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 22,
      height: 22,
      px: 0.5,
      border: 1,
      borderBottomWidth: 2,
      borderColor: "text.disabled",
      borderRadius: 1,
      bgcolor: "background.paper",
      fontFamily: "inherit",
      fontSize: 13,
      fontWeight: 600,
      lineHeight: 1,
    }}
  >
    {children}
  </Box>
);

// A mouse gesture: an icon with what to drag, e.g. ✋ Magnet.
const Gesture = ({ icon, children }) => (
  <Box
    component="span"
    sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
  >
    <FontAwesomeIcon icon={icon} />
    {children && <b>{children}</b>}
  </Box>
);

const Plus = () => (
  <Box component="span" sx={{ color: "text.secondary" }}>
    +
  </Box>
);

// One hint: the keys or gestures, then what they do.
const Item = ({ id, keys, children }) => (
  <Box
    data-help={id}
    sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}
  >
    {keys}
    <Box component="span" sx={{ color: "text.secondary" }}>
      → {children}
    </Box>
  </Box>
);

const ARROWS = ["←", "→", "↑", "↓"];

// How to use the magnet scene, as key caps and mouse icons instead of prose.
// labels: {title, magnet, arrow, background, or, move, axis, distance, slide, turn,
// orbit, pan, zoom, hide, sensor?, centres?}
export default function ControlsHelp({ threeD, labels, onClose }) {
  const or = (
    <Box component="span" sx={{ color: "text.secondary" }}>
      {labels.or}
    </Box>
  );
  return (
    <Box
      id="magnetometer-help"
      role="note"
      aria-label={labels.title}
      sx={{
        mt: 1,
        pl: 1.5,
        pr: 0.5,
        py: 0.75,
        display: "flex",
        alignItems: "center",
        gap: 1,
        bgcolor: "action.hover",
        borderRadius: 1,
        fontSize: 13,
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          columnGap: 2.5,
          rowGap: 0.75,
        }}
      >
        <Typography
          component="span"
          variant="body2"
          sx={{ fontWeight: 600, fontSize: 13 }}
        >
          {labels.title}
        </Typography>
        <Item
          id="move"
          keys={<Gesture icon={faHandPointer}>{labels.magnet}</Gesture>}
        >
          {labels.move}
        </Item>
        <Item
          id="axis"
          keys={
            <>
              <Key>⇧</Key>
              <Plus />
              <Gesture icon={faHandPointer}>{labels.magnet}</Gesture>
              {or}
              <Gesture icon={faHandPointer}>{labels.arrow}</Gesture>
            </>
          }
        >
          {labels.axis}
        </Item>
        {labels.sensor && (
          <Item
            id="sensor"
            keys={<Gesture icon={faHandPointer}>{labels.sensor}</Gesture>}
          >
            {labels.centres}
          </Item>
        )}
        <Item
          id="distance"
          keys={
            <>
              <Key>←</Key>
              <Key>→</Key>
            </>
          }
        >
          {labels.distance}
        </Item>
        <Item
          id="slide"
          keys={
            <>
              <Key>↑</Key>
              <Key>↓</Key>
            </>
          }
        >
          {labels.slide}
        </Item>
        <Item
          id="turn"
          keys={
            <>
              <Key>⇧</Key>
              <Plus />
              {ARROWS.map((arrow) => (
                <Key key={arrow}>{arrow}</Key>
              ))}
            </>
          }
        >
          {labels.turn}
        </Item>
        {threeD && (
          <>
            <Item
              id="orbit"
              keys={<Gesture icon={faHandPointer}>{labels.background}</Gesture>}
            >
              {labels.orbit}
            </Item>
            <Item
              id="pan"
              keys={
                <>
                  <Key>⇧</Key>
                  <Plus />
                  <Gesture icon={faHandPointer}>{labels.background}</Gesture>
                </>
              }
            >
              {labels.pan}
            </Item>
            <Item
              id="zoom"
              keys={
                <>
                  <Gesture icon={faComputerMouse} />
                  {or}
                  <Key>+</Key>
                  <Key>−</Key>
                </>
              }
            >
              {labels.zoom}
            </Item>
          </>
        )}
      </Box>
      <IconButton
        size="small"
        id="magnetometer-help-close"
        aria-label={labels.hide}
        title={labels.hide}
        onClick={onClose}
        sx={{ alignSelf: "flex-start" }}
      >
        <FontAwesomeIcon icon={faXmark} fontSize="0.85em" />
      </IconButton>
    </Box>
  );
}
