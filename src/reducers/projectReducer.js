import {
  PROJECT_PROGRESS,
  GET_PROJECT,
  GET_PROJECTS,
  PROJECT_TYPE,
  PROJECT_DESCRIPTION,
  RESET_PROJECT,
} from "../actions/types";

const initialState = {
  projects: [],
  type: "",
  description: "",
  progress: false,
  xml: "",
};

export default function foo(state = initialState, action) {
  switch (action.type) {
    case PROJECT_PROGRESS:
      return {
        ...state,
        progress: !state.progress,
      };
    case GET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
        xml: "",
      };
    case GET_PROJECT:
      return {
        ...state,
        projects: [action.payload],
        xml: action.payload.xml || "",
      };
    case PROJECT_TYPE:
      return {
        ...state,
        type: action.payload,
      };
    case PROJECT_DESCRIPTION:
      return {
        ...state,
        description: action.payload,
      };
    case RESET_PROJECT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
