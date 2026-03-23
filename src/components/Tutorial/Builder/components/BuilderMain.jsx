import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { Info } from "@mui/icons-material";
import { useTheme } from "@mui/styles";
import { AnimatePresence } from "framer-motion";

import BuildSlide from "./BuildSlide";
import HardwareCard from "../../Viewer/Cards/HardwareCard";
import WhatNext from "./EditorCards/WhatNext";
import QuestionList from "./EditorCards/QuestionList";
import BlocklyExample from "./EditorCards/BlocklyExample";
import H5PEditor from "./EditorCards/H5PEditor";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";

/**
 * Hauptinhalt des Tutorial Builders
 * - Step Editor
 * - Markdown
 * - Blockly / H5P / Questions
 * - Hardware Preview
 */
const BuilderMain = ({
  steps,
  setSteps,
  activeStep,
  selectedHardware,
  learnings,
  setLearnings,
}) => {
  const theme = useTheme();
  const currentStep = steps[activeStep] || {};

  /**
   * 🔧 Hilfsfunktionen für Step Updates
   */
  const updateActiveStep = (updateFn) => {
    setSteps((prev) =>
      prev.map((step, index) => (index === activeStep ? updateFn(step) : step)),
    );
  };

  const updateStepFields = (fields) =>
    updateActiveStep((step) => ({ ...step, ...fields }));

  const updateStepField = (field, value) =>
    updateActiveStep((step) => ({ ...step, [field]: value }));

  return (
    <Box
      sx={{
        flex: "0 0 65%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AnimatePresence mode="wait">
        <BuildSlide
          key={currentStep.id}
          title={currentStep.title}
          stepNumber={activeStep + 1}
          type={currentStep.type}
          setType={updateStepField}
          setSteps={setSteps}
          steps={steps}
        >
          {/* Markdown Editor */}
          <div data-color-mode="light">
            <MDEditor
              height="35vh"
              value={currentStep.text || ""}
              onChange={(value) => updateStepField("text", value)}
              preview="live"
            />
          </div>

          {/* Blockly */}
          {currentStep.type === "blockly" && (
            <BlocklyExample
              index={activeStep}
              value={currentStep.xml || ""}
              updateStepFields={updateStepFields}
            />
          )}

          {currentStep.type === "blocklyExample" && (
            <BlocklyExample
              index={activeStep}
              value={currentStep.xml || ""}
              updateStepFields={updateStepFields}
            />
          )}

          {/* H5P */}
          {currentStep.type === "h5p" && (
            <H5PEditor
              h5psrc={currentStep.h5psrc || ""}
              seth5psrc={(value) => updateStepField("h5psrc", value)}
            />
          )}

          {/* Questions */}
          {currentStep.type === "question" && (
            <QuestionList
              questions={currentStep.questionData || []}
              setQuestions={(value) => updateStepField("questionData", value)}
            />
          )}

          {/* Hardware Preview */}
          {currentStep.type === "instruction" &&
            selectedHardware.length > 0 && (
              <Box mt={2}>
                <Typography sx={{ fontWeight: "bold" }}>
                  <Info
                    sx={{
                      color: theme.palette.primary.main,
                      mr: 1,
                    }}
                  />
                  Benötigte Hardware
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: 2,
                    justifyItems: "center",
                    mt: 2,
                    width: "100%",
                  }}
                >
                  {selectedHardware.map((sensor) => (
                    <Box key={sensor} sx={{ width: "100%", maxWidth: 180 }}>
                      <HardwareCard component={sensor} />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

          {/* Finish */}
          {currentStep.type === "finish" && (
            <WhatNext learnings={learnings} setLearnings={setLearnings} />
          )}
        </BuildSlide>
      </AnimatePresence>
    </Box>
  );
};

BuilderMain.propTypes = {
  steps: PropTypes.array.isRequired,
  setSteps: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
  selectedHardware: PropTypes.array.isRequired,
  learnings: PropTypes.array.isRequired,
  setLearnings: PropTypes.func.isRequired,
};

export default BuilderMain;
