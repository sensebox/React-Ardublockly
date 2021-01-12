import { PROJECT_PROGRESS, GET_PROJECT, GET_PROJECTS, PROJECT_TYPE, PROJECT_DESCRIPTION } from './types';

import axios from 'axios';
import { returnErrors, returnSuccess } from './messageActions';

export const setType = (type) => (dispatch) => {
  dispatch({
    type: PROJECT_TYPE,
    payload: type
  });
};

export const setDescription = (description) => (dispatch) => {
  dispatch({
    type: PROJECT_DESCRIPTION,
    payload: description
  });
};

export const getProject = (type, id) => (dispatch) => {
  dispatch({ type: PROJECT_PROGRESS });
  dispatch(setType(type));
  const config = {
    success: res => {
      var data = type === 'share' ? 'content' : type;
      var project = res.data[data];
      if (project) {
        dispatch({
          type: GET_PROJECT,
          payload: project
        });
        dispatch({
          type: PROJECT_DESCRIPTION,
          payload: project.description
        });
        dispatch({ type: PROJECT_PROGRESS });
        dispatch(returnSuccess(res.data.message, res.status, 'GET_PROJECT_SUCCESS'));
      }
      else {
        dispatch({ type: PROJECT_PROGRESS });
        dispatch(returnErrors(res.data.message, res.status, 'PROJECT_EMPTY'));
      }
    },
    error: err => {
      if (err.response) {
        dispatch(returnErrors(err.response.data.message, err.response.status, 'GET_PROJECT_FAIL'));
      }
      dispatch({ type: PROJECT_PROGRESS });
    }
  };
  axios.get(`${process.env.REACT_APP_BLOCKLY_API}/${type}/${id}`, config)
    .then(res => {
      res.config.success(res);
    })
    .catch(err => {
      err.config.error(err);
    });
};

export const getProjects = (type) => (dispatch) => {
  dispatch({ type: PROJECT_PROGRESS });
  const config = {
    success: res => {
      var data = type === 'project' ? 'projects' : 'galleries';
      var projects = res.data[data];
      dispatch({
        type: GET_PROJECTS,
        payload: projects
      });
      dispatch({ type: PROJECT_PROGRESS });
      dispatch(returnSuccess(res.data.message, res.status));
    },
    error: err => {
      if (err.response) {
        dispatch(returnErrors(err.response.data.message, err.response.status, 'GET_PROJECTS_FAIL'));
      }
      dispatch({ type: PROJECT_PROGRESS });
    }
  };
  axios.get(`${process.env.REACT_APP_BLOCKLY_API}/${type}`, config)
    .then(res => {
      res.config.success(res);
    })
    .catch(err => {
      err.config.error(err);
    });
};

export const updateProject = (type, id) => (dispatch, getState) => {
  var workspace = getState().workspace;
  var body = {
    xml: workspace.code.xml,
    title: workspace.name
  };
  var project = getState().project;
  if (type === 'gallery') {
    body.description = project.description;
  }
  const config = {
    success: res => {
      var project = res.data[type];
      var projects = getState().project.projects;
      var index = projects.findIndex(res => res._id === project._id);
      projects[index] = project;
      dispatch({
        type: GET_PROJECTS,
        payload: projects
      });
      if (type === 'project') {
        dispatch(returnSuccess(res.data.message, res.status, 'PROJECT_UPDATE_SUCCESS'));
      } else {
        dispatch(returnSuccess(res.data.message, res.status, 'GALLERY_UPDATE_SUCCESS'));
      }
    },
    error: err => {
      if (err.response) {
        if (type === 'project') {
          dispatch(returnErrors(err.response.data.message, err.response.status, 'PROJECT_UPDATE_FAIL'));
        } else {
          dispatch(returnErrors(err.response.data.message, err.response.status, 'GALLERY_UPDATE_FAIL'));
        }
      }
    }
  };
  axios.put(`${process.env.REACT_APP_BLOCKLY_API}/${type}/${id}`, body, config)
    .then(res => {
      res.config.success(res);
    })
    .catch(err => {
      err.config.error(err);
    });
};

export const deleteProject = (type, id) => (dispatch, getState) => {
  const config = {
    success: res => {
      var projects = getState().project.projects;
      var index = projects.findIndex(res => res._id === id);
      projects.splice(index, 1)
      dispatch({
        type: GET_PROJECTS,
        payload: projects
      });
      if (type === 'project') {
        dispatch(returnSuccess(res.data.message, res.status, 'PROJECT_DELETE_SUCCESS'));
      } else {
        dispatch(returnSuccess(res.data.message, res.status, 'GALLERY_DELETE_SUCCESS'));
      }
    },
    error: err => {
      dispatch(returnErrors(err.response.data.message, err.response.status, 'PROJECT_DELETE_FAIL'));
    }
  };
  axios.delete(`${process.env.REACT_APP_BLOCKLY_API}/${type}/${id}`, config)
    .then(res => {
      res.config.success(res);
    })
    .catch(err => {
      if (err.response && err.response.status !== 401) {
        err.config.error(err);
      }
    });
};


export const shareProject = (title, type, id) => (dispatch, getState) => {
  var body = {
    title: title
  };
  if (type === 'project') {
    body.projectId = id;
  } else {
    body.xml = getState().workspace.code.xml;
  }
  axios.post(`${process.env.REACT_APP_BLOCKLY_API}/share`, body)
    .then(res => {
      var shareContent = res.data.content;
      if (body.projectId) {
        var projects = getState().project.projects;
        var index = projects.findIndex(res => res._id === id);
        projects[index].shared = shareContent.expiresAt;
        dispatch({
          type: GET_PROJECTS,
          payload: projects
        });
      }
      dispatch(returnSuccess(res.data.message, shareContent._id, 'SHARE_SUCCESS'));
    })
    .catch(err => {
      if (err.response) {
        dispatch(returnErrors(err.response.data.message, err.response.status, 'SHARE_FAIL'));
      }
    });
};


export const resetProject = () => (dispatch) => {
  dispatch({
    type: GET_PROJECTS,
    payload: []
  });
  dispatch(setType(''));
  dispatch(setDescription(''));
};
