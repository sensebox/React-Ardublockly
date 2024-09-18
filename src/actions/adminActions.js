
import axios from 'axios';
import { GET_USERS_SUCCESS, GET_USERS_FAIL, UPDATE_USER_ROLE_SUCCESS, UPDATE_USER_ROLE_FAIL } from './types';

// Fetch all users
export const getUsers = () => async (dispatch) => {
  try {
    const res = await  axios.get(`${process.env.REACT_APP_BLOCKLY_API}/user/users`)
    dispatch({
      type: GET_USERS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_USERS_FAIL,
      payload: err.response.data
    });
  }
};

// Update user role
export const updateUserRole = (userId, role) => async (dispatch) => {
    const body = { 
      "_id": userId,
      "newRole": role
    };
  
    try {
      const res = await axios.put(`${process.env.REACT_APP_BLOCKLY_API}/user/role`, body);  // API endpoint to update user role
      dispatch({
        type: UPDATE_USER_ROLE_SUCCESS,
        payload: { userId, role: res.data.newRole }  // Assuming response contains updated role
      });
    } catch (err) {
      dispatch({
        type: UPDATE_USER_ROLE_FAIL,
        payload: err.response ? err.response.data : 'Error updating role'
      });
    }
  };