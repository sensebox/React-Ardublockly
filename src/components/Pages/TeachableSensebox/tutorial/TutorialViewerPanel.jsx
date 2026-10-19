import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTutorialViewer } from "../../../Tutorial/Viewer/hooks/useTutorialViewer";
import Instruction from "../../../Tutorial/Viewer/Instruction";
import TaskCard from "../../../Tutorial/Viewer/Cards/TaskCard";
import FinishedCard from "../../../Tutorial/Viewer/Cards/FinishedCard";
import ImageClassificationTool from "../image/ImageClassificationTool";
import OrientationClassificationTool from "../orientation/OrientationClassificationTool";
import SpellClassificationTool from "../spell/SpellClassificationTool";

function ClassificationPanel({ type }) {
  if (type === "image") return <ImageClassificationTool hideHeader />;
  if (type === "orientation") return <OrientationClassificationTool hideHeader />;
  if (type === "spell") return <SpellClassificationTool hideHeader />;
  return null;
}

export default function TutorialViewerPanel({
  tutorialId,
  classificationType,
  groupName,
  classificationSteps = null,
  onBack,
  mediaBasePath = "/media/tutorial",
}) {
  const [nextStepDisabled, setNextStepDisabled] = useState(false);
  const rootRef = useRef(null);
  const leftPanelRef = useRef(null);

  const { tutorial, currentStep, activeStep, nextStep, previousStep, message } =
    useTutorialViewer(tutorialId);

  // Scroll back to the top of the tutorial when the step changes
  useEffect(() => {
    const top = rootRef.current?.getBoundingClientRect().top;
    if (top !== undefined && top < 0) {
      window.scrollBy({ top });
    }
  }, [activeStep]);

  // Drag handle to resize the tutorial panel next to the classification widget
  const startResize = (e) => {
    const panel = leftPanelRef.current;
    if (!panel) return;
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = panel.getBoundingClientRect().width;
    const prevTransition = panel.style.transition;
    panel.style.transition = "none";
    document.body.style.userSelect = "none";

    const onMove = (ev) => {
      panel.style.width = `${startWidth + ev.clientX - startX}px`;
    };
    const onUp = () => {
      panel.style.transition = prevTransition;
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.dispatchEvent(new Event("resize"));
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const showClassification =
    !!classificationType &&
    (!classificationSteps || classificationSteps(activeStep));

  useEffect(() => {
    if (!showClassification) {
      // Drop any width set via the resize handle so the tutorial can widen.
      if (leftPanelRef.current) leftPanelRef.current.style.width = "";
    } else {
      // Let charts etc. re-measure after the panel was hidden.
      window.dispatchEvent(new Event("resize"));
    }
  }, [showClassification]);

  useEffect(() => {
    const stepType = currentStep?.type;
    if (stepType === "instruction" || stepType === "finish") {
      setNextStepDisabled(false);
    }
  }, [currentStep]);

  if (!tutorial) {
    if (message?.id === "GET_TUTORIAL_FAIL") {
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography color="error">
            Tutorial konnte nicht geladen werden.
          </Typography>
          <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mt: 2 }}>
            Zurück zur Übersicht
          </Button>
        </Box>
      );
    }
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const type = currentStep?.type;
  const isFirst = activeStep === 0;
  const isLast = activeStep === tutorial.steps.length - 1;

  return (
    <Box ref={rootRef} sx={{ display: "flex", flexDirection: "column" }}>
      {/* Main content */}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {/* Left: tutorial step card + nav */}
        <Box
          ref={leftPanelRef}
          sx={{
            width: showClassification
              ? type === "blockly"
                ? "70vw"
                : "30vw"
              : "100%",
            minWidth: "350px",
            maxWidth: showClassification
              ? type === "blockly"
                ? "80vw"
                : "50vw"
              : "1344px",
            marginLeft: showClassification ? 0 : "auto",
            marginRight: showClassification ? 0 : "auto",
            transition: "width 1.0s ease, max-width 1.0s ease",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
              flexShrink: 0,
              gap: 2,
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
              size="small"
              variant="outlined"
              sx={{ minWidth: "auto" }}
            >
              Übersicht
            </Button>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ flexGrow: 1, textAlign: "right" }}
            >
              {groupName ? `${groupName} - ${tutorial.title}` : tutorial.title}
            </Typography>
          </Box>
          {/* Step card */}
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <AnimatePresence mode="wait">
              {type === "finish" && (
                <FinishedCard key="finished" tutorial={tutorial} />
              )}
              {type === "instruction" && (
                <Instruction
                  key={activeStep}
                  tutorial={tutorial}
                  mediaBasePath={mediaBasePath}
                />
              )}
              {type !== "instruction" && type !== "finish" && (
                <TaskCard
                  key={activeStep}
                  step={currentStep}
                  setNextStepDisabled={setNextStepDisabled}
                />
              )}
            </AnimatePresence>
          </Box>

          {/* Navigation buttons - stick to the viewport bottom while scrolling */}
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              zIndex: 2,
              flexShrink: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 1.5,
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              gap: 2,
            }}
          >
            <Button
              startIcon={<ChevronLeftIcon />}
              onClick={previousStep}
              disabled={isFirst}
              variant="outlined"
            >
              Zurück
            </Button>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "nowrap" }}
            >
              Schritt {activeStep + 1} / {tutorial.steps.length}
            </Typography>
            <Tooltip
              title={
                !isLast && nextStepDisabled
                  ? "Bitte beantworte alle Fragen, bevor du fortfährst."
                  : ""
              }
            >
              <span>
                <Button
                  endIcon={<ChevronRightIcon />}
                  onClick={nextStep}
                  disabled={isLast || nextStepDisabled}
                  variant="contained"
                >
                  Weiter
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Box>

        {/* Resize handle */}
        {showClassification && (
          <Box
            onPointerDown={startResize}
            sx={{
              flexShrink: 0,
              width: "6px",
              cursor: "col-resize",
              borderLeft: "1px solid",
              borderColor: "divider",
              touchAction: "none",
              "&:hover": { bgcolor: "action.hover" },
            }}
          />
        )}

        {/* Right: classification widget - stays in view while scrolling */}
        {classificationType && (
          <Box
            sx={{
              display: showClassification ? "block" : "none",
              flex: 1,
              minWidth: 0,
              position: "sticky",
              top: 0,
              alignSelf: "flex-start",
              height: "100vh",
              overflow: "hidden",
              "& .MuiDrawer-docked .MuiDrawer-paper": {
                position: "absolute",
                top: 0,
                height: "100%",
              },
            }}
          >
            <Box sx={{ height: "100%", overflow: "auto", padding: "32px" }}>
              <ClassificationPanel type={classificationType} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

TutorialViewerPanel.propTypes = {
  tutorialId: PropTypes.string.isRequired,
  classificationType: PropTypes.oneOf(["image", "spell", "orientation", ""])
    .isRequired,
  groupName: PropTypes.string,
  classificationSteps: PropTypes.func,
  onBack: PropTypes.func.isRequired,
};
