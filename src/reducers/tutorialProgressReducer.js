import {
  TUTORIAL_PROGRESS_ANSWER,
  TUTORIAL_PROGRESS_RESET,
  TUTORIAL_PROGRESS_SET_ALL,
  TUTORIAL_PROGRESS_START,
  TUTORIAL_PROGRESS_STEP_SEEN,
} from "@/actions/types";

const initialState = {
  byTutorialId: {}, // tutorialId -> progress
};

export default function tutorialProgressReducer(state = initialState, action) {
  switch (action.type) {
    case TUTORIAL_PROGRESS_SET_ALL:
      return {
        ...state,
        byTutorialId: action.payload,
      };

    case TUTORIAL_PROGRESS_START: {
      const { tutorialId, progress } = action.payload;

      return {
        ...state,
        byTutorialId: {
          ...state.byTutorialId,
          [tutorialId]: progress,
        },
      };
    }
    case TUTORIAL_PROGRESS_STEP_SEEN: {
      const { tutorialId, stepId } = action.payload;
      const tutorialProgress = state.byTutorialId[tutorialId];

      if (!tutorialProgress) return state;

      const stepProgress = tutorialProgress.steps?.[stepId];

      // 🔹 Schon gesehen → nichts tun
      if (stepProgress?.seen === true) {
        return state;
      }

      return {
        ...state,
        byTutorialId: {
          ...state.byTutorialId,
          [tutorialId]: {
            ...tutorialProgress,
            steps: {
              ...tutorialProgress.steps,
              [stepId]: {
                ...(stepProgress ?? { questions: {} }),
                seen: true,
              },
            },
          },
        },
      };
    }

    case TUTORIAL_PROGRESS_ANSWER: {
      const { tutorialId, stepId, questionId, answer, correct } =
        action.payload;

      const tutorialProgress = state.byTutorialId[tutorialId] || {};

      return {
        ...state,
        byTutorialId: {
          ...state.byTutorialId,
          [tutorialId]: {
            ...tutorialProgress,
            steps: {
              ...tutorialProgress.steps,
              [stepId]: {
                ...(tutorialProgress.steps?.[stepId] || {}),
                questions: {
                  ...(tutorialProgress.steps?.[stepId]?.questions || {}),
                  [questionId]: {
                    answered: true,
                    correct,
                    answer,
                  },
                },
              },
            },
          },
        },
      };
    }

    case TUTORIAL_PROGRESS_RESET: {
      const { tutorialId } = action.payload;

      const next = { ...state.byTutorialId };
      delete next[tutorialId];

      return {
        ...state,
        byTutorialId: next,
      };
    }

    default:
      return state;
  }
}
