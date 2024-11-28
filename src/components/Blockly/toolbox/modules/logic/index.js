export const controlsIf = { kind: "block", type: "controls_if" };
export const controlsIfelse = { kind: "block", type: "controls_ifelse" };
export const logicCompare = { kind: "block", type: "logic_compare" };
export const logicOperation = { kind: "block", type: "logic_operation" };
export const logicNegate = { kind: "block", type: "logic_negate" };
export const logicBoolean = { kind: "block", type: "logic_boolean" };
export const switchCase = { kind: "block", type: "switch_case" };

export default {
  mcu: [
    controlsIf,
    controlsIfelse,
    logicCompare,
    logicOperation,
    logicNegate,
    logicBoolean,
    switchCase,
  ],
  mini: [
    controlsIf,
    controlsIfelse,
    logicCompare,
    logicOperation,
    logicNegate,
    logicBoolean,
    switchCase,
  ],
  esp32: [
    controlsIf,
    controlsIfelse,
    logicCompare,
    logicOperation,
    logicNegate,
    logicBoolean,
    switchCase,
  ],
};
