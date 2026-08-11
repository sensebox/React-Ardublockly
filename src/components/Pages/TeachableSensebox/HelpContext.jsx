import React, { createContext, useContext } from "react";

const HelpContext = createContext(false);

export function HelpProvider({ children, hideHelp = false }) {
  return (
    <HelpContext.Provider value={hideHelp}>{children}</HelpContext.Provider>
  );
}

export function useHideHelp() {
  return useContext(HelpContext);
}
