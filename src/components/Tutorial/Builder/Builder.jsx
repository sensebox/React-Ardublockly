import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import TutorialBuilderProgressCard from "./TutorialBuilderProgessCard";
import BuildSlide from "./BuildSlide";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AppSnackbar from "@/components/Snackbar";
import Dialog from "@/components/ui/Dialog";
import HardwareCard from "../TutorialItem/HardwareCard";
import WhatNext from "./WhatNext";
import QuestionList from "./QuestionList";
import BlocklyExample from "./BlocklyExample";

import { Box, Button, Typography, CircularProgress } from "@mui/material";
import {
  Info,
  Save,
  CheckCircle,
  WarningAmber,
  Error as ErrorIcon,
  Visibility,
} from "@mui/icons-material";
import { useTheme } from "@mui/styles";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

// Hilfsfunktionen
const createInitialSteps = () => [
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
];

const buildTutorialPayload = ({
  title,
  subtitle,
  difficulty,
  learnings,
  selectedHardware,
  steps,
  isPublic,
  review,
  creator,
  subjects,
  topics,
  duration,
  year,
}) => ({
  public: isPublic,
  review,
  creator,
  title,
  subtitle,
  difficulty,
  learnings,
  hardware: selectedHardware,
  subjects,
  topics,
  duration,
  year,

  steps: steps.map((step) => ({
    id: step.id,
    title: step.title,
    subtitle: step.subtitle || "",
    text: step.text || "",
    type: step.type,
    questionData: step.questionData || null,
    xml: step.xml || null,
  })),
});

const validateRequiredFields = ({ title, subtitle }) => {
  const missing = [];
  if (!title.trim()) missing.push("Titel");
  if (!subtitle.trim()) missing.push("Untertitel");
  return missing;
};

// 🔥 HILFSFUNKTION: Tiefer Vergleich (einfach, aber ausreichend für Tutorial-Steps)
const deepEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

