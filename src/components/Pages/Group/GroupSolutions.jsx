import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function GroupSolutions() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { groupId } = useParams();
  const [solutions, setSolutions] = useState([]);
  const [memberNamesById, setMemberNamesById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeTab = location.pathname.includes("/tutorials")
    ? 1
    : location.pathname.includes("/solutions")
      ? 2
      : 0;

  const fallbackThumbnail =
    "/cypress/screenshots/basic-page.cy.js/BlocklyThumbnailSolution.png";

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

  const resolveMemberName = (solution) => {
    const user = solution?.userId;

    if (user && typeof user === "object") {
      if (user.name || user.nickname) {
        return user.name || user.nickname;
      }
      const normalizedId = user._id?.toString?.() || user.toString?.();
      return memberNamesById[normalizedId] || "Unbekannt";
    }

    return memberNamesById[user?.toString?.() || user] || "Unbekannt";
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/member/getAll`)
      .then((response) => {
        const members = response.data?.members || [];
        const map = members.reduce((acc, member) => {
          acc[member._id] = member.name || member.nickname || "Unbekannt";
          return acc;
        }, {});
        setMemberNamesById(map);
      })
      .catch(() => {
        setMemberNamesById({});
      });
  }, [groupId]);

  useEffect(() => {
    const fetchSolutions = async () => {
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

        setSolutions(detailed);
        setLoading(false);
      } catch (err) {
        console.error("Fehler beim Abrufen der Lösungen:", err);
        if (err.response?.status === 404) {
          setSolutions([]);
        } else {
          setError("Fehler beim Laden der Lösungen.");
        }
        setLoading(false);
      }
    };

    fetchSolutions();
  }, [groupId]);

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
          <Typography variant="h6" sx={{ mb: 2 }}>
            Gruppen Lösungen
          </Typography>

          {solutions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Noch keine Lösungen vorhanden.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {solutions.map((solution) => {
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
                      {/* Vorschau-Bereich */}
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
                          alt={`Lösung von ${resolveMemberName(solution)}`}
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

                      {/* Text-Bereich */}
                      <Box
                        sx={{
                          px: 2,
                          py: 1.5,
                          textAlign: "center",
                          borderTop: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Typography variant="body1" fontWeight={500} noWrap>
                          {resolveMemberName(solution)}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          title={tutorialTitle}
                        >
                          {tutorialTitle}
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
