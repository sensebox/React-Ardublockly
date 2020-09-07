import { TUTORIAL_SUCCESS, TUTORIAL_ERROR, TUTORIAL_CHANGE } from './types';

import { tutorials } from '../components/Tutorial/tutorials';

export const tutorialChange = () => (dispatch) => {
  dispatch({
    type: TUTORIAL_CHANGE
  });
};

export const tutorialCheck = (id, status) => (dispatch, getState) => {
  var tutorialsStatus = getState().tutorial.status ?
                          getState().tutorial.status
                        : new Array(tutorials.length).fill({});
  tutorialsStatus[id].status = status;
  console.log(tutorials);
  dispatch({
    type: status === 'success' ? TUTORIAL_SUCCESS : TUTORIAL_ERROR,
    payload: tutorialsStatus
  });
  dispatch(tutorialChange());
  // update locale storage - sync with redux store
  window.localStorage.setItem('tutorial', JSON.stringify(tutorialsStatus));
};
