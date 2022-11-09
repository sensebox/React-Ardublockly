import { BOARD } from '../actions/types';

const initialValue = () => {
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
