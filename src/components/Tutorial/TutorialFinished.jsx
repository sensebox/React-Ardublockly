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
import TutorialSlide from "./TutorialSlide";

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

      <CardContent sx={{ width: "100%", textAlign: "center", p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 96,
              height: 96,
              bgcolor: theme.palette.primary.light,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
            }}
          >
            <CheckCircleIcon
              sx={{ fontSize: 48, color: theme.palette.primary.main }}
            />
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
        <Box
          sx={{
            bgcolor: theme.palette.primary[50] || theme.palette.action.hover,
            borderRadius: 2,
            p: 4,
            mb: 4,
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
          <Grid container spacing={2} textAlign="left">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <CheckCircleIcon
                  sx={{ color: theme.palette.primary.main, mt: "2px" }}
                />
                <Box>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Schaltungsaufbau
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    LED-Schaltungen mit Widerständen auf dem Breadboard
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <CheckCircleIcon
                  sx={{ color: theme.palette.primary.main, mt: "2px" }}
                />
                <Box>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Arduino Programmierung
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Grundlagen der Arduino IDE und digitalWrite()
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <CheckCircleIcon
                  sx={{ color: theme.palette.primary.main, mt: "2px" }}
                />
                <Box>
                  <Typography variant="subtitle2" fontWeight={500}>
                    Elektronik Grundlagen
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Polarität, Widerstände und Sicherheit
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
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
