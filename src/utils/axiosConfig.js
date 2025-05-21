import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BLOCKLY_API,
});

// Interceptor zum Hinzufügen des Tokens zu jedem Request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      console.error("API unreachable");
    }
    return Promise.reject(err);
  },
);

// // Interceptor zum Behandeln von Fehlern
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response.status === 401) {
//       store.dispatch({ type: LOGOUT });
//       store.dispatch(returnErrors('Session expired. Please log in again.', 401));
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
