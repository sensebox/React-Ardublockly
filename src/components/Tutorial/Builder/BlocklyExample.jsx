import React, { useEffect, useState } from "react";
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
import { FileUpload, CheckCircle } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

import BlocklyWindow from "../../Blockly/BlocklyWindow";
import { initialXml } from "../../Blockly/initialXml.js";
import {
  changeContent,
  deleteProperty,
  setError,
  deleteError,
} from "../../../actions/tutorialBuilderActions";

const BlocklyExample = ({ index, task = false, value, onXmlChange }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  // ❌ NICHT MEHR BENÖTIGT: const xml = useSelector((state) => state.workspace.code.xml);
  const [xmlState, setXmlState] = useState(null);
  const [input, setInput] = useState(null);
  // Zustand für disabled basierend auf dem aktuellen Workspace-Inhalt
  const [disabled, setDisabled] = useState(true); // Standardmäßig deaktiviert
  const [submitted, setSubmitted] = useState(false);
  moment.updateLocale("de");

  // Effekt zum Setzen von xmlState und Validierung
  useEffect(() => {
    validateXML();
  }, [value]); // Nur 'value' als Abhängigkeit, nicht 'xml' aus dem Store

  const validateXML = () => {
    let localXml = value;
    if (!localXml) {
      localXml = initialXml; // Falls value leer ist, nutze initialXml
    }
    try {
      Blockly.utils.xml.textToDom(localXml);
      dispatch(deleteError(index, "xml"));
    } catch (err) {
      console.error("Invalid XML:", err);
      // Optional: Setze auf initialXml oder zeige Fehler
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

      if (onXmlChange) onXmlChange(currentXmlString); // Gebe aktuellen Zustand weiter

      // Checkmark nach 3 Sekunden wieder ausblenden
      setTimeout(() => setSubmitted(false), 3000);
    } catch (e) {
      console.error("Failed to serialize current workspace XML:", e);
    }
  };

  // Funktion zum Prüfen, ob Workspace Blöcke hat
  const checkWorkspaceForBlocks = () => {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) {
      console.warn("Blockly workspace not found for block count check.");
      // Gehe davon aus, dass es keine Blöcke gibt, wenn Workspace nicht da ist
      setDisabled(true);
      return;
    }
    const hasBlocks = workspace.getAllBlocks().length > 0;
    setDisabled(!hasBlocks);
  };

  // Effekt zum Setzen von 'disabled', wenn sich xmlState ändert (z.B. initial)
  useEffect(() => {
    if (xmlState) {
      try {
        const tempWorkspace = new Blockly.Workspace(); // Temporärer Headless-Workspace
        const xmlDom = Blockly.utils.xml.textToDom(xmlState);
        Blockly.Xml.domToWorkspace(xmlDom, tempWorkspace);
        const hasBlocks = tempWorkspace.getAllBlocks().length > 0;
        setDisabled(!hasBlocks);
        tempWorkspace.dispose(); // Wichtig: Aufräumen
      } catch (e) {
        console.error("Could not validate initial XML for block count:", e);
        setDisabled(true);
      }
    } else {
      setDisabled(true); // Kein XML = Button deaktiviert
    }
  }, [xmlState]); // Wird ausgelöst, wenn xmlState sich ändert (also nach validateXML)

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
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={saveCurrentXml} // 🔥 Verwende die neue Funktion
              disabled={disabled}
              sx={{ mt: 1, height: "40px" }}
              startIcon={<FileUpload />}
            >
              {task
                ? Blockly.Msg.builder_solution_submit
                : Blockly.Msg.builder_example_submit}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BlocklyExample;
