import { VISIT, LANGUAGE, RENDERER, STATISTICS } from '../actions/types';


const initialState = {
  pageVisits: 0, // detect if previous URL was
  language: 'de',
  renderer: window.localStorage.getItem('renderer') || 'geras',
  statistics: window.localStorage.getItem('statistics') === 'true' ? true : window.localStorage.getItem('statistics') === 'false' ? false : false
};

export default function(state = initialState, action){
  switch(action.type){
    case VISIT:
      return {
        ...state,
        pageVisits: state.pageVisits += 1
      };
    case LANGUAGE:
      return {
        ...state,
        language: action.payload
      };
    case RENDERER:
      window.localStorage.setItem('renderer', action.payload);
      return {
        ...state,
        renderer: action.payload
      };
    case STATISTICS:
      window.localStorage.setItem('statistics', action.payload);
      return {
        ...state,
        statistics: action.payload
      };
    default:
      return state;
  }
}
