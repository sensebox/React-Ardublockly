import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

import TutorialBuilderProgressCard from "./TutorialBuilderProgessCard";

/**
 * Linke Sidebar des Tutorial Builders
 * - Metadaten
 * - Steps
 * - Navigation
 * - Autosave Toggle
 * - Actions (Buttons via children)
 */
const BuilderSidebar = ({
  state,
  actions,
  activeStep,
  setActiveStep,
  autosaveEnabled,
  setAutosaveEnabled,
  children,
}) => {
  const {
    title,
    subtitle,
    steps,
    difficulty,
    selectedHardware,
    subjects,
    topics,
    duration,
    year,
  } = state;

  const {
    setTitle,
    setSubtitle,
    setSteps,
    setDifficulty,
    setSelectedHardware,
    setSubjects,
    setTopics,
    setDuration,
    setYear,
  } = actions;

  return (
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

      {/* Action Buttons */}
      {children}
    </Box>
  );
};

BuilderSidebar.propTypes = {
  state: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  activeStep: PropTypes.number.isRequired,
  setActiveStep: PropTypes.func.isRequired,
  autosaveEnabled: PropTypes.bool.isRequired,
  setAutosaveEnabled: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default BuilderSidebar;
