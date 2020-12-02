import { PROJECT_PROGRESS, GET_PROJECT, GET_PROJECTS, PROJECT_TYPE, PROJECT_DESCRIPTION } from './types';

import axios from 'axios';
import { workspaceName } from './workspaceActions';
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
  dispatch({type: PROJECT_PROGRESS});
  dispatch(setType(type));
  axios.get(`${process.env.REACT_APP_BLOCKLY_API}/${type}/${id}`)
    .then(res => {
      var data = type === 'share' ? 'content' : type;
      var project = res.data[data];
      if(project){
        dispatch({
          type: GET_PROJECT,
          payload: project
        });
        dispatch({
          type: PROJECT_DESCRIPTION,
          payload: project.description
        });
        dispatch({type: PROJECT_PROGRESS});
        dispatch(returnSuccess(res.data.message, res.status, 'GET_PROJECT_SUCCESS'));
      }
      else{
        dispatch({type: PROJECT_PROGRESS});
        dispatch(returnErrors(res.data.message, res.status, 'PROJECT_EMPTY'));
      }
    })
    .catch(err => {
      if(err.response){
        dispatch(returnErrors(err.response.data.message, err.response.status, 'GET_PROJECT_FAIL'));
      }
      dispatch({type: PROJECT_PROGRESS});
    });
};

export const getProjects = (type) => (dispatch) => {
  dispatch({type: PROJECT_PROGRESS});
  axios.get(`${process.env.REACT_APP_BLOCKLY_API}/${type}`)
    .then(res => {
      var data = type === 'project' ? 'projects' : 'galleries';
      var projects = res.data[data];
      dispatch({
        type: GET_PROJECTS,
        payload: projects
      });
      dispatch({type: PROJECT_PROGRESS});
      dispatch(returnSuccess(res.data.message, res.status));
    })
    .catch(err => {
      if(err.response){
        dispatch(returnErrors(err.response.data.message, err.response.status, 'GET_PROJECTS_FAIL'));
      }
      dispatch({type: PROJECT_PROGRESS});
    });
};

export const updateProject = () => (dispatch, getState) => {
  var workspace = getState().workspace;
  var body = {
    xml: workspace.code.xml,
    title: workspace.name
  }
  var project = getState().project;
  var id = project.projects[0]._id;
  var type = project.type;
  if(type==='gallery'){
    body.description = project.description;
  }
  axios.put(`${process.env.REACT_APP_BLOCKLY_API}/${type}/${id}`, body)
    .then(res => {
      var project = res.data[type];
      dispatch({
        type: GET_PROJECT,
        payload: project
      });
      if(type === 'project'){
        dispatch(returnSuccess(res.data.message, res.status, 'PROJECT_UPDATE_SUCCESS'));
      } else {
        dispatch(returnSuccess(res.data.message, res.status, 'GALLERY_UPDATE_SUCCESS'));
      }
    })
    .catch(err => {
      if(err.response){
        dispatch(returnErrors(err.response.data.message, err.response.status, 'PROJECT_UPDATE_FAIL'));
      }
    });
}

export const deleteProject = () => (dispatch, getState) => {
  var project = getState().project;
  var id = project.projects[0]._id;
  var type = project.type;
  axios.delete(`${process.env.REACT_APP_BLOCKLY_API}/${type}/${id}`)
    .then(res => {
      dispatch({type: GET_PROJECTS, payload: []});
      if(type === 'project'){
        dispatch(returnSuccess(res.data.message, res.status, 'PROJECT_DELETE_SUCCESS'));
      } else {
        dispatch(returnSuccess(res.data.message, res.status, 'GALLERY_DELETE_SUCCESS'));
      }
    })
    .catch(err => {
      if(err.response){
        dispatch(returnErrors(err.response.data.message, err.response.status, 'PROJECT_DELETE_FAIL'));
      }
    });
}


export const resetProject = () => (dispatch) => {
  dispatch({
    type: GET_PROJECTS,
    payload: []
  });
  dispatch(setType(''));
  dispatch(setDescription(''));
};
