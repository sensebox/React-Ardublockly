/**
 * Utility functions for persisting tutorial answers to localStorage
 * Only stores answers/submissions, not progress (step position)
 */

const STORAGE_PREFIX = "tutorial_answers_";

export const ANSWERS_UPDATED_EVENT = "tutorial-answers-updated";

/**
 * Notify listeners that the saved answers for a tutorial have changed
 * @param {string} tutorialId - The tutorial ID
 */
export const notifyAnswersUpdated = (tutorialId) => {
  window.dispatchEvent(
    new CustomEvent(ANSWERS_UPDATED_EVENT, { detail: { tutorialId } }),
  );
};

/**
 * Get the storage key for a tutorial
 * @param {string} tutorialId - The tutorial ID
 * @returns {string} Storage key
 */
const getStorageKey = (tutorialId) => `${STORAGE_PREFIX}${tutorialId}`;

/**
 * Load saved answers for a tutorial from localStorage
 * @param {string} tutorialId - The tutorial ID
 * @returns {Array} Array of answer objects with _id, answer, and type
 */
export const loadAnswers = (tutorialId) => {
  try {
    const stored = window.localStorage.getItem(getStorageKey(tutorialId));
    if (!stored) return [];

    const answers = JSON.parse(stored);
    // Keep any persisted entry that has an id and at least one known payload field
    return Array.isArray(answers)
      ? answers.filter(
          (a) =>
            a &&
            a._id &&
            (a.answer !== undefined ||
              a.answers !== undefined ||
              a.freetextAnswer !== undefined ||
              a.xml !== undefined),
        )
      : [];
  } catch (e) {
    console.warn("Failed to load tutorial answers from localStorage", e);
    return [];
  }
};

/**
 * Get a map of answers keyed by their ID
 * @param {string} tutorialId - The tutorial ID
 * @returns {Object} Map of answer ID to answer data
 */
const loadAnswersMap = (tutorialId) => {
  const answers = loadAnswers(tutorialId);
  return answers.reduce((map, answer) => {
    map[answer._id] = answer;
    return map;
  }, {});
};

/**
 * Merge saved answers into task list
 * @param {Array} tasks - Array of task objects from server
 * @param {string} tutorialId - The tutorial ID
 * @returns {Array} Tasks with saved answers merged in
 */
export const mergeAnswersIntoTasks = (tasks, tutorialId) => {
  const savedAnswersMap = loadAnswersMap(tutorialId);

  return tasks.map((task) => {
    const savedAnswer = savedAnswersMap[task._id];
    if (savedAnswer) {
      return { ...task, ...savedAnswer };
    }
    return task;
  });
};

/**
 * Clear all saved answers for a tutorial
 * @param {string} tutorialId - The tutorial ID
 */
export const clearAnswers = (tutorialId) => {
  try {
    window.localStorage.removeItem(getStorageKey(tutorialId));
  } catch (e) {
    console.warn("Failed to clear tutorial answers from localStorage", e);
  }
};

/**
 * Insert or update a single answer entry for a tutorial and notify listeners
 * @param {string} tutorialId - The tutorial ID
 * @param {string} entryId - The unique id of the answer entry (e.g. task/question id)
 * @param {Object} payload - The answer payload to store alongside the entry id
 */
export const upsertAnswer = (tutorialId, entryId, payload) => {
  try {
    const answers = loadAnswers(tutorialId);
    const index = answers.findIndex((a) => a._id === entryId);
    const entry = { _id: entryId, ...payload };
    if (index >= 0) {
      answers[index] = entry;
    } else {
      answers.push(entry);
    }
    window.localStorage.setItem(
      getStorageKey(tutorialId),
      JSON.stringify(answers),
    );
    notifyAnswersUpdated(tutorialId);
  } catch (e) {
    console.warn("Failed to save tutorial answer to localStorage", e);
  }
};

/**
 * Remove a single answer entry for a tutorial and notify listeners
 * @param {string} tutorialId - The tutorial ID
 * @param {string} entryId - The unique id of the answer entry to remove
 */
export const removeAnswer = (tutorialId, entryId) => {
  try {
    const answers = loadAnswers(tutorialId).filter((a) => a._id !== entryId);
    window.localStorage.setItem(
      getStorageKey(tutorialId),
      JSON.stringify(answers),
    );
    notifyAnswersUpdated(tutorialId);
  } catch (e) {
    console.warn("Failed to remove tutorial answer from localStorage", e);
  }
};
