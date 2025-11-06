import { BOARD } from "../actions/types";
import mini_opacity from "../data/mini_opacity.png";
import mcu_opacity from "../data/mcu_opacity.png";
import esp_opacity from "../data/esp_opacity.png";

const initialValue = () => {
  if (window.sessionStorage.getItem("board")) {
    setBackgroundImage(window.sessionStorage.getItem("board"));
    return window.sessionStorage.getItem("board");
  }
  return null;
};

const setBackgroundImage = (board) => {
  const root = document.querySelector(":root");
  switch (board) {
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
};

const initialState = {
  board: initialValue(),
};

export default function foo(state = initialState, action) {
  switch (action.type) {
    case BOARD:
      return {
        ...state,
        board: action.payload,
      };
    default:
      return state;
  }
}
