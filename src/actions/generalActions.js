import { VISIT, LANGUAGE, RENDERER, STATISTICS } from './types';


export const visitPage = () => (dispatch) => {
  dispatch({
    type: VISIT
  });
};

export const setLanguage = (language) => (dispatch, getState) => {
  if(!getState().auth.progress && !getState().auth.isAuthenticated){
    window.localStorage.setItem('locale', language);
  }
  dispatch({
    type: LANGUAGE,
    payload: language
  });
};

export const setRenderer = (renderer) => (dispatch) => {
  dispatch({
    type: RENDERER,
    payload: renderer
  });
};

export const setStatistics = (showStatistics) => (dispatch) => {
  dispatch({
    type: STATISTICS,
    payload: showStatistics
  });
};
