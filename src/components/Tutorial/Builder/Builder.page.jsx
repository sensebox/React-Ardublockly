import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress } from "@mui/material";
import { Save, Visibility } from "@mui/icons-material";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { useTutorialBuilder } from "./hooks/useTutorialBuilder";
import { useTutorialAutosave } from "./hooks/useTutorialAutosave";
import { useExistingTutorial } from "./hooks/useExistingTutorial";
import { buildTutorialPayload } from "./utils/tutorialPayload";
import { validateRequiredFields } from "./utils/validation";
import { saveTutorial as saveTutorialRequest } from "../services/tutorial.service";
import BuilderSidebar from "./components/BuilderSidebar";
import BuilderMain from "./components/BuilderMain";
import SaveStatusDialog from "./components/SaveStatusDialog";

const BuilderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
  const existingTutorialId = isValidObjectId(location.pathname.split("/")[2])
    ? location.pathname.split("/")[2]
    : undefined;

  const { tutorial, loading } = useExistingTutorial({
    tutorialId: existingTutorialId,
    token,
  });

  const { state, actions } = useTutorialBuilder({
    initialData: tutorial,
    creator: tutorial?.creator || user?.email || "unknown",
  });

  const {
    title,
    subtitle,
    steps,
    difficulty,
    selectedHardware,
    learnings,
    subjects,
    topics,
    duration,
    year,
    isPublic,
    review,
    creator,
  } = state;

  /**
   * 🧭 UI State
   */
  const [activeStep, setActiveStep] = useState(0);
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);

  const [savingState, setSavingState] = useState("idle");
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [savedTutorialId, setSavedTutorialId] = useState(null);

  /**
   * 🔥 Autosave Hook
   */
  useTutorialAutosave({
    enabled: autosaveEnabled,
    state,
    token,
    tutorialId: savedTutorialId || existingTutorialId,
    onSaved: (res) => {
      if (!savedTutorialId && res?.tutorial?._id) {
        setSavedTutorialId(res.tutorial._id);
      }
    },
  });

  /**
   * 📤 Manuelles Speichern
   */
  const saveTutorial = async () => {
    const missing = validateRequiredFields({ title, subtitle });

    if (missing.length > 0) {
      setSavingState("missing");
      return;
    }

    const payload = buildTutorialPayload(state);

    setSavingState("loading");
    setSaveButtonDisabled(true);

    try {
      const res = await saveTutorialRequest({
        id: savedTutorialId || existingTutorialId,
        payload,
        token,
      });

      const id = res?.tutorial?._id || savedTutorialId || existingTutorialId;

      setSavedTutorialId(id);
      setSavingState("success");
    } catch (err) {
      console.error("Speichern fehlgeschlagen:", err);
      setSavingState("error");
    } finally {
      setSaveButtonDisabled(false);
    }
  };

  /**
   * ⏳ Loading State
   */
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  /**
   * 🎨 Render
   */
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
        {/* Sidebar */}
        <BuilderSidebar
          state={state}
          actions={actions}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          autosaveEnabled={autosaveEnabled}
          setAutosaveEnabled={setAutosaveEnabled}
        >
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={saveTutorial}
            disabled={saveButtonDisabled}
          >
            Tutorial speichern
          </Button>

          {(savedTutorialId || existingTutorialId) && (
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              disabled={saveButtonDisabled}
              onClick={() =>
                navigate(`/tutorial/${savedTutorialId || existingTutorialId}`)
              }
            >
              Tutorial ansehen
            </Button>
          )}
        </BuilderSidebar>

        {/* Main Content */}
        <BuilderMain
          steps={steps}
          setSteps={actions.setSteps}
          activeStep={activeStep}
          selectedHardware={selectedHardware}
          learnings={learnings}
          setLearnings={actions.setLearnings}
        />
      </Box>

      {/* 💾 Save Dialog */}
      <SaveStatusDialog
        savingState={savingState}
        onClose={() => setSavingState("idle")}
        savedTutorialId={savedTutorialId}
        history={history}
      />
    </Box>
  );
};

BuilderPage.propTypes = {
  existingTutorial: PropTypes.object,
};

export default BuilderPage;
