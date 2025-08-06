import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { tutorialCheck, tutorialStep } from "../../actions/tutorialActions";

import Compile from "@/components/Workspace/ToolbarItems/Compile";
import Dialog from "@/components/ui/Dialog";

import { checkXml } from "../../helpers/compareXml";

import { makeStyles } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as Blockly from "blockly";

const useStyles = makeStyles((theme) => ({
  compile: {
    backgroundColor: theme.palette.button.compile,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.button.compile,
      color: theme.palette.primary.contrastText,
    },
  },
}));

export default function SolutionCheck() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const activeStep = useSelector((s) => s.tutorial.activeStep);
  const xml = useSelector((s) => s.workspace.code.xml);
  const tutorial = useSelector((s) => s.tutorial.tutorials[0]);

  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState({});

  const toggleDialog = () => {
    if (open) {
      setOpen(false);
      setMsg("");
    } else {
      setOpen(true);
    }
  };

  const check = () => {
    const step = tutorial.steps[activeStep];
    const result = checkXml(step.xml, xml);
    dispatch(tutorialCheck(result.type, step));
    setMsg(result);
    setOpen(true);
  };

  const isLastStep = tutorial.steps.length - 1 === activeStep;

  return (
    <div>
      <Tooltip title={Blockly.Msg.tooltip_check_solution} arrow>
        <IconButton
          className={`solutionCheck ${classes.compile}`}
          style={{
            width: "40px",
            height: "40px",
            marginRight: "5px",
          }}
          onClick={check}
          size="large"
        >
          <FontAwesomeIcon icon={faClipboardCheck} size="xs" />
        </IconButton>
      </Tooltip>

      <Dialog
        style={{ zIndex: 9999999 }}
        fullWidth
        maxWidth={"sm"}
        open={open}
        title={msg.type === "error" ? "Fehler" : "Erfolg"}
        content={msg.text}
        onClose={toggleDialog}
        onClick={toggleDialog}
        button={Blockly.Msg.button_close}
      >
        {msg.type === "success" && (
          <div style={{ marginTop: "20px", display: "flex" }}>
            <Compile />
            {isLastStep ? (
              <Button
                style={{ marginLeft: "10px" }}
                variant="contained"
                color="primary"
                onClick={() => {
                  toggleDialog();
                  history.push(`/tutorial/`);
                }}
              >
                {Blockly.Msg.button_tutorial_overview}
              </Button>
            ) : (
              <Button
                style={{ marginLeft: "10px" }}
                variant="contained"
                color="primary"
                onClick={() => {
                  toggleDialog();
                  dispatch(tutorialStep(activeStep + 1));
                }}
              >
                {Blockly.Msg.button_next}
              </Button>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
