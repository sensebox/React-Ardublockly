import { TUTORIAL_SUCCESS, TUTORIAL_ERROR, TUTORIAL_CHANGE, TUTORIAL_XML, TUTORIAL_ID, TUTORIAL_STEP } from '../actions/types';

import tutorials from '../components/Tutorial/tutorials.json';

const initialStatus = () => {
  if(window.localStorage.getItem('status')){
    var status = JSON.parse(window.localStorage.getItem('status'));
    var existingTutorialIds = [];
    for(var i = 0; i < tutorials.length; i++){
      var tutorialsId = tutorials[i].id
      existingTutorialIds.push(tutorialsId);
      if(status.findIndex(status => status.id === tutorialsId) > -1){
        var tasks = tutorials[i].steps.filter(step => step.type === 'task');
        var existingTaskIds = [];
        for(var j = 0; j < tasks.length; j++){
          var tasksId = tasks[j].id;
          existingTaskIds.push(tasksId);
          if(status[i].tasks.findIndex(task => task.id === tasksId) === -1){
            // task does not exist
            status[i].tasks.push({id: tasksId});
          }
        }
        // deleting old tasks which do not longer exist
        if(existingTaskIds.length > 0){
          status[i].tasks = status[i].tasks.filter(task => existingTaskIds.indexOf(task.id) > -1);
        }
      }
      else{
        status.push({id: tutorialsId, tasks: new Array(tutorials[i].steps.filter(step => step.type === 'task').length).fill({})});
      }
    }
    // deleting old tutorials which do not longer exist
    if(existingTutorialIds.length > 0){
      status = status.filter(status => existingTutorialIds.indexOf(status.id) > -1);
    }
    console.log('tutorial', existingTutorialIds);
    console.log('tutorial', status);
    return status;
  }
  // window.localStorage.getItem('status') does not exist
  return tutorials.map(tutorial => {return {id: tutorial.id, tasks: tutorial.steps.filter(step => step.type === 'task').map(task => {return {id: task.id};})};});
};

const initialState = {
  status: initialStatus(),
  currentId: null,
  activeStep: 0,
  change: 0
};

export default function(state = initialState, action){
  switch(action.type){
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
        currentId: action.payload
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
