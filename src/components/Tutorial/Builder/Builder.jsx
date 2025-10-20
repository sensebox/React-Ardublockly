import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TutorialBuilderProgressCard from "./TutorialBuilderProgessCard";
import BuildSlide from "./BuildSlide";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { Info, Save, CheckCircle } from "@mui/icons-material";
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
import Dialog from "@/components/ui/Dialog";
import { Error as ErrorIcon, WarningAmber } from "@mui/icons-material";

const Builder = ({ existingTutorial }) => {
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  // 🧱 States
  const [title, setTitle] = useState(existingTutorial?.title || "");
  const [subtitle, setSubtitle] = useState(existingTutorial?.subtitle || "");
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
  const [learnings, setLearnings] = useState(
    existingTutorial?.learnings || [{ title: "", description: "" }],
  );

  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [savingState, setSavingState] = useState("idle"); // idle | loading | success | error
  const [savedTutorialId, setSavedTutorialId] = useState(null);

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackInfo, setSnackInfo] = useState({
    type: "success",
    key: 0,
    message: "",
  });

  const buildTutorialJSON = () => ({
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
      questionData: s.questions || null,
      xml: s.xml || null,
    })),
  });

  const saveTutorial = async () => {
    // 🧩 Prüfe ob Pflichtfelder fehlen
    const missingFields = [];
    if (!title.trim()) missingFields.push("Titel");
    if (!subtitle.trim()) missingFields.push("Untertitel");

    if (missingFields.length > 0) {
      // Öffne Modal mit Info über fehlende Felder
      setSavingState("missing");
      setSnackInfo({
        type: "error",
        key: Date.now(),
        message: "Bitte fülle alle Pflichtfelder aus.",
      });
      setSnackbarOpen(true);
      return;
    }

    const newTutorial = buildTutorialJSON();
    setSaveButtonDisabled(true);
    setSavingState("loading");

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

      if (!response.ok) throw new Error("Fehler beim Speichern");

      const data = await response.json();
      setSavedTutorialId(data._id);
      setSavingState("success");

      setSnackInfo({
        type: "success",
        key: Date.now(),
        message: "Tutorial erfolgreich gespeichert!",
      });
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setSavingState("error");
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
        {/* Sidebar */}
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

        {/* Main Content */}
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
              {steps[activeStep]?.category === "blockly" && (
                <BlocklyExample
                  index={activeStep}
                  value={steps[activeStep]?.xml || ""}
                  onXmlChange={(newXml) => {
                    const updated = [...steps];
                    updated[activeStep].xml = newXml;
                    setSteps(updated);
                  }}
                />
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

              {steps[activeStep]?.category !== "blockly" &&
                steps[activeStep]?.category !== "question" && (
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

              {steps[activeStep]?.id === "finish" && (
                <WhatNext learnings={learnings} setLearnings={setLearnings} />
              )}
            </BuildSlide>
          </AnimatePresence>
        </Box>
      </Box>

      {/* Snackbar */}
      <AppSnackbar
        open={snackbarOpen}
        message={snackInfo.message}
        type={snackInfo.type}
        key={snackInfo.key}
      />

      <Dialog
        open={savingState !== "idle"}
        fullWidth
        maxWidth="xs"
        title={
          savingState === "loading"
            ? "Tutorial wird gespeichert..."
            : savingState === "success"
              ? "Gespeichert!"
              : savingState === "missing"
                ? "Angaben unvollständig"
                : "Fehler beim Speichern"
        }
        onClose={() => setSavingState("idle")}
        content={
          <Box
            sx={{
              textAlign: "center",
              py: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* 🟡 LOADING */}
            {savingState === "loading" && (
              <>
                <CircularProgress color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Bitte warten, das Tutorial wird gespeichert...
                </Typography>
              </>
            )}

            {/* ⚠️ MISSING INFO */}
            {savingState === "missing" && (
              <>
                <WarningAmber sx={{ fontSize: 64, color: "warning.main" }} />
                <Typography variant="body1" fontWeight={600}>
                  Folgende Pflichtfelder fehlen noch:
                </Typography>
                <Box sx={{ mt: 1, textAlign: "left" }}>
                  {!title.trim() && (
                    <Typography color="error.main">• Titel</Typography>
                  )}
                  {!subtitle.trim() && (
                    <Typography color="error.main">• Untertitel</Typography>
                  )}
                </Box>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => setSavingState("idle")}
                >
                  Verstanden
                </Button>
              </>
            )}

            {/* 🟢 SUCCESS */}
            {savingState === "success" && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 120 }}
                >
                  <CheckCircle sx={{ fontSize: 64, color: "success.main" }} />
                </motion.div>
                <Typography variant="body1" fontWeight={600}>
                  Tutorial erfolgreich gespeichert!
                </Typography>
                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => history.push("/tutorial")}
                  >
                    Zur Übersicht
                  </Button>
                  {savedTutorialId && (
                    <Button
                      variant="contained"
                      onClick={() =>
                        history.push(`/tutorial/${savedTutorialId}`)
                      }
                    >
                      Zum Tutorial
                    </Button>
                  )}
                </Box>
              </>
            )}

            {/* 🔴 ERROR */}
            {savingState === "error" && (
              <>
                <ErrorIcon sx={{ fontSize: 64, color: "error.main" }} />
                <Typography variant="body1" fontWeight={600}>
                  Beim Speichern ist ein Fehler aufgetreten.
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setSavingState("idle")}
                >
                  Schließen
                </Button>
              </>
            )}
          </Box>
        }
      />
    </Box>
  );
};

export default Builder;
