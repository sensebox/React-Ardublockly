import { combineReducers } from 'redux';
import workspaceReducer from './workspaceReducer';
import tutorialReducer from './tutorialReducer';
import tutorialBuilderReducer from './tutorialBuilderReducer';
import generalReducer from './generalReducer';
import messageReducer from './messageReducer';

export default combineReducers({
  workspace: workspaceReducer,
  tutorial: tutorialReducer,
  builder: tutorialBuilderReducer,
  general: generalReducer,
  message: messageReducer
});
