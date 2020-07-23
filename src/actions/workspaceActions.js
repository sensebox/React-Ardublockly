import { NEW_WORKSPACE, CREATE_BLOCK, CHANGE_BLOCK, DELETE_BLOCK, CLEAR_STATS } from './types';

export const onChangeWorkspace = (event) => (dispatch, getState) => {
  var oldWorkspace = getState().workspace.new; // stored 'new workspace' is from now on old
  var newWorkspace = window.Ardublockly.workspace;
    dispatch({
      type: NEW_WORKSPACE,
      payload: {new: newWorkspace, old: oldWorkspace}
    });
    var stats = getState().workspace.stats;
    if (event.type === window.Blockly.Events.CREATE){
      stats.create += event.ids.length;
      dispatch({
        type: CREATE_BLOCK,
        payload: stats
      });
    }
    else if (event.type === window.Blockly.Events.CHANGE){
      stats.change += 1;
      dispatch({
        type: CHANGE_BLOCK,
        payload: stats
      });
    }
    else if (event.type === window.Blockly.Events.DELETE){
      if(stats.create > 0){
        stats.delete += event.ids.length;
        dispatch({
          type: DELETE_BLOCK,
          payload: stats
        });
      }
    }
};

export const clearStats = () => (dispatch) => {
  var stats = {
    create: 0,
    change: 0,
    delete: 0
  };
  dispatch({
    type: CLEAR_STATS,
    payload: stats
  });
};

export const setWorkspace = (workspace) => (dispatch, getState) => {
  dispatch({
    type: NEW_WORKSPACE,
    payload: {new: workspace, old: getState().workspace.new}
  });
};
