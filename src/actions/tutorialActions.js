import { TUTORIAL_PROGRESS, GET_TUTORIAL, GET_TUTORIALS, TUTORIAL_SUCCESS, TUTORIAL_ERROR, TUTORIAL_CHANGE, TUTORIAL_XML, TUTORIAL_ID, TUTORIAL_STEP } from './types';

import axios from 'axios';
import { returnErrors, returnSuccess } from './messageActions';

export const getTutorial = (id) => (dispatch, getState) => {
  dispatch({type: TUTORIAL_PROGRESS});
  axios.get(`https://api.blockly.sensebox.de/tutorial/${id}`)
    .then(res => {
      var tutorial = res.data;
      existingTutorial(tutorial, getState().tutorial.status).then(status => {
        dispatch({
          type: TUTORIAL_SUCCESS,
          payload: status
        });
        dispatch({type: TUTORIAL_PROGRESS});
        dispatch({
          type: GET_TUTORIAL,
          payload: tutorial
        });
      });
    })
    .catch(err => {
      dispatch({type: TUTORIAL_PROGRESS});
      if(err.response){
        dispatch(returnErrors(err.response.data.message, err.response.status, 'GET_TUTORIAL_FAIL'));
      }
    });
};

export const getTutorials = () => (dispatch, getState) => {
  dispatch({type: TUTORIAL_PROGRESS});
  axios.get(`https://api.blockly.sensebox.de/tutorial`)
    .then(res => {
      var tutorials = res.data;
      existingTutorials(tutorials, getState().tutorial.status).then(status => {
        dispatch({
          type: TUTORIAL_SUCCESS,
          payload: status
        });
        dispatch({
          type: GET_TUTORIALS,
          payload: tutorials
        });
        dispatch({type: TUTORIAL_PROGRESS});
      });
    })
    .catch(err => {
      dispatch({type: TUTORIAL_PROGRESS});
      if(err.response){
        dispatch(returnErrors(err.response.data.message, err.response.status, 'GET_TUTORIALS_FAIL'));
      }
    });
};

export const resetTutorial = () => (dispatch) => {
  dispatch({
    type: GET_TUTORIALS,
    payload: []
  });
  dispatch({
    type: TUTORIAL_STEP,
    payload: 0
  });
};

export const tutorialChange = () => (dispatch) => {
  dispatch({
    type: TUTORIAL_CHANGE
  });
};

export const tutorialCheck = (status, step) => (dispatch, getState) => {
  var tutorialsStatus = getState().tutorial.status;
  var id = getState().tutorial.tutorials[0].id;
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
  var tutorial = getState().tutorial.tutorials[0];
  if (tutorial) {
    var id = tutorial.id;
    var activeStep = getState().tutorial.activeStep;
    var steps = tutorial.steps;
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

export const tutorialStep = (step) => (dispatch) => {
  dispatch({
    type: TUTORIAL_STEP,
    payload: step
  });
};


const existingTutorials = (tutorials, status) => new Promise(function(resolve, reject){
  var newstatus;
  new Promise(function(resolve, reject){
    var existingTutorialIds = tutorials.map((tutorial, i) => {
      existingTutorial(tutorial, status).then(status => {
        newstatus = status;
      });
      return tutorial.id;
    });
    resolve(existingTutorialIds)
  }).then(existingTutorialIds => {
    // deleting old tutorials which do not longer exist
    if (existingTutorialIds.length > 0) {
      status = newstatus.filter(status => existingTutorialIds.indexOf(status.id) > -1);
    }
    resolve(status);
  });
});

const existingTutorial = (tutorial, status) => new Promise(function(resolve, reject){
  var tutorialsId = tutorial.id;
  var statusIndex = status.findIndex(status => status.id === tutorialsId);
  if (statusIndex > -1) {
    var tasks = tutorial.steps.filter(step => step.type === 'task');
    var existingTaskIds = tasks.map((task, j) => {
      var tasksId = task.id;
      if (status[statusIndex].tasks.findIndex(task => task.id === tasksId) === -1) {
        // task does not exist
        status[statusIndex].tasks.push({ id: tasksId });
      }
      return tasksId;
    });
    // deleting old tasks which do not longer exist
    if (existingTaskIds.length > 0) {
      status[statusIndex].tasks = status[statusIndex].tasks.filter(task => existingTaskIds.indexOf(task.id) > -1);
    }
  }
  else {
    status.push({ id: tutorialsId, tasks: tutorial.steps.filter(step => step.type === 'task').map(task => { return { id: task.id }; }) });
  }
  resolve(status);
});
