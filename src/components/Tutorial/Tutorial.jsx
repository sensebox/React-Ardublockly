import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  getTutorial,
  resetTutorial,
  tutorialStep,
  tutorialProgress,
} from "../../actions/tutorialActions";
import { workspaceName } from "../../actions/workspaceActions";
import { clearMessages } from "../../actions/messageActions";

import Breadcrumbs from "../ui/Breadcrumbs";
import StepperHorizontal from "./StepperHorizontal";
import StepperVertical from "./StepperVertical";
import Instruction from "./Instruction";
import Assessment from "./Assessment";
import NotFound from "../Pages/NotFound";

import * as Blockly from "blockly";
import { detectWhitespacesAndReturnReadableResult } from "../../helpers/whitespace";

import { Card, Button, Box, Stepper, useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import TutorialFooter from "./TutorialFooter";
import { set } from "date-fns";
import TaskStep from "./TaskStep";

export default function Tutorial() {
  const { tutorialId } = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();

  const tutorial = useSelector((state) => state.tutorial.tutorials[0]);
  const message = useSelector((state) => state.message);
  const progress = useSelector((state) => state.auth.progress);
  const activeStep = useSelector((state) => state.tutorial.activeStep);
  const [currentStep, setCurrentStep] = useState();
  // initial load
  useEffect(() => {
    dispatch(getTutorial(tutorialId));
    dispatch({
      type: "TUTORIAL_STEP",
      payload: 0, // oder welcher Schritt aktiv sein soll
    });
    console.log(activeStep);
  }, []);

  useEffect(() => {
    tutorial?.steps && setCurrentStep(tutorial.steps[activeStep]);
    console.log("Current Step set to:", activeStep);
  }, [activeStep, tutorial]);

  if (!tutorial) {
    if (message.id === "GET_TUTORIAL_FAIL") {
      return (
        <NotFound
          button={{
            title: Blockly.Msg.messages_GET_TUTORIAL_FAIL,
            link: "/tutorial",
          }}
        />
      );
    }
    return null;
  }

  return (
    <Box>
      <Breadcrumbs
        content={[
          { link: "/tutorial", title: "Tutorial" },
          { link: `/tutorial/${tutorial._id}`, title: tutorial.title },
        ]}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "80vh",
          mx: "15vw",
        }}
      >
        {activeStep === 0 && <Instruction step={tutorial.steps[activeStep]} />}
        {activeStep > 0 && <TaskStep step={tutorial.steps[activeStep]} />}
        <TutorialFooter
          tutorialSteps={tutorial.steps}
          setCurrentStep={(currentStep) => dispatch(tutorialStep(currentStep))}
          progress={progress}
        />
      </Box>
    </Box>
  );
}

Tutorial.propTypes = {
  // Nur noch Doku für Props aus Redux/Router nötig
  change: PropTypes.number,
  status: PropTypes.array,
  activeStep: PropTypes.number,
  tutorial: PropTypes.object,
  isLoading: PropTypes.bool,
  message: PropTypes.object,
  progress: PropTypes.bool,
};
