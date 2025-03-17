// Shared theme constants
export const senseboxColors = {
  lime: "#CFD706",
  blue: "#48D7E7",
  green: "#4BB20F",
};

export const dialogStyles = {
  paper: {
    width: "60vw",
    height: "50vh",
    minHeight: 500,
    maxWidth: "none",
    background: `linear-gradient(135deg, ${senseboxColors.blue}10, ${senseboxColors.lime}10, ${senseboxColors.green}10)`,
    border: `1px solid ${senseboxColors.blue}`,
    borderRadius: 8,
    overflow: "hidden",
  },
};

export const progressStyles = {
  height: 8,
  borderRadius: 4,
  backgroundColor: `${senseboxColors.blue}20`,
  "& .MuiLinearProgress-bar": {
    backgroundColor: senseboxColors.blue,
  },
};
