import { TUTORIAL_PROGRESS, GET_TUTORIAL, GET_TUTORIALS, GET_STATUS, TUTORIAL_SUCCESS, TUTORIAL_ERROR, TUTORIAL_CHANGE, TUTORIAL_XML, TUTORIAL_STEP } from '../actions/types';


//
// const initialStatus = () => {
//   if(store.getState().auth.user){
//     return store.getState().auth.user.status || []
//   }
//   else if (window.localStorage.getItem('status')) {
//     var status = JSON.parse(window.localStorage.getItem('status'));
//     return status;
//   }
//   return [];
// };

const initialState = {
  status: [],
  activeStep: 0,
  change: 0,
  tutorials: [],
  progress: false
};

export default function foo(state = initialState, action) {
  switch (action.type) {
    case TUTORIAL_PROGRESS:
      return {
        ...state,
        progress: !state.progress
      }
    case GET_TUTORIALS:
      return {
        ...state,
        tutorials: action.payload
      };
    case GET_TUTORIAL:
      return {
        ...state,
        tutorials: [action.payload]
      }
    case TUTORIAL_SUCCESS:
    case TUTORIAL_ERROR:
    case TUTORIAL_XML:
      // update store - sync with redux store is implemented outside reducer
      // in every dispatch action with the types 'TUTORIAL_SUCCESS','TUTORIAL_ERROR'
      // and 'TUTORIAL_XML' the function 'updateStatus' is called
      return {
        ...state,
        status: action.payload
      };
    case GET_STATUS:
      return {
        ...state,
        status: action.payload
      };
    case TUTORIAL_CHANGE:
      return {
        ...state,
        change: state.change += 1
      }
    case TUTORIAL_STEP:
      return {
        ...state,
        activeStep: action.payload
      }
    default:
      return state;
  }
}
