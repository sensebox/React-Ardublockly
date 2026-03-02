import {
  VISIT,
  LANGUAGE,
  RENDERER,
  SOUNDS,
  STATISTICS,
  PLATFORM,
  COMPILER,
  EMBEDDED_MODE,
  AI_MODEL_UPLOAD,
  AI_MODEL_CLEAR,
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

export const setEmbeddedMode = (isEmbedded) => (dispatch) => {
  dispatch({
    type: EMBEDDED_MODE,
    payload: isEmbedded,
  });
};

export const uploadAiModel = (code, filename) => (dispatch) => {
  dispatch({
    type: AI_MODEL_UPLOAD,
    payload: { code, filename },
  });
};

export const clearAiModel = () => (dispatch) => {
  dispatch({
    type: AI_MODEL_CLEAR,
  });
};
