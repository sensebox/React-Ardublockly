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
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import COMPONENT_MAP from "../utils/componentMap";

export default function HardwareSelectorModal({
  selectedHardware,
  onHardwareSelect,
  customHardware = {},
  onCustomHardwareChange,
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [newCustomHardware, setNewCustomHardware] = useState({
    name: "",
    imageUrl: "",
    docUrl: "",
  });

  const handleHardwareSelect = (hardware) => {
    if (selectedHardware.includes(hardware)) {
      onHardwareSelect(selectedHardware.filter((item) => item !== hardware));
    } else {
      onHardwareSelect([...selectedHardware, hardware]);
    }
  };

  const handleAddCustomHardware = () => {
    if (!newCustomHardware.name.trim() || !newCustomHardware.imageUrl.trim()) {
      alert("Name and Image URL are required");
      return;
    }

    const customId = `custom-${Date.now()}`;
    const updatedCustomHardware = {
      ...customHardware,
      [customId]: {
        name: newCustomHardware.name,
        image: newCustomHardware.imageUrl,
        docUrl: newCustomHardware.docUrl || undefined,
        sensor: "Custom",
      },
    };

    onCustomHardwareChange(updatedCustomHardware);
    // Automatically add to selected hardware
    onHardwareSelect([...selectedHardware, customId]);
    setNewCustomHardware({ name: "", imageUrl: "", docUrl: "" });
  };

  const handleDeleteCustomHardware = (customId) => {
    const updatedCustomHardware = { ...customHardware };
    delete updatedCustomHardware[customId];
    onCustomHardwareChange(updatedCustomHardware);

    // Remove from selected if present
    if (selectedHardware.includes(customId)) {
      onHardwareSelect(selectedHardware.filter((item) => item !== customId));
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
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ mb: 2 }}
          >
            <Tab label="Standard Hardware" />
            <Tab label="Benutzerdefiniert" />
          </Tabs>

          {tabValue === 0 && (
            <>
              <TextField
                fullWidth
                placeholder="Hardware suchen..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                size="small"
                sx={{ mb: 2 }}
              />
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
                          item.image ||
                          "/media/hardware/3dmodels/coming-soon.png"
                        }
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: 80,
                          objectFit: "contain",
                        }}
                      />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {item.name}
                      </Typography>
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
            </>
          )}

          {tabValue === 1 && (
            <Box>
              <Box
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                  mb: 3,
                  bgcolor: theme.palette.action.hover,
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="600"
                  sx={{ mb: 1.5 }}
                >
                  Neue benutzerdefinierte Komponente hinzufügen
                </Typography>

                <TextField
                  fullWidth
                  label="Name"
                  placeholder="z. B. Mein Sensor"
                  value={newCustomHardware.name}
                  onChange={(e) =>
                    setNewCustomHardware({
                      ...newCustomHardware,
                      name: e.target.value,
                    })
                  }
                  size="small"
                  sx={{ mb: 1.5 }}
                />

                <TextField
                  fullWidth
                  label="Bild-URL"
                  placeholder="https://example.com/image.png"
                  value={newCustomHardware.imageUrl}
                  onChange={(e) =>
                    setNewCustomHardware({
                      ...newCustomHardware,
                      imageUrl: e.target.value,
                    })
                  }
                  size="small"
                  sx={{ mb: 1.5 }}
                />

                <TextField
                  fullWidth
                  label="Dokumentations-Link (optional)"
                  placeholder="https://example.com/docs"
                  value={newCustomHardware.docUrl}
                  onChange={(e) =>
                    setNewCustomHardware({
                      ...newCustomHardware,
                      docUrl: e.target.value,
                    })
                  }
                  size="small"
                  sx={{ mb: 1.5 }}
                />

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddCustomHardware}
                  fullWidth
                >
                  Hinzufügen
                </Button>
              </Box>

              {Object.keys(customHardware).length > 0 ? (
                <>
                  <Typography
                    variant="subtitle2"
                    fontWeight="600"
                    sx={{ mb: 1.5 }}
                  >
                    Benutzerdefinierte Komponenten
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(120px, 1fr))",
                      gap: 2,
                      maxHeight: 400,
                      overflowY: "auto",
                      p: 1,
                    }}
                  >
                    {Object.entries(customHardware).map(([customId, item]) => (
                      <Box
                        key={customId}
                        sx={{
                          position: "relative",
                          border: "1px solid #ccc",
                          borderRadius: 2,
                          p: 1,
                          textAlign: "center",
                          transition: "all 0.2s",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: 80,
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            e.target.src =
                              "/media/hardware/3dmodels/coming-soon.png";
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ mt: 1, fontSize: "0.75rem" }}
                        >
                          {item.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCustomHardware(customId);
                          }}
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            bgcolor: "error.main",
                            color: "white",
                            width: 24,
                            height: 24,
                            "&:hover": {
                              bgcolor: "error.dark",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 3 }}
                >
                  Noch keine benutzerdefinierten Komponenten hinzugefügt
                </Typography>
              )}
            </Box>
          )}
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
