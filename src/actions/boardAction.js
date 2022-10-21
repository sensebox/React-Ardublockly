import {
    BOARD,
  } from "./types";

export const setBoard = (board) => (dispatch) => {
    dispatch({
      type: BOARD,
      payload: board,
    });
  };