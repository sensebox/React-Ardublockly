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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Dialog from "@/components/ui/Dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faInfoCircle,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";
import * as Blockly from "blockly";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { checkXml } from "@/helpers/compareXml";
import CompilationDialog from "@/components/Workspace/ToolbarItems/CompilationDialog/CompilationDialog";

export default function SolutionCheck({
  solutionXml,
  isLastStep = false,
  onFinish,
}) {
  const xml = useSelector((s) => s.workspace.code.xml);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const activeStep = useSelector((state) => state.tutorial.activeStep);
  const tutorial = useSelector((state) => state.tutorial.tutorials[0]);
  const arduino = useSelector((s) => s.workspace.code.arduino);
  const selectedBoard = useSelector((state) => state.board.board);
  const theme = useTheme();
  const location = useLocation();

  const groupState = location.state;
  const isFromGroupState = Boolean(groupState?.fromGroupTutorial);
  const localGroupId = localStorage.getItem("lastGroupId");
  const localMemberId = localStorage.getItem("lastMemberId");
  const localTutorialId = localStorage.getItem("lastTutorialId");
  const isFromGroupLocal =
    Boolean(localGroupId && localMemberId) &&
    Boolean(tutorial?._id) &&
    localTutorialId === tutorial._id;
  const isGroupContext = isFromGroupState || isFromGroupLocal;

  const handleClose = () => {
    setOpen(false);
    setMsg(null);
    setExpanded(false);
  };

  const postGroupSolution = async () => {
    const groupId = groupState?.groupId || localGroupId;
    const memberId = groupState?.memberId || localMemberId;
    const tutorialId = tutorial?._id || localTutorialId;

    if (!groupId || !memberId || !tutorialId || !xml) {
      console.warn("[SolutionCheck] Missing data for solution post", {
        groupId,
        memberId,
        tutorialId,
        hasXml: Boolean(xml),
      });
      return;
    }

    const payload = {
      userId: memberId,
      groupId,
      tutorialId,
      blocklyXml: xml,
    };

    const primaryUrl = `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/solutions/postSolution/${memberId}`;
    const fallbackUrl = `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/solutions/postSolution`;

    console.log("[SolutionCheck] Try POST solution (primary)", {
      url: primaryUrl,
      payloadPreview: {
        ...payload,
        blocklyXmlLength: payload.blocklyXml?.length,
      },
    });

    try {
      const response = await axios.post(primaryUrl, payload);
      console.log("[SolutionCheck] Solution saved (primary)", {
        status: response.status,
        data: response.data,
      });
    } catch (firstError) {
      console.error("[SolutionCheck] Primary POST failed", {
        message: firstError?.message,
        status: firstError?.response?.status,
        data: firstError?.response?.data,
        url: primaryUrl,
      });

      console.log("[SolutionCheck] Try POST solution (fallback)", {
        url: fallbackUrl,
      });

      try {
        const response = await axios.post(fallbackUrl, payload);
        console.log("[SolutionCheck] Solution saved (fallback)", {
          status: response.status,
          data: response.data,
        });
      } catch (secondError) {
        console.error("[SolutionCheck] Fallback POST failed", {
          message: secondError?.message,
          status: secondError?.response?.status,
          data: secondError?.response?.data,
          url: fallbackUrl,
          payload,
        });
      }
    }
  };

  const check = async () => {
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

    if (isGroupContext && result.type === "success") {
      await postGroupSolution();
    }
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
          {isGroupContext
            ? "In Lösungsgallerie einreichen"
            : "Lösung einreichen"}
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
                color: isSuccess
                  ? theme.palette.feedback.success
                  : theme.palette.feedback.error,
                fontSize: "1.5rem",
              }}
            />
            <Typography variant="h6">
              {isSuccess ? "Sehr gut!" : "Da fehlt noch was…"}
            </Typography>
          </Box>
        }
        button={!isSuccess ? Blockly.Msg.button_close || "Schließen" : null}
        onClick={!isSuccess ? handleClose : undefined}
        content={
          <Box>
            <Typography
              variant="body1"
              sx={{
                mt: 1,
                mb: 2,
                color: isSuccess
                  ? theme.palette.feedback.success
                  : theme.palette.feedback.error,
                fontWeight: 500,
              }}
            >
              {msg?.text}
            </Typography>

            {/* Accordion für Analyse */}
            {msg?.details && (
              <Accordion
                expanded={expanded}
                onChange={() => setExpanded(!expanded)}
                sx={{
                  borderRadius: 2,
                  boxShadow: "none",
                  border: `1px solid ${theme.palette.feedback.border}`,
                  mt: 1,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="analysis-content"
                  id="analysis-header"
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: "text.primary" }}
                  >
                    Hilfe anzeigen
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Divider sx={{ mb: 1 }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
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
                                ? theme.palette.feedback.error
                                : detail.type === "success"
                                  ? theme.palette.feedback.success
                                  : theme.palette.feedback.warning
                            }
                          />
                        </ListItemIcon>
                        <ListItemText primary={detail.text} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}

            <Box sx={{ mt: 1, color: "text.secondary" }}>
              Du kannst den Programmcode jetzt kompilieren und live auf deiner
              senseBox testen!
            </Box>
          </Box>
        }
      >
        {/* ✅ Nur bei erfolgreichem Ergebnis zeigen */}
        {isSuccess && (
          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: theme.palette.button.compile,
                "&:hover": {
                  backgroundColor: theme.palette.senseboxColors.blue,
                },
                color: theme.palette.primary.contrastText,
              }}
              onClick={() => setDialogOpen(true)}
              startIcon={<FontAwesomeIcon icon={faClipboardCheck} />}
            >
              Compile
            </Button>

            <CompilationDialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              selectedBoard={selectedBoard}
              code={arduino}
              filename={"sketch"}
            />

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
