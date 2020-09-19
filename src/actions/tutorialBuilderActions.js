import { BUILDER_CHANGE, BUILDER_ERROR, BUILDER_TITLE, BUILDER_ID, BUILDER_ADD_STEP, BUILDER_DELETE_STEP, BUILDER_CHANGE_STEP, BUILDER_CHANGE_ORDER, BUILDER_DELETE_PROPERTY } from './types';

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
  dispatch(addErrorStep(index));
  dispatch(changeTutorialBuilder());
};

export const addErrorStep = (index) => (dispatch, getState) => {
  var error = getState().builder.error;
  error.steps.splice(index, 0, {});
  dispatch({
    type: BUILDER_ERROR,
    payload: error
  });
};

export const removeStep = (index) => (dispatch, getState) => {
  var steps = getState().builder.steps;
  steps.splice(index, 1);
  dispatch({
    type: BUILDER_DELETE_STEP,
    payload: steps
  });
  dispatch(removeErrorStep(index));
  dispatch(changeTutorialBuilder());
};

export const removeErrorStep = (index) => (dispatch, getState) => {
  var error = getState().builder.error;
  error.steps.splice(index, 1);
  dispatch({
    type: BUILDER_ERROR,
    payload: error
  });
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
  dispatch(changeErrorStepIndex(fromIndex, toIndex));
  dispatch(changeTutorialBuilder());
};

export const changeErrorStepIndex = (fromIndex, toIndex) => (dispatch, getState) => {
  var error = getState().builder.error;
  var errorStep = error.steps[fromIndex];
  error.steps.splice(fromIndex, 1);
  error.steps.splice(toIndex, 0, errorStep);
  dispatch({
    type: BUILDER_ERROR,
    payload: error
  });
};

export const setError = (index, property) => (dispatch, getState) => {
  var error = getState().builder.error;
  console.log(index);
  if(index !== undefined){
    error.steps[index][property] = true;
  }
  else {
    error[property] = true;
  }
  dispatch({
    type: BUILDER_ERROR,
    payload: error
  });
  dispatch(changeTutorialBuilder());
};

export const deleteError = (index, property) => (dispatch, getState) => {
  var error = getState().builder.error;
  if(index !== undefined){
    delete error.steps[index][property];
  }
  else {
    delete error[property];
  }
  dispatch({
    type: BUILDER_ERROR,
    payload: error
  });
  dispatch(changeTutorialBuilder());
};

export const setSubmitError = () => (dispatch, getState) => {
  var builder = getState().builder;
  if(builder.id === ''){
    dispatch(setError(undefined, 'id'));
  }
  if(builder.title === ''){
    dispatch(setError(undefined, 'title'));
  }
  for(var i = 0; i < builder.steps.length; i++){
    if(i === 0 && builder.steps[i].hardware.length < 1){
      dispatch(setError(i, 'hardware'));
    }
    if(builder.steps[i].headline === ''){
      dispatch(setError(i, 'headline'));
    }
    if(builder.steps[i].text === ''){
      dispatch(setError(i, 'text'));
    }
  }
};

export const checkError = () => (dispatch, getState) => {
  dispatch(setSubmitError());
  var error = getState().builder.error;
  if(error.id || error.title){
    return false;
  }
  for(var i = 0; i < error.steps.length; i++){
    if(Object.keys(error.steps[i]).length > 0){
      return false
    }
  }
  return true;
}
