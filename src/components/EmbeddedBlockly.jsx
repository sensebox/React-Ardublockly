import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as Blockly from "blockly/core";
import { De } from "./Blockly/msg/de";
import { En } from "./Blockly/msg/en";

import { setBoardHelper } from "./Blockly/helpers/board";
import { setEmbeddedMode } from "../actions/generalActions";
import BlocklyApp from "./Pages/BlocklyApp";


const EmbeddedBlockly = () => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.general.language);
  const board = useSelector((state) => state.board.board);
  const isEmbedded = useSelector((state) => state.general.embeddedMode);
  
  useEffect(() => {
    // Set embedded mode to true when component mounts
    dispatch(setEmbeddedMode(true));
    
    // Blockly-Locale setzen
    if (language === "de_DE") {
      Blockly.setLocale(De);
    } else if (language === "en_US") {
      Blockly.setLocale(En);
    }
    // Board initialisieren
    setBoardHelper(board);

    // Cleanup: Set embedded mode to false when component unmounts
    return () => {
      dispatch(setEmbeddedMode(false));
    };
  }, [dispatch, language, board]);

  return (
    <div className="wrapper" style={{ margin: 0, padding: 0 }}>
      <BlocklyApp />
    </div>
  );
};

export default EmbeddedBlockly;
