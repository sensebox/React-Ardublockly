import { useEffect, useMemo, useRef } from "react";
import { buildTutorialPayload } from "../utils/tutorialPayload";
import { saveTutorial } from "../services/tutorial.service";
import { findEvaluationStepsWithoutPreparation } from "../utils/validation";

const deepEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

export function useTutorialAutosave({
  enabled,
  state,
  token,
  tutorialId,
  onSaved,
}) {
  const lastSaved = useRef(state);
  const isSaving = useRef(false);

  // Autosave can't store a tutorial with evaluation steps that lack a
  // preceding criteria step, so it pauses until the author fixes them.
  const blockingEvaluationSteps = useMemo(
    () => findEvaluationStepsWithoutPreparation(state.steps),
    [state.steps],
  );

  useEffect(() => {
    if (!enabled || isSaving.current) return;
    if (deepEqual(state, lastSaved.current)) return;
    if (blockingEvaluationSteps.length > 0) return;

    const run = async () => {
      isSaving.current = true;
      try {
        const payload = buildTutorialPayload(state);
        const res = await saveTutorial({
          id: tutorialId,
          payload,
          token,
        });
        lastSaved.current = state;
        onSaved?.(res);
      } finally {
        isSaving.current = false;
      }
    };

    run();
  }, [state, enabled]);

  return {
    paused: enabled && blockingEvaluationSteps.length > 0,
    blockingEvaluationSteps,
  };
}
