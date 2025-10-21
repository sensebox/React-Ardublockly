import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getTutorial } from "../../actions/tutorialActions";

import NotFound from "../Pages/NotFound";
import Instruction from "./TutorialItem/Instruction";
import TaskStep from "./TutorialItem/TaskStep";
import TutorialProgressCard from "./TutorialItem/TutorialProgessCard";
import TutorialFooter from "./TutorialFooter";
import TutorialFinished from "./TutorialFinished";

import * as Blockly from "blockly";
import { Box, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs from "../ui/Breadcrumbs";

export default function Tutorial() {
  const { tutorialId } = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();

  const tutorial = useSelector((state) => state.tutorial.tutorials[0]);
  const message = useSelector((state) => state.message);
  const activeStep = useSelector((state) => state.tutorial.activeStep);
  const [nextStepDisabled, setNextStepDisabled] = useState(false);
  const [currentStep, setCurrentStep] = useState();

  // Initial load
  useEffect(() => {
    dispatch(getTutorial(tutorialId));
    dispatch({ type: "TUTORIAL_STEP", payload: 0 });
  }, [dispatch, tutorialId]);

  useEffect(() => {
    if (tutorial?.steps && activeStep < tutorial.steps.length) {
      setCurrentStep(tutorial.steps[activeStep]);
    } else {
      setCurrentStep(null);
    }
  }, [activeStep, tutorial]);

  useEffect(() => {
    if (
      currentStep &&
      currentStep.type === "question" &&
      currentStep.questionData.length > 0
    ) {
      setNextStepDisabled(true);
    }
  }, [currentStep]);

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "85vh", // 👈 volle Höhe
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Header (Breadcrumbs) */}
      <Box sx={{ flexShrink: 0 }}>
        <Breadcrumbs
          content={[
            { link: "/tutorial", title: "Tutorials" },
            {
              link: `/tutorial/${tutorialId}`,
              title: tutorial?.title || "Aktuelles Tutorial",
            },
          ]}
        />
      </Box>

      {/* Hauptinhalt */}
      <Box
        sx={{
          flexGrow: 1, // 👈 nimmt gesamten verfügbaren Platz ein
          display: "flex",
          flexDirection: "row",
          width: "100%",
          p: 2,
          gap: 4,
          justifyContent: "center",
          alignItems: "stretch", // alles gleiche Höhe
        }}
      >
        {/* ProgressCard links - 20% */}
        <Box
          sx={{
            flex: "0 0 20%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <TutorialProgressCard />
        </Box>

        {/* Hauptbereich rechts */}
        <Box
          sx={{
            flex: "1 1 auto",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100%",
          }}
        >
          <AnimatePresence mode="wait">
            {(() => {
              const currentStep = tutorial.steps[activeStep];
              const type = currentStep?.type;

              if (type === "finish") {
                return <TutorialFinished key="finished" tutorial={tutorial} />;
              }

              if (type === "instruction") {
                return <Instruction tutorial={tutorial} key={activeStep} />;
              }

              return (
                <TaskStep
                  setNextStepDisabled={setNextStepDisabled}
                  step={currentStep}
                  key={activeStep}
                />
              );
            })()}
          </AnimatePresence>
        </Box>
      </Box>

      {/* Footer – immer am unteren Rand */}
      <Box sx={{ flexShrink: 0 }}>
        <TutorialFooter nextStepDisabled={nextStepDisabled} />
      </Box>
    </Box>
  );
}
