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

export default combineReducers({
  auth: authReducer,
  board: boardReducer,
  workspace: workspaceReducer,
  tutorial: tutorialReducer,
  builder: tutorialBuilderReducer,
  project: projectReducer,
  general: generalReducer,
  message: messageReducer,
  sensorwiki: sensorwikiReducer,
});
