import { useEffect } from "react";
import MarkdownIt from "markdown-it";
import { useSelector } from "react-redux";
import TutorialSlide from "./TutorialSlide";
import QuestionBlock from "./QuestionCard";
import QuestionCard from "./QuestionCard";
import SolutionCheck from "./SolutionCheck";
import BlocklyWindow from "@/components/Blockly/BlocklyWindow";
import { Box, Grid } from "@mui/material";

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

const TaskStep = ({ step }) => {
  const activeStep = useSelector((state) => state.tutorial.activeStep);
  return (
    <TutorialSlide stepNumber={activeStep}>
      <div dangerouslySetInnerHTML={{ __html: md.render(step.text) }} />
      {step.type === "question" && step.questionData && (
        <div>
          {step.questionData.map((q, idx) => {
            return <QuestionCard key={idx} questionData={q} />;
          })}
        </div>
      )}
      {step.type === "blockly" && step.xml && (
        <Box className="blocklyWindow">
          <BlocklyWindow blocklyCSS={{ height: "40vH" }} />
          <SolutionCheck solutionXml={step.xml} activeStep={activeStep} />
        </Box>
      )}
    </TutorialSlide>
  );
};

export default TaskStep;
