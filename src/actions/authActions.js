import {
  GET_STATUS,
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  REFRESH_TOKEN_SUCCESS,
} from "../actions/types";

import axios from "axios";
import { returnErrors, returnSuccess } from "./messageActions";
import { setLanguage } from "./generalActions";
import api from '../utils/axiosConfig';


// Social login action
export const socialLogin = (token) => (dispatch) => {
  // // Set token in Authorization header for all future requests
  //axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  // Start loading user data
  dispatch({ type: USER_LOADING });

  // Save the token in localStorage
  console.log("Social login token:", token);
  localStorage.setItem("token", token);
  localStorage.setItem("isSocialAccount", true); // Mark as a social login user

  // Fetch user data from the backend
  api
    .get(`${process.env.REACT_APP_BLOCKLY_API}/user`) // Endpoint to fetch user data
    .then((res) => {
      // Dispatch LOGIN_SUCCESS and store the user data in Redux
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          user: res.data.user, // User data from the response
          token: res.data.token, // JWT Token from response
        },
      });

      // Handle social login user-specific logic
      if (res.data.user.isSocialAccount) {
        console.log("Social login user detected");
        // You can add any additional handling here if needed
      }
    })
    .catch((err) => {
      dispatch({ type: AUTH_ERROR });
      console.error("Error loading user data", err);
    });
};

// // Check token & load user
// export const loadUser = () => (dispatch) => {
//   // Check if the user is a social login user
//   const isSocialAccount = localStorage.getItem("isSocialAccount") === "true";

//   // If it's a social user, we should not trigger loadUser
//   if (isSocialAccount) {
//     console.log("Skipping loadUser for social login users");
//     return; // Don't proceed for social login users
//   }

//   // Continue for non-social users (openSenseMap users)
//   dispatch({ type: USER_LOADING });

//   api
//     .get(`${process.env.REACT_APP_BLOCKLY_API}/user`)
//     .then((res) => {
//       dispatch({
//         type: GET_STATUS,
//         payload: res.data.user.status,
//       });
//       dispatch(setLanguage(res.data.user.language));
//       dispatch({
//         type: USER_LOADED,
//         payload: res.data.user,
//       });
//       dispatch({
//         type: LOGIN_SUCCESS,
//         payload: {
//           user: res.data.user, // User data
//           token: res.data.token, // JWT Token from response
//         },
//       });
//     })
//     .catch((err) => {
//       if (err.response) {
//         dispatch(returnErrors(err.response.data.message, err.response.status));
//       }
//       var status = [];
//       if (window.localStorage.getItem("status")) {
//         status = JSON.parse(window.localStorage.getItem("status"));
//       }
//       dispatch({ type: GET_STATUS, payload: status });
//       dispatch({ type: AUTH_ERROR });
//     });
// };

// Check token & load user (called only when the app loads or on login)
export const loadUser = () => (dispatch) => {
  const isSocialAccount = localStorage.getItem("isSocialAccount") === "true";

  if (isSocialAccount) {
    console.log("Skipping loadUser for social login users");
    return;
  }

  dispatch({ type: USER_LOADING });

  api
    .get(`${process.env.REACT_APP_BLOCKLY_API}/user`)
    .then((res) => {
      dispatch({
        type: GET_STATUS,
        payload: res.data.user.status,
      });
      dispatch(setLanguage(res.data.user.language));
      dispatch({
        type: USER_LOADED,
        payload: res.data.user,
      });
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          user: res.data.user,
          token: res.data.token,
        },
      });
    })
    .catch((err) => {
      console.error("Error loading user:", err);
      dispatch({ type: AUTH_ERROR });
    });
};

// Login user
export const login =
  ({ email, password }) =>
    (dispatch) => {
      dispatch({
        type: USER_LOADING,
      });
      // Headers
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      // Request Body
      const body = JSON.stringify({ email, password });
      axios
        .post(`${process.env.REACT_APP_BLOCKLY_API}/user`, body, config)
        .then((res) => {
          dispatch(setLanguage(res.data.user.language));
          dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
          });
          dispatch({
            type: GET_STATUS,
            payload: res.data.user.status,
          });
          dispatch(returnSuccess(res.data.message, res.status, "LOGIN_SUCCESS"));
        })
        .catch((err) => {
          dispatch(
            returnErrors(
              err.response.data.message,
              err.response.status,
              "LOGIN_FAIL"
            )
          );
          dispatch({
            type: LOGIN_FAIL,
          });
          var status = [];
          if (window.localStorage.getItem("status")) {
            status = JSON.parse(window.localStorage.getItem("status"));
          }
          dispatch({
            type: GET_STATUS,
            payload: status,
          });
        });
    };


// Logout User
export const logout = () => (dispatch) => {
  const isSocialAccount = localStorage.getItem("isSocialAccount") === "true";

  const config = {
    success: (res) => {
      dispatch({ type: LOGOUT_SUCCESS });
      localStorage.removeItem("isSocialAccount"); // Clear the social user flag

      var status = [];
      if (window.localStorage.getItem("status")) {
        status = JSON.parse(window.localStorage.getItem("status"));
      }
      dispatch({ type: GET_STATUS, payload: status });

      var locale = "en_US";
      if (window.localStorage.getItem("locale")) {
        locale = window.localStorage.getItem("locale");
      } else if (navigator.language === "de-DE") {
        locale = "de_DE";
      }
      dispatch(setLanguage(locale));
      dispatch(returnSuccess(res.data.message, res.status, "LOGOUT_SUCCESS"));
    },
    error: (err) => {
      dispatch(
        returnErrors(err.response.data.message, err.response.status, "LOGOUT_FAIL")
      );
      dispatch({ type: LOGOUT_FAIL });
      var status = [];
      if (window.localStorage.getItem("status")) {
        status = JSON.parse(window.localStorage.getItem("status"));
      }
      dispatch({ type: GET_STATUS, payload: status });
    },
  };

  if (isSocialAccount) {
    // Social user logout logic (just remove token and dispatch success)
    dispatch({ type: LOGOUT_SUCCESS });
    localStorage.removeItem("token");
    localStorage.removeItem("isSocialAccount"); // Clear the social user flag
  } else {
    // openSenseMap logout logic
    axios
      .post("https://api.opensensemap.org/users/sign-out", {}, config)
      .then((res) => {
        res.config.success(res);
      })
      .catch((err) => {
        if (err.response && err.response.status !== 401) {
          err.config.error(err);
        }
      });
  }
};

export const authInterceptor = () => (dispatch, getState) => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token"); // Get token from localStorage
      console.log("Interceptor token:", token); // Debugging: Check if token exists

      if (token) {
        // Set the token in the Authorization header for every request
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.warn("No token found, skipping Authorization header");
      }
      return config;
    },
    (error) => {
      return Promise.reject(error); // Handle request errors
    }
  );
  // Handle token expiration in the response interceptor
axios.interceptors.response.use(
  (response) => response, // Return the response if it's successful
  (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refreshToken"); // Get refresh token

    // If 401 Unauthorized, try to refresh the token
    if (error.response.status === 401 && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;

      return axios
        .post(`${process.env.REACT_APP_BLOCKLY_API}/refresh-token`, { token: refreshToken })
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("token", res.data.token); // Store the new token
            axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
            originalRequest.headers["Authorization"] = `Bearer ${res.data.token}`;

            // Retry the original request with the new token
            return axios(originalRequest);
          }
        })
        .catch((err) => {
          dispatch({ type: AUTH_ERROR }); // Dispatch auth error if refresh fails
          return Promise.reject(err);
        });
    }

    return Promise.reject(error); // Reject the request if there's an error
  }
);
};
