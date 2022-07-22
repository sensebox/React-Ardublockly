import {
  PROGRESS,
  JSON_STRING,
  BUILDER_CHANGE,
  BUILDER_ERROR,
  BUILDER_TITLE,
  BUILDER_ID,
  BUILDER_ADD_STEP,
  BUILDER_DELETE_STEP,
  BUILDER_CHANGE_STEP,
  BUILDER_CHANGE_ORDER,
  BUILDER_DELETE_PROPERTY,
  BUILDER_DIFFICULTY,
  BUILDER_PUBLIC,
  BUILDER_REVIEW,
} from "../actions/types";

const initialState = {
  change: 0,
  progress: false,
  json: "",
  title: "",
  difficulty: 0,
  public: false,
  review: false,
  id: "",
  steps: [
    {
      id: 1,
      type: "instruction",
      headline: "",
      text: "",
      hardware: [],
      requirements: [],
    },
  ],
  error: {
    steps: [{}],
  },
};

export default function foo(state = initialState, action) {
  switch (action.type) {
    case BUILDER_CHANGE:
      return {
        ...state,
        change: (state.change += 1),
      };
    case BUILDER_TITLE:
      return {
        ...state,
        title: action.payload,
      };
    case BUILDER_PUBLIC:
      return {
        ...state,
        public: action.payload,
      };
    case BUILDER_DIFFICULTY:
      return {
        ...state,
        difficulty: action.payload,
      };
    case BUILDER_REVIEW:
      return {
        ...state,
        review: action.payload,
      };
    case BUILDER_ID:
      return {
        ...state,
        id: action.payload,
      };
    case BUILDER_ADD_STEP:
    case BUILDER_DELETE_STEP:
    case BUILDER_CHANGE_STEP:
    case BUILDER_CHANGE_ORDER:
    case BUILDER_DELETE_PROPERTY:
      return {
        ...state,
        steps: action.payload,
      };
    case BUILDER_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case PROGRESS:
      return {
        ...state,
        progress: action.payload,
      };
    case JSON_STRING:
      return {
        ...state,
        json: action.payload,
      };
    default:
      return state;
  }
}
