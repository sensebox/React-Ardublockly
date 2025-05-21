import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';


import withStyles from '@mui/styles/withStyles';
import { render } from '@testing-library/react';


const styles = (theme) => ({
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    },
  },
});

const ClassroomProjectHome = ({}) => {
    const projects = useSelector((state) => state.classroomAuth.classroomUser.projects);
    const progress = useSelector((state) => state.classroomAuth.progress);

    useEffect(() => {
        console.log('ClassroomProjectHome useEffect');
        console.log('projects', projects);
    }, [projects]);

    return() => {
        <div>

        </div> 

};
};

ClassroomProjectHome.propTypes = {
  getClassroomProjects: PropTypes.func.isRequired,
  resetProject: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
  progress: PropTypes.bool.isRequired,
  classRoomuser: PropTypes.object,
  message: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ClassroomProjectHome);
