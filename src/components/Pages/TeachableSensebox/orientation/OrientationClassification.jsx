import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Tabs,
  Tab,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getOrientationTranslations } from "./translations";
import OrientationModelTrainer from "./OrientationModelTrainer";
import OrientationDecisionTreeVisualizer from "./OrientationDecisionTreeVisualizer";
import OrientationNNVisualizer, {
  DEFAULT_NN_CONFIG,
} from "./OrientationNNVisualizer";
import useOrientationNNTraining from "./hooks/useOrientationNNTraining";
import OrientationHelpSidebar, {
  SIDEBAR_WIDTH,
} from "./OrientationHelpSidebar";
import HelpButton from "../HelpButton";

const OrientationClassification = () => {
  const navigate = useNavigate();
  const [trainedModel, setTrainedModel] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingError, setTrainingError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [latestSample, setLatestSample] = useState(null);
  const [vizTab, setVizTab] = useState(0); // 0 = Decision Tree, 1 = Neural Network
  const [nnConfig, setNNConfig] = useState(DEFAULT_NN_CONFIG);
  const [trainedNNModel, setTrainedNNModel] = useState(null);
  const isMountedRef = useRef(true);
  const language = useSelector((s) => s.general.language);
  const t = getOrientationTranslations();

  const {
    trainModel: trainNNModel,
    trainingProgress: nnProgress,
    isTraining: isNNTraining,
  } = useOrientationNNTraining();

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

  // ── NN re-training whenever classes change (mirrors decision tree logic) ──
  useEffect(() => {
    const canTrain =
      classes.length >= 2 && classes.every((cls) => cls.samples.length >= 1);
    if (!canTrain) return;

    trainNNModel(
      classes,
      () => {},
      (err) => {
        console.error("NN training error:", err);
      },
      (modelInfo) => {
        if (isMountedRef.current) {
          setTrainedNNModel(modelInfo);
        }
      },
      nnConfig,
    );
  }, [classes, nnConfig, trainNNModel]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <>
      <OrientationHelpSidebar
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
                "Was ist Orientierungsklassifizierung?"
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
          {/* Model Training Section */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              {t.training.title}
            </Typography>
            <OrientationModelTrainer
              classes={classes}
              onClassesChange={setClasses}
              onModelTrained={handleModelTrained}
              onTrainingStart={handleTrainingStart}
              onTrainingError={handleTrainingError}
              isTraining={isTraining}
              disabled={isTraining}
              onOpenHelp={handleOpenHelp}
              onLatestSample={setLatestSample}
            />
          </Paper>
        </Box>

        {/* Tabbed visualizer: Decision Tree | Neural Network */}
        <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
          <Tabs
            value={vizTab}
            onChange={(_, v) => setVizTab(v)}
            sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
          >
            <Tab
              label={t.decisionTree?.tabLabel ?? "Decision Tree"}
              id="viz-tab-0"
              aria-controls="viz-panel-0"
            />
            <Tab
              label={t.neuralNetwork?.tabLabel ?? "Neural Network"}
              id="viz-tab-1"
              aria-controls="viz-panel-1"
            />
          </Tabs>

          {/* ── Tab 0: Decision Tree ─────────────────────────────────── */}
          <Box
            role="tabpanel"
            id="viz-panel-0"
            aria-labelledby="viz-tab-0"
            hidden={vizTab !== 0}
          >
            {vizTab === 0 && (
              <>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="h5">{t.decisionTree.title}</Typography>
                  <HelpButton
                    onClick={() => handleOpenHelp("decisionTree")}
                    tooltip={t.training.tooltip.helpDecisionTree}
                  />
                </Box>
                <OrientationDecisionTreeVisualizer
                  trainedModel={trainedModel}
                  latestSample={latestSample}
                />
              </>
            )}
          </Box>

          {/* ── Tab 1: Neural Network ─────────────────────────────────── */}
          <Box
            role="tabpanel"
            id="viz-panel-1"
            aria-labelledby="viz-tab-1"
            hidden={vizTab !== 1}
          >
            {vizTab === 1 && (
              <>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="h5">
                    {t.neuralNetwork?.title ?? "Neural Network"}
                  </Typography>
                  <HelpButton
                    onClick={() => handleOpenHelp("neuralNetwork")}
                    tooltip={t.training.tooltip.helpNeuralNetwork}
                  />
                </Box>

                <OrientationNNVisualizer
                  classNames={classes.map((c) => c.name)}
                  nnConfig={nnConfig}
                  onNNConfigChange={setNNConfig}
                  trainedModel={trainedNNModel}
                  latestSample={latestSample}
                  onOpenHelp={handleOpenHelp}
                />

                {isNNTraining && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {t.neuralNetwork?.training ?? "Training…"}{" "}
                      {nnProgress.totalEpochs > 0
                        ? `(${nnProgress.epoch}/${nnProgress.totalEpochs})`
                        : ""}
                    </Typography>
                    <LinearProgress
                      variant={
                        nnProgress.totalEpochs > 0
                          ? "determinate"
                          : "indeterminate"
                      }
                      value={
                        nnProgress.totalEpochs > 0
                          ? (nnProgress.epoch / nnProgress.totalEpochs) * 100
                          : undefined
                      }
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default OrientationClassification;
