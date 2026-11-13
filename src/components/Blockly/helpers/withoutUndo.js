import * as Blockly from "blockly/core";

/**
 * Runs a programmatic workspace change (e.g. loading XML on page load,
 * board or language change) without recording it on the undo stack and
 * clears the existing undo history afterwards.
 *
 * Without this, Undo (Ctrl+Z / toolbar button) right after a reload would
 * revert the load itself and remove all blocks, including setup/loop.
 *
 * @param {Blockly.Workspace} workspace - The workspace being changed
 * @param {Function} fn - Function performing the change
 */
export function withoutUndo(workspace, fn) {
  const previous = Blockly.Events.getRecordUndo();
  Blockly.Events.setRecordUndo(false);
  try {
    fn();
  } finally {
    Blockly.Events.setRecordUndo(previous);
    workspace?.clearUndo();
  }
}
