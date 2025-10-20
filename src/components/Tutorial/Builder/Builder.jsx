import React, { useEffect, useState } from "react";
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
import HardwareCard from "../TutorialItem/HardwareCard";
import { useTheme } from "@mui/styles";
import { useSelector } from "react-redux";
import WhatNext from "./WhatNext";
import QuestionList from "./QuestionList";
import BlocklyExample from "./BlocklyExample";
import AppSnackbar from "@/components/Snackbar";
import { useHistory } from "react-router-dom";

const Builder = ({ existingTutorial }) => {
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  // 🔥 Global States
  const [title, setTitle] = useState(
    existingTutorial?.title || "Tutorial Titel",
  );
  const [subtitle, setSubtitle] = useState(
    existingTutorial?.subtitle || "Kurze Beschreibung",
  );
  const [steps, setSteps] = useState(
    existingTutorial?.steps || [
      {
        id: "intro",
        title: "Einleitung",
        subtitle: "Starte hier!",
        type: "instruction",
      },
      {
        id: "finish",
        title: "Abschluss",
        type: "finish",
        subtitle: "Übersicht & Zusammenfassung",
      },
    ],
  );
  const [difficulty, setDifficulty] = useState(
    existingTutorial?.difficulty || 3,
  );
  const [selectedHardware, setSelectedHardware] = useState(
    existingTutorial?.hardware || [],
  );
  const [isPublic, setIsPublic] = useState(existingTutorial?.public ?? true);
  const [review, setReview] = useState(existingTutorial?.review ?? false);
  const [creator, setCreator] = useState(
    existingTutorial?.creator || user.email || "unknown",
  );
  const [activeStep, setActiveStep] = useState(0);
  const [category, setCategory] = useState(
    existingTutorial?.category || "task",
  );

  // 🧠 NEW: Learnings state
  const [learnings, setLearnings] = useState(
    existingTutorial?.learnings || [
      {
        title: "",
        description: "",
      },
    ],
  );

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackInfo, setSnackInfo] = useState({
    type: "success",
    key: 0,
    message: "",
  });

  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);

  const buildTutorialJSON = () => (
    console.log("building tutorial json with steps", steps),
    {
      public: isPublic,
      review,
      creator,
      title,
      difficulty,
      learnings,
      hardware: selectedHardware,
      steps: steps.map((s) => ({
        id: s.id,
        headline: s.title,
        subtitle: s.subtitle || "",
        text: s.text || "",
        type: s.category || s.type,
        questionData: s.questions || null, // 👈 HIER hinzugefügt
        xml: s.xml || null, // 👈 HIER hinzugefügt
      })),
    }
  );

  const saveTutorial = async () => {
    const newTutorial = buildTutorialJSON();
    setSaveButtonDisabled(true);
    console.log("Posting this tutorial:", newTutorial);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BLOCKLY_API}/tutorial/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTutorial),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Fehler beim Speichern");
      }

      const data = await response.json();
      console.log("Tutorial saved:", data);
      setSnackInfo({
        type: "success",
        key: Date.now(),
        message: "Tutorial erfolgreich gespeichert!",
      });
      setSnackbarOpen(true);
      history.push("/tutorial");
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
    } finally {
      setSaveButtonDisabled(false);
    }
  };

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
          boxSizing: "border-box",
          width: "100%",
          height: "80vh",
          p: 2,
          gap: 4,
          justifyContent: "center",
        }}
      >
        {/* Left Side */}
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
            onClick={saveTutorial}
            disabled={saveButtonDisabled}
          >
            Tutorial speichern
          </Button>
        </Box>

        {/* Right Side */}
        <Box
          sx={{
            flex: "0 0 60%",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AnimatePresence mode="wait">
            <BuildSlide
              title={steps[activeStep]?.title}
              stepNumber={activeStep + 1}
              key={steps[activeStep]?.id}
              setCategory={setCategory}
              category={category}
              setSteps={setSteps}
              steps={steps}
            >
              {steps[activeStep]?.category !== "blockly" && (
                <div data-color-mode="light">
                  <MDEditor
                    height={"35vh"}
                    value={steps[activeStep]?.text || ""}
                    onChange={(value) => {
                      const updated = [...steps];
                      updated[activeStep].text = value || "";
                      setSteps(updated);
                    }}
                    preview="live"
                  />
                </div>
              )}

              {steps[activeStep]?.category === "question" && (
                <QuestionList
                  questions={steps[activeStep].questions || []}
                  setQuestions={(newList) => {
                    const updated = [...steps];
                    updated[activeStep].questions = newList;
                    setSteps(updated);
                  }}
                />
              )}

              {steps[activeStep]?.category === "blockly" && (
                <BlocklyExample
                  index={activeStep}
                  task={false}
                  value={steps[activeStep]?.xml || ""}
                  onXmlChange={(newXml) => {
                    const updated = [...steps];
                    updated[activeStep].xml = newXml;
                    setSteps(updated);
                  }}
                />
              )}

              {/* Hardware Overview nur im Intro */}
              {steps[activeStep]?.id === "intro" &&
                selectedHardware.length > 0 && (
                  <Box sx={{ mt: 3 }}>
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
                            flex: "1 1 calc(25% - 16px)",
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
                  </Box>
                )}

              {/* ✅ Learnings (nur im Abschluss) */}
              {steps[activeStep]?.id === "finish" && (
                <WhatNext learnings={learnings} setLearnings={setLearnings} />
              )}
            </BuildSlide>
          </AnimatePresence>
        </Box>
      </Box>
      <AppSnackbar
        open={snackbarOpen}
        message={snackInfo.message}
        type={snackInfo.type}
        key={snackInfo.key}
      />
    </Box>
  );
};

export default Builder;
