import { combineReducers } from 'redux';
import workspaceReducer from './workspaceReducer';
import tutorialReducer from './tutorialReducer';
import tutorialBuilderReducer from './tutorialBuilderReducer';
import generalReducer from './generalReducer';

export default combineReducers({
  workspace: workspaceReducer,
  tutorial: tutorialReducer,
  builder: tutorialBuilderReducer,
  general: generalReducer
});
