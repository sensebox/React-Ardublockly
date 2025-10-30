import {
  GET_STATUS,
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from "../actions/types";

import axios from "axios";
import { returnErrors, returnSuccess } from "./messageActions";
import { setLanguage } from "./generalActions";

const API_BASE = import.meta.env.VITE_BLOCKLY_API;

// ======================
// LOAD USER (from token)
// ======================
export const loadUser = () => (dispatch) => {
  dispatch({ type: USER_LOADING });

  // Kein async/await auf der äußeren Ebene – stattdessen .then/.catch
  axios
    .get(`${API_BASE}/user`, { headers: authHeader() })
    .then((res) => {
      // Erfolg
      dispatch({ type: USER_LOADED, payload: res.data.user });
      dispatch({ type: GET_STATUS, payload: res.data.user.status });
      dispatch(setLanguage(res.data.user.language || "en_US"));
    })
    .catch((err) => {
      // Fehler – aber NICHT werfen!
      dispatch({ type: AUTH_ERROR });
      let status = [];
      try {
        status = JSON.parse(localStorage.getItem("status")) || [];
      } catch (e) {
        /* ignore */
      }
      dispatch({ type: GET_STATUS, payload: status });
      console.warn("Failed to load user:", err.message);
    });
};

// ======================
// REGISTER (native)
// ======================
export const register =
  ({ email, password }) =>
  async (dispatch) => {
    dispatch({ type: USER_LOADING });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(
        `${API_BASE}/user/register`,
        JSON.stringify({ email, password }),
        config,
      );

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      dispatch(returnSuccess(res.data.message, res.status, "REGISTER_SUCCESS"));
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
      });
      if (err.response) {
        dispatch(
          returnErrors(
            err.response.data.message,
            err.response.status,
            "REGISTER_FAIL",
          ),
        );
      }
    }
  };

// ======================
// LOGIN (native)
// ======================
export const login =
  ({ email, password }) =>
  async (dispatch) => {
    dispatch({ type: USER_LOADING });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(
        `${API_BASE}/user/login`,
        JSON.stringify({ email, password }),
        config,
      );

      dispatch(setLanguage(res.data.user.language || "en_US"));
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      dispatch({
        type: GET_STATUS,
        payload: res.data.user.status,
      });
      dispatch(returnSuccess(res.data.message, res.status, "LOGIN_SUCCESS"));
    } catch (err) {
      dispatch({ type: LOGIN_FAIL });
      let status = [];
      try {
        status = JSON.parse(localStorage.getItem("status")) || [];
      } catch (e) {
        /* ignore */
      }
      dispatch({ type: GET_STATUS, payload: status });

      if (err.response) {
        dispatch(
          returnErrors(
            err.response.data.message,
            err.response.status,
            "LOGIN_FAIL",
          ),
        );
      }
    }
  };

// ======================
// LOGIN via openSenseMap (optional)
// ======================
export const loginOpenSenseMap =
  ({ email, password }) =>
  async (dispatch) => {
    dispatch({ type: USER_LOADING });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(
        `${API_BASE}/user/login/opensensemap`,
        JSON.stringify({ email, password }),
        config,
      );

      dispatch(setLanguage(res.data.user.language || "en_US"));
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });

      dispatch({
        type: GET_STATUS,
        payload: res.data.user.status,
      });
      dispatch(returnSuccess(res.data.message, res.status, "LOGIN_SUCCESS"));
    } catch (err) {
      dispatch({ type: LOGIN_FAIL });
      let status = [];
      try {
        status = JSON.parse(localStorage.getItem("status")) || [];
      } catch (e) {
        /* ignore */
      }
      dispatch({ type: GET_STATUS, payload: status });
      if (err.response) {
        dispatch(
          returnErrors(
            err.response.data.message,
            err.response.status,
            "LOGIN_FAIL",
          ),
        );
      }
    }
  };

// ======================
// LOGOUT (native)
// ======================
export const logout = () => (dispatch) => {
  // Bei native-Login: nur lokal ausloggen
  dispatch({ type: LOGOUT_SUCCESS });
  let status = [];
  try {
    status = JSON.parse(localStorage.getItem("status")) || [];
  } catch (e) {
    /* ignore */
  }
  dispatch({ type: GET_STATUS, payload: status });

  const locale =
    localStorage.getItem("locale") ||
    (navigator.language === "de-DE" ? "de_DE" : "en_US");
  dispatch(setLanguage(locale));

  dispatch(returnSuccess("Successfully logged out.", 200, "LOGOUT_SUCCESS"));
};

export const authHeader = () => {
  try {
    const token = localStorage.getItem("token");
    if (token && typeof token === "string" && token.trim() !== "") {
      return { Authorization: `Bearer ${token}` };
    }
  } catch (e) {
    console.warn("Failed to read token from localStorage", e);
  }
  return {};
};

// ======================
// Auth Interceptor (optional – für Token-basierte API-Aufrufe)
// ======================
export const setupInterceptors = (store) => {
  axios.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  });
};

// 🔥 Neue Action für Passwort-Reset-Anfrage
export const requestPasswordReset =
  ({ email }) =>
  (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    return new Promise((resolve, reject) => {
      axios
        .post(
          `${API_BASE}/user/reset-password/request`,
          JSON.stringify({ email }),
          config,
        )
        .then((res) => {
          dispatch({
            type: "REQUEST_PASSWORD_RESET_SUCCESS",
            payload: res.data,
          });
          dispatch(
            returnSuccess(
              res.data.message,
              res.status,
              "REQUEST_PASSWORD_RESET_SUCCESS",
            ),
          );
          resolve(res);
        })
        .catch((err) => {
          dispatch({
            type: "REQUEST_PASSWORD_RESET_FAIL",
            payload: err.response?.data || { msg: "Netzwerkfehler" },
          });
          dispatch(
            returnErrors(
              err.response?.data?.message || "Netzwerkfehler",
              err.response?.status || 500,
              "REQUEST_PASSWORD_RESET_FAIL",
            ),
          );
          reject(err);
        });
    });
  };

export const resetPassword =
  ({ token, newPassword }) =>
  (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    return new Promise((resolve, reject) => {
      axios
        .post(
          `${API_BASE}/user/reset-password/reset`,
          JSON.stringify({ token, newPassword }),
          config,
        )
        .then((res) => {
          dispatch({
            type: "RESET_PASSWORD_SUCCESS",
            payload: res.data,
          });
          dispatch(
            returnSuccess(
              res.data.message,
              res.status,
              "RESET_PASSWORD_SUCCESS",
            ),
          );
          resolve(res);
        })
        .catch((err) => {
          dispatch({
            type: "RESET_PASSWORD_FAIL",
            payload: err.response?.data || { msg: "Netzwerkfehler" },
          });
          dispatch(
            returnErrors(
              err.response?.data?.message || "Netzwerkfehler",
              err.response?.status || 500,
              "RESET_PASSWORD_FAIL",
            ),
          );
          reject(err);
        });
    });
  };
