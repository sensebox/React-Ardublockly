import { NEW_WORKSPACE, CREATE_BLOCK, CHANGE_BLOCK, DELETE_BLOCK, CLEAR_STATS } from '../actions/types';


const initialState = {
  old: {},
  new: {},
  stats: {
    create: 0,
    change: 0,
    delete: 0,
  },
  test: 0
};

export default function(state = initialState, action){
  switch(action.type){
    case NEW_WORKSPACE:
      return {
        ...state,
        old: action.payload.old,
        new: action.payload.new,
        test: state.test += 1
      };
    case CREATE_BLOCK:
    case CHANGE_BLOCK:
    case DELETE_BLOCK:
    case CLEAR_STATS:
      return {
        ...state,
        stats: action.payload
      };
    default:
      return state;
  }
}
