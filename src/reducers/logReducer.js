import { createSlice } from "@reduxjs/toolkit";

const logSlice = createSlice({
  name: "logs",
  initialState: [],
  reducers: {
    addLog: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare({ type, title, description }) {
        return {
          payload: {
            id: Date.now() + Math.random(),
            type, // 'blockly' | 'click' | 'simulator'
            title,
            description,
            timestamp: new Date().toISOString(),
          },
        };
      },
    },
    clearLogs() {
      return [];
    },
  },
});

export const { addLog, clearLogs } = logSlice.actions;
export const selectLogs = (state) => state.logs;
export default logSlice.reducer;
