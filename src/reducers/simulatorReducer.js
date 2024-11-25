import Interpreter from "js-interpreter";
import { START_SIMULATOR, STOP_SIMULATOR, NEW_CODE } from "../actions/types";
import initDom from "../components/Simulator/initDom";

const initialState = {
  code: "",
  modules: [],
  isRunning: false,
  interpreter: null,
  simulationStartTimestamp: null, // Timestamp when the simulation starts
  abortController: null, // Added for abort control
};

function runInterpreter(interpreter, abortSignal) {
  return new Promise((resolve, reject) => {
    const nextStep = () => {
      if (abortSignal.aborted) {
        reject(new Error("Interpreter execution aborted"));
        return;
      }
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
    case NEW_CODE: {
      if (
        JSON.stringify(action.payload.simulator) === JSON.stringify(state.code)
      ) {
        return state;
      }

      const newInterpreter = new Interpreter(action.payload.simulator, initDom);

      // Extract the modules comment
      const moduleCommentMatch = action.payload.simulator.match(
        /^\/\/\s*modules:\s*(.*)$/m,
      );

      let modules = [];
      if (moduleCommentMatch) {
        const modulesString = moduleCommentMatch[1]; // "display, temperature"
        modules = modulesString.split(",").map((module) => module.trim());
        console.log(modules); // ["display", "temperature"]
      } else {
        console.log("No modules comment found.");
      }

      if (state.isRunning) {
        state.abortController.abort();
      }

      return {
        ...state,
        code: action.payload.simulator,
        modules: modules,
        interpreter: newInterpreter,
        simulationStartTimestamp: null,
        abortController: null, // Reset abortController
        isRunning: false,
      };
    }
    case START_SIMULATOR: {
      console.log("START_SIMULATOR");

      const abortController = new AbortController();

      runInterpreter(state.interpreter, abortController.signal)
        .then(() => {
          console.log("Interpreter finished running");
          action.asyncDispatch({ type: STOP_SIMULATOR });
        })
        .catch((error) => {
          if (error.message === "Interpreter execution aborted") {
            console.log("Simulation stopped manually");
          } else {
            console.error(error);
          }
        });

      return {
        ...state,
        isRunning: true,
        simulationStartTimestamp: new Date(),
        abortController, // Save the controller for stopping
      };
    }
    case STOP_SIMULATOR: {
      console.log("STOP_SIMULATOR");
      if (state.abortController) {
        state.abortController.abort(); // Abort the current simulation
      }

      return {
        ...state,
        isRunning: false,
        interpreter: new Interpreter(state.code, initDom), // Reset interpreter
        simulationStartTimestamp: null,
        abortController: null, // Clear the controller
      };
    }
    default:
      return state;
  }
}
