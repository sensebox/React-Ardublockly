import React, { useEffect, useState } from "react";
import {
  Box,
  CardContent,
  useTheme,
  Skeleton,
  Typography,
} from "@mui/material";
import TutorialSlide from "../components/TutorialSlide";
import UnlockedContent from "./UnlockedContent";
import { CheckCircleOutline, LockOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getTutorialCompletionStatus } from "@/helpers/getTutorialCompletionStatus";

const FinishedCard = ({ tutorial }) => {
  const theme = useTheme();
  const tutorialProgress = useSelector(
    (state) => state.tutorialProgress.byTutorialId[tutorial._id],
  );
  const [isUnlocked, setIsUnlocked] = useState(false);

  // is finished?
  useEffect(() => {
    const isFinished = getTutorialCompletionStatus(tutorial, tutorialProgress);
    setIsUnlocked(isFinished.missing.length === 0);
  }, []);
  const renderOverlay = () => (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(2px)",
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 3,
          p: 4,
          maxWidth: 420,
          width: "90%",
          textAlign: "center",
          boxShadow: 6,
        }}
      >
        <LockOutlined sx={{ fontSize: 48, color: "warning.main", mb: 2 }} />

        <Typography variant="h6" fontWeight={600} gutterBottom>
          Abschluss noch gesperrt
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Beantworte zuerst alle Fragen richtig, um die letzte Folie
          freizuschalten.
        </Typography>
      </Box>
    </Box>
  );

  return (
    <TutorialSlide>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            filter: !isUnlocked ? "blur(6px) grayscale(0.3)" : "none",
            pointerEvents: isUnlocked ? "auto" : "none",
            transition: "filter 0.3s ease",
          }}
        >
          <UnlockedContent theme={theme} tutorial={tutorial} />
        </Box>

        {!isUnlocked && renderOverlay()}
      </Box>
    </TutorialSlide>
  );
};

export default FinishedCard;
