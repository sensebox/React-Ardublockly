import { combineReducers } from 'redux';
import workspaceReducer from './workspaceReducer';
import tutorialReducer from './tutorialReducer';
import tutorialBuilderReducer from './tutorialBuilderReducer';
import generalReducer from './generalReducer';
import projectReducer from './projectReducer';
import messageReducer from './messageReducer';

export default combineReducers({
  workspace: workspaceReducer,
  tutorial: tutorialReducer,
  builder: tutorialBuilderReducer,
  project: projectReducer,
  general: generalReducer,
  message: messageReducer
});
