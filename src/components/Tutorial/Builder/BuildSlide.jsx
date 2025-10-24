import { motion } from "framer-motion";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useTheme } from "@mui/styles";
import { useState } from "react";

const variants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

const BuildSlide = ({
  children,
  title,
  stepNumber,
  setSteps,
  steps,
  type,
  setType,
}) => {
  const theme = useTheme();
  const updateStep = (index, key, value) => {
    setType(value);
    const updated = [...steps];
    updated[index][key] = value;
    setSteps(updated);
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{
        position: "absolute", // wichtig: übereinander stapeln
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card sx={{ width: "100%", overflow: "auto", maxHeight: "80vh" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {" "}
          {(title || stepNumber !== undefined) && (
            <div>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    p: 0.5,
                    border: "1px solid #ddd",
                    borderRadius: "10%",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                  }}
                >
                  {`Schritt ${stepNumber}`}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {!(type === "instruction" || type === "finish") && (
                    <FormControl size="small" fullWidth>
                      <InputLabel id="category-label">Kategorie</InputLabel>
                      <Select
                        labelId="category-label"
                        label="Kategorie"
                        value={type}
                        sx={{
                          borderColor: theme.palette.primary.main,
                        }}
                        onChange={(e) =>
                          updateStep(stepNumber - 1, "type", e.target.value)
                        }
                      >
                        <MenuItem value="task">Aufgabe</MenuItem>
                        <MenuItem value="question">Fragestellung</MenuItem>
                        <MenuItem value="blockly">Blockly-Aufgabe</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Box>
              </Box>

              <h2>{title}</h2>
            </div>
          )}
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BuildSlide;
