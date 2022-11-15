import {
  BOARD,
} from "./types";

export const setBoard = (board) => (dispatch) => {
  window.sessionStorage.setItem("board", board);
  dispatch({
    type: BOARD,
    payload: board,
  });
};