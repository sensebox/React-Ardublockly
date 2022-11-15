import { BOARD } from '../actions/types';

const initialValue = () => {
  if (window.sessionStorage.getItem("board")) {
    return window.sessionStorage.getItem("board");
  }
  return null;
};

const initialState = {
    board: initialValue()
};

export default function foo(state = initialState, action){
  switch(action.type){
    case BOARD:
      return {
        ...state,
        board: action.payload,
      };
    default:
      return state;
  }
}
