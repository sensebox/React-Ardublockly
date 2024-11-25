import { PROJECT_PROGRESS, GET_PROJECT, GET_PROJECTS, PROJECT_TYPE, PROJECT_DESCRIPTION, PROJECT_EMPTY, GET_PROJECT_FAIL, GET_PROJECTS_FAIL } from './types';

import { returnErrors, returnSuccess } from './messageActions';
import api from '../utils/axiosConfig';

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
  // Start progress
  dispatch({ type: PROJECT_PROGRESS, payload: true });

  api.get(`${process.env.REACT_APP_BLOCKLY_API}/${type}/${id}`)
    .then(res => {
      const dataKey = type === 'share' ? 'content' : type;
      const project = res.data[dataKey];
      console.log('API Response:', project); // Log the API response
      if (project) {
        // Dispatch the project data
        dispatch({
          type: GET_PROJECT,
          payload: project,
        });

        // Dispatch project description
        dispatch({
          type: PROJECT_DESCRIPTION,
          payload: project.description,
        });

        // Stop progress
        dispatch({ type: PROJECT_PROGRESS, payload: false });

        // Dispatch success message
        dispatch(returnSuccess(res.data.message, res.status, 'GET_PROJECT_SUCCESS'));
      } else {
        // No project found, handle empty project case
        dispatch({ type: PROJECT_PROGRESS, payload: false });
        dispatch(returnErrors('No project found', res.status, 'PROJECT_EMPTY'));
      }
    })
    .catch(err => {
      if (err.response) {
        dispatch(returnErrors(err.response.data.message, err.response.status, 'GET_PROJECT_FAIL'));
      }

      // Stop progress even if there's an error
      dispatch({ type: PROJECT_PROGRESS, payload: false });
    });
};

export const getProjects = (type) => (dispatch) => {
  // Indicate that project fetching is in progress
  dispatch({ type: PROJECT_PROGRESS });

  // Make the API call
  api.get(`${process.env.REACT_APP_BLOCKLY_API}/${type}`)
    .then(res => {
      // Determine the correct data field based on the type ('projects' for 'project', 'galleries' for others)
      const dataKey = type === 'project' ? 'projects' : 'galleries';
      const projects = res.data[dataKey];
      console.log('API Response:', res.data[dataKey]); // Log the API response
      // Dispatch the projects data
      dispatch({
        type: GET_PROJECTS,
        payload: projects
      });

    // Stop progress
    dispatch({ type: PROJECT_PROGRESS, payload: false });
      
    // Dispatch success message
    dispatch(returnSuccess(res.data.message, res.status));
    })
    .catch(err => {
      // Handle error response
      if (err.response) {
        dispatch(returnErrors(err.response.data.message, err.response.status, GET_PROJECTS_FAIL));
      }

      // Stop the progress indicator even if there is an error
      dispatch({ type: PROJECT_PROGRESS });
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
  api.put(`${process.env.REACT_APP_BLOCKLY_API}/${type}/${id}`, body, config)
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
  api.delete(`${process.env.REACT_APP_BLOCKLY_API}/${type}/${id}`, config)
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
  api.post(`${process.env.REACT_APP_BLOCKLY_API}/share`, body)
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
