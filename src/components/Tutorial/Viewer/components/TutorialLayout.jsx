import React, { useEffect } from "react";
import { Box } from "@mui/material";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import TutorialFooter from "./TutorialFooter";
import TutorialProgressCard from "../Cards/Sidebar";
import Sidebar from "../Cards/Sidebar";
import FloatingNavigation from "./FloatingNavigation";
import { useTutorialViewer } from "../hooks/useTutorialViewer";

const TutorialLayout = ({
  tutorial,
  tutorialId,
  platform,
  nextStepDisabled,
  children,
}) => {
  const { activeStep } = useTutorialViewer(tutorialId);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box sx={{ flexShrink: 0 }}>
        <Breadcrumbs
          content={[
            { link: "/tutorial", title: "Tutorials" },
            {
              link: `/tutorial/${tutorialId}`,
              title: tutorial?.title || "Aktuelles Tutorial",
            },
          ]}
        />
      </Box>

      {/* Main */}
      <Box
        sx={{
          flex: 1, // 🔥 nimmt Resthöhe
          display: "flex",
          flexDirection: "row",
          gap: 4,
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            flex: "0 0 20%",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Sidebar />
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            flexDirection: "column",
            borderRadius: 3,
            boxShadow: 3,
            height: "80vh",
            overflow: "scroll",
          }}
        >
          {children}

          <FloatingNavigation tutorialId={tutorialId} />
        </Box>
      </Box>

      {/* Footer */}
      {platform && (
        <Box sx={{ flexShrink: 0 }}>
          <TutorialFooter nextStepDisabled={nextStepDisabled} />
        </Box>
      )}
    </Box>
  );
};

export default TutorialLayout;
