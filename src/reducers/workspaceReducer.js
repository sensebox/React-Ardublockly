import { CHANGE_WORKSPACE, NEW_CODE, CREATE_BLOCK, MOVE_BLOCK, CHANGE_BLOCK, DELETE_BLOCK, CLEAR_STATS, NAME } from '../actions/types';


const initialState = {
  code: {
    arduino: '',
    xml: ''
  },
  stats: {
    create: -1, // initialXML is created automatically, Block is not part of the statistics
    change: 0,
    delete: 0,
    move: -1 // initialXML is moved automatically, Block is not part of the statistics
  },
  change: 0,
  name: null
};

export default function foo(state = initialState, action){
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
    case NAME:
      return {
        ...state,
        name: action.payload
      }
    default:
      return state;
  }
}
