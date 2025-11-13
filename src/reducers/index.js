import { combineReducers } from "redux";
import workspaceReducer from "./workspaceReducer";
import tutorialReducer from "./tutorialReducer";
import tutorialBuilderReducer from "./tutorialBuilderReducer";
import generalReducer from "./generalReducer";
import projectReducer from "./projectReducer";
import messageReducer from "./messageReducer";
import authReducer from "./authReducer";
import boardReducer from "./boardReducer";
import sensorwikiReducer from "./sensorwikiReducer";
import simulatorReducer from "./simulatorReducer";
import { fluoroASMReducer } from "./fluoroASMReducer";
import logReducer from "./logReducer";

export default combineReducers({
  auth: authReducer,
  board: boardReducer,
  workspace: workspaceReducer,
  tutorial: tutorialReducer,
  tutorialBuilder: tutorialBuilderReducer,
  project: projectReducer,
  general: generalReducer,
  message: messageReducer,
  sensorwiki: sensorwikiReducer,
  simulator: simulatorReducer,
  fluoroASM: fluoroASMReducer,
  logs: logReducer,
});
