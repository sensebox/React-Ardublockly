import { TUTORIAL_PROGRESS, GET_TUTORIAL, GET_TUTORIALS, TUTORIAL_SUCCESS, TUTORIAL_ERROR, TUTORIAL_CHANGE, TUTORIAL_XML, TUTORIAL_STEP } from '../actions/types';


const initialStatus = () => {
  if (window.localStorage.getItem('status')) {
    var status = JSON.parse(window.localStorage.getItem('status'));
    return status;
  }
  return [];
  // // window.localStorage.getItem('status') does not exist
  // return tutorials.map(tutorial => { return { id: tutorial.id, tasks: tutorial.steps.filter(step => step.type === 'task').map(task => { return { id: task.id }; }) }; });
};

const initialState = {
  status: initialStatus(),
  activeStep: 0,
  change: 0,
  tutorials: [],
  progress: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TUTORIAL_PROGRESS:
      return {
        ...state,
        progress: !state.progress
      }
    case GET_TUTORIALS:
      return {
        ...state,
        tutorials: action.payload
      };
    case GET_TUTORIAL:
      return {
        ...state,
        tutorials: [action.payload]
      }
    case TUTORIAL_SUCCESS:
    case TUTORIAL_ERROR:
    case TUTORIAL_XML:
      // update locale storage - sync with redux store
      window.localStorage.setItem('status', JSON.stringify(action.payload));
      return {
        ...state,
        status: action.payload
      };
    case TUTORIAL_CHANGE:
      return {
        ...state,
        change: state.change += 1
      }
    case TUTORIAL_STEP:
      return {
        ...state,
        activeStep: action.payload
      }
    default:
      return state;
  }
}
