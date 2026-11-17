import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useStore } from "react-redux";
import * as Blockly from "blockly/core";

import NotFound from "../../Pages/NotFound";
import TutorialLayout from "./components/TutorialLayout";
import TutorialContent from "./components/TutorialContent";
import { useTutorialViewer } from "./hooks/useTutorialViewer";
import { setBoard } from "@/actions/boardAction";

export default function TutorialPage() {
  const { tutorialId } = useParams();
  const [nextStepDisabled, setNextStepDisabled] = useState(false);
  const dispatch = useDispatch();
  const store = useStore();

  // restore previous board after leaving tutorial
  const [previousBoard] = useState(() => store.getState().board.board);
  useEffect(() => {
    return () => {
      if (previousBoard && store.getState().board.board !== previousBoard) {
        dispatch(setBoard(previousBoard));
      }
    };
  }, [previousBoard, store, dispatch]);

  const {
    tutorial,
    currentStep,
    activeStep,
    nextStep,
    previousStep,
    message,
    platform,
  } = useTutorialViewer(tutorialId);

  if (!tutorial) {
    if (message?.id === "GET_TUTORIAL_FAIL") {
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
    <TutorialLayout
      tutorial={tutorial}
      tutorialId={tutorialId}
      platform={platform}
      nextStepDisabled={nextStepDisabled}
    >
      <TutorialContent
        tutorial={tutorial}
        currentStep={currentStep}
        activeStep={activeStep}
        nextStep={nextStep}
        previousStep={previousStep}
        setNextStepDisabled={setNextStepDisabled}
      />
    </TutorialLayout>
  );
}
