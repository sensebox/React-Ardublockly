import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function MemberSolution() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { groupId, memberId } = useParams();

  const [solutions, setSolutions] = useState([]);
  const [memberNamesById, setMemberNamesById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fallbackThumbnail =
    "/cypress/screenshots/basic-page.cy.js/BlocklyThumbnailSolution.png";

  const activeTab = location.pathname.includes("/member/solutions")
    ? 2
    : location.pathname.includes("/member/tutorials")
      ? 1
      : 0;

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
        console.log("Solutions data:", response.data);

        const detailed = await Promise.all(
          list.map(async (solution) => {
            const detail = await fetchSolutionDetail(solution._id);
            return detail || solution;
          }),
        );

        setSolutions(detailed);
        setLoading(false);
      } catch (err) {
        console.log("Solutions fetch status:", err.response?.status);
        console.log("Solutions fetch error:", err.response?.data);
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
            Gruppenlösungen
          </Typography>
          {solutions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Noch keine Gruppenlösungen vorhanden.
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
