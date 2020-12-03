import { combineReducers } from 'redux';
import workspaceReducer from './workspaceReducer';
import tutorialReducer from './tutorialReducer';
import tutorialBuilderReducer from './tutorialBuilderReducer';
import generalReducer from './generalReducer';
import projectReducer from './projectReducer';
import messageReducer from './messageReducer';
import authReducer from './authReducer';

export default combineReducers({
  auth: authReducer,
  workspace: workspaceReducer,
  tutorial: tutorialReducer,
  builder: tutorialBuilderReducer,
  project: projectReducer,
  general: generalReducer,
  message: messageReducer
});
