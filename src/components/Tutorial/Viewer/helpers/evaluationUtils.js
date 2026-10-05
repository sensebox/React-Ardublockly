/**
 * Helpers for the "evaluationPreparation" (learner defines criteria) and
 * "evaluation" (learner writes a free text per criterion) step types.
 */

export const DEFAULT_CRITERIA_CONFIG = {
  minCriteria: 2,
  maxCriteria: 5,
  title: "",
  subtitle: "",
};

export const DEFAULT_CRITERIA_TITLE = "Deine Bewertungskriterien";

export const DEFAULT_EVALUATION_CONFIG = {
  sourceStepId: "",
  evaluations: [],
  allowLearnerEvaluations: false,
};

/**
 * Stable key of a step. `id` survives saving, `_id` is the fallback for
 * steps that were saved before `id` was persisted.
 */
export const getStepKey = (step) => step?.id || step?._id;

export const criteriaAnswerId = (step) => `${getStepKey(step)}_criteria`;
export const evaluationAnswerId = (step) => `${getStepKey(step)}_evaluation`;

export const newId = () =>
  window.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const getCriteriaConfig = (step) => ({
  ...DEFAULT_CRITERIA_CONFIG,
  ...(step?.criteriaConfig || {}),
});

export const getEvaluationConfig = (step) => ({
  ...DEFAULT_EVALUATION_CONFIG,
  ...(step?.evaluationConfig || {}),
});

/**
 * Find the preparation step an evaluation step takes its criteria from:
 * the configured one, otherwise the closest preparation step before it.
 */
export const findSourceStep = (steps, evaluationStep) => {
  const { sourceStepId } = getEvaluationConfig(evaluationStep);
  if (sourceStepId) {
    const configured = steps.find(
      (s) =>
        s.type === "evaluationPreparation" && getStepKey(s) === sourceStepId,
    );
    if (configured) return configured;
  }
  const index = steps.indexOf(evaluationStep);
  const preceding = index >= 0 ? steps.slice(0, index) : steps;
  return [...preceding]
    .reverse()
    .find((s) => s.type === "evaluationPreparation");
};

/** Criteria the learner actually filled in */
export const getFilledCriteria = (criteriaAnswer) =>
  (criteriaAnswer?.criteria || []).filter((c) => c.text?.trim());

export const isCriteriaComplete = (criteria, step) =>
  criteria.filter((c) => c.text?.trim()).length >=
  getCriteriaConfig(step).minCriteria;

/**
 * Creator evaluations always come first (titles from the builder),
 * learner-added evaluations follow if the step allows them.
 */
export const buildEvaluationList = (step, storedEvaluations = []) => {
  const config = getEvaluationConfig(step);
  const storedById = Object.fromEntries(
    storedEvaluations.map((e) => [e.id, e]),
  );
  const creatorEvaluations = config.evaluations.map((e) => ({
    id: e.id,
    title: e.title,
    learnerAdded: false,
    answers: storedById[e.id]?.answers || {},
  }));
  const learnerEvaluations = config.allowLearnerEvaluations
    ? storedEvaluations.filter((e) => e.learnerAdded)
    : [];
  return [...creatorEvaluations, ...learnerEvaluations];
};

const isEvaluationFilled = (evaluation, criteria) =>
  Boolean(evaluation.title?.trim()) &&
  criteria.every((c) => evaluation.answers?.[c.id]?.trim());

const isEvaluationUntouched = (evaluation, criteria) =>
  !evaluation.title?.trim() &&
  criteria.every((c) => !evaluation.answers?.[c.id]?.trim());

/**
 * Complete when at least one evaluation exists and everything started is
 * filled in. A learner-added evaluation that is still completely empty
 * (e.g. just added after finishing) doesn't block, so learners are free
 * to continue or add more. Evaluations the creator defined must be filled.
 */
export const isEvaluationComplete = (step, evaluations, criteria) => {
  if (criteria.length === 0) return false;
  const relevant = evaluations.filter(
    (e) => !e.learnerAdded || !isEvaluationUntouched(e, criteria),
  );
  if (relevant.length === 0) {
    // nothing to fill in, unless the learner is expected to add evaluations
    return !getEvaluationConfig(step).allowLearnerEvaluations;
  }
  return relevant.every((e) => isEvaluationFilled(e, criteria));
};

/**
 * Completion check used by the sidebar, based on the saved answers only
 * @param {Object} step - the step to check
 * @param {Array} steps - all steps of the tutorial
 * @param {Object} answersMap - saved answers keyed by their _id
 */
export const isEvaluationStepCompleted = (step, steps, answersMap) => {
  if (step.type === "evaluationPreparation") {
    return isCriteriaComplete(
      answersMap[criteriaAnswerId(step)]?.criteria || [],
      step,
    );
  }
  if (step.type === "evaluation") {
    const source = findSourceStep(steps, step);
    if (!source) return true;
    const criteria = getFilledCriteria(answersMap[criteriaAnswerId(source)]);
    const evaluations = buildEvaluationList(
      step,
      answersMap[evaluationAnswerId(step)]?.evaluations,
    );
    return isEvaluationComplete(step, evaluations, criteria);
  }
  return true;
};
