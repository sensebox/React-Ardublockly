import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import COMPONENT_MAP from "../utils/componentMap";

export default function HardwareSelectorModal({
  selectedHardware,
  onHardwareSelect,
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleHardwareSelect = (hardware) => {
    if (selectedHardware.includes(hardware)) {
      onHardwareSelect(selectedHardware.filter((item) => item !== hardware));
    } else {
      onHardwareSelect([...selectedHardware, hardware]);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        sx={{
          fontSize: "0.8rem",
          border: "3px dashed #99a1af",
          color: "#4a5565",
        }}
        id="edit_hardware"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Hardware bearbeiten
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Hardware auswählen{" "}
          {selectedHardware.length > 0 && (
            <Typography
              component="span"
              variant="body2"
              color="primary"
              sx={{ ml: 1 }}
            >
              ({selectedHardware.length} ausgewählt)
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {/* Suche */}
          <TextField
            fullWidth
            placeholder="Hardware suchen..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
          />

          {/* Tabs */}

          {/* Grid mit Hardware */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: 2,
              mt: 2,
              maxHeight: 400,
              overflowY: "auto",
              p: 1,
            }}
          >
            {Object.entries(COMPONENT_MAP).map(([id, item]) => {
              if (
                searchValue &&
                !item.name.toLowerCase().includes(searchValue.toLowerCase())
              ) {
                return null;
              }
              return (
                <Box
                  key={id}
                  onClick={() => handleHardwareSelect(id)}
                  sx={{
                    position: "relative",
                    border: selectedHardware.includes(id)
                      ? `2px solid ${theme.palette.primary.main}`
                      : "1px solid #ccc",
                    borderRadius: 2,
                    p: 1,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      border: `2px solid ${theme.palette.primary.main}`,
                    },
                  }}
                >
                  <img
                    src={
                      item.image || "/media/hardware/3dmodels/coming-soon.png"
                    }
                    alt={item.name}
                    style={{ width: "100%", height: 80, objectFit: "contain" }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {item.name}
                  </Typography>

                  {/* ✅ Checkmark unten rechts */}
                  {selectedHardware.includes(id) && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 6,
                        right: 6,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        bgcolor: theme.palette.primary.main,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      ✓
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => onHardwareSelect([])}
            disabled={selectedHardware.length === 0}
          >
            Alle entfernen
          </Button>
          <Button variant="contained" onClick={() => setOpen(false)}>
            Fertig ({selectedHardware.length})
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
