import {
  VISIT,
  LANGUAGE,
  RENDERER,
  SOUNDS,
  STATISTICS,
  PLATFORM,
  COMPILER,
} from "./types";

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

export const setSounds = (sounds) => (dispatch) => {
  dispatch({
    type: SOUNDS,
    payload: sounds,
  });
};

export const setStatistics = (showStatistics) => (dispatch) => {
  dispatch({
    type: STATISTICS,
    payload: showStatistics,
  });
};

export const setCompiler = (compiler) => (dispatch) => {
  dispatch({
    type: COMPILER,
    payload: compiler,
  });
};
