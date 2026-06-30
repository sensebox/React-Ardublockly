import { BOARD, SET_DEVICE_PORT, CLEAR_DEVICE_PORT, SET_BOOTLOADER_PORT, CLEAR_BOOTLOADER_PORT } from "../actions/types";
import mini_opacity from "../data/mini_opacity.png";
import mcu_opacity from "../data/mcu_opacity.png";
import esp_opacity from "../data/esp_opacity.png";
import eye_opacity from "../data/eye_opacity.png";

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
    case "MCU-EYE":
      root.style.setProperty("--url", `url(${eye_opacity})`);
      break;
    default:
      break;
  }
};

const initialState = {
  board: initialValue(),
  devicePort: window.sessionStorage.getItem("devicePort") || null,
  deviceLabel: window.sessionStorage.getItem("deviceLabel") || "",
  bootloaderPortPrepared: window.sessionStorage.getItem("bootloaderPortPrepared") === "true" || false,
};

export default function foo(state = initialState, action) {
  switch (action.type) {
    case BOARD:
      return {
        ...state,
        board: action.payload,
      };
    case SET_DEVICE_PORT:
      window.sessionStorage.setItem("devicePort", action.payload.portInfo);
      window.sessionStorage.setItem("deviceLabel", action.payload.label);
      return {
        ...state,
        devicePort: action.payload.portInfo,
        deviceLabel: action.payload.label,
      };
    case CLEAR_DEVICE_PORT:
      window.sessionStorage.removeItem("devicePort");
      window.sessionStorage.removeItem("deviceLabel");
      return {
        ...state,
        devicePort: null,
        deviceLabel: "",
      };
    case SET_BOOTLOADER_PORT:
      window.sessionStorage.setItem("bootloaderPortPrepared", "true");
      return {
        ...state,
        bootloaderPortPrepared: true,
      };
    case CLEAR_BOOTLOADER_PORT:
      window.sessionStorage.removeItem("bootloaderPortPrepared");
      return {
        ...state,
        bootloaderPortPrepared: false,
      };
    default:
      return state;
  }
}
