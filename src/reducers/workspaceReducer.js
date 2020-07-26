import { CHANGE_WORKSPACE, NEW_CODE, CREATE_BLOCK, MOVE_BLOCK, CHANGE_BLOCK, DELETE_BLOCK, CLEAR_STATS } from '../actions/types';


const initialState = {
  code: {
    arduino: '',
    xml: ''
  },
  stats: {
    create: 0,
    change: 0,
    delete: 0,
    move: 0
  },
  change: 0
};

export default function(state = initialState, action){
  switch(action.type){
    case NEW_CODE:
      return {
        ...state,
        code: action.payload
      };
    case CHANGE_WORKSPACE:
      return {
        ...state,
        change: state.change += 1
      };
    case CREATE_BLOCK:
    case MOVE_BLOCK:
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
