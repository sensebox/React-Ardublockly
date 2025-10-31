import React from "react";
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
import { Edit } from "@mui/icons-material";
import { useHistory } from "react-router-dom";

const TutorialProgressCard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const activeStep = useSelector((state) => state.tutorial.activeStep);
  const tutorial = useSelector((state) => state.tutorial.tutorials[0]);
  const user = useSelector((state) => state.auth.user);
  // künstlich einen "Abschluss"-Step anhängen
  const stepsWithFinish = [...tutorial.steps];

  const progress = ((activeStep + 1) / stepsWithFinish.length) * 100;

  const changeStep = (step) => {
    dispatch({
      type: "TUTORIAL_STEP",
      payload: step,
    });
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        maxHeight: "80vh",
        overflow: "scroll",
      }}
    >
      <CardHeader
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

      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
            onClick={() => history.push(`/tutorial/${tutorial._id}/edit`)}
          >
            Tutorial bearbeiten
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TutorialProgressCard;
