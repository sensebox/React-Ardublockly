import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "moment/locale/de";
import * as Blockly from "blockly/core";
import { FileUpload, CheckCircle, RotateLeft } from "@mui/icons-material"; // 🔥 Icon für Reset
import { motion, AnimatePresence } from "framer-motion";

import BlocklyWindow from "../../Blockly/BlocklyWindow";
import { initialXml } from "../../Blockly/initialXml.js";
import {
  changeContent,
  setError,
  deleteError,
} from "../../../actions/tutorialBuilderActions";

// 🔥 Importiere Dialog und Snackbar, falls nicht bereits in BlocklyExample vorhanden
import Dialog from "@/components/ui/Dialog";
import Snackbar from "@/components/Snackbar";

const BlocklyExample = ({ index, task = false, value, onXmlChange }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [xmlState, setXmlState] = useState(null);
  const [input, setInput] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // 🔥 Zustand für den Reset-Dialog und die Snackbar
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "info",
    key: 0,
  });

  // Ref für den Debounce-Timer
  const debounceTimerRef = useRef(null);

  moment.updateLocale("de");

  useEffect(() => {
    validateXML();
  }, [value]);

  const validateXML = () => {
    let localXml = value;
    if (!localXml) {
      localXml = initialXml;
    }
    try {
      Blockly.utils.xml.textToDom(localXml);
      dispatch(deleteError(index, "xml"));
    } catch (err) {
      console.error("Invalid XML:", err);
      dispatch(setError(index, "xml"));
    }

    if (!task) {
      localXml = localXml.replace('deletable="false"', 'deletable="true"');
    }

    setXmlState(localXml);
  };

  // Funktion zum Speichern des aktuellen Workspace-XMLs
  const saveCurrentXml = () => {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) {
      console.warn("Blockly workspace not found for saving.");
      return;
    }
    try {
      const currentXmlString = Blockly.Xml.domToText(
        Blockly.Xml.workspaceToDom(workspace),
      );
      dispatch(changeContent(currentXmlString, index, "xml"));
      setInput(moment().format("LTS"));
      setSubmitted(true);

      if (onXmlChange) onXmlChange(currentXmlString);

      setTimeout(() => setSubmitted(false), 3000);
    } catch (e) {
      console.error("Failed to serialize current workspace XML:", e);
    }
  };

  // 🔥 Funktion zum Zurücksetzen des Workspaces
  const resetWorkspace = () => {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) {
      console.warn("Blockly workspace not found for reset.");
      return;
    }

    try {
      // 🔥 Verwende den initialXml-Wert (oder initialXml als Fallback)
      const resetXml = value || initialXml;
      const xmlDom = Blockly.utils.xml.textToDom(resetXml);

      // 🔥 Deaktiviere Events, um unnötige Callbacks zu vermeiden
      Blockly.Events.disable();
      // 🔥 Lösche den Workspace und lade das Reset-XML
      Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, workspace);
      // 🔥 Aktiviere Events wieder
      Blockly.Events.enable();

      // 🔥 Setze disabled Status basierend auf dem Reset-XML
      const tempWorkspace = new Blockly.Workspace();
      Blockly.Xml.domToWorkspace(xmlDom, tempWorkspace);
      const hasBlocks = tempWorkspace.getAllBlocks().length > 0;
      tempWorkspace.dispose();
      setDisabled(!hasBlocks);

      console.log("BlocklyExample: Workspace reset to initial state.");
    } catch (e) {
      console.error("Failed to reset workspace:", e);
      setSnackbar({
        open: true,
        type: "error",
        key: Date.now(),
        message: "Fehler beim Zurücksetzen des Workspace.",
      });
    }
  };

  // Funktion, die aufgerufen wird, wenn sich der Workspace ändert (mit Debouncing)
  const handleWorkspaceChanged = () => {
    // console.log("BlocklyExample: Workspace changed, scheduling save..."); // 🔧 Debug-Log
    // if (debounceTimerRef.current) {
    //   clearTimeout(debounceTimerRef.current);
    // }
    // debounceTimerRef.current = setTimeout(() => {
    //   console.log("BlocklyExample: Debounced save triggered."); // 🔧 Debug-Log
    //   saveCurrentXml();
    // }, 500); // 500ms Verzögerung
  };

  // Cleanup: Lösche den Timer beim Entfernen der Komponente
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Effekt zum Setzen von 'disabled', wenn sich xmlState ändert (z.B. initial)
  useEffect(() => {
    if (xmlState) {
      try {
        const tempWorkspace = new Blockly.Workspace();
        const xmlDom = Blockly.utils.xml.textToDom(xmlState);
        Blockly.Xml.domToWorkspace(xmlDom, tempWorkspace);
        const hasBlocks = tempWorkspace.getAllBlocks().length > 0;
        setDisabled(!hasBlocks);
        tempWorkspace.dispose();
      } catch (e) {
        console.error("Could not validate initial XML for block count:", e);
        setDisabled(true);
      }
    } else {
      setDisabled(true);
    }
  }, [xmlState]);

  // 🔥 Funktionen für Dialog-Öffnen/Schließen
  const openDialog = () => {
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        borderRadius: "16px",
        border: "1px solid #ccc",
        width: "100%",
        boxSizing: "border-box",
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        Blockly Beispiel
      </Typography>

      {/* Hinweise */}
      {!value ? (
        <FormHelperText sx={{ color: theme.palette.text.secondary }}>
          Reiche deine Blöcke ein, indem du auf den
          <strong>
            {" "}
            "
            {task
              ? Blockly.Msg.builder_solution_submit
              : Blockly.Msg.builder_example_submit}
            "
          </strong>{" "}
          Button klickst.
        </FormHelperText>
      ) : input ? (
        <FormHelperText>Letzte Einreichung um {input} Uhr.</FormHelperText>
      ) : null}

      {!task && (
        <FormHelperText sx={{ color: theme.palette.text.secondary }}>
          {Blockly.Msg.builder_comment}
        </FormHelperText>
      )}

      {/* Blockly Workspace */}
      {xmlState && (
        <Box sx={{ mt: 2, position: "relative" }}>
          {/* Animiertes Checkmark */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                key="checkmark"
                initial={{ opacity: 0, scale: 0.5, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -10 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 5,
                  color: theme.palette.success.main,
                }}
              >
                <CheckCircle fontSize="large" />
              </motion.div>
            )}
          </AnimatePresence>

          <Grid
            container
            sx={{
              borderRadius: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxSizing: "border-box",
              p: 1,
              border: submitted
                ? `2px solid ${theme.palette.success.main}`
                : "1px solid transparent",
              transition: "border 0.3s ease-in-out",
            }}
          >
            <Grid item xs={12}>
              <BlocklyWindow
                scroll
                blockDisabled={task}
                trashcan={false}
                initialXml={value}
                blocklyCSS={{ height: "40vh", width: "100%" }}
                onWorkspaceChanged={handleWorkspaceChanged}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
            {/* 🔥 Reset-Button links */}
            <Button
              variant="outlined"
              color="secondary"
              onClick={openDialog} // Öffnet den Bestätigungsdialog
              startIcon={<RotateLeft />}
            >
              Workspace zurücksetzen
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={saveCurrentXml} // Der Button ruft es auch manuell auf (ohne Debounce)
              disabled={disabled}
              sx={{ height: "40px" }}
              startIcon={<FileUpload />}
            >
              {task
                ? Blockly.Msg.builder_solution_submit
                : Blockly.Msg.builder_example_submit}
            </Button>
          </Box>
        </Box>
      )}

      {/* 🔥 Snackbar */}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        key={snackbar.key}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />

      {/* 🔥 Bestätigungsdialog */}
      <Dialog
        open={dialogOpen}
        title="Workspace zurücksetzen?"
        content="Möchtest du den Workspace wirklich auf den Anfangszustand zurücksetzen? Alle deine Änderungen gehen verloren."
        onClose={closeDialog}
        onClick={closeDialog} // Schließt bei Klick auf Overlay/Abbrechen
        button="Abbrechen"
      >
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          <Button variant="outlined" onClick={closeDialog}>
            Abbrechen
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              resetWorkspace(); // Führt das Zurücksetzen aus
              closeDialog(); // Schließt den Dialog
            }}
          >
            Zurücksetzen
          </Button>
        </div>
      </Dialog>
    </Box>
  );
};

export default BlocklyExample;
