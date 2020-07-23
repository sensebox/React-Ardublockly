import { NEW_CODE, CHANGE_WORKSPACE, NEW_WORKSPACE, CREATE_BLOCK, MOVE_BLOCK, CHANGE_BLOCK, DELETE_BLOCK, CLEAR_STATS } from './types';

import * as Blockly from 'blockly/core';

export const workspaceChange = () => (dispatch) => {
  dispatch({
    type: CHANGE_WORKSPACE
  })
}

export const initWorkspace = (workspace) => (dispatch) => {
  dispatch({
    type: NEW_WORKSPACE,
    payload: workspace
  });
}

export const onChangeWorkspace = (event) => (dispatch, getState) => {
    const workspace = Blockly.getMainWorkspace();
    dispatch({
      type: NEW_WORKSPACE,
      payload: workspace
    });
    dispatch({
      type: CHANGE_WORKSPACE,
    })
    var code = getState().workspace.code;
    code.arduino = Blockly.Arduino.workspaceToCode(workspace);
    var xmlDom = Blockly.Xml.workspaceToDom(workspace);
    code.xml = Blockly.Xml.domToPrettyText(xmlDom);
    dispatch({
      type: NEW_CODE,
      payload: code
    });
    console.log(event.type);
    var stats = getState().workspace.stats;
    if (event.type === Blockly.Events.BLOCK_CREATE){
      stats.create += event.ids.length;
      dispatch({
        type: CREATE_BLOCK,
        payload: stats
      });
    }
    else if (event.type === Blockly.Events.BLOCK_MOVE){
      stats.move += 1;
      dispatch({
        type: MOVE_BLOCK,
        payload: stats
      });
    }
    else if (event.type === Blockly.Events.BLOCK_CHANGE){
      stats.change += 1;
      dispatch({
        type: CHANGE_BLOCK,
        payload: stats
      });
    }
    else if (event.type === Blockly.Events.BLOCK_DELETE){
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
    delete: 0,
    move: 0
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
