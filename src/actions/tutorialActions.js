import { TUTORIAL_SUCCESS, TUTORIAL_ERROR, TUTORIAL_CHANGE, TUTORIAL_XML, TUTORIAL_ID, TUTORIAL_STEP } from './types';

export const tutorialChange = () => (dispatch) => {
  dispatch({
    type: TUTORIAL_CHANGE
  });
};

export const tutorialCheck = (status) => (dispatch, getState) => {
  var tutorialsStatus = getState().tutorial.status;
  var id = getState().tutorial.currentId;
  tutorialsStatus[id] = {...tutorialsStatus[id], status: status};
  dispatch({
    type: status === 'success' ? TUTORIAL_SUCCESS : TUTORIAL_ERROR,
    payload: tutorialsStatus
  });
  dispatch(tutorialChange());
};

export const storeTutorialXml = (code) => (dispatch, getState) => {
  var id = getState().tutorial.currentId;
  var level = getState().tutorial.level;
  if(id !== null && level === 'assessment'){
    var tutorialsStatus = getState().tutorial.status;
    tutorialsStatus[id] = {...tutorialsStatus[id], xml: code};
    dispatch({
      type: TUTORIAL_XML,
      payload: tutorialsStatus
    });
  }
};


export const tutorialId = (id) => (dispatch) => {
  dispatch({
    type: TUTORIAL_ID,
    payload: id
  });
};

export const tutorialStep = (step) => (dispatch) => {
  dispatch({
    type: TUTORIAL_STEP,
    payload: step
  });
};
