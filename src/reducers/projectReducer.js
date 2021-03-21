import { PROJECT_PROGRESS, GET_PROJECT, GET_PROJECTS, PROJECT_TYPE, PROJECT_DESCRIPTION } from '../actions/types';

const initialState = {
  projects: [],
  type: '',
  description: '',
  progress: false
};

export default function foo(state = initialState, action) {
  switch (action.type) {
    case PROJECT_PROGRESS:
      return {
        ...state,
        progress: !state.progress
      }
    case GET_PROJECTS:
      return {
        ...state,
        projects: action.payload
      };
    case GET_PROJECT:
      return {
        ...state,
        projects: [action.payload]
      }
    case PROJECT_TYPE:
      return {
        ...state,
        type: action.payload
      }
    case PROJECT_DESCRIPTION:
      return {
        ...state,
        description: action.payload
      }
    default:
      return state;
  }
}
