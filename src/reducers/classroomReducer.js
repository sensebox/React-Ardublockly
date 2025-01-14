import {
  GET_CLASSROOMS,
  GET_CLASSROOM,
  ADD_STUDENT,
  CREATE_CLASSROOM,
  DELETE_CLASSROOM,
  ADD_STUDENT_SUCCESS,
  DELETE_STUDENT_SUCCESS,
  GET_CLASSROOM_PROJECTS,
  GET_CLASSROOM_PROJECTS_SUCCESS,
  GET_CLASSROOM_PROJECT,
  GET_CLASSROOM_PROJECT_SUCCESS,
  POST_CLASSROOM_PROJECT_FAIL,
  POST_CLASSROOM_PROJECT_SUCCESS,
  POST_CLASSROOM_PROJECT,
} from "../actions/types";

const initialState = {
  classrooms: [],
};

export default function foo(state = initialState, action) {
  switch (action.type) {
    case GET_CLASSROOMS:
      return {
        ...state,
        classrooms: action.payload,
      };
    case GET_CLASSROOM:
      return {
        ...state,
        classroom: action.payload,
      };
    case ADD_STUDENT:
      return {
        ...state,
        classroom: action.payload,
      };
    case ADD_STUDENT_SUCCESS:
      return {
        ...state,
        msg: action.payload.message,
        status: action.payload.status,
        id: "ADD_STUDENT_SUCCESS",
      };
    case DELETE_STUDENT_SUCCESS:
      return {
        ...state,
        msg: action.payload.message,
        status: action.payload.status,
        id: "DELETE_STUDENT_SUCCESS",
      };
    case CREATE_CLASSROOM:
      return {
        ...state,
        classroom: action.payload,
      };
    case DELETE_CLASSROOM:
      return {
        ...state,
        classroom: action.payload,
      };
    case GET_CLASSROOM_PROJECT:
      return {
        ...state,
        classroomProject: action.payload,
      };
    case GET_CLASSROOM_PROJECT_SUCCESS:
      return {
        ...state,
        msg: action.payload.message,
        status: action.payload.status,
        id: "GET_CLASSROOM_PROJECT_SUCCESS",
      };
    case GET_CLASSROOM_PROJECTS:
      return {
        ...state,
        classroomProjects: action.payload,
      };
    case GET_CLASSROOM_PROJECTS_SUCCESS:
      return {
        ...state,
        msg: action.payload.message,
        status: action.payload.status,
        id: "GET_CLASSROOM_PROJECTS_SUCCESS",
      };
    case POST_CLASSROOM_PROJECT:
      return {
        ...state,
        classroomProject: action.payload,
      };
    case POST_CLASSROOM_PROJECT_FAIL:
      return {
        ...state,
        msg: action.payload.message,
        status: action.payload.status,
        id: "POST_CLASSROOM_PROJECT_FAIL",
      };
    case POST_CLASSROOM_PROJECT_SUCCESS:
      return {
        ...state,
        msg: action.payload.message,
        status: action.payload.status,
        id: "POST_CLASSROOM_PROJECT_SUCCESS",
      };

    default:
      return state;
  }
}
