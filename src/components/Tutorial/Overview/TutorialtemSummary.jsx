import { Box, Typography, Tooltip } from "@mui/material";
import { useTheme } from "@mui/styles";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
// /Users/eric/Documents/arbeit/React-Ardublockly/src/components/Tutorial/TutorialOverview.jsx
/**
 * TutorialOverview
 * - reads tutorial data and global variables (e.g. theme) from the store
 * - triggers a load request if no tutorial is present
 *
 * Note: this component dispatches a generic action type 'tutorial/loadRequest'.
 * Adjust the action type or import an action creator if your app uses a different convention.
 */
export const TutorialItemSummary = ({ tutorial }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  // example of reading a global variable like theme from the store
  const theme = useTheme();

  if (!tutorial) return;
  return (
    <Box
      sx={{
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: "5px",
        backgroundColor: "#f5f5f5",
        p: 2,
        bgcolor: "white",
        position: "relative", // 🔑 wichtig für das absolute Tag
        height: "100%",
      }}
    >
      {/* 🟢 Grünes Tag oben links */}
      <Box
        sx={{
          position: "absolute",
          top: -8,
          left: 8,
          backgroundColor: theme.palette.primary.main, // Grün
          color: "white",
          fontWeight: 600,
          fontSize: "1rem",
          padding: "4px 8px",
          borderRadius: "4px 4px 0 0", // nur unten abgerundet
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 1, // sicherstellen, dass es über dem Rand liegt
        }}
      >
        {Array.isArray(tutorial.subjects) && tutorial.subjects.length > 0
          ? tutorial.subjects.map((s) => s || "Thema").join(", ")
          : "Thema"}
      </Box>

      {/* Titel */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
          textAlign: "center",
          p: 1, // etwas Abstand zum Tag
          minHeight: "80px",
        }}
      >
        {tutorial.title}
      </Typography>

      {/* Info-Liste */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          fontSize: "0.875rem",
          mt: 1, // Abstand nach Titel
        }}
      >
        {/* Jahrgangsstufe */}
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          <Typography
            component="span"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              mr: 0.5,
              minWidth: "100px",
            }}
          >
            Jahrgangsstufe:
          </Typography>
          <Typography component="span">{tutorial.year || "—"}</Typography>
        </Box>

        {/* Fach */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            component="span"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              mr: 0.5,
              minWidth: "100px",
            }}
          >
            Fach:
          </Typography>

          {Array.isArray(tutorial.subjects) && tutorial.subjects.length > 0 ? (
            tutorial.subjects.map((subject, i) => {
              // Dateiname vorbereiten: z. B. "Informatik" → "informatik.svg"
              const iconFile =
                subject.toLowerCase().replace(/ /g, "_") + ".svg";
              return (
                <Tooltip key={i} title={subject} arrow>
                  <Box
                    component="img"
                    src={`/media/tutorial/icons/${iconFile}`}
                    alt={subject}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      cursor: "help",
                      transition: "transform 0.2s ease",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  />
                </Tooltip>
              );
            })
          ) : (
            <Typography component="span">—</Typography>
          )}
        </Box>

        {/* Dauer */}
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          <Typography
            component="span"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              mr: 0.5,
              minWidth: "100px",
            }}
          >
            Dauer:
          </Typography>
          <Typography component="span">
            {tutorial.duration ? `${tutorial.duration} Minuten` : "—"}
          </Typography>
        </Box>

        {/* Themenbereiche */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            component="span"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              mr: 0.5,
              minWidth: "100px",
            }}
          >
            Themenbereiche:
          </Typography>

          {Array.isArray(tutorial.topics) && tutorial.topics.length > 0 ? (
            tutorial.topics.map((topic, i) => {
              // Dateiname vorbereiten: z. B. "KI / Machine Learning" → "ki_machine_learning.svg"
              const iconFile =
                topic
                  .toLowerCase()
                  .replace(/\//g, "")
                  .replace(/&/g, "")
                  .replace(/ +/g, "_")
                  .replace(/ä/g, "ae")
                  .replace(/ö/g, "oe")
                  .replace(/ü/g, "ue")
                  .replace(/ß/g, "ss") + ".svg";

              return (
                <Tooltip key={i} title={topic} arrow>
                  <Box
                    component="img"
                    src={`/media/tutorial/icons/${iconFile}`}
                    alt={topic}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      cursor: "help",
                      transition: "transform 0.2s ease",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  />
                </Tooltip>
              );
            })
          ) : (
            <Typography component="span">—</Typography>
          )}
        </Box>

        {/* Technische Kompetenzen (optional) */}
        {tutorial.technicalSkills && (
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Typography
              component="span"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                mr: 0.5,
                minWidth: "100px",
              }}
            >
              technische Kompetenzen (u.a.):
            </Typography>
            <Typography component="span">{tutorial.technicalSkills}</Typography>
          </Box>
        )}

        {/* Kurzbeschreibung (Subtitle) */}
        {tutorial.subtitle && (
          <Box
            sx={{
              mt: 1.5,
              p: 1.5,
              bgcolor: "grey.100",
              borderRadius: 1.5,
              borderLeft: `3px solid ${theme.palette.primary.main}`,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontStyle: "italic",
                color: "text.secondary",
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              {tutorial.subtitle}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default TutorialItemSummary;
