import React, { useState } from "react";
import {
  Box,
  Typography,
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
      {/* ✅ Großer Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={check}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: "10px",
            fontWeight: 600,
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          Lösung einreichen
        </Button>
      </Box>

      {/* Dialog mit Analyse */}
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
        // 👇 Nur anzeigen, wenn Ergebnis falsch ist
        button={!isSuccess ? Blockly.Msg.button_close || "Schließen" : null}
        onClick={!isSuccess ? handleClose : undefined}
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
      >
        {/* ✅ Nur bei erfolgreichem Ergebnis zeigen */}
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
