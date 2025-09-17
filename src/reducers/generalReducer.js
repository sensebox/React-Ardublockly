import {
  VISIT,
  LANGUAGE,
  RENDERER,
  SOUNDS,
  STATISTICS,
  PLATFORM,
  COMPILER,
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

const initialPlatform = () => {
  return getPlatform();
};

const initialCompiler = () => {
  return import.meta.env.INITIAL_COMPILER_URL;
};

const initialSounds = () => {
  if (window.localStorage.getItem("sounds")) {
    return window.localStorage.getItem("sounds");
  } else {
    return false;
  }
};

export const getPlatform = () => {
  if (window.localStorage.getItem("platform")) {
    return JSON.parse(window.localStorage.getItem("platform"));
  }
  var userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"],
    os = null;
  if (macosPlatforms.indexOf(platform) !== -1) {
    os = false;
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = true;
  } else if (windowsPlatforms.indexOf(userAgent) !== -1) {
    os = false;
  } else if (/Android/.test(userAgent)) {
    os = true;
  } else if (!os && /Linux/.test(platform)) {
    os = false;
  }
  return os;
};

const initialSessionId = () => {
  const key = "sessionId";
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;
  const id =
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  window.sessionStorage.setItem(key, id);
  return id;
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
  sounds: initialSounds(),
  statistics: initialStatistics(),
  platform: initialPlatform(),
  compiler: initialCompiler(),
  sessionId: initialSessionId(),
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
      window.localStorage.setItem("platform", action.payload);
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
    case SOUNDS:
      window.localStorage.setItem("sounds", action.payload);
      return {
        ...state,
        sounds: action.payload,
      };
    case STATISTICS:
      window.localStorage.setItem("statistics", action.payload);
      return {
        ...state,
        statistics: action.payload,
      };
    case COMPILER:
      return {
        ...state,
        compiler: action.payload,
      };
    default:
      return state;
  }
}
