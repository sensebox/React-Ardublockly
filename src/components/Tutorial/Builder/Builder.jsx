import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  checkError,
  readJSON,
  jsonString,
  progress,
  tutorialId,
  resetTutorial as resetTutorialBuilder,
} from "../../../actions/tutorialBuilderActions";
import {
  getAllTutorials,
  getUserTutorials,
  resetTutorial,
  deleteTutorial,
  tutorialProgress,
} from "../../../actions/tutorialActions";
import { clearMessages } from "../../../actions/messageActions";

import axios from "axios";
import { useHistory } from "react-router-dom";

import { useTheme, Box } from "@mui/material";
import TutorialBuilderProgressCard from "./TutorialBuilderProgessCard";
import BuildSlide from "./BuildSlide";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const Builder = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();

  // Redux state
  const {
    title,
    difficulty,
    review,
    public: isPublic,
    id,
    steps,
    progress: isProgress,
    tutorials,
    message,
  } = useSelector((state) => ({
    title: state.builder.title,
    difficulty: state.builder.difficulty,
    review: state.builder.review,
    public: state.builder.public,
    id: state.builder.id,
    steps: state.builder.steps,
    error: state.builder.error,
    json: state.builder.json,
    progress: state.builder.progress,
    tutorials: state.tutorial.tutorials,
    message: state.message,
  }));

  // Local state
  const [dialog, setDialog] = useState({
    open: false,
    string: false,
    title: "",
    content: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    key: "",
    message: "",
    type: "",
  });

  useEffect(() => {
    return () => {
      resetFull();
      dispatch(resetTutorial());
      if (message.msg) dispatch(clearMessages());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetFull = () => {
    dispatch(resetTutorialBuilder());
    setSnackbar({
      open: true,
      key: Date.now(),
      message: "Das Tutorial wurde erfolgreich zurückgesetzt.",
      type: "success",
    });
    window.scrollTo(0, 0);
  };

  const submit = () => {
    if (dispatch(checkError())) {
      setSnackbar({
        open: true,
        key: Date.now(),
        message: "Die Angaben sind nicht vollständig.",
        type: "error",
      });
      window.scrollTo(0, 0);
      return null;
    }
    const newTutorial = new FormData();
    newTutorial.append("title", title);
    newTutorial.append("difficulty", difficulty);
    newTutorial.append("public", isPublic);
    newTutorial.append("review", review);
    steps.forEach((step, i) => {
      if (step._id) newTutorial.append(`steps[${i}][_id]`, step._id);
      newTutorial.append(`steps[${i}][type]`, step.type);
      newTutorial.append(`steps[${i}][headline]`, step.headline);
      newTutorial.append(`steps[${i}][text]`, step.text);
      if (i === 0 && step.type === "instruction") {
        step.requirements?.forEach((req, j) =>
          newTutorial.append(`steps[${i}][requirements][${j}]`, req),
        );
        step.hardware?.forEach((hw, j) =>
          newTutorial.append(`steps[${i}][hardware][${j}]`, hw),
        );
      }
      if (step.xml) newTutorial.append(`steps[${i}][xml]`, step.xml);
    });
    return newTutorial;
  };

  const submitNew = () => {
    const form = submit();
    if (!form) return;
    axios
      .post(`${import.meta.env.VITE_BLOCKLY_API}/tutorial/`, form)
      .then((res) => {
        history.push(`/tutorial/${res.data.tutorial._id}`);
      })
      .catch(() =>
        setSnackbar({
          open: true,
          key: Date.now(),
          message: "Fehler beim Erstellen.",
          type: "error",
        }),
      );
  };

  const submitUpdate = () => {
    const form = submit();
    if (!form) return;
    axios
      .put(`${import.meta.env.VITE_BLOCKLY_API}/tutorial/${id}`, form)
      .then((res) => {
        history.push(`/tutorial/${res.data.tutorial._id}`);
      })
      .catch(() =>
        setSnackbar({
          open: true,
          key: Date.now(),
          message: "Fehler beim Ändern.",
          type: "error",
        }),
      );
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
          width: "100%",
          p: 2,
          gap: 4,
          justifyContent: "center",
        }}
      >
        {/* ProgressCard links - 20% */}
        <Box sx={{ flex: "0 0 20%" }}>
          <TutorialBuilderProgressCard />
        </Box>

        {/* Animierter Bereich rechts - 75% */}
        <Box
          sx={{
            flex: "0 0 60%",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BuildSlide />
        </Box>
      </Box>
      <Box></Box>
    </Box>
  );
};

Builder.propTypes = {
  title: PropTypes.string,
  difficulty: PropTypes.number,
  review: PropTypes.bool,
  public: PropTypes.bool,
  id: PropTypes.string,
  steps: PropTypes.array,
  error: PropTypes.object,
  json: PropTypes.string,
  isProgress: PropTypes.bool,
  tutorials: PropTypes.array,
  message: PropTypes.object,
};

export default Builder;
