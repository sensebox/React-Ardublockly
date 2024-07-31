// src/utils/axiosConfig.js
import axios from 'axios';
import store from '../store'; // Pfad zu Ihrem Redux-Store
import { LOGOUT } from '../actions/types';
import { returnErrors } from '../actions/messageActions';


const api = axios.create({
  baseURL: process.env.REACT_APP_BLOCKLY_API,
});

// Interceptor zum Hinzufügen des Tokens zu jedem Request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
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
