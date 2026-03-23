import { useEffect, useRef } from "react";
import { buildTutorialPayload } from "../utils/tutorialPayload";
import { saveTutorial } from "../services/tutorial.service";

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

  useEffect(() => {
    if (!enabled || isSaving.current) return;
    if (deepEqual(state, lastSaved.current)) return;

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
}
