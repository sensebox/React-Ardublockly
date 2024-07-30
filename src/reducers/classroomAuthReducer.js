import { LOGIN_SUCCESS, GET_STATUS, CLASSROOM_LOGIN_FAILURE } from '../actions/types';

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  classroomUser: null,
  error: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        classroomUser: action.payload.student,
        message: action.payload.message,
        error: null,
      };
    case GET_STATUS:
      return {
        ...state,
        student: action.payload,
      };
    case CLASSROOM_LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload.error,
      };
    default:
      return state;
  }
}
