import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import * as Blockly from "blockly/core";
import { De } from "./Blockly/msg/de";
import { En } from "./Blockly/msg/en";

import Navbar from "./Navbar";
import Routes from "./Route/Routes";
import Cookies from "./Cookies";
import Footer from "./Footer";
import { setBoardHelper } from "./Blockly/helpers/board";
import { FlashProvider } from "./Workspace/ToolbarItems/CompileAndUploadDialog/useFlash";

const Content = () => {
  const language = useSelector((state) => state.general.language);
  const board = useSelector((state) => state.board.board);

  // Blockly-Locale setzen, bevor die Kinder rendern. In einem Effekt käme sie
  // zu spät: Komponenten, die danach nicht neu rendern, zeigen sonst Texte in
  // der vorherigen Sprache.
  useMemo(() => {
    if (language === "de_DE") {
      Blockly.setLocale(De);
    } else if (language === "en_US") {
      Blockly.setLocale(En);
    }
  }, [language]);

  useEffect(() => {
    // Board initialisieren
    setBoardHelper(board);
  }, [board]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <FlashProvider>
        <Navbar />
        <div
          style={{
            flex: 1,
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Routes />
        </div>
      </FlashProvider>
      <Cookies />
      <Footer />
    </div>
  );
};

export default Content;
