import { TUTORIAL_PROGRESS, GET_TUTORIAL, GET_TUTORIALS, TUTORIAL_SUCCESS, TUTORIAL_ERROR, TUTORIAL_CHANGE, TUTORIAL_XML, TUTORIAL_ID, TUTORIAL_STEP } from '../actions/types';

import tutorials from '../data/tutorials';

const initialStatus = () => {
  if (window.localStorage.getItem('status')) {
    var status = JSON.parse(window.localStorage.getItem('status'));
    var existingTutorialIds = tutorials.map((tutorial, i) => {
      var tutorialsId = tutorial.id;
      var statusIndex = status.findIndex(status => status.id === tutorialsId);
      if (statusIndex > -1) {
        var tasks = tutorial.steps.filter(step => step.type === 'task');
        var existingTaskIds = tasks.map((task, j) => {
          var tasksId = task.id;
          if (status[statusIndex].tasks.findIndex(task => task.id === tasksId) === -1) {
            // task does not exist
            status[statusIndex].tasks.push({ id: tasksId });
          }
          return tasksId;
        });
        // deleting old tasks which do not longer exist
        if (existingTaskIds.length > 0) {
          status[statusIndex].tasks = status[statusIndex].tasks.filter(task => existingTaskIds.indexOf(task.id) > -1);
        }
      }
      else {
        status.push({ id: tutorialsId, tasks: tutorial.steps.filter(step => step.type === 'task').map(task => { return { id: task.id }; }) });
      }
      return tutorialsId;
    });
    // deleting old tutorials which do not longer exist
    if (existingTutorialIds.length > 0) {
      status = status.filter(status => existingTutorialIds.indexOf(status.id) > -1);
    }
    return status;
  }
  // window.localStorage.getItem('status') does not exist
  return tutorials.map(tutorial => { return { id: tutorial.id, tasks: tutorial.steps.filter(step => step.type === 'task').map(task => { return { id: task.id }; }) }; });
};

const initialState = {
  status: initialStatus(),
  currentIndex: null,
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
    case TUTORIAL_ID:
      return {
        ...state,
        currentIndex: tutorials.findIndex(tutorial => tutorial.id === action.payload)
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
