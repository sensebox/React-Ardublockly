import {
  ADD_TAB,
  CLOSE_TAB,
  SWITCH_TAB,
  UPDATE_ACTIVE_TAB,
  SET_TABS_ENABLED,
  RENAME_TAB,
  REORDER_TABS,
  CLOSE_ALL_TABS,
  NAME,
  BOARD,
} from "../actions/types";
import { createNameId } from "mnemonic-id";

export const STORAGE_KEY = "workspaceTabs";
export const MAX_TABS = 10;

export const createTabId = () =>
  `t${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

const persist = (state) => {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ activeId: state.activeId, tabs: state.tabs }),
    );
  } catch (e) {
    console.warn("Could not persist workspace tabs:", e);
  }
  return state;
};

// Load tabs from localStorage. Without stored tabs, the existing autosave
// (single workspace) becomes the first tab so nobody loses their program.
const loadInitialTabs = () => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (
      stored &&
      Array.isArray(stored.tabs) &&
      stored.tabs.length > 0 &&
      stored.tabs.some((tab) => tab.id === stored.activeId)
    ) {
      return { activeId: stored.activeId, tabs: stored.tabs };
    }
  } catch (e) {
    console.warn("Could not read workspace tabs, starting fresh:", e);
  }
  const tab = {
    id: createTabId(),
    name: createNameId(),
    board: window.sessionStorage.getItem("board"),
    xml: window.localStorage.getItem("autoSaveXML"),
  };
  return persist({ activeId: tab.id, tabs: [tab] });
};

const initialState = () => ({
  ...loadInitialTabs(),
  // true while the tab bar is shown (home page without a loaded project);
  // only then are name/board/xml changes written into the active tab
  enabled: false,
});

const updateActive = (state, changes) =>
  persist({
    ...state,
    tabs: state.tabs.map((tab) =>
      tab.id === state.activeId ? { ...tab, ...changes } : tab,
    ),
  });

export default function tabsReducer(state = initialState(), action) {
  switch (action.type) {
    case SET_TABS_ENABLED:
      return { ...state, enabled: action.payload };
    case ADD_TAB: {
      if (state.tabs.length >= MAX_TABS) return state;
      // optional afterId inserts the tab next to another one (duplicate)
      const { tab, afterId } = action.payload;
      const tabs = [...state.tabs];
      const index = tabs.findIndex((t) => t.id === afterId);
      tabs.splice(index === -1 ? tabs.length : index + 1, 0, tab);
      return persist({ ...state, tabs, activeId: tab.id });
    }
    case CLOSE_TAB: {
      if (state.tabs.length <= 1) return state;
      const tabs = state.tabs.filter((tab) => tab.id !== action.payload.id);
      return persist({
        ...state,
        tabs,
        activeId: action.payload.nextActiveId || state.activeId,
      });
    }
    case CLOSE_ALL_TABS:
      // payload is the fresh tab that replaces all others
      return persist({
        ...state,
        tabs: [action.payload],
        activeId: action.payload.id,
      });
    case SWITCH_TAB:
      return persist({ ...state, activeId: action.payload });
    case RENAME_TAB:
      return persist({
        ...state,
        tabs: state.tabs.map((tab) =>
          tab.id === action.payload.id
            ? { ...tab, name: action.payload.name }
            : tab,
        ),
      });
    case REORDER_TABS: {
      const { fromId, toId } = action.payload;
      const from = state.tabs.findIndex((tab) => tab.id === fromId);
      const to = state.tabs.findIndex((tab) => tab.id === toId);
      if (from === -1 || to === -1 || from === to) return state;
      const tabs = [...state.tabs];
      const [moved] = tabs.splice(from, 1);
      tabs.splice(to, 0, moved);
      return persist({ ...state, tabs });
    }
    case UPDATE_ACTIVE_TAB:
      return updateActive(state, action.payload);
    case NAME:
      // name is reset to null when leaving the page – keep the tab name then
      if (!state.enabled || !action.payload) return state;
      return updateActive(state, { name: action.payload });
    case BOARD:
      if (!state.enabled || !action.payload) return state;
      return updateActive(state, { board: action.payload });
    default:
      return state;
  }
}
