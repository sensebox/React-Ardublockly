import {
  NEW_CODE,
  CHANGE_WORKSPACE,
  CREATE_BLOCK,
  MOVE_BLOCK,
  CHANGE_BLOCK,
  DELETE_BLOCK,
  CLEAR_STATS,
  NAME,
} from "./types";

import * as Blockly from "blockly/core";
import { basicGenerator } from "@/components/Blockly/generator/basic/generator";
import { simulatorGenerator } from "@/components/Blockly/generator/simulator";
import { SIMULATOR_BOARD } from "@/components/Simulator/constants";
import { storeTutorialXml } from "./tutorialActions";

export const workspaceChange = () => (dispatch) => {
  dispatch({
    type: CHANGE_WORKSPACE,
  });
};

export const onChangeCode = () => (dispatch, getState) => {
  const workspace = Blockly.getMainWorkspace();
  var code = getState().workspace.code;
  code.arduino = Blockly.Generator.Arduino.workspaceToCode(workspace);

  // Basic-Code-Generierung mit try-catch, da nicht alle Blöcke unterstützt werden
  try {
    code.basic = basicGenerator.workspaceToCode(workspace);
  } catch (error) {
    code.basic = ""; // Leeren String setzen, wenn Generierung fehlschlägt
  }

  // Simulator-Code nur für das MCU-S2. Nicht unterstützte Blöcke überspringt
  // der Generator, das Simulator-Panel listet sie auf. Ein Fehler hier darf
  // die Arduino-Codeerzeugung nie beeinträchtigen.
  code.simulator = "";
  code.simulatorUnsupported = [];
  code.simulatorError = null;
  if (getState().board.board === SIMULATOR_BOARD) {
    try {
      code.simulator = simulatorGenerator.workspaceToCode(workspace);
      code.simulatorUnsupported = simulatorGenerator.getUnsupportedBlockLabels();
    } catch (error) {
      code.simulatorError = error.message;
    }
  }

  var xmlDom = Blockly.Xml.workspaceToDom(workspace);
  var board = getState().board.board;
  xmlDom.setAttribute("board", board);
  code.xml = Blockly.Xml.domToPrettyText(xmlDom);
  var selectedBlock = Blockly.getSelected();
  if (selectedBlock) {
    code.helpurl = selectedBlock.helpUrl ?? null;
    if (typeof selectedBlock.tooltip === "function") {
      try {
        code.tooltip = selectedBlock.tooltip.call(selectedBlock) ?? null;
      } catch (e) {
        code.tooltip = null;
      }
    } else {
      code.tooltip = selectedBlock.tooltip ?? null;
    }
    code.data = selectedBlock.data ?? null;
  } else {
  }

  dispatch({
    type: NEW_CODE,
    payload: code,
  });
  return code;
};

export const onChangeWorkspace = (event) => (dispatch, getState) => {
  dispatch(workspaceChange());
  var code = dispatch(onChangeCode());

  dispatch(storeTutorialXml(code.xml));
  var stats = getState().workspace.stats;
  if (event.type === Blockly.Events.BLOCK_CREATE) {
    stats.create += event.ids.length;
    dispatch({
      type: CREATE_BLOCK,
      payload: stats,
    });
  } else if (event.type === Blockly.Events.BLOCK_MOVE) {
    stats.move += 1;
    dispatch({
      type: MOVE_BLOCK,
      payload: stats,
    });
  } else if (event.type === Blockly.Events.BLOCK_CHANGE) {
    stats.change += 1;
    dispatch({
      type: CHANGE_BLOCK,
      payload: stats,
    });
  } else if (event.type === Blockly.Events.BLOCK_DELETE) {
    if (stats.create > 0) {
      stats.delete += event.ids.length;
      dispatch({
        type: DELETE_BLOCK,
        payload: stats,
      });
    }
  }
};

export const clearStats = () => (dispatch) => {
  var stats = {
    create: -1, // initialXML is created automatically, Block is not part of the statistics
    change: 0,
    delete: 0,
    move: -1, // initialXML is moved automatically, Block is not part of the statistics
  };
  dispatch({
    type: CLEAR_STATS,
    payload: stats,
  });
};

export const workspaceName = (name) => (dispatch) => {
  dispatch({
    type: NAME,
    payload: name,
  });
};
