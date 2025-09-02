import { BOARD } from "./types";
import mini_opacity from "../data/mini_opacity.png";
import mcu_opacity from "../data/mcu_opacity.png";
import esp_opacity from "../data/esp_opacity.png";
import { setBoardHelper } from "@/components/Blockly/helpers/board";

export const setBoard = (board) => (dispatch) => {
  window.sessionStorage.setItem("board", board);
  setBoardHelper(board);
  const root = document.querySelector(":root");
  switch (board) {
    case "MCU":
      root.style.setProperty("--url", `url(${mcu_opacity})`);
      break;
    case "MCU:mini":
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
    payload: board,
  });
};
