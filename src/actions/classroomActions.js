import { GET_CLASSROOMS, GET_CLASSROOM, ADD_STUDENT_SUCCESS, CREATE_CLASSROOM, DELETE_STUDENT_SUCCESS, DELETE_STUDENT_FAIL, GET_CLASSROOM_PROJECTS_SUCCESS, GET_CLASSROOM_PROJECT_SUCCESS  } from './types';
import { returnErrors, returnSuccess } from './messageActions';
import api from '../utils/axiosConfig';



export const createClassroom = (classroom) => (dispatch) => {
  console.log(classroom);
  const config = {
    success: res => {
      dispatch(returnSuccess(res.data.message, res.status, 'CREATE_CLASSROOM_SUCCESS'));
    },
    error: err => {
      if (err.response) {
        dispatch(returnErrors(err.response.data.message, err.response.status, 'CREATE_CLASSROOM_FAIL'));
      }
    }
  };
  api.post(`${process.env.REACT_APP_BLOCKLY_API}/classroom`, classroom, config)
    .then(res => {
      res.config.success(res);
    })
    .catch(err => {
      err.config.error(err);
    });
};

export const deleteClassroom = (id) => (dispatch) => {
  const config = {
    success: res => {
      dispatch(returnSuccess(res.data.message, res.status));
    },
    error: err => {
      if (err.response) {
        dispatch(returnErrors(err.response.data.message, err.response.status, 'DELETE_CLASSROOM_FAIL'));
      }
    }
  };
  api.delete(`${process.env.REACT_APP_BLOCKLY_API}/classroom/${id}`, config)
    .then(res => {
      res.config.success(res);
    })
    .catch(err => {
      err.config.error(err);
    });
};


export const addStudent = (classroomId, student) => (dispatch) => {
  const body = {
    students: [student]
  }
  const config = {
    success: res => {
      dispatch({
        type: ADD_STUDENT_SUCCESS,
        payload: student
      });
      dispatch(returnSuccess(res.data.message, res.status, 'ADD_STUDENT_SUCCESS'));
    },
    error: err => {
      if (err.response) {
        dispatch(returnErrors(err.response.data.message, err.response.status, 'ADD_STUDENT_FAIL'));
      }
    }
  };
  api.post(`${process.env.REACT_APP_BLOCKLY_API}/classroom/${classroomId}/adduser`, body, config)
    .then(res => {
      res.config.success(res);
    })
    .catch(err => {
      err.config.error(err);
    });
};

export const deleteStudent = (classroomId, studentId) => (dispatch) => {
  const body = {
    _id: studentId
  };
  console.log(body);
  
  api.delete(`${process.env.REACT_APP_BLOCKLY_API}/classroom/${classroomId}/user`, { data: body })
    .then(res => {
      dispatch({
        type: DELETE_STUDENT_SUCCESS,
        payload: studentId
      });
      dispatch(returnSuccess(res.data.message, res.status, 'DELETE_STUDENT_SUCCESS'));
    })
    .catch(err => {
      if (err.response) {
        dispatch(returnErrors(err.response.data.message, err.response.status, 'DELETE_STUDENT_FAIL'));
      }
    });
};


export const getClassrooms = () => (dispatch) => {
  const config = {
    success: res => {
      console.log(res.data.classrooms);
      var classrooms = res.data.classrooms;
      dispatch({
        type: GET_CLASSROOMS,
        payload: classrooms
      });
      dispatch(returnSuccess(res.data.message, res.status));
    },
    error: err => {
      if (err.response) {
        dispatch(returnErrors(err.response.data.message, err.response.status, 'GET_CLASSROOMS_FAIL'));
      }
    }
  };
  api.get(`${process.env.REACT_APP_BLOCKLY_API}/classroom`, config)
    .then(res => {
      res.config.success(res);
    })
    .catch(err => {
      err.config.error(err);
    });
};

  
  export const getClassroom = (id) => (dispatch ) => {
    console.log('Fetching classroom:', id);
    api
      .get(`${process.env.REACT_APP_BLOCKLY_API}/classroom/${id}`)
      .then((res) => {
        var classroom = res.data.classroom;
        dispatch({
          type: GET_CLASSROOM,
          payload: classroom,
        });
        dispatch(returnSuccess(res.data.message, res.status));
      })
      .catch((err) => {
        if (err.response) {
          dispatch(
            returnErrors(
              err.response.data.message,
              err.response.status,
              "GET_CLASSROOM_FAIL"
            )
          );
        }
      }
      );
  };

  export const getClassroomProject = (classroomId, projectId ) => (dispatch ) => {
    const config = {
      success: res => {
        var project = res.data.project;
        dispatch({
          type: GET_CLASSROOM_PROJECT_SUCCESS,
          payload: project
        });
        dispatch(returnSuccess(res.data.message, res.status, 'GET_CLASSROOM_PROJECT_SUCCESS'));
      },
      error: err => {
        if (err.response) {
          dispatch(returnErrors(err.response.data.message, err.response.status, 'GET_CLASSROOM_PROJECT_FAIL'));
        }
      }
    };
    api.get(`/classroom/${classroomId}/${projectId}`, config)
    .then(res => {
      res.config.success(res);
    })
    .catch(err => {
      err.config.error(err);
    });
  };


  export const getClassroomProjects = (classroomCode, nickname, classroomId) => (dispatch ) => {
    const body = {
      classroomCode: classroomCode,
      nickname: nickname
    }
    const config = {
      success: res => {
        var projects = res.data.projects;
        dispatch({
          type: GET_CLASSROOM_PROJECTS_SUCCESS,
          payload: projects
        });
        dispatch(returnSuccess(res.data.message, res.status, 'GET_CLASSROOM_PROJECTS_SUCCESS'));
      },
      error: err => {
        if (err.response) {
          dispatch(returnErrors(err.response.data.message, err.response.status, 'GET_CLASSROOM_PROJECTS_FAIL'));
        }
      }
    };
    api.post(`${process.env.REACT_APP_BLOCKLY_API}/classroom/${classroomId}/projects`, body, config)
      .then(res => {
        res.config.success(res);
      })
      .catch(err => {
        err.config.error(err);
      });
  };

