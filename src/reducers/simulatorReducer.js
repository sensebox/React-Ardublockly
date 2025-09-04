import Interpreter from "js-interpreter";
import {
  START_SIMULATOR,
  STOP_SIMULATOR,
  NEW_CODE,
  SET_MODULE_VALUE,
} from "../actions/types";
import initSimulator from "../components/Simulator/init";

const initialState = {
  code: "",
  modules: [],
  moduleValues: {},
  isRunning: false,
  interpreter: null,
  simulationStartTimestamp: null,
  abortController: null,
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
      console.log(initSimulator, action.payload);
      const newInterpreter = new Interpreter(
        action.payload.simulator,
        initSimulator,
      );

      // Extract the modules comment
      const moduleCommentMatch = action.payload.simulator.match(
        /^\/\/\s*modules:\s*(.*?)\s*#$/m,
      );

      let modules = [];
      if (moduleCommentMatch) {
        const modulesString = moduleCommentMatch[1]; // "display, temperature"
        modules = modulesString
          .split(",")
          .map((module) => module.trim())
          .filter((m) => m.length > 0)
          .map((type, index) => ({
            id: `m_${index}`,
            type,
          }));
      } else {
        console.log("No modules comment found.");
      }

      // Initialisiere Werte separat
      const moduleValues = {};
      modules.forEach((mod) => {
        switch (mod.type) {
          case "senseBox_hdc1080":
            moduleValues["senseBox_hdc1080_temp"] = 20;
            moduleValues["senseBox_hdc1080_humidity"] = 50;
            break;
          case "sensebox_sensor_dps310":
            moduleValues["sensebox_dps310_temp"] = 20;
            moduleValues["sensebox_dps310_pressure"] = 1013;
            moduleValues["sensebox_dps310_altitude"] = 0;
            break;
          case "senseBox_lightUv":
            moduleValues["sensebox_light_uv"] = 55;
            moduleValues["sensebox_light_lux"] = 2500;
          case "sensebox_scd30":
            moduleValues["sensebox_scd_co2"] = 400;
            moduleValues["sensebox_scd_temp"] = 20;
            moduleValues["sensebox_scd_humi"] = 50;
          case "sensebox_tof_imager":
            moduleValues["sensebox_tof_dist"] = 1000;
          case "senseBox_smt50":
            moduleValues["sensebox_smt50_temp"] = 20;
            moduleValues["sensebox_smt50_moisture"] = 50;
          case "sensebox_esp32s2_accelerometer":
            moduleValues["accelerometer_x"] = 0;
            moduleValues["accelerometer_y"] = 0;
            moduleValues["accelerometer_z"] = 0;
          case "sensebox_sensor_sds011":
            moduleValues["sensebox_sds_pm10"] = 0;
            moduleValues["sensebox_sds_pm25"] = 0;
          case "sensebox_sensor_sps30":
            moduleValues["sensebox_sps_pm1"] = 0;
            moduleValues["sensebox_sps_pm25"] = 0;
            moduleValues["sensebox_sps_pm4"] = 0;
            moduleValues["sensebox_sps_pm10"] = 0;
          case "sensebox_rg15_rainsensor":
            moduleValues["sensebox_rg15_total_rainfall"] = 0;
            moduleValues["sensebox_rg15_rainfall_intensity"] = 0;
          default:
            moduleValues[mod.type] = null;
            break;
        }
      });

      if (state.isRunning) {
        state.abortController.abort();
      }

      return {
        ...state,
        code: action.payload.simulator,
        modules,
        moduleValues,
        interpreter: newInterpreter,
        simulationStartTimestamp: null,
        abortController: null,
        isRunning: false,
      };
    }
    case START_SIMULATOR: {
      console.log("START_SIMULATOR");

      const abortController = new AbortController();
      console.log(state);
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
        interpreter: new Interpreter(state.code, initSimulator), // Reset interpreter
        simulationStartTimestamp: null,
        abortController: null, // Clear the controller
      };
    }
    case SET_MODULE_VALUE: {
      const { type, value } = action.payload;
      return {
        ...state,
        moduleValues: {
          ...state.moduleValues,
          [type]: value,
        },
      };
    }

    default:
      return state;
  }
}
