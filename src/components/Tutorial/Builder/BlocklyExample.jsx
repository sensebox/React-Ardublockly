import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "moment/locale/de";
import * as Blockly from "blockly/core";

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
  const xml = useSelector((state) => state.workspace.code.xml);
  const [xmlState, setXmlState] = useState(null);
  const [input, setInput] = useState(null);
  const [disabled, setDisabled] = useState(false);

  moment.updateLocale("de");

  // ✅ Check for XML errors when toggled or XML changes
  useEffect(() => {
    validateXML();
  }, [xml]);

  // 🔍 Validate XML content
  const validateXML = () => {
    let localXml = value;
    try {
      Blockly.utils.xml.textToDom(localXml);
      dispatch(deleteError(index, "xml"));
    } catch (err) {
      localXml = initialXml;
      dispatch(setError(index, "xml"));
    }

    // Make initial block deletable for instructions
    if (!task) {
      localXml = localXml.replace('deletable="false"', 'deletable="true"');
    }

    setXmlState(localXml);
  };

  // 🔁 Toggle example on/off
  const handleToggle = (newValue) => {
    if (!newValue) {
      dispatch(deleteError(index, "xml"));
      dispatch(deleteProperty(index, "xml"));
    }
  };

  const handleSubmit = () => {
    dispatch(changeContent(xml, index, "xml"));
    setInput(moment().format("LTS"));

    // 🔥 Hier wird das XML an den Parent (z. B. Builder) zurückgegeben
    if (onXmlChange) onXmlChange(xml);
  };

  // 🧱 Check if workspace has blocks to prevent empty submission
  useEffect(() => {
    const workspace = Blockly.getMainWorkspace();
    const hasBlocks = workspace?.getAllBlocks().length > 0;
    setDisabled(!hasBlocks);
  }, [xml]);

  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        borderRadius: "16px",
        border: "1px solid #ccc",
        width: "100%",
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        Blockly Beispiel
      </Typography>

      {/* Hinweise */}
      <>
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
      </>

      {/* Blockly Workspace */}
      {xmlState && (
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Grid
            container
            sx={{
              border: !value ? `1px solid ${theme.palette.error.main}` : "none",
              borderRadius: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 1,
            }}
          >
            <Grid item xs={12}>
              <BlocklyWindow
                blockDisabled={task}
                trashcan={false}
                initialXml={xmlState}
                blocklyCSS={{ height: "40vh", width: "100%" }}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color={!value ? "error" : "primary"}
            onClick={handleSubmit}
            disabled={disabled}
            sx={{ mt: 1, height: "40px" }}
          >
            {task
              ? Blockly.Msg.builder_solution_submit
              : Blockly.Msg.builder_example_submit}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BlocklyExample;
