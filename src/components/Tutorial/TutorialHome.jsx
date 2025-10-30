import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { getTutorials } from "../../actions/tutorialActions";
import Breadcrumbs from "../ui/Breadcrumbs";
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
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  Button,
  IconButton,
} from "@mui/material";
import { faPencil, faPlus, faTools } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function getDifficultyLevel(value) {
  if (value <= 1) return 1;
  if (value <= 2) return 2;
  if (value <= 3) return 3;
  if (value <= 4) return 4;
  return 5;
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
        <Box sx={{ flex: "0 1 65%" }}>
          <TextField
            fullWidth
            label={Blockly.Msg.searchQuery_placeholder || "Tutorials suchen"}
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
        <Box
          sx={{
            flex: "0 1 20%",
            display: "flex",
            alignItems: "center",
            padding: "4px",
          }}
        >
          <ToggleButtonGroup
            value={difficulty}
            exclusive
            onChange={(e, newValue) => setDifficulty(newValue)}
            size="small"
            sx={{
              justifyContent: "space-between",
              gap: 2,
              "& .MuiToggleButton-root": {
                border: "1px solid #c4c4c4 ",
                borderRadius: "5px",
              },
              "& .MuiToggleButton-root.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                fontWeight: 800,
                color: "#fff",
                "&:hover": {
                  backgroundColor: "darkgreen",
                },
              },
              "& .MuiToggleButton-root:hover": {
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                fontWeight: 800,
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
        {user && (
          <Box
            sx={{
              flex: "0 1 10%",
              display: "flex",
              alignItems: "center",
              p: 0.5,
            }}
          >
            <Link to="/tutorial/builder" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                startIcon={<FontAwesomeIcon icon={faPlus} />}
                sx={{
                  borderRadius: "5px",
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  px: 2,
                  py: 1,
                  fontSize: "0.9rem",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  },
                }}
              >
                Tutorial erstellen
              </Button>
            </Link>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <h2>Alle Tutorials</h2>
          <div>
            Damit Tutorials in dieser Gallerie angezeigt werden, müssen Sie von
            uns überprüft werden. Falls dein Tutorial hier erscheinen soll,
            stelle dein Tutorial auf öffentlich und schreibe uns an auf
            support@sensebox.de
          </div>

          <Grid container spacing={2}>
            {filteredTutorials.length > 0 ? (
              filteredTutorials.map(
                (tutorial) =>
                  tutorial.review &&
                  tutorial.public && (
                    <TutorialItem
                      key={tutorial._id}
                      tutorial={tutorial}
                      level={getDifficultyLevel(tutorial.difficulty)}
                    />
                  ),
              )
            ) : (
              <Typography variant="body1" sx={{ ml: 2 }}>
                Keine Tutorials gefunden.
              </Typography>
            )}
          </Grid>
        </Box>

        {user && (
          <div>
            <h2>Deine Tutorials</h2>
            <Grid container spacing={2}>
              {filteredTutorials.filter((t) => t.creator === user.email)
                .length > 0 ? (
                filteredTutorials
                  .filter((t) => t.creator === user.email)
                  .map((tutorial) => (
                    <TutorialItem
                      key={tutorial._id}
                      tutorial={tutorial}
                      level={getDifficultyLevel(tutorial.difficulty)}
                    />
                  ))
              ) : (
                <Typography variant="body1" sx={{ ml: 2 }}>
                  Du hast noch keine Tutorials erstellt.
                </Typography>
              )}
            </Grid>
          </div>
        )}
      </Box>

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
