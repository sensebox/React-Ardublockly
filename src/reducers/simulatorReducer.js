import Interpreter from "js-interpreter";
import { START_SIMULATOR, STOP_SIMULATOR, NEW_CODE } from "../actions/types";
import initDom from "../components/Simulator/initDom";

const initialState = {
  code: "",
  isRunning: false,
  interpreter: null,
};

function runInterpreter(interpreter) {
  return new Promise((resolve) => {
    const nextStep = () => {
      if (interpreter.step()) {
        window.setTimeout(nextStep, 0);
      } else {
        resolve();
      }
    };
    nextStep();
  });
}

export default function simulatorReducer(state = initialState, action) {
  switch (action.type) {
    case NEW_CODE:
      const newInterpreter = new Interpreter(action.payload.simulator, initDom);
      return {
        ...state,
        code: action.payload.simulator,
        interpreter: newInterpreter,
      };
    case START_SIMULATOR:
      console.log("START_SIMULATOR");

      runInterpreter(state.interpreter).then(() => {
        console.log("Interpreter finished running");
        action.asyncDispatch({ type: STOP_SIMULATOR });
      });

      return {
        ...state,
        isRunning: true,
      };
    case STOP_SIMULATOR:
      console.log("STOP_SIMULATOR");
      return {
        ...state,
        isRunning: false,
        interpreter: new Interpreter(state.code, initDom),
      };
    default:
      return state;
  }
}
