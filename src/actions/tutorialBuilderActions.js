import {
  PROGRESS,
  JSON_STRING,
  BUILDER_CHANGE,
  BUILDER_ERROR,
  BUILDER_TITLE,
  BUILDER_PUBLIC,
  BUILDER_DIFFICULTY,
  BUILDER_REVIEW,
  BUILDER_ID,
  BUILDER_ADD_STEP,
  BUILDER_DELETE_STEP,
  BUILDER_CHANGE_STEP,
  BUILDER_CHANGE_ORDER,
  BUILDER_DELETE_PROPERTY,
} from "./types";

import data from "../data/hardware.json";

export const changeTutorialBuilder = () => (dispatch) => {
  dispatch({
    type: BUILDER_CHANGE,
  });
};

export const jsonString = (json) => (dispatch) => {
  dispatch({
    type: JSON_STRING,
    payload: json,
  });
};

export const tutorialTitle = (title) => (dispatch) => {
  dispatch({
    type: BUILDER_TITLE,
    payload: title,
  });
  dispatch(changeTutorialBuilder());
};

export const tutorialPublic = (pub) => (dispatch) => {
  dispatch({
    type: BUILDER_PUBLIC,
    payload: pub,
  });
  dispatch(changeTutorialBuilder());
};

export const tutorialDifficulty = (difficulty) => (dispatch) => {
  dispatch({
    type: BUILDER_DIFFICULTY,
    payload: difficulty,
  });
  dispatch(changeTutorialBuilder());
};

export const tutorialReview = (review) => (dispatch) => {
  dispatch({
    type: BUILDER_REVIEW,
    payload: review,
  });
  dispatch(changeTutorialBuilder());
};

export const tutorialSteps = (steps) => (dispatch) => {
  dispatch({
    type: BUILDER_ADD_STEP,
    payload: steps,
  });
  dispatch(changeTutorialBuilder());
};

export const tutorialId = (id) => (dispatch) => {
  dispatch({
    type: BUILDER_ID,
    payload: id,
  });
  dispatch(changeTutorialBuilder());
};

export const addStep = (index) => (dispatch, getState) => {
  var steps = getState().tutorialBuilder.steps;
  var step = {
    id: index + 1,
    type: "instruction",
    title: "",
    text: "",
  };
  steps.splice(index, 0, step);
  dispatch({
    type: BUILDER_ADD_STEP,
    payload: steps,
  });
  dispatch(addErrorStep(index));
  dispatch(changeTutorialBuilder());
};

export const addErrorStep = (index) => (dispatch, getState) => {
  var error = getState().tutorialBuilder.error;
  error.steps.splice(index, 0, {});
  dispatch({
    type: BUILDER_ERROR,
    payload: error,
  });
};

export const removeStep = (index) => (dispatch, getState) => {
  var steps = getState().tutorialBuilder.steps;
  steps.splice(index, 1);
  dispatch({
    type: BUILDER_DELETE_STEP,
    payload: steps,
  });
  dispatch(removeErrorStep(index));
  dispatch(changeTutorialBuilder());
};

export const removeErrorStep = (index) => (dispatch, getState) => {
  var error = getState().tutorialBuilder.error;
  error.steps.splice(index, 1);
  dispatch({
    type: BUILDER_ERROR,
    payload: error,
  });
};

export const changeContent =
  (content, index, property1, property2) => (dispatch, getState) => {
    const state = getState();
    let steps = state.tutorialBuilder?.steps || [];

    // Stelle sicher, dass steps[index] existiert
    if (!steps[index]) {
      steps[index] = {};
    }

    const step = steps[index];

    if (property2) {
      if (step[property1] && step[property1][property2]) {
        step[property1][property2] = content;
      } else {
        step[property1] = { [property2]: content };
      }
    } else {
      step[property1] = content;
    }

    dispatch({
      type: BUILDER_CHANGE_STEP,
      payload: steps,
    });
    dispatch(changeTutorialBuilder());
  };

export const deleteProperty =
  (index, property1, property2) => (dispatch, getState) => {
    var steps = getState().tutorialBuilder.steps;
    var step = steps[index];
    if (property2) {
      if (step[property1] && step[property1][property2]) {
        delete step[property1][property2];
      }
    } else {
      delete step[property1];
    }
    dispatch({
      type: BUILDER_DELETE_PROPERTY,
      payload: steps,
    });
    dispatch(changeTutorialBuilder());
  };

export const changeStepIndex = (fromIndex, toIndex) => (dispatch, getState) => {
  var steps = getState().tutorialBuilder.steps;
  var step = steps[fromIndex];
  steps.splice(fromIndex, 1);
  steps.splice(toIndex, 0, step);
  dispatch({
    type: BUILDER_CHANGE_ORDER,
    payload: steps,
  });
  dispatch(changeErrorStepIndex(fromIndex, toIndex));
  dispatch(changeTutorialBuilder());
};

