import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import BlocklyCard from "./BlocklyCard";
import "@/components/Blockly/blocks/basic/index"; // registriert Block
import senseboxlogo from "@/data/senseBox_Icon_bunt.png";
import { useSelector } from "react-redux";
import * as Blockly from "blockly/core";

const BasicPage = ({ initialXml }) => {
  const basicCode = useSelector((s) => s.workspace.code.basic);
  // DONT DELETE THIS !!
  useEffect(() => {
    console.log("Basic Code Updated:", basicCode);
  }, [basicCode]);

  useEffect(() => {
    const head = document.head;
    const link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = new URL("./toolbox_style.css", import.meta.url).href;
    head.appendChild(link);

    // 🎨 Hintergrund setzen (freundlich, senseBox Basic)
    const root = document.querySelector(":root");

    root.style.setProperty("--url", `url(${senseboxlogo})`);

    // 🧹 Cleanup: CSS entfernen und Hintergrund zurücksetzen
    return () => {
      if (head.contains(link)) {
        head.removeChild(link);
      }
      root.style.removeProperty("--url");
    };
  }, []);

  // Toolbox toggle state (logic remains, UI removed)
  const isEmbeddedBasic =
    window.location.pathname.startsWith("/embeddedbasic");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: isEmbeddedBasic ? "100vh" : "85vh",
      }}
    >
      <BlocklyCard initialXml={initialXml} />
    </Box>
  );
};

export default BasicPage;
