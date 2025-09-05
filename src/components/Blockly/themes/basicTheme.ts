import * as Blockly from "blockly/core";

export const BasicTheme = Blockly.Theme.defineTheme("basicTheme", {
  name: "basicTheme",
  base: Blockly.Themes.Classic,
  componentStyles: {
    workspaceBackgroundColour: "#ffffff",
    toolboxBackgroundColour: "#ededed",
    toolboxForegroundColour: "#333333",
    flyoutBackgroundColour: "#e0e0e0",
    flyoutOpacity: 0.6,
    flyoutForegroundColour: "black",
    scrollbarColour: "#4EAF47",
    insertionMarkerColour: "#FFFA90",
    insertionMarkerOpacity: 0.7,
    cursorColour: "#4EAF47",
    markerColour: "#FF70A6",
    selectedGlowColour: "#74D964",
  },
  categoryStyles: {},
  fontStyle: {
    family: "Inter, ui-sans-serif, system-ui",
    weight: "500",
    size: 13,
  },
  startHats: true,
});
