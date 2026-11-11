import * as Blockly from "blockly/core";

/**
 * Debug log entry for a workspace event, or null if the event is not logged.
 * Only block changes are logged, no UI events (selection, drag, scroll, ...).
 * @param {!Blockly.Events.Abstract} event
 * @return {?{title: string, description: string}}
 */
export function describeBlockEvent(event) {
  if (event.isUiEvent) {
    return null;
  }
  switch (event.type) {
    case Blockly.Events.BLOCK_CREATE:
      // The setup/loop block is created with every workspace
      if (event.json?.type === "arduino_functions") {
        return null;
      }
      return {
        title: Blockly.Msg.simulator_log_block_created,
        description: event.json?.type ?? "",
      };
    case Blockly.Events.BLOCK_DELETE:
      // ... and deleted when a workspace is loaded
      if (event.oldJson?.type === "arduino_functions") {
        return null;
      }
      return {
        title: Blockly.Msg.simulator_log_block_deleted,
        description: event.oldJson?.type ?? "",
      };
    case Blockly.Events.BLOCK_CHANGE:
      return {
        title: Blockly.Msg.simulator_log_block_changed,
        description: event.name
          ? `${event.name}: ${event.oldValue} → ${event.newValue}`
          : "",
      };
    default:
      return null;
  }
}
