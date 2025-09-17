import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { getTutorials } from "../../actions/tutorialActions";
import Breadcrumbs from "../ui/Breadcrumbs";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import * as Blockly from "blockly";
import DeviceSelection from "../DeviceSelection";
import TutorialItem from "./TutorialItem";
import {
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

function getDifficultyLevel(value) {
  if (value <= 1) return 1;
  if (value <= 2) return 2;
  if (value <= 3) return 3;
  if (value <= 4) return 4;
  return 5;
}

function getDifficultyLabel(level) {
  switch (level) {
    case 1:
      return "Sehr leicht";
    case 2:
      return "Leicht";
    case 3:
      return "Mittel";
    case 4:
      return "Schwer";
    case 5:
      return "Sehr schwer";
    default:
      return "Unbekannt";
  }
}

function TutorialHome() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { tutorials, user } = useSelector((state) => ({
    tutorials: state.tutorial.tutorials,
    user: state.auth.user,
  }));

  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState(""); // "" = alle Stufen

  useEffect(() => {
    dispatch(getTutorials());
  }, [dispatch]);

  // Tutorials nach Suchbegriff & Schwierigkeit filtern
  const filteredTutorials = useMemo(() => {
    let result = tutorials;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title?.toLowerCase().includes(query) ||
          t.creator?.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query),
      );
    }

    if (difficulty) {
      result = result.filter(
        (t) => getDifficultyLevel(t.difficulty) === difficulty,
      );
    }

    return result;
  }, [tutorials, searchQuery, difficulty]);

  return (
    <div>
      <Breadcrumbs content={[{ link: "/tutorial", title: "Tutorial" }]} />
      <h1>{Blockly.Msg.tutorials_home_head}</h1>

      {/* Suche + Schwierigkeit Filter */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 3,
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          label={Blockly.Msg.searchQuery_placeholder || "Tutorials suchen"}
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: "1 1 60%" }}
        />

        <FormControl sx={{ flex: "1 1 30%", minWidth: 150 }}>
          <InputLabel id="difficulty-label">Schwierigkeit</InputLabel>
          <Select
            labelId="difficulty-label"
            value={difficulty}
            label="Schwierigkeit"
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <MenuItem value="">Alle</MenuItem>
            <MenuItem value={1}>Stufe 1 (Sehr leicht)</MenuItem>
            <MenuItem value={2}>Stufe 2 (Leicht)</MenuItem>
            <MenuItem value={3}>Stufe 3 (Mittel)</MenuItem>
            <MenuItem value={4}>Stufe 4 (Schwer)</MenuItem>
            <MenuItem value={5}>Stufe 5 (Sehr schwer)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <h2>Alle Tutorials</h2>
      <Grid container spacing={2}>
        {filteredTutorials.length > 0 ? (
          filteredTutorials.map((tutorial) => (
            <TutorialItem key={tutorial._id} tutorial={tutorial} />
          ))
        ) : (
          <Typography variant="body1" sx={{ ml: 2 }}>
            Keine Tutorials gefunden.
          </Typography>
        )}
      </Grid>

      {user && (
        <div>
          <h2>User Tutorials</h2>
          <Grid container spacing={2}>
            {/* Falls auch gefiltert werden soll: userTutorials hier einbauen */}
          </Grid>
        </div>
      )}

      <DeviceSelection />
    </div>
  );
}

TutorialHome.propTypes = {
  status: PropTypes.array,
  tutorials: PropTypes.array,
  isLoading: PropTypes.bool,
  message: PropTypes.object,
  user: PropTypes.object,
  authProgress: PropTypes.bool,
};

export default TutorialHome;