// Hauptkomponente
const Builder = () => {
  const params = useLocation();
  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  const existingTutorialId = isValidObjectId(params.pathname.split("/")[2])
    ? params.pathname.split("/")[2]
    : undefined;
  const [existingTutorial, setExistingTutorial] = useState(null);
  const [loading, setLoading] = useState(!!existingTutorialId);

  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  //  Tutorial-Daten
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [steps, setSteps] = useState(createInitialSteps());
  const [difficulty, setDifficulty] = useState(3);
  const [selectedHardware, setSelectedHardware] = useState([]);
  const [isPublic] = useState(true);
  const [review] = useState(false);
  const [creator] = useState(
    existingTutorial?.creator || user.email || "unknown",
  );
  const [type, setType] = useState("task");
  const [learnings, setLearnings] = useState(
    existingTutorial?.learnings || [{ title: "", description: "" }],
  );
  // Fach und Themenbereich
  const [subjects, setSubjects] = useState(existingTutorial?.subjects || []); // Array!
  const [topics, setTopics] = useState(existingTutorial?.topics || []);
  const [duration, setDuration] = useState(existingTutorial?.duration || "");
  const [year, setYear] = useState(existingTutorial?.year || "");
  //  UI & Navigation
  const [activeStep, setActiveStep] = useState(0);

  // 🔥 NEU: Zustand für Autosave
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);

  //  Speichern
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [savingState, setSavingState] = useState("idle");
  const [savedTutorialId, setSavedTutorialId] = useState(null);

  //  Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackInfo, setSnackInfo] = useState({
    type: "success",
    key: 0,
    message: "",
  });

  // 🔥 NEU: Ref für letzten gespeicherten Zustand
  const lastSavedState = useRef({
    title: "",
    subtitle: "",
    steps: [],
    difficulty: 3,
    learnings: [],
    selectedHardware: [],
  });

  // 🔥 NEU: Ref, um laufende Requests zu verhindern
  const isAutosaving = useRef(false);

  useEffect(() => {
    if (!existingTutorialId) {
      setLoading(false);
      return;
    }

    const fetchTutorial = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BLOCKLY_API}/tutorial/${existingTutorialId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (res.ok) {
          const tutorial = await res.json();
          setExistingTutorial(tutorial.tutorial);
        } else {
          console.error("Tutorial nicht gefunden");
        }
      } catch (err) {
        console.error("Fehler beim Laden des Tutorials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorial();
  }, [existingTutorialId, token]);

  // Sobald existingTutorial geladen ist → States befüllen
  useEffect(() => {
    if (existingTutorial) {
      setTitle(existingTutorial.title || "");
      setSubtitle(existingTutorial.subtitle || "");
      setSteps(existingTutorial.steps || createInitialSteps());
      setDifficulty(existingTutorial.difficulty || 3);
      setSelectedHardware(existingTutorial.hardware || []);
      setTopics(existingTutorial.topics || []);
      setSubjects(existingTutorial.subjects || []);
      setDuration(existingTutorial.duration || "");
      setYear(existingTutorial.year || "");
      setLearnings(
        existingTutorial.learnings || [{ title: "", description: "" }],
      );
    } else if (!existingTutorialId) {
      setTitle("");
      setSubtitle("");
      setSteps(createInitialSteps());
      setDifficulty(3);
      setSelectedHardware([]);
      setLearnings([{ title: "", description: "" }]);
    }
  }, [existingTutorial, existingTutorialId]);

  // 🔥 AUTOSAVE: Wenn activeStep wechselt UND autosave aktiv UND sich was geändert hat
  useEffect(() => {
    if (!autosaveEnabled || isAutosaving.current) return;

    // Zustand, den wir speichern würden
    const currentState = {
      title,
      subtitle,
      steps,
      difficulty,
      learnings,
      selectedHardware,
      topics,
      subjects,
      duration,
      year,
    };

    // 🔥 Prüfe: Hat sich etwas geändert?
    if (deepEqual(currentState, lastSavedState.current)) {
      console.log(
        "Keine Änderungen seit letztem Autosave – überspringe Request.",
      );
      return;
    }

    const autosave = async () => {
      isAutosaving.current = true;

      const missing = validateRequiredFields({ title, subtitle });
      if (missing.length > 0) {
        console.warn("Autosave abgebrochen: Pflichtfelder fehlen");
        isAutosaving.current = false;
        return;
      }

      const payload = buildTutorialPayload({
        title,
        subtitle,
        difficulty,
        learnings,
        selectedHardware,
        steps,
        isPublic,
        review,
        creator,
        subjects,
        topics,
        duration,
        year,
      });

      try {
        let url = `${import.meta.env.VITE_BLOCKLY_API}/tutorial/`;
        let method = "POST";

        if (savedTutorialId) {
          url = `${import.meta.env.VITE_BLOCKLY_API}/tutorial/${savedTutorialId}`;
          method = "PUT";
        } else if (existingTutorialId) {
          url = `${import.meta.env.VITE_BLOCKLY_API}/tutorial/${existingTutorialId}`;
          method = "PUT";
        }

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Autosave Netzwerkfehler");

        const data = await response.json();
        if (!savedTutorialId && !existingTutorialId) {
          setSavedTutorialId(data.tutorial._id);
        }

        // 🔥 Aktualisiere den letzten gespeicherten Zustand
        lastSavedState.current = { ...currentState };
      } catch (err) {
        console.error("Autosave fehlgeschlagen:", err);
      } finally {
        isAutosaving.current = false;
      }
    };

    autosave();
  }, [
    activeStep,
    autosaveEnabled,
    title,
    subtitle,
    steps,
    learnings,
    selectedHardware,
    difficulty,
  ]);

  // 📤 Speichern-Funktion (wie bisher)
  const saveTutorial = async () => {
    const missing = validateRequiredFields({ title, subtitle });
    if (missing.length > 0) {
      setSavingState("missing");
      setSnackInfo({
        type: "error",
        key: Date.now(),
        message: "Bitte fülle alle Pflichtfelder aus.",
      });
      setSnackbarOpen(true);
      return;
    }

    console.log("savign", steps);
    const payload = buildTutorialPayload({
      title,
      subtitle,
      difficulty,
      learnings,
      selectedHardware,
      steps,
      isPublic,
      review,
      creator,
      subjects,
      topics,
      duration,
      year,
    });
    setSaveButtonDisabled(true);
    setSavingState("loading");

    try {
      let url = `${import.meta.env.VITE_BLOCKLY_API}/tutorial/`;
      let method = "POST";

      if (savedTutorialId) {
        url = `${import.meta.env.VITE_BLOCKLY_API}/tutorial/${savedTutorialId}`;
        method = "PUT";
      } else if (existingTutorialId) {
        url = `${import.meta.env.VITE_BLOCKLY_API}/tutorial/${existingTutorialId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Netzwerkfehler");

      const data = await response.json();
      setSavedTutorialId(
        data.tutorial._id || existingTutorialId || savedTutorialId,
      );
      setSavingState("success");
      setSnackInfo({
        type: "success",
        key: Date.now(),
        message:
          savedTutorialId || existingTutorialId
            ? "Tutorial erfolgreich aktualisiert!"
            : "Tutorial erfolgreich gespeichert!",
      });

      // 🔥 Aktualisiere auch nach manuellem Speichern
      lastSavedState.current = {
        title,
        subtitle,
        steps,
        difficulty,
        learnings,
        selectedHardware,
      };

      setSnackbarOpen(true);
    } catch (err) {
      console.error("Speichern fehlgeschlagen:", err);
      setSavingState("error");
    } finally {
      setSaveButtonDisabled(false);
    }
  };

  // 🛠️ Hilfsfunktionen für Schritt-Updates
  const updateStepField = (field, value) => {
    const updated = [...steps];
    updated[activeStep] = { ...updated[activeStep], [field]: value };
    setSteps(updated);
  };

  const updateStepText = (text) => updateStepField("text", text);
  const updateStepXml = (xml) => updateStepField("xml", xml);
  const updateStepQuestions = (questionData) =>
    updateStepField("questionData", questionData); // ✅ RICHTIG

  // 🎨 Render
  const currentStep = steps[activeStep] || {};
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
          height: "80vh",
          p: 2,
          gap: 4,
        }}
      >
        <Box
          sx={{
            flex: "0 0 30%",
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
            autosaveEnabled={autosaveEnabled}
            setAutosaveEnabled={setAutosaveEnabled}
            subjects={subjects}
            setSubjects={setSubjects}
            topics={topics}
            setTopics={setTopics}
            duration={duration}
            setDuration={setDuration}
            year={year}
            setYear={setYear}
          />

          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={saveTutorial}
            disabled={saveButtonDisabled}
          >
            Tutorial speichern
          </Button>
          {existingTutorialId && (
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() =>
                history.push(
                  existingTutorialId
                    ? `/tutorial/${existingTutorialId}`
                    : "/tutorial",
                )
              }
              disabled={saveButtonDisabled}
            >
              Tutorial ansehen
            </Button>
          )}
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flex: "0 0 65%",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AnimatePresence mode="wait">
            <BuildSlide
              title={currentStep.title}
              stepNumber={activeStep + 1}
              key={currentStep.id}
              setType={setType}
              type={currentStep.type}
              setSteps={setSteps}
              steps={steps}
            >
              <div data-color-mode="light">
                <MDEditor
                  height="35vh"
                  value={currentStep.text || ""}
                  onChange={updateStepText}
                  preview="live"
                />
              </div>
              {currentStep.type === "blockly" && (
                <BlocklyExample
                  index={activeStep}
                  value={currentStep.xml || ""}
                  onXmlChange={updateStepXml}
                />
              )}

              {currentStep.type === "question" && (
                <QuestionList
                  questions={currentStep.questionData || []}
                  setQuestions={updateStepQuestions}
                />
              )}

              {currentStep.type === "instruction" &&
                selectedHardware.length > 0 && (
                  <Box mt={2}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      <Info sx={{ color: theme.palette.primary.main, mr: 1 }} />
                      Benötigte Hardware
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: 2,
                        justifyItems: "center",
                        mt: 2,
                        width: "100%",
                      }}
                    >
                      {selectedHardware.map((sensor) => (
                        <Box key={sensor} sx={{ width: "100%", maxWidth: 180 }}>
                          <HardwareCard component={sensor} />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

              {currentStep.type === "finish" && (
                <WhatNext learnings={learnings} setLearnings={setLearnings} />
              )}
            </BuildSlide>
          </AnimatePresence>
        </Box>
      </Box>

      {/* Speicher-Dialog */}
      <SaveStatusDialog
        savingState={savingState}
        onClose={() => setSavingState("idle")}
        savedTutorialId={savedTutorialId}
        history={history}
        theme={theme}
      />
    </Box>
  );
};

// 🔲 Dialog-Komponente (extrahiert für Übersicht)
const SaveStatusDialog = ({
  savingState,
  onClose,
  savedTutorialId,
  history,
  theme,
}) => {
  const renderContent = () => {
    switch (savingState) {
      case "loading":
        return (
          <>
            <CircularProgress color="primary" />
            <Typography variant="body2" color="text.secondary">
              Bitte warten, das Tutorial wird gespeichert...
            </Typography>
          </>
        );

      case "missing":
        return (
          <>
            <WarningAmber sx={{ fontSize: 64, color: "warning.main" }} />
            <Typography variant="body1" fontWeight={600}>
              Folgende Pflichtfelder fehlen noch:
            </Typography>
            <Box sx={{ mt: 1, textAlign: "left" }}>
              <Typography color="error.main">• Titel</Typography>
              <Typography color="error.main">• Untertitel</Typography>
            </Box>
            <Button variant="contained" sx={{ mt: 2 }} onClick={onClose}>
              Verstanden
            </Button>
          </>
        );

      case "success":
        return (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <CheckCircle
                sx={{ fontSize: 64, color: theme.palette.primary.main }}
              />
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
                  onClick={() => history.push(`/tutorial/${savedTutorialId}`)}
                >
                  Zum Tutorial
                </Button>
              )}
            </Box>
          </>
        );

      case "error":
        return (
          <>
            <ErrorIcon sx={{ fontSize: 64, color: "error.main" }} />
            <Typography variant="body1" fontWeight={600}>
              Beim Speichern ist ein Fehler aufgetreten.
            </Typography>
            <Button variant="contained" color="error" onClick={onClose}>
              Schließen
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  if (savingState === "idle") return null;

  return (
    <Dialog
      open
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
      onClose={onClose}
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
          {renderContent()}
        </Box>
      }
    />
  );
};

Builder.propTypes = {
  existingTutorial: PropTypes.object,
};

export default Builder;
