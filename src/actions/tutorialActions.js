import { TUTORIAL_SUCCESS, TUTORIAL_ERROR, TUTORIAL_CHANGE, TUTORIAL_XML, TUTORIAL_ID, TUTORIAL_STEP } from './types';

import tutorials from '../data/tutorials';

export const tutorialChange = () => (dispatch) => {
  dispatch({
    type: TUTORIAL_CHANGE
  });
};

export const tutorialCheck = (status, step) => (dispatch, getState) => {
  var tutorialsStatus = getState().tutorial.status;
  var id = getState().tutorial.currentId;
  var tutorialsStatusIndex = tutorialsStatus.findIndex(tutorialStatus => tutorialStatus.id === id);
  var tasksIndex = tutorialsStatus[tutorialsStatusIndex].tasks.findIndex(task => task.id === step.id);
  tutorialsStatus[tutorialsStatusIndex].tasks[tasksIndex] = {
    ...tutorialsStatus[tutorialsStatusIndex].tasks[tasksIndex],
    type: status
  };
  dispatch({
    type: status === 'success' ? TUTORIAL_SUCCESS : TUTORIAL_ERROR,
    payload: tutorialsStatus
  });
  dispatch(tutorialChange());
};

export const storeTutorialXml = (code) => (dispatch, getState) => {
  var id = getState().tutorial.currentId;
  if (id !== null) {
    var activeStep = getState().tutorial.activeStep;
    var steps = tutorials.filter(tutorial => tutorial.id === id)[0].steps;
    if (steps[activeStep].type === 'task') {
      var tutorialsStatus = getState().tutorial.status;
      var tutorialsStatusIndex = tutorialsStatus.findIndex(tutorialStatus => tutorialStatus.id === id);
      var tasksIndex = tutorialsStatus[tutorialsStatusIndex].tasks.findIndex(task => task.id === steps[activeStep].id);
      tutorialsStatus[tutorialsStatusIndex].tasks[tasksIndex] = {
        ...tutorialsStatus[tutorialsStatusIndex].tasks[tasksIndex],
        xml: code
      };
      dispatch({
        type: TUTORIAL_XML,
        payload: tutorialsStatus
      });
    }
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
