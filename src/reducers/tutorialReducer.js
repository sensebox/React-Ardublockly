import { TUTORIAL_SUCCESS, TUTORIAL_ERROR, TUTORIAL_CHANGE, TUTORIAL_XML, TUTORIAL_ID, TUTORIAL_LEVEL } from '../actions/types';

import { tutorials } from '../components/Tutorial/tutorials';

const initialState = {
  status: window.localStorage.getItem('tutorial') ?
            JSON.parse(window.localStorage.getItem('tutorial'))
          : new Array(tutorials.length).fill({}),
  level: 'instruction',
  currentId: null,
  change: 0
};

export default function(state = initialState, action){
  switch(action.type){
    case TUTORIAL_SUCCESS:
    case TUTORIAL_ERROR:
    case TUTORIAL_XML:
      // update locale storage - sync with redux store
      window.localStorage.setItem('tutorial', JSON.stringify(action.payload));
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
    case TUTORIAL_LEVEL:
      return {
        ...state,
        level: action.payload
      }
    default:
      return state;
  }
}
