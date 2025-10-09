import React from "react";
import Confetti from "react-confetti";
import {
  Box,
  CardContent,
  Typography,
  Button,
  Grid,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import TutorialSlide from "./TutorialItem/TutorialSlide";
import { ArrowForward, Celebration, PartyMode } from "@mui/icons-material";

const TutorialFinished = ({ currentStepData }) => {
  const theme = useTheme();

  return (
    <TutorialSlide>
      {/* 🎉 Konfetti Overlay, füllt einfach das Fenster */}
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={500}
        recycle={false} // nur einmal abfeuern
      />

      <CardContent sx={{ textAlign: "center", p: 4 }}>
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
            <Typography variant="body1" sx={{ mb: 1 }}>
              {currentStepData?.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Du hast alle Schritte erfolgreich durchgeführt und dabei wichtige
              Grundlagen der Elektronik und Programmierung gelernt.
            </Typography>
          </Box>
        </Box>
        {/* Lerninhalte */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box
            sx={{
              bgcolor: theme.palette.primary[50] || theme.palette.action.hover,
              borderRadius: 2,
              p: 4,
              mb: 4,
              flex: "1 1 calc(50% - 10px)",
              boxSizing: "border-box",
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
                textAlign: "left",
              }}
            >
              <Box
                sx={{
                  flex: "1 1 calc(50% - 10px)",
                  boxSizing: "border-box",
                }}
              >
                <Box sx={{ display: "flex", gap: 2 }}>
                  <CheckCircleIcon
                    sx={{ color: theme.palette.primary.main, mt: "2px" }}
                  />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={500}>
                      Hardware-Software Integration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Code auf Mikrocontroller laden und testen
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  flex: "1 1 calc(50% - 10px)",
                  boxSizing: "border-box",
                }}
              >
                <Box sx={{ display: "flex", gap: 2 }}>
                  <CheckCircleIcon
                    sx={{ color: theme.palette.primary.main, mt: "2px" }}
                  />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={500}>
                      Hardware-Software Integration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Code auf Mikrocontroller laden und testen
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  flex: "1 1 calc(50% - 10px)",
                  boxSizing: "border-box",
                }}
              >
                <Box sx={{ display: "flex", gap: 2 }}>
                  <CheckCircleIcon
                    sx={{ color: theme.palette.primary.main, mt: "2px" }}
                  />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={500}>
                      Hardware-Software Integration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Code auf Mikrocontroller laden und testen
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  flex: "1 1 calc(50% - 10px)",
                  boxSizing: "border-box",
                }}
              >
                <Box sx={{ display: "flex", gap: 2 }}>
                  <CheckCircleIcon
                    sx={{ color: theme.palette.primary.main, mt: "2px" }}
                  />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={500}>
                      Hardware-Software Integration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Code auf Mikrocontroller laden und testen
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              flex: "1 1 calc(50% - 10px)",
              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                bgcolor:
                  theme.palette.secondary[50] || theme.palette.action.hover,
                borderRadius: 2,
                p: 4,
                mb: 4,
                flex: "1 1 calc(50% - 10px)",
                boxSizing: "border-box",
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
                  textAlign: "left",
                }}
              >
                <Box
                  sx={{ flex: "1 1 calc(50% - 10px)", boxSizing: "border-box" }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <ArrowForward
                      sx={{ color: theme.palette.primary.main, mt: "2px" }}
                    />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={500}>
                        Eigenes Projekt starten
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Entwickle eine eigene Idee und setze sie mit dem
                        Gelernten um.
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{ flex: "1 1 calc(50% - 10px)", boxSizing: "border-box" }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <ArrowForward
                      sx={{ color: theme.palette.primary.main, mt: "2px" }}
                    />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={500}>
                        Sensor erweitern
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ergänze dein Projekt mit zusätzlichen Sensoren oder
                        Aktoren.
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{ flex: "1 1 calc(50% - 10px)", boxSizing: "border-box" }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <ArrowForward
                      sx={{ color: theme.palette.primary.main, mt: "2px" }}
                    />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={500}>
                        Daten visualisieren
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stelle deine Messwerte in Diagrammen oder Dashboards
                        dar.
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{ flex: "1 1 calc(50% - 10px)", boxSizing: "border-box" }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <ArrowForward
                      sx={{ color: theme.palette.primary.main, mt: "2px" }}
                    />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={500}>
                        Nächstes Tutorial
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Wähle ein fortgeschrittenes Tutorial aus, um tiefer
                        einzutauchen.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

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
