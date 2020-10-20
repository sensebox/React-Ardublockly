import { VISIT } from '../actions/types';


const initialState = {
  pageVisits: 0 // detect if previous URL was
};

export default function(state = initialState, action){
  switch(action.type){
    case VISIT:
      return {
        ...state,
        pageVisits: state.pageVisits += 1
      };
    default:
      return state;
  }
}