export const changeErrorStepIndex =
  (fromIndex, toIndex) => (dispatch, getState) => {
    var error = getState().tutorialBuilder.error;
    var errorStep = error.steps[fromIndex];
    error.steps.splice(fromIndex, 1);
    error.steps.splice(toIndex, 0, errorStep);
    dispatch({
      type: BUILDER_ERROR,
      payload: error,
    });
  };

export const setError = (index, field) => (dispatch, getState) => {
  const state = getState();
  const error = { ...(state.tutorialBuilder.error || {}) };

  // Stelle sicher, dass steps existiert
  if (!Array.isArray(error.steps)) error.steps = [];

  // Stelle sicher, dass der Eintrag für den Step existiert
  if (!error.steps[index]) error.steps[index] = {};

  // Fehler markieren
  error.steps[index][field] = true;

  dispatch({
    type: "SET_ERROR",
    payload: error,
  });
};

export const deleteError = (index, field) => (dispatch, getState) => {
  const state = getState();
  const error = { ...(state.tutorialBuilder.error || {}) };

  if (error.steps && error.steps[index]) {
    delete error.steps[index][field];
  }

  dispatch({
    type: "DELETE_ERROR",
    payload: error,
  });
};

export const setSubmitError = () => (dispatch, getState) => {
  var builder = getState().tutorialBuilder;
  // if(builder.id === undefined || builder.id === ''){
  //   dispatch(setError(undefined, 'id'));
  // }
  if (builder.title === "") {
    dispatch(setError(undefined, "title"));
  }
  if (builder.title === null) {
    dispatch(setError(undefined, "title"));
  }
  var type = builder.steps.map((step, i) => {
    // media and xml are directly checked for errors in their components and
    // therefore do not have to be checked again
    step.id = i + 1;
    if (i === 0) {
      if (step.requirements && step.requirements.length > 0) {
        var requirements = step.requirements.filter((requirement) =>
          /^[0-9a-fA-F]{24}$/.test(requirement),
        );
        if (requirements.length < step.requirements.length) {
          dispatch(changeContent(requirements, i, "requirements"));
        }
      }
      if (step.hardware === undefined || step.hardware.length < 1) {
        dispatch(setError(i, "hardware"));
      } else {
        var hardwareIds = data.map((hardware) => hardware.id);
        var hardware = step.hardware.filter((hardware) =>
          hardwareIds.includes(hardware),
        );
        if (hardware.length < step.hardware.length) {
          dispatch(changeContent(hardware, i, "hardware"));
        }
      }
    }
    if (step.headline === undefined || step.headline === "") {
      dispatch(setError(i, "headline"));
    }
    if (step.text === undefined || step.text === "") {
      dispatch(setError(i, "text"));
    }
    return step.type;
  });
  if (
    !(
      type.filter((item) => item === "task").length > 0 &&
      type.filter((item) => item === "instruction").length > 0
    )
  ) {
    dispatch(setError(undefined, "type"));
  }
};

export const checkError = () => (dispatch, getState) => {
  dispatch(setSubmitError());
  var error = getState().tutorialBuilder.error;
  if (error.id || error.title || error.type) {
    return true;
  }
  for (var i = 0; i < error.steps.length; i++) {
    if (Object.keys(error.steps[i]).length > 0) {
      return true;
    }
  }
  return false;
};

export const progress = (inProgress) => (dispatch) => {
  dispatch({
    type: PROGRESS,
    payload: inProgress,
  });
};

export const resetTutorial = () => (dispatch, getState) => {
  dispatch(jsonString(""));
  dispatch(tutorialTitle(""));
  var steps = [
    {
      type: "instruction",
      headline: "",
      text: "",
      hardware: [],
      requirements: [],
    },
  ];
  dispatch(tutorialSteps(steps));
  dispatch({
    type: BUILDER_ERROR,
    payload: {
      steps: [{}],
    },
  });
};

export const readJSON = (json) => (dispatch, getState) => {
  dispatch(resetTutorial());
  dispatch({
    type: BUILDER_ERROR,
    payload: {
      steps: json.steps.map(() => {
        return {};
      }),
    },
  });
  // accept only valid attributes
  var steps = json.steps.map((step, i) => {
    var object = {
      _id: step._id,
      type: step.type,
      headline: step.headline,
      text: step.text,
    };
    if (i === 0) {
      object.hardware = step.hardware;
      object.requirements = step.requirements;
    }
    if (step.xml) {
      object.xml = step.xml;
    }
    if (step.media && step.type === "instruction") {
      object.media = {};
      if (step.media.picture) {
        object.media.picture = step.media.picture;
      } else if (step.media.youtube) {
        object.media.youtube = step.media.youtube;
      }
    }
    return object;
  });
  dispatch(tutorialTitle(json.title));
  dispatch(tutorialDifficulty(json.difficulty));
  dispatch(tutorialSteps(steps));
  dispatch(setSubmitError());
  dispatch(progress(false));
};
