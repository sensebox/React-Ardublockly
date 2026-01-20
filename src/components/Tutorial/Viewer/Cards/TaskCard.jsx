import { useEffect } from "react";
import MarkdownIt from "markdown-it";
import { useSelector } from "react-redux";
import TutorialSlide from "../components/TutorialSlide";
import QuestionBlock from "./QuestionCard";
import QuestionCard from "./QuestionCard";
import SolutionCheck from "./SolutionCheck";
import BlocklyWindow from "@/components/Blockly/BlocklyWindow";
import { Box, Grid, Typography } from "@mui/material";
import H5PCard from "./H5PCard";

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

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

// 🔸 Blockquote mit Klasse
const defaultBlockquoteRenderer =
  md.renderer.rules.blockquote_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };
md.renderer.rules.blockquote_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet("class", "tutorial-blockquote");
  return defaultBlockquoteRenderer(tokens, idx, options, env, self);
};

// 🔸 Table mit Klasse
const defaultTableRenderer =
  md.renderer.rules.table_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };
md.renderer.rules.table_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet("class", "tutorial-table");
  return defaultTableRenderer(tokens, idx, options, env, self);
};

const TaskCard = ({ step, setNextStepDisabled }) => {
  const activeStep = useSelector((state) => state.tutorial.activeStep);

  const svgToDataUrl = (svgString) =>
    "data:image/svg+xml;base64," +
    window.btoa(
      new TextEncoder().encode(svgString).reduce((data, byte) => {
        return data + String.fromCharCode(byte);
      }, ""),
    );

  return (
    <TutorialSlide stepNumber={activeStep}>
      <div dangerouslySetInnerHTML={{ __html: md.render(step.text) }} />
      {step.type === "question" && step.questionData && (
        <Box
          sx={{
            gap: 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {step.questionData.map((q, idx) => {
            return <QuestionCard key={idx} questionData={q} step={step} />;
          })}
        </Box>
      )}
      {step.type === "h5p" && step.h5psrc && (
        <Box
          className="blocklyWindow"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <H5PCard h5psrc={step.h5psrc} />
        </Box>
      )}
      {step.type === "blockly" && step.xml && (
        <Box
          className="blocklyWindow"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Blockly mit Rahmen */}
          <Box
            sx={{
              width: "100%",
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.1)",
              overflow: "hidden",
              backgroundColor: "#fff",
              p: 1,
            }}
          >
            <BlocklyWindow
              blocklyCSS={{
                height: "40vh",
                width: "100%",
              }}
              tutorial
            />
            {/* Einführungstext */}
            <Typography
              variant="body2"
              sx={{
                fontStyle: "italic",
                color: "text.secondary",
                textAlign: "center",
                maxWidth: "50vw",
                mt: 2,
              }}
            >
              Hier sollst du den vorgegebenen Sketch nachbauen. Wenn du fertig
              bist, klicke auf <b>„Lösung einreichen“</b>, um zu sehen, ob dein
              Ergebnis korrekt ist.
            </Typography>
          </Box>

          {/* Lösung prüfen */}
          <SolutionCheck solutionXml={step.xml} activeStep={activeStep} />
        </Box>
      )}
      {step.type === "blocklyExample" && step.svg && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img src={svgToDataUrl(step.svg)} alt="Blockly block" />
        </Box>
      )}
    </TutorialSlide>
  );
};

export default TaskCard;
