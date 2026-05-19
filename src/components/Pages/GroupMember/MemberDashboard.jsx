import { useEffect, useState } from "react";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  useTheme,
  Avatar,
  Button,
  CircularProgress,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DoorBack } from "@mui/icons-material";
import axios from "axios";

function getDifficultyLabel(value) {
  if (value <= 1) return "Sehr leicht";
  if (value <= 2) return "Leicht";
  if (value <= 3) return "Mittel";
  if (value <= 4) return "Schwer";
  return "Sehr schwer";
}

export default function MemberDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { groupId, memberId } = useParams();

  const [group, setGroup] = useState(null);
  const [memberDisplayName, setMemberDisplayName] = useState("Mitglied");
  const [startedTutorial, setStartedTutorial] = useState(null);
  const [mySolutions, setMySolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fallbackThumbnail =
    "/cypress/screenshots/basic-page.cy.js/BlocklyThumbnailSolution.png";

  const getNameFromPayload = (payload) =>
    payload?.memberName ||
    payload?.name ||
    payload?.member?.name ||
    payload?.member?.nickname ||
    payload?.groupMember?.name ||
    payload?.groupMember?.nickname ||
    null;

  const activeTab = location.pathname.includes("/member/solutions")
    ? 2
    : location.pathname.includes("/member/tutorials")
      ? 1
      : 0;

  useEffect(() => {
    localStorage.setItem("lastGroupId", groupId);
    localStorage.setItem("lastMemberId", memberId);
  }, [groupId, memberId]);

  useEffect(() => {
    if (!memberId) {
      setError("Kein Mitglied angemeldet.");
      setLoading(false);
      return;
    }
    axios
      .get(
        `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/member/dashboard/${memberId}`,
        { params: { memberId, groupId } },
      )
      .then((response) => {
        console.log("Dashboard data:", response.data);
        setGroup(response.data);
        const payloadName = getNameFromPayload(response.data);
        if (payloadName) {
          setMemberDisplayName(payloadName);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen des Dashboards:", err);
        setError("Fehler beim Abrufen des Dashboards.");
        setLoading(false);
      });
  }, [groupId, memberId]);

  useEffect(() => {
    if (!groupId || !memberId) return;

    axios
      .get(`${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/member/getAll`)
      .then((response) => {
        const members = response.data?.members || [];
        const currentMember = members.find(
          (member) =>
            (member?._id?.toString?.() || member?.id?.toString?.()) ===
            memberId,
        );
        const resolvedName = currentMember?.name || currentMember?.nickname;
        if (resolvedName) {
          setMemberDisplayName(resolvedName);
        }
      })
      .catch(() => {
        // Keep existing fallback name if member lookup fails.
      });
  }, [groupId, memberId]);

  useEffect(() => {
    if (!groupId || !memberId) return;

    const fetchStartedTutorial = async () => {
      try {
        const progressResponse = await axios.get(
          `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/progress/getTutorialProgress/${memberId}`,
        );

        const progress =
          progressResponse.data?.progress ||
          progressResponse.data?.tutorialProgress ||
          progressResponse.data ||
          null;

        const tutorialId = progress?.tutorialId?._id || progress?.tutorialId;
        const tutorialTitle = progress?.tutorialTitle;

        if (!tutorialId && !tutorialTitle) {
          setStartedTutorial(null);
          return;
        }

        const tutorialsResponse = await axios.get(
          `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/tutorial/getAllTutorials`,
        );
        const tutorials = tutorialsResponse.data?.tutorials || [];

        const matchedTutorial = tutorials.find((tutorial) => {
          const matchesId = tutorialId
            ? tutorial?._id?.toString?.() === tutorialId?.toString?.()
            : false;
          const matchesTitle = tutorialTitle
            ? tutorial?.title === tutorialTitle
            : false;
          return matchesId || matchesTitle;
        });

        if (matchedTutorial) {
          setStartedTutorial(matchedTutorial);
          return;
        }

        setStartedTutorial({
          _id: tutorialId || tutorialTitle,
          title: tutorialTitle || "Unbekanntes Tutorial",
          description: "",
          difficulty: 3,
        });
      } catch {
        setStartedTutorial(null);
      }
    };

    fetchStartedTutorial();
  }, [groupId, memberId]);

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

  const fetchSolutionDetail = async (solutionId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/solutions/getSolution/${solutionId}`,
      );
      return response.data?.solution || null;
    } catch {
      return null;
    }
  };

  const handleOpenInBlockly = async (solution) => {
    let xml = solution?.blocklyXml || solution?.xml;

    if (!xml && solution?._id) {
      const detail = await fetchSolutionDetail(solution._id);
      xml = detail?.blocklyXml || detail?.xml;
    }

    if (!xml) {
      console.warn("Kein XML für diese Lösung vorhanden:", solution?._id);
      return;
    }

    localStorage.setItem("autoSaveXML", xml);
    navigate("/");
  };

  useEffect(() => {
    if (!groupId || !memberId) return;

    const fetchMySolutions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/solutions/getAllSolutions`,
        );
        const list = response.data?.solutions || [];

        const detailed = await Promise.all(
          list.map(async (solution) => {
            const detail = await fetchSolutionDetail(solution._id);
            return detail || solution;
          }),
        );

        const ownSolutions = detailed.filter((solution) => {
          const userIdValue =
            solution?.userId?._id ||
            solution?.userId ||
            solution?.groupMember?._id ||
            solution?.groupMember ||
            solution?.memberId ||
            solution?.groupMemberId;
          return userIdValue?.toString?.() === memberId;
        });

        setMySolutions(ownSolutions);
      } catch (err) {
        if (err.response?.status === 404) {
          setMySolutions([]);
          return;
        }
        console.error("Fehler beim Laden der eigenen Lösungen:", err);
      }
    };

    fetchMySolutions();
  }, [groupId, memberId]);

  const handleLeaveGroup = () => {
    axios
      .put(
        `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/member/leave`,
        {
          groupId,
          memberId,
        },
      )
      .then(() => navigate("/joinGroup"))
      .catch((err) => console.error("Fehler beim Verlassen der Gruppe:", err));
  };

  const displayName = memberDisplayName || "Mitglied";

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
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={activeTab}>
          <Tab label="Dashboard" />
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

      {!loading && !error && group && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar sx={{ width: 56, height: 56 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {displayName}
              </Typography>
            </Box>
          </Box>

          <Button
            startIcon={<DoorBack />}
            onClick={handleLeaveGroup}
            sx={{
              color: theme.palette.primary.main,
              alignSelf: "flex-start",
              mb: 3,
            }}
          >
            Gruppe verlassen
          </Button>

          <Typography variant="h6" sx={{ mb: 1 }}>
            Angefangende Tutorials
          </Typography>
          {startedTutorial ? (
            <Card
              variant="outlined"
              sx={{ mb: 3, maxWidth: { xs: "100%", sm: 420 } }}
            >
              <CardActionArea
                onClick={() =>
                  navigate(`/tutorial/${startedTutorial._id}`, {
                    state: {
                      fromGroupTutorial: true,
                      groupId,
                      memberId,
                      tutorialId: startedTutorial._id,
                    },
                  })
                }
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
                      {startedTutorial.title}
                    </Typography>
                  </Box>
                  {typeof startedTutorial.difficulty === "number" && (
                    <Chip
                      label={getDifficultyLabel(startedTutorial.difficulty)}
                      size="small"
                      sx={{
                        mt: 1,
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                      }}
                    />
                  )}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                    noWrap
                  >
                    {startedTutorial.description ||
                      "Dieses Tutorial ist aktuell in Bearbeitung."}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Aktuell kein angefangenes Tutorial.
            </Typography>
          )}

          <Typography variant="h6" sx={{ mb: 1 }}>
            Meine Lösungen
          </Typography>
          {mySolutions.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Noch keine Lösungen abgegeben.
            </Typography>
          ) : (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {mySolutions.map((solution) => {
                const tutorialTitle =
                  solution.tutorialTitle ||
                  solution.tutorialId?.title ||
                  solution.tutorialId?.toString?.() ||
                  solution.tutorialId ||
                  "Unbekannt";

                const thumbnailUrl =
                  solution.thumbnail ||
                  solution.screenshotUrl ||
                  solution.thumbnailXml ||
                  solution.xmlThumbnail ||
                  (typeof solution.blocklyXml === "string" &&
                  solution.blocklyXml.startsWith("data:image")
                    ? solution.blocklyXml
                    : fallbackThumbnail);
                const hasCustomThumbnail = Boolean(
                  solution.thumbnail ||
                  solution.screenshotUrl ||
                  solution.thumbnailXml ||
                  solution.xmlThumbnail ||
                  (typeof solution.blocklyXml === "string" &&
                    solution.blocklyXml.startsWith("data:image")),
                );

                return (
                  <Grid item xs={12} sm={6} md={4} key={solution._id}>
                    <Box
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: "16px",
                        overflow: "hidden",
                        backgroundColor: theme.palette.background.paper,
                        transition: "box-shadow 0.2s ease",
                        "&:hover": {
                          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "16 / 9",
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? theme.palette.grey[800]
                              : theme.palette.grey[100],
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          component="img"
                          src={thumbnailUrl}
                          alt={`Lösung: ${tutorialTitle}`}
                          sx={{
                            width: "70%",
                            height: "70%",
                            objectFit: "contain",
                            borderRadius: "10px",
                            border: `1px solid ${theme.palette.divider}`,
                            backgroundColor: "white",
                          }}
                        />
                        {!hasCustomThumbnail && (
                          <Box
                            sx={{
                              position: "absolute",
                              right: 8,
                              top: 8,
                              px: 1,
                              py: 0.25,
                              borderRadius: 1,
                              backgroundColor: "rgba(0,0,0,0.6)",
                              color: "white",
                              fontSize: "0.72rem",
                              fontWeight: 600,
                            }}
                          >
                            Standard Thumbnail
                          </Box>
                        )}
                      </Box>

                      <Box
                        sx={{
                          px: 2,
                          py: 1.5,
                          textAlign: "center",
                          borderTop: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Typography variant="body1" fontWeight={500} noWrap>
                          {displayName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          title={tutorialTitle}
                        >
                          {tutorialTitle}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {solution.publishedAt
                            ? `Eingereicht: ${new Date(solution.publishedAt).toLocaleDateString("de-DE")}`
                            : "Eingereicht: -"}
                        </Typography>

                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() => handleOpenInBlockly(solution)}
                        >
                          In Blockly öffnen
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}
