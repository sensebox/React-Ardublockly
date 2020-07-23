import { combineReducers } from 'redux';
import workspaceReducer from './workspaceReducer';

export default combineReducers({
  workspace: workspaceReducer
});
