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
import { getAccelerationTranslations } from "./translations";
import AccelerationModelTrainer from "./AccelerationModelTrainer";
import AccelerationModelVisualizer, {
  DEFAULT_MODEL_CONFIG,
  DEFAULT_ACTIVE_GROUP_KEYS,
} from "./AccelerationModelVisualizer";
import AccelerationHelpSidebar, {
  SIDEBAR_WIDTH,
} from "./AccelerationHelpSidebar";
import HelpButton from "../HelpButton";

const AccelerationClassification = () => {
  const navigate = useNavigate();
  const [trainedModel, setTrainedModel] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingError, setTrainingError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [modelConfig, setModelConfig] = useState(DEFAULT_MODEL_CONFIG);
  const [activeGroupKeys, setActiveGroupKeys] = useState(
    DEFAULT_ACTIVE_GROUP_KEYS,
  );
  const isMountedRef = useRef(true);
  const language = useSelector((s) => s.general.language);
  const t = getAccelerationTranslations();

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

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <>
      <AccelerationHelpSidebar
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
              onClick={() => handleOpenHelp("pageTitle")}
              tooltip={
                t.training?.tooltip?.helpMain ||
                "Was ist Bewegungsklassifizierung?"
              }
            />
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t.description}
          </Typography>
        </Box>

        {trainingError && (
          <Box sx={{ mb: 2, p: 2, bgcolor: "error.light", borderRadius: 1 }}>
            <Typography variant="body2" color="error.contrastText">
              {trainingError}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Model Architecture Visualizer Section */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography variant="h5">{t.modelVisualizer.title}</Typography>
              <HelpButton
                onClick={() => handleOpenHelp("architecture")}
                tooltip={t.training.tooltip.helpArchitecture}
              />
            </Box>
            <AccelerationModelVisualizer
              classNames={classes.map((c) => c.name)}
              modelConfig={modelConfig}
              activeGroupKeys={activeGroupKeys}
              onModelConfigChange={setModelConfig}
              onActiveGroupsChange={setActiveGroupKeys}
              trainedModel={trainedModel}
            />
          </Paper>

          {/* Model Training Section */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              {t.training.title}
            </Typography>
            <AccelerationModelTrainer
              classes={classes}
              onClassesChange={setClasses}
              onModelTrained={handleModelTrained}
              onTrainingStart={handleTrainingStart}
              onTrainingError={handleTrainingError}
              isTraining={isTraining}
              disabled={isTraining}
              onOpenHelp={handleOpenHelp}
              modelConfig={modelConfig}
              activeGroupKeys={activeGroupKeys}
            />
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default AccelerationClassification;
