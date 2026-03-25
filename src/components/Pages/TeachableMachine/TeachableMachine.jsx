import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import { getTeachableMachineTranslations } from "./translations";
import ModelTrainer from "./ModelTrainer";
import ConvertDeploy from "./convertDeploy";
import HelpSidebar, { SIDEBAR_WIDTH } from "./HelpSidebar";
import HelpButton from "./HelpButton";

const TeachableMachine = () => {
  const [trainedModel, setTrainedModel] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingError, setTrainingError] = useState(null);
  const isMountedRef = useRef(true);
  const language = useSelector((s) => s.general.language);
  const t = getTeachableMachineTranslations();

  // Help sidebar state
  const [helpSidebarOpen, setHelpSidebarOpen] = useState(false);
  const [currentHelpTopic, setCurrentHelpTopic] = useState(null);
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const handleOpenHelp = useCallback((topic) => {
    setCurrentHelpTopic(topic);
    setHelpSidebarOpen(true);
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="h3" component="h1">
              {t.title}
            </Typography>
            <HelpButton
              onClick={() => handleOpenHelp("pageTitle")}
              tooltip={t.training?.helpMain || "Was ist Teachable senseBox?"}
            />
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t.description}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Model Training Section */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              {t.training.title}
            </Typography>
            <ModelTrainer
              onModelTrained={handleModelTrained}
              onTrainingStart={handleTrainingStart}
              onTrainingError={handleTrainingError}
              isTraining={isTraining}
              disabled={isTraining}
              onOpenHelp={handleOpenHelp}
            />
          </Paper>

          {/* Blockly Integration Section */}
          {trainedModel && (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {t.integration.title}
                <HelpButton
                  onClick={() => handleOpenHelp("deployModel")}
                  tooltip={
                    t.training?.tooltip?.helpDeployModel ||
                    "Help with deploying the model"
                  }
                />
              </Typography>
              <ConvertDeploy model={trainedModel} />
            </Paper>
          )}
        </Box>
      </Container>
    </>
  );
};

export default TeachableMachine;
