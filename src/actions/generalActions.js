import { VISIT } from './types';


export const visitPage = () => (dispatch) => {
  dispatch({
    type: VISIT
  });
};
