import { BOARD } from '../actions/types';

const initialValue = () => {
  if (window.localStorage.getItem("board")) {
    return window.localStorage.getItem("locale");
  }
  return "";
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
