import {
  VISIT,
  LANGUAGE,
  RENDERER,
  STATISTICS,
  PLATFORM,
} from "../actions/types";

const initialLanguage = () => {
  if (window.localStorage.getItem("locale")) {
    return window.localStorage.getItem("locale");
  }
  if (navigator.language === "de-DE") {
    return "de_DE";
  }
  return "en_US";
};

const getPlatform = () => {
  var userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"],
    os = null;
  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "Mac OS";
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "iOS";
  } else if (windowsPlatforms.indexOf(userAgent) !== -1) {
    os = "Windows";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (!os && /Linux/.test(platform)) {
    os = "Linux";
  }
  return os;
};

const initialRenderer = () => {
  if (window.localStorage.getItem("renderer")) {
    return window.localStorage.getItem("renderer");
  }
  return "geras";
};

const initialStatistics = () => {
  if (window.localStorage.getItem("statistics")) {
    return JSON.parse(window.localStorage.getItem("statistics"));
  }
  return false;
};

const initialState = {
  pageVisits: 0, // detect if previous URL was
  language: initialLanguage(),
  renderer: initialRenderer(),
  statistics: initialStatistics(),
  platform: getPlatform(),
};

export default function foo(state = initialState, action) {
  switch (action.type) {
    case VISIT:
      return {
        ...state,
        pageVisits: (state.pageVisits += 1),
      };
    case LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };
    case PLATFORM:
      return {
        ...state,
        platform: action.payload,
      };
    case RENDERER:
      window.localStorage.setItem("renderer", action.payload);
      return {
        ...state,
        renderer: action.payload,
      };
    case STATISTICS:
      window.localStorage.setItem("statistics", action.payload);
      return {
        ...state,
        statistics: action.payload,
      };
    default:
      return state;
  }
}
