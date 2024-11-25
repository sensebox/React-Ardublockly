import {
  GET_PROJECTS,
  GET_PROJECT,
  PROJECT_PROGRESS,
  PROJECT_TYPE,
  PROJECT_DESCRIPTION,
} from '../actions/types'; // Make sure these are your actual action types

const initialState = {
  projects: [],
  progress: false,
  type: '',
  description: '',
};

export default function foo(state = initialState, action) {
  switch (action.type) {
    case PROJECT_PROGRESS:
      // Explicitly set progress to true or false, instead of toggling
      return {
        ...state,
        progress: action.payload,
      };

    case GET_PROJECTS:
      console.log(action.payload);
      // When fetching multiple projects, reset the description and update the projects
      return {
        ...state,
        projects: action.payload, // Replace the current projects with the fetched projects
        progress: false, // Reset progress once the data is loaded
      };

    case GET_PROJECT:
      // When fetching a single project, reset and update the state with the new project
      console.log(action.payload);
      return {
        ...state,
        projects: [action.payload] , // Replace the current projects with the fetched project
      };

    case PROJECT_TYPE:
      // Set the project type
      return {
        ...state,
        type: action.payload,
      };

    case PROJECT_DESCRIPTION:
      // Update project description when received
      return {
        ...state,
        description: action.payload,
      };

    default:
      return state;
  }
}