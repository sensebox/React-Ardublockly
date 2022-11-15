import {
  BOARD,
} from "./types";

export const setBoard = (board) => (dispatch) => {
  window.localStorage.setItem("board", board);
  dispatch({
    type: BOARD,
    payload: board,
  });
};