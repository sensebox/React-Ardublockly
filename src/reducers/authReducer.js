import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  REFRESH_TOKEN_SUCCESS,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  progress: true,
  user: null,
};

export default function foo(state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        progress: true,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        progress: false,
        user: action.payload,
      };
    case LOGIN_SUCCESS:
      console.log("Login success", action.payload);
      localStorage.setItem("token", action.payload.token);
      // localStorage.setItem("refreshToken", action.payload.refreshToken);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        progress: false,
      };
    case AUTH_ERROR:
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        progress: false,
      };
    case LOGIN_FAIL:
      console.log("Login fail", action.payload);
      localStorage.removeItem("token");
      // localStorage.removeItem("refreshToken");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        progress: false,
      };
    case REFRESH_TOKEN_SUCCESS:
      console.log("REFRESH_TOKEN_SUCCESS", action.payload);
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        progress: false,
      };
    case LOGOUT_SUCCESS:
    case LOGOUT_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        progress: false,
      };
    default:
      return state;
  }
}
