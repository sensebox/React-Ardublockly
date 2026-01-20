import {
  TUTORIAL_PROGRESS_SET_ALL,
  TUTORIAL_PROGRESS_START,
  TUTORIAL_PROGRESS_STEP_SEEN,
  TUTORIAL_PROGRESS_ANSWER,
  TUTORIAL_PROGRESS_RESET,
} from "./types";

/**
 * Set all tutorial progress for a user (e.g. after login)
 */
export const setAllTutorialProgress = (progressArray) => {
  const byTutorialId = {};
  progressArray.forEach((p) => {
    byTutorialId[p.tutorial.toString()] = p;
  });

  return {
    type: TUTORIAL_PROGRESS_SET_ALL,
    payload: byTutorialId,
  };
};

/**
 * Store progress after tutorial start
 */
export const startTutorialProgressLocal = (tutorialId, progress) => ({
  type: TUTORIAL_PROGRESS_START,
  payload: { tutorialId, progress },
});

/**
 * Mark step as seen (optimistic)
 */
export const markStepSeenLocal = (tutorialId, stepId) => ({
  type: TUTORIAL_PROGRESS_STEP_SEEN,
  payload: { tutorialId, stepId },
});

/**
 * Store answered question (optimistic)
 */
export const answerQuestionLocal = (
  tutorialId,
  stepId,
  questionId,
  correct,
) => ({
  type: TUTORIAL_PROGRESS_ANSWER,
  payload: { tutorialId, stepId, questionId, correct },
});

/**
 * Reset tutorial progress
 */
export const resetTutorialProgressLocal = (tutorialId) => ({
  type: TUTORIAL_PROGRESS_RESET,
  payload: { tutorialId },
});
