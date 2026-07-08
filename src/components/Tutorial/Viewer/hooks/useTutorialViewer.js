import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTutorial } from "@/actions/tutorialActions";

export function useTutorialViewer(tutorialId) {
  const dispatch = useDispatch();

  const tutorial = useSelector((state) => state.tutorial.tutorials[0]);
  const activeStep = useSelector((state) => state.tutorial.activeStep);
  const message = useSelector((state) => state.message);
  const platform = useSelector((state) => state.general.platform);

  useEffect(() => {
    dispatch(getTutorial(tutorialId));
    dispatch({ type: "TUTORIAL_STEP", payload: 0 });
  }, [dispatch, tutorialId]);

  const currentStep = useMemo(() => {
    if (!tutorial?.steps) return null;
    return tutorial.steps[activeStep] ?? null;
  }, [tutorial, activeStep]);

  const hasQuestions =
    currentStep?.type === "question" && currentStep?.questionData?.length > 0;

  const nextStep = () => {
    if (!tutorial) return;
    if (activeStep < tutorial.steps.length - 1) {
      dispatch({
        type: "TUTORIAL_STEP",
        payload: activeStep + 1,
      });
    }
  };

  const previousStep = () => {
    if (activeStep > 0) {
      dispatch({
        type: "TUTORIAL_STEP",
        payload: activeStep - 1,
      });
    }
  };
  return {
    tutorial,
    activeStep,
    currentStep,
    hasQuestions,
    nextStep,
    previousStep,
    message,
    platform,
  };
}
