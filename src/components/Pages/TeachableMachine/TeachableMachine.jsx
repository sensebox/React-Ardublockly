import React, { useState, useRef, useCallback, useEffect } from "react";
import { Container, Typography, Box, Paper, Alert } from "@mui/material";
import * as Blockly from "blockly/core";
import ModelTrainer from "./ModelTrainer";
import BlocklyIntegration from "./BlocklyIntegration";
import "./TeachableMachine.css";

const TeachableMachine = () => {
  const [trainedModel, setTrainedModel] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingError, setTrainingError] = useState(null);
  const isMountedRef = useRef(true);

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
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {Blockly.Msg.teachableMachine?.title || "Teachable Machine"}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {Blockly.Msg.teachableMachine?.description ||
            "Train your own machine learning model using the camera and deploy it on your senseBox Eye."}
        </Typography>
      </Box>

      {trainingError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setTrainingError(null)}
        >
          {trainingError}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Model Training Section */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            {Blockly.Msg.teachableMachine?.training?.title || "Model Training"}
          </Typography>
          <ModelTrainer
            onModelTrained={handleModelTrained}
            onTrainingStart={handleTrainingStart}
            onTrainingError={handleTrainingError}
            isTraining={isTraining}
            disabled={isTraining}
          />
        </Paper>

        {/* Blockly Integration Section */}
        {trainedModel && (
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              {Blockly.Msg.teachableMachine?.integration?.title ||
                "Blockly Integration"}
            </Typography>
            <BlocklyIntegration model={trainedModel} />
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default TeachableMachine;
