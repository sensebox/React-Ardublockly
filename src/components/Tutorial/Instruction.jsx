import { Book, Info } from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import { useEffect } from "react";
import HardwareCard from "./HardwareCard";

const Instruction = ({ step }) => {
  const theme = useTheme();

  useEffect(() => {
    console.log(step);
  }, []);
  return (
    <Box>
      <Box
        sx={{
          backgroundColor: theme.palette.background.grey,
          borderRadius: "10px",
          borderLeft: `5px solid ${theme.palette.primary.main}`,
          p: 5,
          m: 4,
          gap: 2,
          display: "flex",
          boxShadow: 1,

          flexDirection: "column",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Book sx={{ color: theme.palette.primary.main }} />
          Was lernst du in dieser Challenge?
        </Typography>
        <Typography>{step.text}</Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: theme.palette.background.grey,
          borderRadius: "10px",
          borderLeft: `5px solid ${theme.palette.primary.main}`,
          p: 5,
          m: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxShadow: 1,
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
          }}
        >
          <Info sx={{ color: theme.palette.primary.main }} />
          Benötigte Hardware
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "flex-start",
          }}
        >
          {step.hardware.map((sensor, idx) => (
            <Box
              key={sensor.id || idx}
              sx={{
                flex: "1 0 30%",
                maxWidth: "32%",
                minWidth: "180px",
                boxSizing: "border-box",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <HardwareCard component={sensor} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Instruction;
