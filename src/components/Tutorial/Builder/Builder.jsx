import React, { useEffect, useState } from "react";
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
} from "@mui/icons-material";
import { useTheme } from "@mui/styles";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";

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
}) => ({
  public: isPublic,
  review,
  creator,
  title,
  subtitle,
  difficulty,
  learnings,
  hardware: selectedHardware,
  steps: steps.map((step) => ({
    id: step.id,
    headline: step.title,
    subtitle: step.subtitle || "",
    text: step.text || "",
    type: step.type,
    questionData: step.questions || null,
    xml: step.xml || null,
  })),
});

const validateRequiredFields = ({ title, subtitle }) => {
  const missing = [];
  if (!title.trim()) missing.push("Titel");
  if (!subtitle.trim()) missing.push("Untertitel");
  return missing;
};

// Hauptkomponente
const Builder = () => {
  const { tutorialId } = useParams();

  const existingTutorialId = "hallo";
  console.log(tutorialId);
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
  const [category, setCategory] = useState(existingTutorial?.type || "task");
  const [learnings, setLearnings] = useState(
    existingTutorial?.learnings || [{ title: "", description: "" }],
  );

  //  UI & Navigation
  const [activeStep, setActiveStep] = useState(0);

  //  Speichern
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [savingState, setSavingState] = useState("idle"); // idle | loading | success | error | missing
  const [savedTutorialId, setSavedTutorialId] = useState(null);

  //  Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackInfo, setSnackInfo] = useState({
    type: "success",
    key: 0,
    message: "",
  });

  useEffect(() => {
    if (!existingTutorialId) {
      setLoading(false);
      return;
    }

    console.log("getting tutorial");

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
          setExistingTutorial(tutorial);
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
      setLearnings(
        existingTutorial.learnings || [{ title: "", description: "" }],
      );
      // category, isPublic, review, creator – falls nötig
    } else if (!existingTutorialId) {
      // Neues Tutorial → Standardwerte
      setTitle("");
      setSubtitle("");
      setSteps(createInitialSteps());
      setDifficulty(3);
      setSelectedHardware([]);
      setLearnings([{ title: "", description: "" }]);
    }
  }, [existingTutorial, existingTutorialId]);

  // 📤 Speichern-Funktion
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
    });

    setSaveButtonDisabled(true);
    setSavingState("loading");

    try {
      let url = `${import.meta.env.VITE_BLOCKLY_API}/tutorial/`;
      let method = "POST";

      // 🔁 Wenn existingTutorialId vorhanden → PUT
      if (existingTutorialId) {
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
      setSavedTutorialId(data._id || existingTutorialId); // bei PUT ist _id oft nicht im Response
      setSavingState("success");
      setSnackInfo({
        type: "success",
        key: Date.now(),
        message: existingTutorialId
          ? "Tutorial erfolgreich aktualisiert!"
          : "Tutorial erfolgreich gespeichert!",
      });
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
  const updateStepQuestions = (questions) =>
    updateStepField("questions", questions);

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
              title={currentStep.title}
              stepNumber={activeStep + 1}
              key={currentStep.id}
              setCategory={setCategory}
              category={category}
              setSteps={setSteps}
              steps={steps}
            >
              {currentStep.type === "blockly" && (
                <BlocklyExample
                  index={activeStep}
                  value={currentStep.xml || ""}
                  onXmlChange={updateStepXml}
                />
              )}

              {currentStep.type === "question" && (
                <QuestionList
                  questions={currentStep.questions || []}
                  setQuestions={updateStepQuestions}
                />
              )}

              {currentStep.type !== "blockly" &&
                currentStep.type !== "question" && (
                  <div data-color-mode="light">
                    <MDEditor
                      height="35vh"
                      value={currentStep.text || ""}
                      onChange={updateStepText}
                      preview="live"
                    />
                  </div>
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

      {/* Snackbar */}
      <AppSnackbar
        open={snackbarOpen}
        message={snackInfo.message}
        type={snackInfo.type}
        key={snackInfo.key}
        onClose={() => setSnackbarOpen(false)}
      />

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
