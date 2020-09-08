import { TUTORIAL_SUCCESS, TUTORIAL_ERROR, TUTORIAL_CHANGE } from './types';

export const tutorialChange = () => (dispatch) => {
  dispatch({
    type: TUTORIAL_CHANGE
  });
};

export const tutorialCheck = (id, status) => (dispatch, getState) => {
  var tutorialsStatus = getState().tutorial.status;
  tutorialsStatus[id] = {...tutorialsStatus[id], status: status};
  dispatch({
    type: status === 'success' ? TUTORIAL_SUCCESS : TUTORIAL_ERROR,
    payload: tutorialsStatus
  });
  dispatch(tutorialChange());
};
