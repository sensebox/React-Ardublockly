import { GET_ERRORS, CLEAR_MESSAGES, GET_SUCCESS } from './types';

// RETURN Errors
export const returnErrors = (msg, status, id = null) => {
  return {
    type: GET_ERRORS,
    payload: {
      msg: msg,
      status: status,
      id: id
    }
  };
};

// RETURN Success
export const returnSuccess = (msg, status, id = null) => {
  return {
    type: GET_SUCCESS,
    payload: {
      msg: msg,
      status: status,
      id: id
    }
  };
};

// CLEAR_MESSAGES
export const clearMessages = () => {
  return {
    type: CLEAR_MESSAGES
  };
};
