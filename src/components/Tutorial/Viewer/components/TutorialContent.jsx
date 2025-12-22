import React from "react";
import PropTypes from "prop-types";
import { AnimatePresence } from "framer-motion";

import Instruction from "../Instruction";

import FinishedCard from "../Cards/FinishedCard";
import FloatingNavigation from "./FloatingNavigation";
import TaskCard from "../Cards/TaskCard";

const TutorialContent = ({
  tutorial,
  currentStep,
  activeStep,
  nextStep,
  previousStep,
  setNextStepDisabled,
}) => {
  if (!tutorial || !currentStep) return null;

  const type = currentStep.type;

  return (
    <AnimatePresence mode="wait">
      <div style={{ width: "100%", height: "100%" }}>
        {type === "finish" && (
          <FinishedCard key="finished" tutorial={tutorial} />
        )}
        {type === "instruction" && (
          <Instruction key={activeStep} tutorial={tutorial} />
        )}
        {type !== "instruction" && type !== "finish" && (
          <TaskCard
            key={activeStep}
            step={currentStep}
            setNextStepDisabled={setNextStepDisabled}
          />
        )}
      </div>
    </AnimatePresence>
  );
};

TutorialContent.propTypes = {
  tutorial: PropTypes.object,
  currentStep: PropTypes.object,
  activeStep: PropTypes.number,
  nextStep: PropTypes.func,
  previousStep: PropTypes.func,
  setNextStepDisabled: PropTypes.func,
};

export default TutorialContent;
