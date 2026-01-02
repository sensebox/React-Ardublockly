import { BOARD } from "./types";
import mini_opacity from "../data/mini_opacity.png";
import mcu_opacity from "../data/mcu_opacity.png";
import esp_opacity from "../data/esp_opacity.png";
import { setBoardHelper } from "@/components/Blockly/helpers/board";

export const setBoard = (board) => (dispatch) => {
  const boardTmp = board.toUpperCase();
  window.sessionStorage.setItem("board", boardTmp);
  setBoardHelper(boardTmp);
  const root = document.querySelector(":root");
  switch (boardTmp) {
    case "MCU":
      root.style.setProperty("--url", `url(${mcu_opacity})`);
      break;
    case "MCU:MINI":
      root.style.setProperty("--url", `url(${mini_opacity})`);
      break;
    case "MCU-S2":
      root.style.setProperty("--url", `url(${esp_opacity})`);
      break;
    default:
      break;
  }

  dispatch({
    type: BOARD,
    payload: boardTmp,
  });
};
