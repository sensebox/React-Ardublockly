import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import * as Blockly from "blockly/core";
import { De } from "./Blockly/msg/de";
import { En } from "./Blockly/msg/en";

import Navbar from "./Navbar";
import Routes from "./Route/Routes";
import Cookies from "./Cookies";
import Footer from "./Footer";
import { setBoardHelper } from "./Blockly/helpers/board";

const Content = () => {
  const language = useSelector((state) => state.general.language);
  const board = useSelector((state) => state.board.board);

  useEffect(() => {
    // Blockly-Locale setzen
    if (language === "de_DE") {
      Blockly.setLocale(De);
    } else if (language === "en_US") {
      Blockly.setLocale(En);
    }
    // Board initialisieren
    setBoardHelper(board);
  }, [language, board]);

  return (
    <div className="wrapper">
      <Navbar />
      <Routes />
      <Cookies />
      <Footer />
    </div>
  );
};

export default Content;
