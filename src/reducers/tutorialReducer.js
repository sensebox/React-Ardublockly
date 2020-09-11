import { TUTORIAL_SUCCESS, TUTORIAL_ERROR, TUTORIAL_CHANGE, TUTORIAL_XML, TUTORIAL_ID, TUTORIAL_STEP } from '../actions/types';

import tutorials from '../components/Tutorial/tutorials.json';

const initialState = {
  status: window.localStorage.getItem('status') ?
            JSON.parse(window.localStorage.getItem('status'))
          : tutorials.map(tutorial => {return {id: tutorial.id, tasks: new Array(tutorial.steps.filter(step => step.type === 'task').length).fill({}) };}),
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
