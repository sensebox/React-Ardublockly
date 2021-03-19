import { VISIT, LANGUAGE, RENDERER, STATISTICS } from '../actions/types';

const initialLanguage = () => {
  if (window.localStorage.getItem('locale')) {
    return window.localStorage.getItem('locale');
  }
  if (navigator.language === 'de-DE'){
    return 'de_DE';
  }
  return 'en_US';
};

const initialRenderer = () => {
  if (window.localStorage.getItem('renderer')) {
    return window.localStorage.getItem('renderer');
  }
  return 'geras';
};

const initialStatistics = () => {
  if (window.localStorage.getItem('statistics')) {
    return JSON.parse(window.localStorage.getItem('statistics'));
  }
  return false;
};


const initialState = {
  pageVisits: 0, // detect if previous URL was
  language: initialLanguage(),
  renderer: initialRenderer(),
  statistics: initialStatistics()
};

export default function foo(state = initialState, action){
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
