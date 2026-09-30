import { ADD_LOG, CLEAR_LOGS } from "../actions/types";

// Keep the debug log from growing without limit.
export const MAX_LOG_ENTRIES = 500;

/**
 * Debug log of block and simulator events.
 * Entries: { id, type: "blockly" | "simulator", title, description, timestamp }
 */
export default function logReducer(state = [], action) {
  switch (action.type) {
    case ADD_LOG: {
      const logs = [...state, action.payload];
      return logs.length > MAX_LOG_ENTRIES
        ? logs.slice(logs.length - MAX_LOG_ENTRIES)
        : logs;
    }
    case CLEAR_LOGS:
      return [];
    default:
      return state;
  }
}

export const selectLogs = (state) => state.logs;
