import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Chip,
  Divider,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTutorials } from "../../../actions/tutorialActions";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

function getDifficultyLabel(value) {
  if (value <= 1) return "Sehr leicht";
  if (value <= 2) return "Leicht";
  if (value <= 3) return "Mittel";
  if (value <= 4) return "Schwer";
  return "Sehr schwer";
}

export default function GroupTutorials() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { groupId } = useParams();

  const allTutorials = useSelector((state) => state.tutorial.tutorials);

  const [groupTutorials, setGroupTutorials] = useState([]);
  const [groupLoading, setGroupLoading] = useState(true);
  const [error, setError] = useState(null);

  const loading = groupLoading;

  const activeTab = location.pathname.includes("/tutorials")
    ? 1
    : location.pathname.includes("/solutions")
      ? 2
      : 0;

  useEffect(() => {
    dispatch(getTutorials());
  }, [dispatch]);

  useEffect(() => {
    console.log(
      "All tutorials from Redux:",
      allTutorials.map((t) => t._id),
    );
  }, [allTutorials]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/tutorial/getAllTutorials`,
      )
      .then((response) => {
        const tutorials = response.data?.tutorials || [];
        setGroupTutorials(tutorials);
        setGroupLoading(false);
        console.log(
          "Group tutorials fetched:",
          tutorials.map((t) => t._id || t.tutorialId),
        );
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen der Gruppen-Tutorials:", err);
        setError("Fehler beim Laden der Tutorials.");
        setGroupLoading(false);
      });
  }, [groupId]);

  const groupTutorialIds = useMemo(
    () => groupTutorials.map((t) => t._id || t.tutorialId),
    [groupTutorials],
  );

  const availableTutorials = useMemo(
    () =>
      allTutorials.filter(
        (t) => t.review && t.public && !groupTutorialIds.includes(t._id),
      ),
    [allTutorials, groupTutorialIds],
  );

  const addToGroup = (tutorialId) => {
    axios
      .post(
        `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/tutorial/${tutorialId}/postTutorial`,
        { tutorialId },
      )
      .then(() => {
        const tutorial = allTutorials.find((t) => t._id === tutorialId);
        if (tutorial) setGroupTutorials((prev) => [...prev, tutorial]);
        console.log("Tutorial hinzugefügt:", tutorialId);
      })
      .catch((err) => console.error("Fehler beim Hinzufügen:", err));
  };

  const removeFromGroup = (tutorialId) => {
    axios
      .delete(
        `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/tutorial/${tutorialId}/removeGroupTutorial`,
      )
      .then(() => {
        setGroupTutorials((prev) =>
          prev.filter((t) => (t._id || t.tutorialId) !== tutorialId),
        );
        console.log("Tutorial entfernt:", tutorialId);
      })
      .catch((err) => console.error("Fehler beim Entfernen:", err));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "85vh",
        backgroundColor: theme.palette.background.default,
        padding: "20px",
      }}
    >
      {/* Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Tabs value={activeTab}>
          <Tab
            label="Schüler*innen"
            onClick={() => navigate(`/group/${groupId}`)}
          />
          <Tab
            label="Tutorials"
            onClick={() => navigate(`/groups/${groupId}/tutorials`)}
          />
          <Tab
            label="Lösungsgallerie"
            onClick={() => navigate(`/groups/${groupId}/solutions`)}
          />
        </Tabs>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Gruppen-Tutorials
          </Typography>
          {groupTutorials.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Noch keine Tutorials zur Gruppe hinzugefügt.
            </Typography>
          ) : (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {groupTutorials.map((tutorial) => (
                <Grid item xs={12} sm={6} md={4} key={tutorial._id}>
                  <Card variant="outlined">
                    <CardActionArea
                      onClick={() => removeFromGroup(tutorial._id)}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight={600}>
                            {tutorial.title}
                          </Typography>
                          <RemoveCircleOutlineIcon color="error" />
                        </Box>
                        <Chip
                          label={getDifficultyLabel(tutorial.difficulty)}
                          size="small"
                          sx={{
                            mt: 1,
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                          noWrap
                        >
                          {tutorial.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" sx={{ mb: 1 }}>
            Verfügbare Tutorials
          </Typography>
          {availableTutorials.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Alle Tutorials wurden bereits zur Gruppe hinzugefügt.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {availableTutorials.map((tutorial) => (
                <Grid item xs={12} sm={6} md={4} key={tutorial._id}>
                  <Card variant="outlined">
                    <CardActionArea onClick={() => addToGroup(tutorial._id)}>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight={600}>
                            {tutorial.title}
                          </Typography>
                          <AddCircleOutlineIcon color="success" />
                        </Box>
                        <Chip
                          label={getDifficultyLabel(tutorial.difficulty)}
                          size="small"
                          sx={{
                            mt: 1,
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                          noWrap
                        >
                          {tutorial.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}
