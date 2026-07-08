/**
 * Utility functions for persisting tutorial answers to localStorage
 * Only stores answers/submissions, not progress (step position)
 */

const STORAGE_PREFIX = "tutorial_answers_";

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
    // Return only entries that have actual answers (not empty task objects)
    return Array.isArray(answers)
      ? answers.filter((a) => a.answer !== undefined)
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
