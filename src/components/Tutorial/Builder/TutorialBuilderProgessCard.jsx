import React, { act, useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  useTheme,
  IconButton,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import HardwareSelectorModal from "./AddNewHardware";
import {
  SaveOutlined,
  Save,
  Expand,
  ExpandCircleDown,
} from "@mui/icons-material";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Autocomplete } from "@mui/material";
const SUBJECTS = [
  "Informatik",
  "Physik",
  "Mathematik",
  "Biologie",
  "Chemie",
  "Technik",
  "Digitale Bildung",
  "Sonstiges",
];

const TOPICS = [
  "Algorithmen",
  "Datenstrukturen",
  "Sensoren",
  "Microcontroller",
  "KI / Machine Learning",
  "Robotik",
  "Webentwicklung",
  "Spieleentwicklung",
  "Datenvisualisierung",
  "Netzwerke",
  "Cybersecurity",
  "Nachhaltigkeit & Technik",
];

const TutorialBuilderProgressCard = ({
  title,
  setTitle,
  subtitle,
  setSubtitle,
  steps,
  setSteps,
  difficulty,
  setDifficulty,
  selectedHardware,
  setSelectedHardware,
  activeStep,
  setActiveStep,
  setAutosaveEnabled,
  autosaveEnabled,
  subjects,
  topics,
  setSubjects,
  setTopics,
  duration,
  setDuration,
  year,
  setYear,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const tutorialFromStore = useSelector((state) => state.tutorial.tutorials[0]);

  const [modalOpen, setModalOpen] = useState(false);
  const progress = ((activeStep + 1) / steps.length) * 100;

  const changeStep = (stepIndex) => {
    dispatch({ type: "TUTORIAL_STEP", payload: stepIndex });
  };
  const updateStep = (index, key, value) => {
    const updated = [...steps];
    updated[index][key] = value;
    setSteps(updated);
  };

  const addStep = () => {
    const newStep = {
      id: `step-${Date.now()}`,
      title: ``,
      subtitle: "",
      type: "task",
      xml: "",
    };

    const updatedSteps = [...steps];
    // Füge neuen Step direkt nach dem aktiven Step ein
    updatedSteps.splice(activeStep + 1, 0, newStep);

    setSteps(updatedSteps);
    setActiveStep(activeStep + 1); // optional: gleich zum neuen Step springen
  };

  const deleteStep = (index) => {
    const updated = [...steps];
    updated.splice(index, 1);
    setSteps(updated);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setActiveStep(result.destination.index);
    setSteps(items);

    // Wenn der verschobene Step aktiv war → neuen Index dispatchen
    if (activeStep === result.source.index) {
      dispatch({
        type: "TUTORIAL_STEP",
        payload: result.destination.index,
      });
    }
  };

  return (
    <Card
      sx={{ borderRadius: 3, boxShadow: 3, overflow: "scroll", height: "100%" }}
    >
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              variant="standard"
              id="tutorial-title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputProps={{
                sx: {
                  fontWeight: 600,
                  fontSize: "1.25rem", // entspricht Typography h6
                },
              }}
              placeholder="Tutorial Titel"
            />
            <IconButton
              onClick={() => setAutosaveEnabled(!autosaveEnabled)}
              size="small"
              color={autosaveEnabled ? "primary" : "default"}
              title={
                autosaveEnabled
                  ? "Zwischenspeichern aktiviert"
                  : "Zwischenspeichern deaktiviert"
              }
            >
              {autosaveEnabled ? <Save /> : <SaveOutlined />}
            </IconButton>
          </Box>
        }
        subheader={
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            {/* Kurzbeschreibung */}
            <TextField
              id="tutorial-subtitle"
              variant="standard"
              fullWidth
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Kurzbeschreibung eingeben…"
              InputProps={{
                sx: {
                  fontSize: "0.875rem", // entspricht body2
                  color: "text.secondary",
                },
              }}
            />
          </Box>
        }
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Accordion
          sx={{
            boxShadow: "none",
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<ExpandCircleDown />}>
            <Typography
              id={"accordion_builder_advanced"}
              sx={{ fontWeight: 600 }}
            >
              Erweitert
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            {/* 🔥 Schwierigkeitsgrad */}
            <Box sx={{ mb: 1.5 }}>
              <Typography
                sx={{ fontWeight: 600, fontSize: "0.875rem", mb: 0.5 }}
              >
                Schwierigkeitsgrad
              </Typography>
              <ToggleButtonGroup
                value={difficulty}
                exclusive
                onChange={(e, newValue) => newValue && setDifficulty(newValue)}
                sx={{
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 0.5,
                  "& .MuiToggleButton-root": {
                    border: "1px solid #c4c4c4",
                    borderRadius: "6px",
                    flex: "1 1 30%",
                    minWidth: "80px",
                    padding: "4px 8px",
                    fontSize: "0.75rem",
                  },
                  "& .MuiToggleButton-root.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    fontWeight: 700,
                    color: "#fff",
                    "&:hover": { backgroundColor: theme.palette.primary.dark },
                  },
                  "& .MuiToggleButton-root:hover": {
                    backgroundColor: theme.palette.primary.light,
                    color: "#fff",
                  },
                }}
              >
                <ToggleButton value={1}>Sehr leicht</ToggleButton>
                <ToggleButton value={2}>Leicht</ToggleButton>
                <ToggleButton value={3}>Mittel</ToggleButton>
                <ToggleButton value={4}>Schwer</ToggleButton>
                <ToggleButton value={5}>Sehr schwer</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* 🕒 Dauer */}
            <Box sx={{ mb: 1 }}>
              <Typography
                sx={{ fontWeight: 600, fontSize: "0.875rem", mb: 0.5 }}
              >
                Dauer (in Minuten)
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                inputProps={{ min: 1, step: 5 }}
                value={duration || ""}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="z. B. 45"
                variant="outlined"
                sx={{ fontSize: "0.875rem" }}
              />
            </Box>

            {/* 📚 Jahrgangsstufe */}
            <Box sx={{ mb: 1 }}>
              <Typography
                sx={{ fontWeight: 600, fontSize: "0.875rem", mb: 0.5 }}
              >
                Jahrgangsstufe
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={year || ""}
                onChange={(e) => setYear(e.target.value)}
                placeholder="z. B. 7–9"
                variant="outlined"
                sx={{ fontSize: "0.875rem" }}
              />
            </Box>

            {/* 📚 Fächer – Mehrfachauswahl */}
            <Box sx={{ mb: 1 }}>
              <Typography
                sx={{ fontWeight: 600, fontSize: "0.875rem", mb: 0.5 }}
              >
                Fächer
              </Typography>
              <Autocomplete
                multiple
                freeSolo
                options={SUBJECTS}
                value={subjects}
                onChange={(event, newValue) => {
                  setSubjects(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Fächer hinzufügen..."
                    variant="outlined"
                  />
                )}
                ChipProps={{
                  sx: {
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    fontWeight: 600,
                    "& .MuiChip-deleteIcon": {
                      color: "white",
                      "&:hover": {
                        color: "error.light",
                      },
                    },
                  },
                }}
                sx={{ fontSize: "0.875rem" }}
              />
            </Box>

            <Autocomplete
              multiple
              freeSolo
              options={TOPICS}
              value={topics}
              onChange={(event, newValue) => {
                setTopics(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Themen hinzufügen..."
                  variant="outlined"
                />
              )}
              ChipProps={{
                sx: {
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  fontWeight: 600,
                  "& .MuiChip-deleteIcon": {
                    color: "white",
                    "&:hover": {
                      color: "error.light",
                    },
                  },
                },
              }}
              sx={{ fontSize: "0.875rem" }}
            />

            {/* 🧱 Hardware Selection */}
            <Box sx={{ mt: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0.5,
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                  Benötigte Hardware
                </Typography>
                <HardwareSelectorModal
                  open={modalOpen}
                  onClose={() => setModalOpen(false)}
                  selectedHardware={selectedHardware}
                  onHardwareSelect={setSelectedHardware}
                />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        {/* Übersicht der ausgewählten Hardware */}
        {selectedHardware.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mt: 1,
            }}
          >
            {selectedHardware.map((hw) => (
              <Box
                key={hw}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1.5,
                  bgcolor: theme.palette.primary.main,
                  color: "white",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                }}
              >
                {hw}
              </Box>
            ))}
          </Box>
        )}

        {/* Steps mit Drag & Drop */}
        <Box sx={{ position: "relative" }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="steps">
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{
                    overflowY: "auto",
                    p: 1,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  {steps.map((step, index) => {
                    const isCurrent = index === activeStep;

                    return (
                      <Draggable
                        key={step._id || step.id}
                        draggableId={step._id || step.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps} // immer hier dran!
                            onClick={() => setActiveStep(index)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              border: "1px solid #e0e0e0", // ✅ dünner Rahmen
                              borderRadius: 2, // ✅ abgerundet
                              boxShadow: "0 2px 6px rgba(0,0,0,0.1)", // ✅ dezenter Shadow

                              gap: 2,
                              px: 2,
                              py: 1.5,
                              mb: 1,
                              borderRadius: 2,
                              bgcolor: isCurrent
                                ? theme.palette.primary.main
                                : snapshot.isDragging
                                  ? theme.palette.action.selected
                                  : "transparent",
                              color: isCurrent
                                ? theme.palette.primary.contrastText
                                : theme.palette.text.primary,
                              boxShadow: snapshot.isDragging
                                ? "0 4px 8px rgba(0,0,0,0.2)"
                                : "none",
                            }}
                          >
                            <RadioButtonUncheckedIcon
                              sx={{
                                color: isCurrent
                                  ? theme.palette.primary.contrastText
                                  : theme.palette.text.secondary,
                                flexShrink: 0,
                                cursor: "pointer",
                              }}
                            />

                            {/* Titel + Untertitel */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <TextField
                                value={step.title}
                                placeholder="Neuer Schritt"
                                onChange={(e) =>
                                  updateStep(index, "title", e.target.value)
                                }
                                variant="standard"
                                fullWidth
                                InputProps={{
                                  disableUnderline: true,
                                  style: {
                                    color: isCurrent
                                      ? theme.palette.primary.contrastText
                                      : theme.palette.text.primary,
                                    fontWeight: isCurrent ? 600 : 400,
                                  },
                                }}
                              />
                              <TextField
                                id="tutorial-subtitle"
                                value={step.subtitle}
                                placeholder="Beschreibung hinzufügen"
                                onChange={(e) =>
                                  updateStep(index, "subtitle", e.target.value)
                                }
                                variant="standard"
                                fullWidth
                                InputProps={{
                                  disableUnderline: true,
                                  style: {
                                    color: isCurrent
                                      ? theme.palette.primary.contrastText
                                      : theme.palette.text.secondary,
                                    fontSize: "0.8rem",
                                  },
                                }}
                              />
                            </Box>

                            {/* Trash Icon */}
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteStep(index);
                              }}
                              sx={{ color: theme.palette.error.main }}
                            >
                              <DeleteIcon />
                            </IconButton>

                            {/* Drag Handle Icon */}
                            <IconButton
                              size="small"
                              onClick={(e) => e.stopPropagation()}
                              {...provided.dragHandleProps} // ✅ DragHandle hier
                              sx={{
                                color:
                                  activeStep === index
                                    ? theme.palette.primary.contrastText
                                    : theme.palette.text.secondary,
                                cursor: "grab",
                              }}
                            >
                              <DragHandleIcon />
                            </IconButton>
                          </Box>
                        )}
                      </Draggable>
                    );
                  })}{" "}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>

          {/* Plus-Button sticky */}
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              background: "white",
              display: "flex",
              justifyContent: "center",
              p: 1,
              mt: 1,
              borderTop: "1px solid #eee",
            }}
          >
            <IconButton
              onClick={addStep}
              color="primary"
              sx={{
                border: `2px dashed ${theme.palette.primary.main}`,
                borderRadius: "50%",
                width: 40,
                height: 40,
              }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TutorialBuilderProgressCard;
