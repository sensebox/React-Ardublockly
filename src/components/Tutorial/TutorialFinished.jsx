import React from "react";
import Confetti from "react-confetti";
import { Box, CardContent, Typography, Button, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import { ArrowForward, Celebration } from "@mui/icons-material";
import TutorialSlide from "./TutorialItem/TutorialSlide";
import MarkdownIt from "markdown-it";
const md = new MarkdownIt();

// Image-Renderer anpassen
const defaultImageRenderer =
  md.renderer.rules.image ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.image = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  token.attrs = token.attrs || [];
  token.attrs = token.attrs.filter(
    ([name]) => name !== "width" && name !== "height" && name !== "style",
  );
  token.attrs.push([
    "style",
    "max-width:250px; height:auto; display:block; margin:auto;",
  ]);
  const imgHtml = defaultImageRenderer(tokens, idx, options, env, self);
  return `
    <div style="text-align:center;">
      <div style="display:inline-block; padding:12px; background:#f5f5f5;">
        ${imgHtml}
      </div>
    </div>
  `;
};

const TutorialFinished = ({ tutorial }) => {
  const theme = useTheme();

  // 🧩 Step mit type "finish" finden
  const finishStep = tutorial?.steps?.find((s) => s.type === "finish");
  const finishText =
    finishStep?.text ||
    "Herzlichen Glückwunsch! Du hast alle Schritte erfolgreich abgeschlossen.";

  // 🎓 Dynamische Lerninhalte
  const learnings = tutorial?.learnings || [];

  // 🚀 Dynamische “Was kommt als Nächstes”
  const upcoming = tutorial?.upcoming || [];

  return (
    <TutorialSlide>
      {/* 🎉 Konfetti einmalig */}
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={300}
        recycle={false}
      />

      <CardContent sx={{ textAlign: "center", p: 4 }}>
        {/* 🎉 Header */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              p: 1,
              bgcolor: theme.palette.primary.light,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
            }}
          >
            <Celebration sx={{ fontSize: 48, color: "white" }} />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Tutorial abgeschlossen!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {/* {finishText} */}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ my: 2 }}>
          <div
            dangerouslySetInnerHTML={{ __html: md.render(finishStep.text) }}
          />
        </Box>
        {/* 📘 Lerninhalte */}
        {learnings.length > 0 && (
          <Box
            sx={{
              bgcolor: theme.palette.primary[50] || theme.palette.action.hover,
              borderRadius: 2,
              p: 4,
              mb: 4,
              textAlign: "left",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              color="primary"
              gutterBottom
            >
              Was du gelernt hast
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {learnings.map((learning, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: "1 1 calc(50% - 10px)",
                    boxSizing: "border-box",
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      color: theme.palette.primary.main,
                      mt: "2px",
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={500}>
                      {learning.title || "Lerninhalt"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {learning.description || ""}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* 🚀 Was kommt als Nächstes */}
        {upcoming.length > 0 && (
          <Box
            sx={{
              bgcolor:
                theme.palette.secondary[50] || theme.palette.action.hover,
              borderRadius: 2,
              p: 4,
              mb: 4,
              textAlign: "left",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              color="primary"
              gutterBottom
            >
              Was kommt als Nächstes
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {upcoming.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: "1 1 calc(50% - 10px)",
                    boxSizing: "border-box",
                    display: "flex",
                    gap: 2,
                  }}
                >
                  <ArrowForward
                    sx={{
                      color: theme.palette.primary.main,
                      mt: "2px",
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={500}>
                      {item.title || "Nächster Schritt"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description || ""}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* 🔙 Zurück-Button */}
        <Button
          component="a"
          href="/tutorial"
          variant="contained"
          size="large"
          sx={{ gap: 1 }}
          startIcon={<HomeIcon />}
        >
          Zur Tutorial-Übersicht
        </Button>
      </CardContent>
    </TutorialSlide>
  );
};

export default TutorialFinished;
