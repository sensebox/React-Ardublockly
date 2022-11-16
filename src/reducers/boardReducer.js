import { BOARD } from '../actions/types';
import mini_opacity from "../data/mini_opacity.png"
import mcu_opacity from "../data/mcu_opacity.png"

const initialValue = () => {
  if (window.sessionStorage.getItem("board")) {
    setBackgroundImage(window.sessionStorage.getItem("board"));
    return window.sessionStorage.getItem("board");
  }
  return null;
};

const setBackgroundImage = (board) => {
  const root = document.querySelector(':root');
  root.style.setProperty('--url', `url(${board === "mcu" ? mcu_opacity : mini_opacity})`);
}

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
