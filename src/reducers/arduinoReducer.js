import { GET_ARDUINO_EXAMPLES } from '../actions/types';

const initialState = {
  examples: [],
  type: '',
  description: '',
  progress: false
};

export default function foo(state = initialState, action) {
  switch (action.type) {
    case GET_ARDUINO_EXAMPLES:
      return {
        ...state,
        examples: action.payload
      };
    default:
      return state;
  }
}
