import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

const WhatNext = ({ learnings, setLearnings }) => {
  const theme = useTheme();

  const addLearning = () =>
    setLearnings([...learnings, { title: "", description: "" }]);

  const deleteLearning = (index) =>
    setLearnings(learnings.filter((_, i) => i !== index));

  const updateLearning = (index, key, value) => {
    const updated = [...learnings];
    updated[index][key] = value;
    setLearnings(updated);
  };

  return (
    <Box
      sx={{
        bgcolor: theme.palette.primary[50] || theme.palette.action.hover,
        borderRadius: 2,
        p: 4,
        mb: 4,
        mt: 4,
      }}
    >
      <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
        Was du gelernt hast
      </Typography>

      <Box
        sx={{ display: "flex", flexWrap: "wrap", gap: 2, textAlign: "left" }}
      >
        {learnings.map((item, index) => (
          <Box
            key={index}
            sx={{ flex: "1 1 calc(50% - 10px)", boxSizing: "border-box" }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <CheckCircleIcon
                sx={{ color: theme.palette.primary.main, mt: "2px" }}
              />
              <Box sx={{ flex: 1 }}>
                <TextField
                  variant="standard"
                  value={item.title}
                  onChange={(e) =>
                    updateLearning(index, "title", e.target.value)
                  }
                  fullWidth
                  placeholder="Titel des Learnings"
                />
                <TextField
                  variant="standard"
                  value={item.description}
                  onChange={(e) =>
                    updateLearning(index, "description", e.target.value)
                  }
                  fullWidth
                  placeholder="Beschreibung des Learnings"
                  InputProps={{
                    sx: { fontSize: "0.85rem", color: "text.secondary" },
                  }}
                />
              </Box>
              <IconButton
                size="small"
                onClick={() => deleteLearning(index)}
                sx={{ color: theme.palette.error.main }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      <Button
        variant="outlined"
        startIcon={<AddCircleOutlineIcon />}
        onClick={addLearning}
        sx={{ mt: 3 }}
      >
        Neues Learning hinzufügen
      </Button>
    </Box>
  );
};

export default WhatNext;
