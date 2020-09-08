import { combineReducers } from 'redux';
import workspaceReducer from './workspaceReducer';
import tutorialReducer from './tutorialReducer';

export default combineReducers({
  workspace: workspaceReducer,
  tutorial: tutorialReducer
});
