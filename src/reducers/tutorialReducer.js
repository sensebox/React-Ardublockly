import { TUTORIAL_SUCCESS, TUTORIAL_ERROR, TUTORIAL_CHANGE } from '../actions/types';

import { tutorials } from '../components/Tutorial/tutorials';

const initialState = {
  status: window.localStorage.getItem('tutorial') ?
            JSON.parse(window.localStorage.getItem('tutorial'))
          : new Array(tutorials.length).fill({}),
  change: 0
};

export default function(state = initialState, action){
  switch(action.type){
    case TUTORIAL_SUCCESS:
    case TUTORIAL_ERROR:
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
    default:
      return state;
  }
}
