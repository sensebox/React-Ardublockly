import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getTutorial, tutorialStep } from "../../actions/tutorialActions";

import NotFound from "../Pages/NotFound";
import Instruction from "./Instruction";
import TaskStep from "./TaskStep";
import TutorialProgressCard from "./TutorialProgessCard";
import TutorialFooter from "./TutorialFooter";
import TutorialFinished from "./TutorialFinished"; // 👉 neu importieren

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
  const [currentStep, setCurrentStep] = useState();

  // initial load
  useEffect(() => {
    dispatch(getTutorial(tutorialId));
    dispatch({
      type: "TUTORIAL_STEP",
      payload: 0,
    });
  }, [dispatch, tutorialId]);

  useEffect(() => {
    if (tutorial?.steps && activeStep < tutorial.steps.length) {
      setCurrentStep(tutorial.steps[activeStep]);
    } else {
      setCurrentStep(null);
    }
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

  // Animation Varianten
  const variants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  const isFinished = activeStep >= tutorial.steps.length;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignContent: "flex-start",
      }}
    >
      <Breadcrumbs
        content={[
          { link: "/tutorial", title: "Tutorials" },
          {
            link: `/tutorial/${tutorialId}`,
            title: tutorial?.title || "Aktuelles Tutorial",
          },
        ]}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          p: 2,
          justifyContent: "center",
        }}
      >
        {/* ProgressCard links - 20% */}
        <Box sx={{ flex: "0 0 20%" }}>
          <TutorialProgressCard />
        </Box>

        {/* Animierter Bereich rechts - 75% */}
        <Box
          sx={{
            flex: "0 0 75%",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AnimatePresence mode="wait">
            {isFinished ? (
              <TutorialFinished key="finished" />
            ) : activeStep === 0 ? (
              <Instruction step={tutorial.steps[activeStep]} key={activeStep} />
            ) : (
              <TaskStep step={tutorial.steps[activeStep]} key={activeStep} />
            )}
          </AnimatePresence>
        </Box>
      </Box>

      <TutorialFooter />
    </Box>
  );
}
