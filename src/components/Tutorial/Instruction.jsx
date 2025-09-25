import { Info } from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import HardwareCard from "./HardwareCard";
import TutorialSlide from "./TutorialSlide";

const Instruction = ({ step }) => {
  const theme = useTheme();

  return (
    <TutorialSlide title="Einleitung">
      <Box sx={{ my: 2 }}>{step.text}</Box>

      <Typography sx={{ fontWeight: "bold" }}>
        <Info sx={{ color: theme.palette.primary.main, mr: 1 }} />
        Benötigte Hardware
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          mt: 2,
          width: "100%",
        }}
      >
        {step.hardware.map((sensor, idx) => (
          <Box
            key={sensor.id || idx}
            sx={{
              flex: "1",
              maxWidth: "22%",
              minWidth: "80px",
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <HardwareCard component={sensor} />
          </Box>
        ))}
      </Box>
    </TutorialSlide>
  );
};

export default Instruction;
