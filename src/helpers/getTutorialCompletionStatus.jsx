/**
 * Prüft, ob ein Tutorial abgeschlossen ist
 * und gibt zurück, welche Steps noch fehlen
 *
 * @param {Object} tutorial
 * @param {Object} progress
 * @returns {{
 *   completed: boolean,
 *   missing: Array<{ stepId: string, type: string, reason: string }>
 * }}
 */
export function getTutorialCompletionStatus(tutorial, progress) {
  if (!tutorial?.steps || !progress?.steps) {
    return {
      completed: false,
      missing: [],
    };
  }

  const missing = [];

  tutorial.steps.forEach((step) => {
    const stepProgress = progress.steps[step._id];

    // ❌ Step nicht gesehen
    if (!stepProgress?.seen) {
      missing.push({
        stepId: step._id,
        type: step.type,
        reason: "not_seen",
      });
      return;
    }

    // 🔍 Task-Step → korrekte Antwort nötig
    const isTaskStep = ["question"].includes(step.type);

    if (!isTaskStep) return;

    const questions = stepProgress.questions ?? {};
    const hasCorrectAnswer = Object.values(questions).some((q) => q?.correct);
    if (!hasCorrectAnswer) {
      missing.push({
        stepId: step._id,
        type: step.type,
        reason: "task_not_completed",
      });
    }
  });

  return {
    completed: missing.length === 0,
    missing,
  };
}
