// useNavigationState.js

export const isQuestionStep = (step) =>
  step.type === "question" || step.type === "blockly";

export const isStepFinished = (step) => {
  if (isQuestionStep(step)) {
    const id = step?.questionData?.[0]?._id;
    if (!id) return false;
    return document.cookie.includes(`${id}=true`);
  }
  return true;
};

export const computeNavigationState = (currentStep, steps) => {
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const isBeforeLast = currentStep === steps.length - 2;

  const finishedArray = steps.map((step, i) => {
    const result = isStepFinished(step);
    return result;
  });

  const allFinished = finishedArray.every(Boolean);

  return {
    isFirst,
    isLast,
    isBeforeLast,
    allFinished,
  };
};
