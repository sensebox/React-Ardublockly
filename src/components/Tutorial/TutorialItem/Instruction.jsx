import { Info } from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import HardwareCard from "./HardwareCard";
import TutorialSlide from "./TutorialSlide";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

// Image-Renderer anpassen
const defaultImageRenderer =
  md.renderer.rules.image ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.image = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  token.attrs = token.attrs || [];
  token.attrs = token.attrs.filter(
    ([name]) => name !== "width" && name !== "height" && name !== "style",
  );
  token.attrs.push([
    "style",
    "max-width:250px; height:auto; display:block; margin:auto;",
  ]);
  const imgHtml = defaultImageRenderer(tokens, idx, options, env, self);
  return `
    <div style="text-align:center;">
      <div style="display:inline-block; padding:12px; background:#f5f5f5;">
        ${imgHtml}
      </div>
    </div>
  `;
};

const Instruction = ({ tutorial }) => {
  const theme = useTheme();
  // find the instruction step
  const step = (tutorial?.steps || []).find(
    (s) => s.type === "instruction",
  ) || { text: "", hardware: [] };

  return (
    <TutorialSlide title="Einleitung">
      <Box sx={{ my: 2 }}>
        <div dangerouslySetInnerHTML={{ __html: md.render(step.text) }} />
      </Box>
      <Typography sx={{ fontWeight: "bold" }}>
        <Info sx={{ color: theme.palette.primary.main, mr: 1 }} />
        Benötigte Hardware
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          mt: 2,
          width: "100%",
        }}
      >
        {tutorial.hardware &&
          tutorial.hardware.map((sensor, idx) => (
            <div key={idx}>
              <Box
                key={sensor.id || idx}
                sx={{
                  flex: "1",
                  minWidth: "80px",
                  boxSizing: "border-box",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <HardwareCard component={sensor} />
              </Box>
            </div>
          ))}
      </Box>
    </TutorialSlide>
  );
};

export default Instruction;
