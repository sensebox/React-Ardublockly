import { GET_ERRORS, CLEAR_MESSAGES, GET_SUCCESS } from '../actions/types';

const initialState = {
  msg: {},
  status: null,
  id: null
};

export default function foo(state = initialState, action){
  switch(action.type){
    case GET_ERRORS:
    case GET_SUCCESS:
      return {
        msg: action.payload.msg,
        status: action.payload.status,
        id: action.payload.id
      };
    case CLEAR_MESSAGES:
      return {
        msg: {},
        status: null,
        id: null
      };
    default:
      return state;
  }
}
