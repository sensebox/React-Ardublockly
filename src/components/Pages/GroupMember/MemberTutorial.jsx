import { useEffect, useState } from "react";
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
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

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
  const { groupId, memberId } = useParams();

  const [groupTutorials, setGroupTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeTab = location.pathname.includes("/member/solutions")
    ? 2
    : location.pathname.includes("/member/tutorials")
      ? 1
      : 0;

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/tutorial/getAllTutorials`,
      )
      .then((response) => {
        const tutorials = response.data?.tutorials || [];
        setGroupTutorials(tutorials);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen der Gruppen-Tutorials:", err);
        setError("Fehler beim Laden der Tutorials.");
        setLoading(false);
      });
  }, [groupId]);

  useEffect(() => {
    if (!memberId || !groupId) return;

    const sendHeartbeat = () => {
      axios
        .post(
          `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/member/heartbeat/${memberId}`,
          {
            groupMember: memberId,
            groupId,
          },
        )
        .catch((err) => console.error("Heartbeat fehlgeschlagen:", err));
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 15000);
    return () => clearInterval(interval);
  }, [groupId, memberId]);

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
            label="Dashboard"
            onClick={() =>
              navigate(`/group/${groupId}/member/dashboard/${memberId}`)
            }
          />
          <Tab
            label="Tutorials"
            onClick={() =>
              navigate(`/group/${groupId}/member/tutorials/${memberId}`)
            }
          />
          <Tab
            label="Lösungsgallerie"
            onClick={() =>
              navigate(`/group/${groupId}/member/solutions/${memberId}`)
            }
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
                      onClick={() => {
                        localStorage.setItem("lastTutorialId", tutorial._id);
                        localStorage.setItem(
                          "lastTutorialTitle",
                          tutorial.title,
                        );
                        axios
                          .post(
                            `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/progress/postTutorialProgress/${memberId}`,
                            {
                              tutorialId: tutorial._id,
                              tutorialTitle: tutorial.title,
                              currentStep: 1,
                              totalSteps: tutorial?.steps?.length ?? 0,
                            },
                          )
                          .then((response) => {
                            console.log("Tutorial progress updated:", {
                              tutorialId: tutorial._id,
                              tutorialTitle: tutorial.title,
                              currentStep: 1,
                              totalSteps: tutorial?.steps?.length ?? 0,
                            });
                          })
                          .catch((err) =>
                            console.error(
                              "Fortschritt konnte nicht gesendet werden:",
                              err,
                            ),
                          );
                        navigate(`/tutorial/${tutorial._id}`, {
                          state: {
                            fromGroupTutorial: true,
                            groupId,
                            memberId,
                            tutorialId: tutorial._id,
                          },
                        });
                      }}
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