export const postClassroomProject = (classroomId, body) => (dispatch) => {
  const config = {
    success: res => {
      dispatch(returnSuccess(res.data.message, res.status, 'POST_CLASSROOM_PROJECT_SUCCESS'));
    },
    error: err => {
      if (err.response) {
        dispatch(returnErrors(err.response.data.message, err.response.status, 'POST_CLASSROOM_PROJECT_FAIL'));
      }
    }
  };
  api.post(`${process.env.REACT_APP_BLOCKLY_API}/classroom/${classroomId}/project`, body, config)
    .then(res => {
      res.config.success(res);
    })
    .catch(err => {
      err.config.error(err);
    });
};


  

// export const updateProject = (type, id) => (dispatch, getState) => {
//   var workspace = getState().workspace;
//   var body = {
//     xml: workspace.code.xml,
//     title: workspace.name
//   };
//   var project = getState().project;
//   if (type === 'gallery') {
//     body.description = project.description;
//   }
//   const config = {
//     success: res => {
//       var project = res.data[type];
//       var projects = getState().project.projects;
//       var index = projects.findIndex(res => res._id === project._id);
//       projects[index] = project;
//       dispatch({
//         type: GET_PROJECTS,
//         payload: projects
//       });
//       if (type === 'project') {
//         dispatch(returnSuccess(res.data.message, res.status, 'PROJECT_UPDATE_SUCCESS'));
//       } else {
//         dispatch(returnSuccess(res.data.message, res.status, 'GALLERY_UPDATE_SUCCESS'));
//       }
//     },
//     error: err => {
//       if (err.response) {
//         if (type === 'project') {
//           dispatch(returnErrors(err.response.data.message, err.response.status, 'PROJECT_UPDATE_FAIL'));
//         } else {
//           dispatch(returnErrors(err.response.data.message, err.response.status, 'GALLERY_UPDATE_FAIL'));
//         }
//       }
//     }
//   };
//   axios.put(`${process.env.REACT_APP_BLOCKLY_API}/${type}/${id}`, body, config)
//     .then(res => {
//       res.config.success(res);
//     })
//     .catch(err => {
//       err.config.error(err);
//     });
// };

// export const deleteProject = (type, id) => (dispatch, getState) => {
//   const config = {
//     success: res => {
//       var projects = getState().project.projects;
//       var index = projects.findIndex(res => res._id === id);
//       projects.splice(index, 1)
//       dispatch({
//         type: GET_PROJECTS,
//         payload: projects
//       });
//       if (type === 'project') {
//         dispatch(returnSuccess(res.data.message, res.status, 'PROJECT_DELETE_SUCCESS'));
//       } else {
//         dispatch(returnSuccess(res.data.message, res.status, 'GALLERY_DELETE_SUCCESS'));
//       }
//     },
//     error: err => {
//       dispatch(returnErrors(err.response.data.message, err.response.status, 'PROJECT_DELETE_FAIL'));
//     }
//   };
//   axios.delete(`${process.env.REACT_APP_BLOCKLY_API}/${type}/${id}`, config)
//     .then(res => {
//       res.config.success(res);
//     })
//     .catch(err => {
//       if (err.response && err.response.status !== 401) {
//         err.config.error(err);
//       }
//     });
// };


// export const shareProject = (title, type, id) => (dispatch, getState) => {
//   var body = {
//     title: title
//   };
//   if (type === 'project') {
//     body.projectId = id;
//   } else {
//     body.xml = getState().workspace.code.xml;
//   }
//   axios.post(`${process.env.REACT_APP_BLOCKLY_API}/share`, body)
//     .then(res => {
//       var shareContent = res.data.content;
//       if (body.projectId) {
//         var projects = getState().project.projects;
//         var index = projects.findIndex(res => res._id === id);
//         projects[index].shared = shareContent.expiresAt;
//         dispatch({
//           type: GET_PROJECTS,
//           payload: projects
//         });
//       }
//       dispatch(returnSuccess(res.data.message, shareContent._id, 'SHARE_SUCCESS'));
//     })
//     .catch(err => {
//       if (err.response) {
//         dispatch(returnErrors(err.response.data.message, err.response.status, 'SHARE_FAIL'));
//       }
//     });
// };


// export const resetProject = () => (dispatch) => {
//   dispatch({
//     type: GET_PROJECTS,
//     payload: []
//   });
//   dispatch(setType(''));
//   dispatch(setDescription(''));
// };
