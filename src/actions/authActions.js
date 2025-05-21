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

// Check token & load user
export const loadUser = () => (dispatch) => {
  // user loading
  dispatch({
    type: USER_LOADING,
  });
  console.log("loadUser");
  const config = {
    success: (res) => {
      dispatch({
        type: GET_STATUS,
        payload: res.data.user.status,
      });
      dispatch(setLanguage(res.data.user.language));
      dispatch({
        type: USER_LOADED,
        payload: res.data.user,
      });
    },
    error: (err) => {
      if (err.response) {
        dispatch(returnErrors(err.response.data.message, err.response.status));
      }
      var status = [];
      if (window.localStorage.getItem("status")) {
        status = JSON.parse(window.localStorage.getItem("status"));
      }
      dispatch({
        type: GET_STATUS,
        payload: status,
      });
      dispatch({
        type: AUTH_ERROR,
      });
    },
  };
  axios
    .get(
      `${import.meta.env.VITE_BLOCKLY_API}/user`,
      config,
      dispatch(authInterceptor()),
    )
    .then((res) => {
      res.config.success(res);
    })
    .catch((err) => {
      err.config.error(err);
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
      .post(`${import.meta.env.VITE_BLOCKLY_API}/user`, body, config)
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
            "LOGIN_FAIL",
          ),
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
  axios
    .post("http://localhost:8080/user/logout") // adjust if needed
    .then((res) => {
      // Clear Redux auth state
      dispatch({ type: LOGOUT_SUCCESS });

      // Restore previous local status
      let status = [];
      if (window.localStorage.getItem("status")) {
        status = JSON.parse(window.localStorage.getItem("status"));
      }
      dispatch({ type: GET_STATUS, payload: status });

      // Determine locale
      let locale = "en_US";
      if (window.localStorage.getItem("locale")) {
        locale = window.localStorage.getItem("locale");
      } else if (navigator.language === "de-DE") {
        locale = "de_DE";
      }
      dispatch(setLanguage(locale));

      // Notify success
      dispatch(returnSuccess(res.data.message, res.status, "LOGOUT_SUCCESS"));
    })
    .catch((err) => {
      // Only dispatch error if it's not unauthorized
      if (err.response && err.response.status !== 401) {
        dispatch(
          returnErrors(
            err.response.data.message,
            err.response.status,
            "LOGOUT_FAIL",
          ),
        );
      }

      // Dispatch fallback fail
      dispatch({ type: LOGOUT_FAIL });

      // Fallback: Restore previous status
      let status = [];
      if (window.localStorage.getItem("status")) {
        status = JSON.parse(window.localStorage.getItem("status"));
      }
      dispatch({ type: GET_STATUS, payload: status });
    });
};

// // Logout User
// export const logout = () => (dispatch) => {
//   const config = {
//     success: (res) => {
//       dispatch({
//         type: LOGOUT_SUCCESS,
//       });
//       var status = [];
//       if (window.localStorage.getItem("status")) {
//         status = JSON.parse(window.localStorage.getItem("status"));
//       }
//       dispatch({
//         type: GET_STATUS,
//         payload: status,
//       });
//       var locale = "en_US";
//       if (window.localStorage.getItem("locale")) {
//         locale = window.localStorage.getItem("locale");
//       } else if (navigator.language === "de-DE") {
//         locale = "de_DE";
//       }
//       dispatch(setLanguage(locale));
//       dispatch(returnSuccess(res.data.message, res.status, "LOGOUT_SUCCESS"));
//     },
//     error: (err) => {
//       dispatch(
//         returnErrors(
//           err.response.data.message,
//           err.response.status,
//           "LOGOUT_FAIL",
//         ),
//       );
//       dispatch({
//         type: LOGOUT_FAIL,
//       });
//       var status = [];
//       if (window.localStorage.getItem("status")) {
//         status = JSON.parse(window.localStorage.getItem("status"));
//       }
//       dispatch({
//         type: GET_STATUS,
//         payload: status,
//       });
//     },
//   };
//   axios
//     .post("https://api.opensensemap.org/users/sign-out", {}, config)
//     .then((res) => {
//       res.config.success(res);
//     })
//     .catch((err) => {
//       if (err.response && err.response.status !== 401) {
//         err.config.error(err);
//       }
//     });
// };

// Social login action
export const socialLogin = (token) => (dispatch) => {
  console.log("Storing token in localStorage:", token); // Add this for debugging

  // Set token in Authorization header for all future requests
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  // Start loading user data
  dispatch({ type: USER_LOADING });

  // Save the token in localStorage
  localStorage.setItem("token", token);

  // Fetch user data from the backend
  return axios
    .get("http://localhost:8080/user") // Endpoint to fetch user data
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          user: res.data, // User data from the response
          token, // Store the token
        },
      });
      return res.data;
    })
    .catch((err) => {
      dispatch({ type: AUTH_ERROR });
      console.error("Error loading user data", err);
    });
};
export const authInterceptor = () => (dispatch, getState) => {
  // Request Interceptor
  axios.interceptors.request.use(
    (config) => {
      config.headers["Content-Type"] = "application/json";
      const token = getState().auth.token;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      config.withCredentials = true; // Always send cookies (e.g., for refresh)
      return config;
    },
    (error) => Promise.reject(error),
  );

  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  // In your setup file:
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const token = localStorage.getItem("token");
      if (error.response?.status === 401 && !originalRequest._retry && token) {
        originalRequest._retry = true;

        if (isRefreshing) {
          // Wait until the token is refreshed
          return new Promise(function (resolve, reject) {
            failedQueue.push({
              resolve: (token) => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                resolve(axios(originalRequest));
              },
              reject: (err) => reject(err),
            });
          });
        }

        isRefreshing = true;

        try {
          const res = await axios.post(
            `http://localhost:8080/user/refresh-token`,
            {},
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            },
          );

          if (res.status === 200 && res.data?.token) {
            const newToken = res.data.token;
            console.log(res.data);
            dispatch({
              type: REFRESH_TOKEN_SUCCESS,
              payload: res.data,
            });

            localStorage.setItem("token", newToken);
            axios.defaults.headers.common["Authorization"] =
              `Bearer ${newToken}`;
            processQueue(null, newToken);

            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          dispatch({ type: AUTH_ERROR });

          if (refreshError.response) {
            dispatch(
              returnErrors(
                refreshError.response.data.message,
                refreshError.response.status,
              ),
            );
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );
};
