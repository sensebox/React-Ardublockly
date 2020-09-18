import { BUILDER_CHANGE, BUILDER_TITLE, BUILDER_ID, BUILDER_ADD_STEP, BUILDER_DELETE_STEP, BUILDER_CHANGE_STEP, BUILDER_CHANGE_ORDER, BUILDER_DELETE_PROPERTY } from './types';

export const changeTutorialBuilder = () => (dispatch) => {
  dispatch({
    type: BUILDER_CHANGE
  });
};

export const tutorialTitle = (title) => (dispatch) => {
  dispatch({
    type: BUILDER_TITLE,
    payload: title
  });
  dispatch(changeTutorialBuilder());
};

export const tutorialId = (id) => (dispatch) => {
  dispatch({
    type: BUILDER_ID,
    payload: id
  });
  dispatch(changeTutorialBuilder());
};

export const addStep = (index) => (dispatch, getState) => {
  var steps = getState().builder.steps;
  var step = {
    id: index+1,
    type: 'instruction',
    headline: '',
    text: ''
  };
  steps.splice(index, 0, step);
  dispatch({
    type: BUILDER_ADD_STEP,
    payload: steps
  });
  dispatch(changeTutorialBuilder());
};

export const removeStep = (index) => (dispatch, getState) => {
  var steps = getState().builder.steps;
  steps.splice(index, 1);
  dispatch({
    type: BUILDER_DELETE_STEP,
    payload: steps
  });
  dispatch(changeTutorialBuilder());
};

export const changeContent = (index, property, content) => (dispatch, getState) => {
  var steps = getState().builder.steps;
  var step = steps[index];
  step[property] = content;
  dispatch({
    type: BUILDER_CHANGE_STEP,
    payload: steps
  });
  dispatch(changeTutorialBuilder());
};

export const deleteProperty = (index, property) => (dispatch, getState) => {
  var steps = getState().builder.steps;
  var step = steps[index];
  delete step[property];
  dispatch({
    type: BUILDER_DELETE_PROPERTY,
    payload: steps
  });
  dispatch(changeTutorialBuilder());
};

export const changeStepIndex = (fromIndex, toIndex) => (dispatch, getState) => {
  var steps = getState().builder.steps;
  var step = steps[fromIndex];
  steps.splice(fromIndex, 1);
  steps.splice(toIndex, 0, step);
  dispatch({
    type: BUILDER_CHANGE_ORDER,
    payload: steps
  });
  dispatch(changeTutorialBuilder());
};
