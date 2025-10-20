import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Dialog from "@/components/ui/Dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardCheck,
  faCheckCircle,
  faTimesCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import * as Blockly from "blockly";
import { useDispatch, useSelector } from "react-redux";
import { checkXml } from "@/helpers/compareXml";

export default function SolutionCheck({
  solutionXml,
  isLastStep = false,

  onNextStep,
  onFinish,
}) {
  const xml = useSelector((s) => s.workspace.code.xml);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const activeStep = useSelector((state) => state.tutorial.activeStep);
  const tutorial = useSelector((state) => state.tutorial.tutorials[0]);

  const handleClose = () => {
    setOpen(false);
    setMsg(null);
  };

  const check = () => {
    if (!xml || !solutionXml) {
      setMsg({
        type: "error",
        text: "Es konnte kein Blockly-Code geladen werden.",
      });
      setOpen(true);
      return;
    }

    const result = checkXml(solutionXml, xml);
    setMsg(result);
    setOpen(true);
  };

  const changeStep = (step) => {
    dispatch({
      type: "TUTORIAL_STEP",
      payload: step,
    });
  };

  const nextStep = () => {
    const allSteps = tutorial.steps;
    if (activeStep < allSteps.length - 1) {
      changeStep(activeStep + 1);
    }
    handleClose();
  };

  const isSuccess = msg?.type === "success";

  return (
    <>
      <Tooltip
        title={Blockly.Msg.tooltip_check_solution || "Lösung prüfen"}
        arrow
      >
        <IconButton
          sx={{
            width: 40,
            height: 40,
            marginRight: 1,
            backgroundColor: "#4CAF50",
            color: "#fff",
            "&:hover": { backgroundColor: "#43A047" },
          }}
          onClick={check}
          size="large"
        >
          <FontAwesomeIcon icon={faClipboardCheck} size="xs" />
        </IconButton>
      </Tooltip>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FontAwesomeIcon
              icon={isSuccess ? faCheckCircle : faTimesCircle}
              style={{
                color: isSuccess ? "#4CAF50" : "#E53935",
                fontSize: "1.5rem",
              }}
            />
            <Typography variant="h6">
              {isSuccess ? "Sehr gut!" : "Da fehlt noch was…"}
            </Typography>
          </Box>
        }
        content={
          <Box>
            <Typography
              variant="body1"
              sx={{
                mt: 1,
                mb: 2,
                color: isSuccess ? "success.main" : "error.main",
                fontWeight: 500,
              }}
            >
              {msg?.text}
            </Typography>

            {msg?.details && (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Analyse:
                </Typography>
                <List dense>
                  {msg.details.map((detail, i) => (
                    <ListItem key={i}>
                      <ListItemIcon>
                        <FontAwesomeIcon
                          icon={
                            detail.type === "error"
                              ? faTimesCircle
                              : detail.type === "success"
                                ? faCheckCircle
                                : faInfoCircle
                          }
                          color={
                            detail.type === "error"
                              ? "#E53935"
                              : detail.type === "success"
                                ? "#43A047"
                                : "#FFA000"
                          }
                        />
                      </ListItemIcon>
                      <ListItemText primary={detail.text} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Box>
        }
        button={Blockly.Msg.button_close || "Schließen"}
        onClick={handleClose}
      >
        {isSuccess && (
          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            {isLastStep ? (
              <Button variant="contained" color="primary" onClick={onFinish}>
                {Blockly.Msg.button_tutorial_overview || "Zur Übersicht"}
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={nextStep}>
                {Blockly.Msg.button_next || "Nächster Schritt"}
              </Button>
            )}
          </Box>
        )}
      </Dialog>
    </>
  );
}
