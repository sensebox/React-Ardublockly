import React, { useState } from "react";
import PropTypes from "prop-types";
import TutorialBuilderProgressCard from "./TutorialBuilderProgessCard";
import BuildSlide from "./BuildSlide";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Box, Button, Typography } from "@mui/material";
import { Info, Save } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import MDEditor from "@uiw/react-md-editor";
import HardwareCard from "../HardwareCard";
import { useTheme } from "@mui/styles";
const Builder = () => {
  // 🔥 States für das gesamte Tutorial
  const theme = useTheme();
  const [title, setTitle] = useState("Tutorial Titel");
  const [subtitle, setSubtitle] = useState("Kurze Beschreibung");
  const [steps, setSteps] = useState([
    { id: "intro", title: "Einleitung", subtitle: "Starte hier!" },
    {
      id: "finish",
      title: "Abschluss",
      subtitle: "Übersicht & Zusammenfassung",
    },
  ]);
  const [difficulty, setDifficulty] = useState(3);
  const [selectedHardware, setSelectedHardware] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [review, setReview] = useState(false);
  const [creator, setCreator] = useState("mario.pesch@uni-muenster.de");
  const [activeStep, setActiveStep] = useState(0);
  const variants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  // ✅ JSON Object Builder
  const buildTutorialJSON = () => ({
    public: isPublic,
    review: review,
    creator: creator,
    title: title,
    difficulty: difficulty,
    steps: steps.map((s) => ({
      id: s.id,
      headline: s.title,
      text: s.subtitle,
      hardware: selectedHardware,
      type: "instruction",
    })),
  });

  return (
    <Box>
      <Breadcrumbs
        content={[
          { link: "/tutorial", title: "Tutorials" },
          { link: "/tutorial/builder", title: "Tutorial Builder" },
        ]}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          p: 2,
          gap: 4,
          justifyContent: "center",
        }}
      >
        {/* ProgressCard links - 20% */}
        <Box
          sx={{
            flex: "0 0 20%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TutorialBuilderProgressCard
            title={title}
            setTitle={setTitle}
            subtitle={subtitle}
            setSubtitle={setSubtitle}
            steps={steps}
            setSteps={setSteps}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            selectedHardware={selectedHardware}
            setSelectedHardware={setSelectedHardware}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => {
              console.log(buildTutorialJSON());
            }}
          >
            Tutorial speichern
          </Button>
        </Box>

        {/* Vorschau-Bereich rechts */}
        <Box
          sx={{
            flex: "0 0 60%",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            minHeight: 300, // 👈 Feste Höhe verhindert Kollaps
          }}
        >
          <AnimatePresence mode="wait">
            <BuildSlide key={steps[activeStep]?.id} stepNumber={activeStep + 1}>
              <div data-color-mode="light">
                <MDEditor
                  height={300}
                  width={"100%"}
                  color="light"
                  value={steps[activeStep]?.text || ""}
                  onChange={(value) => {
                    const updated = [...steps];
                    updated[activeStep].text = value || "";
                    setSteps(updated);
                  }}
                  preview="live"
                />{" "}
              </div>
              {steps[activeStep]?.id === "intro" &&
                selectedHardware.length > 0 && (
                  <div>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Info sx={{ color: theme.palette.primary.main, mr: 1 }} />
                      Benötigte Hardware
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 2,
                        mt: 2,
                        width: "100%",
                      }}
                    >
                      {selectedHardware.map((sensor, index) => (
                        <Box
                          key={index}
                          sx={{
                            flex: "1 1 calc(25% - 16px)", // 🔥 max 4 pro Reihe
                            maxWidth: "25%",
                            minWidth: "120px",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <HardwareCard component={sensor} />
                        </Box>
                      ))}
                    </Box>
                  </div>
                )}
            </BuildSlide>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};

export default Builder;
