import axios from "axios";
import { LOGIN_SUCCESS, CLASSROOM_LOGIN_FAILURE, GET_STATUS } from "./types";

export const classroomLogin = (classroomCode, nickname) => async (dispatch) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BLOCKLY_API}/classroom/login`,
      { classroomCode, nickname },
    );
    console.log(res.data);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        ...res.data,
        message: "LOGIN_SUCCESS",
      },
    });
    dispatch({
      type: GET_STATUS,
      payload: res.data.student,
    });
  } catch (err) {
    dispatch({
      type: CLASSROOM_LOGIN_FAILURE,
      payload: err.response ? err.response.data : { error: "Login failed" },
    });
  }
};
