import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { workspaceName } from '../../actions/workspaceActions';
import { getProject, resetProject } from '../../actions/projectActions';
import { clearMessages, returnErrors } from '../../actions/messageActions';

import Home from '../Home';
import Breadcrumbs from '../Breadcrumbs';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const ClassroomProject = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const project = useSelector(state => state.project.projects[0]);
  const progress = useSelector(state => state.project.progress);
  const type = useSelector(state => state.project.type);
  const message = useSelector(state => state.message);

  useEffect(() => {
    dispatch(resetProject());
    getProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, type]);

  useEffect(() => {
    if (message) {
      if (message.id === 'PROJECT_EMPTY' || message.id === 'GET_PROJECT_FAIL') {
        if (type !== 'share') {
          dispatch(returnErrors('', 404, 'GET_PROJECT_FAIL'));
          history.push(`/${type}`);
        } else {
          history.push('/');
          dispatch(returnErrors('', 404, 'GET_SHARE_FAIL'));
        }
      } else if (message.id === 'GET_PROJECT_SUCCESS') {
        dispatch(workspaceName(project.title));
      } else if (message.id === 'PROJECT_DELETE_SUCCESS' || message.id === 'GALLERY_DELETE_SUCCESS') {
        history.push(`/${type}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  const getProject = useCallback(() => {
    const id = location.pathname.replace(/\/[a-z]{1,}\//, '');
    const param = location.pathname.replace(`/${id}`, '').replace('/', '');
    dispatch(getProject(param, id));
  }, [dispatch, location.pathname]);

  useEffect(() => {
    return () => {
      dispatch(resetProject());
      dispatch(workspaceName(null));
    };
  }, [dispatch]);

  const data = type === 'project' ? 'Projekte' : 'Galerie';

  return (
    progress ? (
      <Backdrop open invisible>
        <CircularProgress color="primary" />
      </Backdrop>
    ) : project ? (
      <div>
        {type !== 'share' && (
          <Breadcrumbs content={[
            { link: `/${type}`, title: data },
            { link: location.pathname, title: project.title }
          ]} />
        )}
        <Home project={project} projectType={type} />
      </div>
    ) : null
  );
};

ClassroomProject.propTypes = {
  workspaceName: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  resetProject: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  returnErrors: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  message: PropTypes.object.isRequired,
  progress: PropTypes.bool.isRequired
};

export default ClassroomProject;
