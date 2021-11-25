import { VISIT, LANGUAGE, RENDERER, STATISTICS, PLATFORM } from "./types";

export const visitPage = () => (dispatch) => {
  dispatch({
    type: VISIT,
  });
};

export const setPlatform = (platform) => (dispatch) => {
  dispatch({
    type: PLATFORM,
    payload: platform,
  });
};

export const setLanguage = (language) => (dispatch, getState) => {
  if (!getState().auth.progress && !getState().auth.isAuthenticated) {
    window.localStorage.setItem("locale", language);
  }
  dispatch({
    type: LANGUAGE,
    payload: language,
  });
};

export const setRenderer = (renderer) => (dispatch) => {
  dispatch({
    type: RENDERER,
    payload: renderer,
  });
};

export const setStatistics = (showStatistics) => (dispatch) => {
  dispatch({
    type: STATISTICS,
    payload: showStatistics,
  });
};
