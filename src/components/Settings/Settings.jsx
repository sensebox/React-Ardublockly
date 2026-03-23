import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import * as Blockly from "blockly/core";

import Breadcrumbs from "../ui/Breadcrumbs";
import LanguageSelector from "./LanguageSelector";
import RenderSelector from "./RenderSelector";
import StatsSelector from "./StatsSelector";
import TabletMode from "./TabletMode";
import SoundsSelector from "./SoundsSelector";
import DeviceSelector from "./DeviceSelector";
import CompilerSelector from "./CompilerSelector";

import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();

  const language = useSelector((state) => state.general.language);
  const pageVisits = useSelector((state) => state.general.pageVisits);

  // Blockly locale refresh (ersetzt forceUpdate)
  useEffect(() => {
    // bewusst leer – Render reicht aus, damit Blockly.Msg greift
  }, [language]);

  return (
    <div>
      <Breadcrumbs
        content={[
          {
            link: location.pathname,
            title: Blockly.Msg.settings_head,
          },
        ]}
      />

      <h1>{Blockly.Msg.settings_head}</h1>

      <Paper sx={{ my: 1, p: 1 }}>
        <LanguageSelector />
      </Paper>
      <Paper sx={{ my: 1, p: 1 }}>
        <RenderSelector />
      </Paper>
      <Paper sx={{ my: 1, p: 1 }}>
        <StatsSelector />
      </Paper>
      <Paper sx={{ my: 1, p: 1 }}>
        <TabletMode />
      </Paper>
      <Paper sx={{ my: 1, p: 1 }}>
        <SoundsSelector />
      </Paper>
      <Paper sx={{ my: 1, p: 1 }}>
        <DeviceSelector />
      </Paper>
      <Paper sx={{ my: 1, p: 1 }}>
        <CompilerSelector />
      </Paper>

      <Button
        sx={{ mt: 2 }}
        variant="contained"
        color="primary"
        onClick={() => (pageVisits > 0 ? navigate(-1) : navigate("/"))}
      >
        {Blockly.Msg.button_back}
      </Button>
    </div>
  );
}
