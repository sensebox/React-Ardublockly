import React, { useState } from "react";
import PropTypes from "prop-types";
import { AnimatePresence } from "framer-motion";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
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
  if (type === "image") return <ImageClassificationTool />;
  if (type === "orientation") return <OrientationClassificationTool />;
  if (type === "spell") return <SpellClassificationTool />;
  return null;
}

export default function TutorialViewerPanel({
  tutorialId,
  classificationType,
  onBack,
}) {
  const [nextStepDisabled, setNextStepDisabled] = useState(false);

  const { tutorial, currentStep, activeStep, nextStep, previousStep, message } =
    useTutorialViewer(tutorialId);

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Main content */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          minHeight: 0,
          alignItems: "flex-start",
        }}
      >
        {/* Left: tutorial step card + nav */}
        <Box
          sx={{
            flex: "0 0 auto",
            minWidth: "500px",
            maxWidth: "20vw",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid",
            borderColor: "divider",
            maxHeight: "87vh",
            overflow: "hidden",
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
            >
              Übersicht
            </Button>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ flexGrow: 1, textAlign: "right" }}
            >
              {tutorial.title}
            </Typography>
          </Box>
          {/* Step card - scrollable */}
          <Box sx={{ flexGrow: 1, overflow: "auto", minHeight: 0, p: 2 }}>
            <AnimatePresence mode="wait">
              {type === "finish" && (
                <FinishedCard key="finished" tutorial={tutorial} />
              )}
              {type === "instruction" && (
                <Instruction key={activeStep} tutorial={tutorial} />
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

          {/* Navigation buttons */}
          <Box
            sx={{
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
            <Button
              endIcon={<ChevronRightIcon />}
              onClick={nextStep}
              disabled={isLast || nextStepDisabled}
              variant="contained"
            >
              Weiter
            </Button>
          </Box>
        </Box>

        {/* Right: classification widget */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            minHeight: 0,
            height: "87vh",
            padding: "32px",
          }}
        >
          <ClassificationPanel type={classificationType} />
        </Box>
      </Box>
    </Box>
  );
}

TutorialViewerPanel.propTypes = {
  tutorialId: PropTypes.string.isRequired,
  classificationType: PropTypes.oneOf(["image", "orientation"]).isRequired,
  onBack: PropTypes.func.isRequired,
};
