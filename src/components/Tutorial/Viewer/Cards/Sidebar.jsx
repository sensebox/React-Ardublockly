import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  LinearProgress,
  useTheme,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Edit, QuestionMark } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeStep = useSelector((state) => state.tutorial.activeStep);
  const tutorial = useSelector((state) => state.tutorial.tutorials[0]);
  const user = useSelector((state) => state.auth.user);
  const [stepWithTask, setStepWithTaks] = useState(false);
  const stepsWithFinish = [...tutorial.steps];

  const progress = ((activeStep + 1) / stepsWithFinish.length) * 100;
  useEffect(() => {
    const currentStep = tutorial.steps[activeStep];
    if (
      currentStep &&
      (currentStep.type === "question" || currentStep.type === "blockly")
    ) {
    }
  }, [activeStep]);
  const changeStep = (step) => {
    dispatch({
      type: "TUTORIAL_STEP",
      payload: step,
    });
  };

  useEffect(() => {
    const groupId = localStorage.getItem("lastGroupId");
    const memberId = localStorage.getItem("lastMemberId");
    const tutorialId = tutorial?._id || localStorage.getItem("lastTutorialId");
    const tutorialTitle =
      tutorial?.title || localStorage.getItem("lastTutorialTitle");

    if (groupId && memberId && tutorialId) {
      // Send step progress update whenever the current tutorial slide changes.
      axios
        .put(
          `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/progress/patchTutorialProgress/${memberId}`,
          {
            tutorialId,
            tutorialTitle,
            currentStep: activeStep + 1,
            totalSteps: stepsWithFinish.length,
          },
        )
        .then(() => {
          console.log("Tutorial progress updated:", {
            tutorialId,
            tutorialTitle,
            currentStep: activeStep + 1,
            totalSteps: stepsWithFinish.length,
          });
        })
        .catch((err) =>
          console.error("Fortschritt konnte nicht gesendet werden:", err),
        );
    }

    if (groupId && memberId) {
      axios
        .post(
          `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/member/heartbeat/${memberId}`,
          {
            groupMember: memberId,
            groupId,
          },
        )
        .catch((err) => console.error("Heartbeat fehlgeschlagen:", err));
    }
  }, [activeStep, stepsWithFinish.length, tutorial]);

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 180px)", // Navbar ~64px + Breadcrumbs ~45px + margins ~70px
        overflow: "hidden",
      }}
    >
      <CardHeader
        sx={{ flexShrink: 0 }} // Keep header fixed
        title={
          <Typography variant="h6" fontWeight={600}>
            {tutorial.title || ""}
          </Typography>
        }
        subheader={
          <Box>
            {tutorial.subtitle}

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                mb: 1,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Schritt {Math.min(activeStep + 1, stepsWithFinish.length)} von{" "}
              {stepsWithFinish.length}
            </Typography>
          </Box>
        }
      />

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          flex: 1,
          overflow: "auto", // Make steps scrollable
          minHeight: 0, // Required for flex overflow to work
        }}
      >
        {stepsWithFinish.map((step, index) => {
          const isCurrent = index === activeStep;
          const isCompleted = index < activeStep;

          return (
            <Box
              key={step.id || index}
              component="button"
              onClick={() => changeStep(index)}
              sx={{
                all: "unset",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 2,
                py: 1.5,
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                bgcolor: isCurrent
                  ? theme.palette.primary.main
                  : isCompleted
                    ? theme.palette.action.selected
                    : "transparent",
                color: isCurrent
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.primary,
                "&:hover": {
                  bgcolor: isCurrent
                    ? theme.palette.primary.dark
                    : theme.palette.action.hover,
                },
              }}
            >
              {isCompleted ? (
                <CheckCircleIcon
                  sx={{ color: theme.palette.success.main, flexShrink: 0 }}
                />
              ) : (
                <RadioButtonUncheckedIcon
                  sx={{
                    color: isCurrent
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.secondary,

                    flexShrink: 0,
                  }}
                />
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={isCurrent ? 600 : 400}
                  noWrap
                >
                  {step.title ||
                    (index === 0 ? "Einleitung" : `Schritt ${index}`)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }} noWrap>
                  {step.subtitle || ""}
                </Typography>
              </Box>
            </Box>
          );
        })}
        {user && tutorial.creator === user.email && (
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/tutorial/${tutorial._id}/edit`)}
          >
            Tutorial bearbeiten
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Sidebar;
