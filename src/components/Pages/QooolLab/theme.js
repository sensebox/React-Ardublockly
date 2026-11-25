import { createTheme } from "@mui/material/styles";
import "./qoool.css";

// Colours of the QOOOL Sensing brand (logo and https://qoool-sensing.org).
// The light green fails contrast for text on white, so text and filled
// buttons use the darker shade; the bright ones are for decoration.
export const QOOOL = {
  green: "#96b239",
  greenDark: "#66801f",
  greenDarker: "#55691a",
  red: "#d5232a",
  // Values read from the plot: dip markers, Δf and the worked example.
  readout: "#97b33d",
  redDark: "#b21d23",
  blue: "#1ca0fb",
  slate: "#64748b",
  ink: "#0f172a",
  line: "#e5e7eb",
};

// The bars in the logo: green → red → green.
export const BRAND_GRADIENT = `linear-gradient(90deg, ${QOOOL.green}, ${QOOOL.red} 50%, ${QOOOL.green})`;

// The glowing frame of the tiles on qoool-sensing.org.
export const GLOW_GRADIENT = [
  `radial-gradient(circle farthest-side at 0 100%, ${QOOOL.green}, transparent)`,
  `radial-gradient(circle farthest-side at 100% 0, ${QOOOL.red}, transparent)`,
  `radial-gradient(circle farthest-side at 100% 100%, ${QOOOL.green}, transparent)`,
  `radial-gradient(circle farthest-side at 0 0, ${QOOOL.blue}, ${QOOOL.red})`,
].join(", ");

const FONT = '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif';
// The outer theme has already resolved its variants with Roboto, so each
// variant needs the font, not just typography.fontFamily.
const VARIANTS = [
  ...["h1", "h2", "h3", "h4", "h5", "h6"],
  ...["subtitle1", "subtitle2", "body1", "body2", "caption", "overline"],
];

// Extends the app theme for the QOOOL Lab only. palette.readout colours the
// values students read from the plot (readoutColour in FieldCalculation.jsx).
export const qooolTheme = (outer) =>
  createTheme(outer, {
    palette: {
      readout: { main: QOOOL.readout },
      primary: {
        main: QOOOL.greenDark,
        dark: QOOOL.greenDarker,
        light: QOOOL.green,
        contrastText: "#ffffff",
      },
      error: { main: QOOOL.red, dark: QOOOL.redDark, contrastText: "#ffffff" },
      text: { primary: QOOOL.ink, secondary: QOOOL.slate },
      divider: QOOOL.line,
    },
    typography: {
      fontFamily: FONT,
      ...Object.fromEntries(VARIANTS.map((v) => [v, { fontFamily: FONT }])),
      button: { fontFamily: FONT, fontWeight: 600, letterSpacing: 0 },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiPaper: {
        styleOverrides: {
          outlined: { borderColor: QOOOL.line, borderRadius: 16 },
        },
      },
      MuiButton: {
        styleOverrides: { root: { textTransform: "none", borderRadius: 10 } },
      },
      MuiToggleButton: {
        styleOverrides: { root: { fontWeight: 600 } },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            "&.Mui-selected": { color: QOOOL.ink, fontWeight: 600 },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: { height: 3, background: BRAND_GRADIENT },
        },
      },
    },
  });
