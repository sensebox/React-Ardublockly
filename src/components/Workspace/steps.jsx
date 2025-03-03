import { Code, Check, Download } from "@mui/icons-material";

export const steps = [
  {
    title: "Kompilierung läuft...",
    icon: <Code sx={{ fontSize: 48 }} />,
  },
  {
    title: "Download wird vorbereitet",
    icon: <Download sx={{ fontSize: 48 }} />,
  },
  {
    title: "Kompilierung abgeschlossen!",
    icon: <Check sx={{ fontSize: 48 }} />,
  },
];
