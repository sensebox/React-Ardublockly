import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { AnimatePresence } from "framer-motion";

import Instruction from "../Instruction";

import FinishedCard from "../Cards/FinishedCard";
import FloatingNavigation from "./FloatingNavigation";
import TaskCard from "../Cards/TaskCard";
import { markStepSeen } from "../../services/tutorial.service";
import { useDispatch, useSelector } from "react-redux";
import { markStepSeenLocal } from "@/actions/tutorialProgressActions";

const TutorialContent = ({
  tutorial,
  currentStep,
  activeStep,
  nextStep,
  previousStep,
  setNextStepDisabled,
}) => {
  if (!tutorial || !currentStep) return null;
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const tutorialProgressById = useSelector(
    (state) => state.tutorialProgress.byTutorialId,
  );
  const type = currentStep.type;

  useEffect(() => {
    if (!tutorial || !currentStep || !user) return;

    const stepId = currentStep._id;

    const progressForTutorial = tutorialProgressById?.[tutorial._id];

    const alreadySeen = progressForTutorial?.steps?.[stepId]?.seen === true;
    if (alreadySeen) return;
    // 🔹 Optimistic Update
    dispatch(markStepSeenLocal(tutorial._id, stepId));

    // 🔹 Backend Sync
    markStepSeen({
      tutorialId: tutorial._id,
      stepId,
      token,
    }).catch((error) => {
      console.error("Failed to mark step as seen", error);
    });
  }, [activeStep, tutorial?._id, currentStep?._id, user, tutorialProgressById]);

  return (
    <AnimatePresence mode="wait">
      <div style={{ width: "100%", height: "100%" }}>
        {type === "finish" && (
          <FinishedCard key="finished" tutorial={tutorial} isUnlocked={false} />
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
