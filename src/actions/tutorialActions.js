import { TUTORIAL_PROGRESS, GET_TUTORIAL, TUTORIAL_SUCCESS, TUTORIAL_ERROR, TUTORIAL_CHANGE, TUTORIAL_XML, TUTORIAL_ID, TUTORIAL_STEP } from './types';

import axios from 'axios';
import { returnErrors, returnSuccess } from './messageActions';

// import tutorials from '../data/tutorials';

export const getTutorial = (id) => (dispatch) => {
  dispatch({type: TUTORIAL_PROGRESS});
  axios.get(`https://api.blockly.sensebox.de/tutorial/${id}`)
    .then(res => {
      dispatch({type: TUTORIAL_PROGRESS});
      dispatch({
        type: GET_TUTORIAL,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({type: TUTORIAL_PROGRESS});
      if(err.response){
        dispatch(returnErrors(err.response.data.message, err.response.status, 'GET_TUTORIAL_FAIL'));
      }
    });
};

export const resetTutorial = () => (dispatch) => {
  dispatch({
    type: GET_TUTORIAL,
    payload: {}
  });
};

export const tutorialChange = () => (dispatch) => {
  dispatch({
    type: TUTORIAL_CHANGE
  });
};

export const tutorialCheck = (status, step) => (dispatch, getState) => {
  var tutorialsStatus = getState().tutorial.status;
  var id = getState().tutorial.tutorial.id;
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
  var tutorial = getState().tutorial.tutorial;
  var id = tutorial.id;
  if (id !== null) {
    var activeStep = getState().tutorial.activeStep;
    var steps = tutorial.steps;//tutorials.filter(tutorial => tutorial.id === id)[0].steps;
    if (steps && steps[activeStep].type === 'task') {
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


// export const tutorialId = (id) => (dispatch) => {
//   dispatch({
//     type: TUTORIAL_ID,
//     payload: id
//   });
// };

export const tutorialStep = (step) => (dispatch) => {
  dispatch({
    type: TUTORIAL_STEP,
    payload: step
  });
};
