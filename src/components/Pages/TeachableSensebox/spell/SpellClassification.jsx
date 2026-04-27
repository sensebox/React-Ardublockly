import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getSpellTranslations } from "./translations";
import SpellModelTrainer from "./SpellModelTrainer";
import HelpSidebar, { SIDEBAR_WIDTH } from "../HelpSidebar";
import HelpButton, { useHelpBlink } from "../HelpButton";

const SpellClassification = () => {
  const navigate = useNavigate();
  const [trainedModel, setTrainedModel] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingError, setTrainingError] = useState(null);
  const [classes, setClasses] = useState([]);
  const isMountedRef = useRef(true);
  const language = useSelector((s) => s.general.language);
  const t = getSpellTranslations();

  // Help sidebar state
  const [helpSidebarOpen, setHelpSidebarOpen] = useState(false);
  const [currentHelpTopic, setCurrentHelpTopic] = useState(null);
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const handleOpenHelp = useCallback((topic) => {
    setCurrentHelpTopic("spells/" + topic);
    setHelpSidebarOpen(true);
  }, []);

  // ── Help blink hooks ──────────────────────────────────────────────────────
  const {
    isBlinking: spellClassBlinking,
    trigger: triggerSpellClass,
    markSeen: markSpellClassSeen,
  } = useHelpBlink("spell/spellClassification");

  useEffect(() => {
    triggerSpellClass();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseHelp = useCallback(() => {
    setHelpSidebarOpen(false);
  }, []);

  const handleModelTrained = useCallback((model) => {
    if (isMountedRef.current) {
      setTrainedModel(model);
      setIsTraining(false);
      setTrainingError(null);
    }
  }, []);

  const handleTrainingStart = useCallback(() => {
    if (isMountedRef.current) {
      setIsTraining(true);
      setTrainingError(null);
    }
  }, []);

  const handleTrainingError = useCallback((error) => {
    if (isMountedRef.current) {
      setTrainingError(error);
      setIsTraining(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <>
      {/* Help Sidebar */}
      <HelpSidebar
        open={helpSidebarOpen}
        onClose={handleCloseHelp}
        helpTopic={currentHelpTopic}
      />

      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          pb: 10,
          mr: isWideScreen && helpSidebarOpen ? `${SIDEBAR_WIDTH}px` : "auto",
          transition: "margin-right 0.3s ease",
        }}
        key={language}
      >
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/teachable")}
            sx={{ mb: 2 }}
          >
            Teachable senseBox
          </Button>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="h3" component="h1">
              {t.title}
            </Typography>
            <HelpButton
              onClick={() => {
                markSpellClassSeen();
                handleOpenHelp("spellClassification");
              }}
              isBlinking={spellClassBlinking}
              tooltip={
                t.training?.tooltip?.helpMain || "What is spell classification?"
              }
            />
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t.description}
          </Typography>
        </Box>

        {/* Error display */}
        {trainingError && (
          <Paper
            sx={{
              p: 2,
              mb: 3,
              bgcolor: "error.light",
              color: "error.contrastText",
            }}
          >
            <Typography>{trainingError}</Typography>
          </Paper>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Model Training Section */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <SpellModelTrainer
              classes={classes}
              onClassesChange={setClasses}
              onModelTrained={handleModelTrained}
              onTrainingStart={handleTrainingStart}
              onTrainingError={handleTrainingError}
              isTraining={isTraining}
              disabled={isTraining}
              onOpenHelp={handleOpenHelp}
              trainedModel={trainedModel}
            />
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default SpellClassification;
