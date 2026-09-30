import { ADD_LOG, CLEAR_LOGS } from "./types";

let nextLogId = 0;

/**
 * Add an entry to the debug log.
 * @param {{type: string, title: string, description?: string}} entry
 */
export const addLog = ({ type, title, description = "" }) => ({
  type: ADD_LOG,
  payload: {
    id: `${Date.now()}-${nextLogId++}`,
    type,
    title,
    description,
    timestamp: new Date().toISOString(),
  },
});

export const clearLogs = () => ({
  type: CLEAR_LOGS,
});
