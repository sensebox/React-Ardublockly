import { TUTORIAL_SUCCESS, TUTORIAL_ERROR, TUTORIAL_CHANGE } from '../actions/types';


const initialState = {
  status: JSON.parse(window.localStorage.getItem('tutorial')),
  change: 0
};

export default function(state = initialState, action){
  switch(action.type){
    case TUTORIAL_SUCCESS:
    case TUTORIAL_ERROR:
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
