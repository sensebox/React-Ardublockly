import store from "@/store"; // ggf. Pfad anpassen

export const isQuestionAnswered = (step) => {
  if (!step) return false;
  const state = store.getState();
  const answeredStore = state.tutorial?.answeredQuestions || {};

  const isQuestion = step.type === "question" || step.type === "blockly";
  if (!isQuestion) return true;

  const id = step?.questionData?.[0]?._id;
  if (!id) return false;

  if (answeredStore[id] === true) return true;

  return document.cookie.includes(`${id}=true`);
};
