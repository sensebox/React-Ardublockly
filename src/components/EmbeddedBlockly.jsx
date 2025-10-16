import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as Blockly from "blockly/core";
import { De } from "./Blockly/msg/de";
import { En } from "./Blockly/msg/en";

import { setBoardHelper } from "./Blockly/helpers/board";
import BlocklyApp from "./Pages/BlocklyApp";


const EmbeddedBlockly = () => {
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
    <div className="wrapper" style={{ margin: 0, padding: 0 }}>
      <BlocklyApp />
    </div>
  );
};

export default EmbeddedBlockly;
