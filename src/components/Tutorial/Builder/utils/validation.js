export function validateRequiredFields({ title, subtitle }) {
  const missing = [];
  if (!title?.trim()) missing.push("title");
  if (!subtitle?.trim()) missing.push("subtitle");
  return missing;
}

/**
 * Evaluation steps take their criteria from an earlier evaluationPreparation
 * step, so one has to come before each of them.
 * @returns {number[]} 1-based numbers of the evaluation steps without one
 */
export function findEvaluationStepsWithoutPreparation(steps) {
  const invalid = [];
  let hasPreparation = false;
  steps.forEach((step, index) => {
    if (step.type === "evaluationPreparation") hasPreparation = true;
    if (step.type === "evaluation" && !hasPreparation) invalid.push(index + 1);
  });
  return invalid;
}
