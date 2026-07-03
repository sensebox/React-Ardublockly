import {
  BOARD,
  SET_DEVICE_PORT,
  CLEAR_DEVICE_PORT,
  SET_BOOTLOADER_PORT,
  CLEAR_BOOTLOADER_PORT,
} from "./types";
import mini_opacity from "../data/mini_opacity.png";
import mcu_opacity from "../data/mcu_opacity.png";
import eye_opacity from "../data/eye_opacity.png";
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
    case "MCU-EYE":
      root.style.setProperty("--url", `url(${eye_opacity})`);
      break;
    default:
      break;
  }

  dispatch({
    type: BOARD,
    payload: boardTmp,
  });
};

export const setDevicePort = (portInfo, label) => (dispatch) => {
  dispatch({
    type: SET_DEVICE_PORT,
    payload: { portInfo, label },
  });
};

export const clearDevicePort = () => (dispatch) => {
  dispatch({
    type: CLEAR_DEVICE_PORT,
  });
};

export const setBootloaderPortPrepared = () => (dispatch) => {
  dispatch({
    type: SET_BOOTLOADER_PORT,
  });
};

export const clearBootloaderPortPrepared = () => (dispatch) => {
  dispatch({
    type: CLEAR_BOOTLOADER_PORT,
  });
};
