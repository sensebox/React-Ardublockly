import * as Blockly from "blockly/core";
import { createNameId } from "mnemonic-id";

import {
  ADD_TAB,
  CLOSE_TAB,
  SWITCH_TAB,
  UPDATE_ACTIVE_TAB,
  SET_TABS_ENABLED,
  RENAME_TAB,
  REORDER_TABS,
} from "./types";
import { setBoard } from "./boardAction";
import { clearStats, workspaceName } from "./workspaceActions";
import { createTabId, MAX_TABS } from "../reducers/tabsReducer";
import { initialXml } from "@/components/Blockly/initialXml.js";
import { withoutUndo } from "@/components/Blockly/helpers/withoutUndo";
import { ensureStartBlock } from "@/components/Blockly/helpers/ensureStartBlock";

export const MAX_TAB_NAME_LENGTH = 50;

export const getActiveTab = (state) =>
  state.tabs.tabs.find((tab) => tab.id === state.tabs.activeId);

const loadXmlIntoWorkspace = (xml) => {
  const ws = Blockly.getMainWorkspace();
  if (!ws) return;
  withoutUndo(ws, () => {
    try {
      Blockly.Xml.clearWorkspaceAndLoadFromXml(
        Blockly.utils.xml.textToDom(xml),
        ws,
      );
    } catch (e) {
      console.warn("Failed to load tab XML:", e);
      ws.clear();
    }
    ensureStartBlock(ws);
  });
  Blockly.svgResize(ws);
};

// Reads the XML synchronously from the workspace (Redux/autosave may lag
// behind because of the autosave debounce) and stores it in the active tab.
const saveCurrentWorkspace = () => (dispatch, getState) => {
  const ws = Blockly.getMainWorkspace();
  if (!ws) return;
  const xmlDom = Blockly.Xml.workspaceToDom(ws);
  const board = getState().board.board;
  if (board) xmlDom.setAttribute("board", board);
  dispatch({
    type: UPDATE_ACTIVE_TAB,
    payload: { xml: Blockly.Xml.domToPrettyText(xmlDom) },
  });
};

// Loads the (already active) tab into the workspace.
const activateTab = (tab) => (dispatch, getState) => {
  const xml = tab.xml || initialXml;
  // autoSaveXML mirrors the active tab; BlocklyWindow reloads from it on
  // board and language changes
  window.localStorage.setItem("autoSaveXML", xml);
  dispatch(workspaceName(tab.name));

  const currentBoard = getState().board.board;
  if (tab.board && tab.board !== currentBoard) {
    // BlocklyWindow reloads autoSaveXML and the toolbox on board change
    dispatch(setBoard(tab.board));
  } else {
    if (!tab.board && currentBoard) {
      dispatch({ type: UPDATE_ACTIVE_TAB, payload: { board: currentBoard } });
    }
    loadXmlIntoWorkspace(xml);
  }
  dispatch(clearStats());
};

export const setTabsEnabled = (enabled) => (dispatch, getState) => {
  dispatch({ type: SET_TABS_ENABLED, payload: enabled });
  const board = getState().board.board;
  const activeTab = getActiveTab(getState());
  if (enabled && board && activeTab && activeTab.board !== board) {
    // board may have been changed elsewhere (settings, tutorial)
    dispatch({ type: UPDATE_ACTIVE_TAB, payload: { board } });
  }
};

export const updateActiveTabXml = (xml) => (dispatch, getState) => {
  if (!getState().tabs.enabled || !xml) return;
  dispatch({ type: UPDATE_ACTIVE_TAB, payload: { xml } });
};

export const switchTab = (id) => (dispatch, getState) => {
  const { activeId, tabs } = getState().tabs;
  const tab = tabs.find((t) => t.id === id);
  if (!tab || id === activeId) return;
  dispatch(saveCurrentWorkspace());
  dispatch({ type: SWITCH_TAB, payload: id });
  dispatch(activateTab(tab));
};

export const addTab = () => (dispatch, getState) => {
  if (getState().tabs.tabs.length >= MAX_TABS) return;
  dispatch(saveCurrentWorkspace());
  const tab = {
    id: createTabId(),
    name: createNameId(),
    board: getState().board.board,
    xml: initialXml,
  };
  dispatch({ type: ADD_TAB, payload: { tab } });
  dispatch(activateTab(tab));
};

// Copies a tab (program, board, name) and opens the copy next to it.
export const duplicateTab = (id) => (dispatch, getState) => {
  if (getState().tabs.tabs.length >= MAX_TABS) return;
  // store the current workspace first: it is either the source (whose stored
  // XML may lag behind) or the tab we are about to leave
  dispatch(saveCurrentWorkspace());
  const source = getState().tabs.tabs.find((t) => t.id === id);
  if (!source) return;
  const suffix = ` ${Blockly.Msg.tabs_copy_suffix}`;
  const tab = {
    ...source,
    id: createTabId(),
    name: `${source.name.slice(0, MAX_TAB_NAME_LENGTH - suffix.length)}${suffix}`,
  };
  dispatch({ type: ADD_TAB, payload: { tab, afterId: id } });
  dispatch(activateTab(tab));
};

export const renameTab = (id, name) => (dispatch, getState) => {
  const trimmed = (name || "").trim().slice(0, MAX_TAB_NAME_LENGTH);
  if (!trimmed) return;
  dispatch({ type: RENAME_TAB, payload: { id, name: trimmed } });
  // the active tab's name is also the workspace name used by save/share/download
  if (id === getState().tabs.activeId) dispatch(workspaceName(trimmed));
};

// moves the tab `fromId` to the position of the tab `toId`
export const reorderTabs = (fromId, toId) => (dispatch) => {
  dispatch({ type: REORDER_TABS, payload: { fromId, toId } });
};

export const closeTab = (id) => (dispatch, getState) => {
  const { activeId, tabs } = getState().tabs;
  if (tabs.length <= 1) return;
  const index = tabs.findIndex((t) => t.id === id);
  if (index === -1) return;
  if (id !== activeId) {
    dispatch({ type: CLOSE_TAB, payload: { id } });
    return;
  }
  const next = tabs[index + 1] || tabs[index - 1];
  dispatch({ type: CLOSE_TAB, payload: { id, nextActiveId: next.id } });
  dispatch(activateTab(next));
};
