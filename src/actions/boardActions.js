import {
  BOARD,
} from "./types";
import mini_opacity from "../data/mini_opacity.png"
import mcu_opacity from "../data/mcu_opacity.png"

export const setBoard = (board) => (dispatch) => {
  window.sessionStorage.setItem("board", board);
  const root = document.querySelector(':root');
  root.style.setProperty('--url', `url(${board === "mcu" ? mcu_opacity : mini_opacity})`);
  dispatch({
    type: BOARD,
    payload: board,
  });
};