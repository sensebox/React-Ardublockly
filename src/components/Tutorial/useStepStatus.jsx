// useStepStatus.js
export const isStepQuestion = (step) =>
  step.type === "question" || step.type === "blockly";

export const isStepCorrect = (step) => {
  if (!isStepQuestion(step)) return false;

  const id = step?.questionData?.[0]?._id;
  if (!id) return false;

  return document.cookie.includes(`${id}=true`);
};

export const isStepFinished = (step, index, activeStep) => {
  if (isStepCorrect(step)) return true;
  return index < activeStep; // "normale" abgeschlossene Steps
};
