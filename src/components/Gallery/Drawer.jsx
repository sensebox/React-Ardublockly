import React from "react";
import {
  Box,
  Drawer,
  Button,
  IconButton,
  Typography,
  Divider,
  FormControl,
  FormLabel,
  Chip,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/TuneRounded";
import CloseIcon from "@mui/icons-material/Close";

export default function DrawerFilters({
  tags = [],
  selectedTags = [],
  onApply,
  onClear,
}) {
  const [open, setOpen] = React.useState(false);
  const [localTags, setLocalTags] = React.useState(selectedTags);

  React.useEffect(() => {
    setLocalTags(selectedTags);
  }, [selectedTags]);

  const toggleTag = (tag) => {
    setLocalTags((prev) => {
      const s = new Set(prev);
      s.has(tag) ? s.delete(tag) : s.add(tag);
      return [...s];
    });
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<TuneIcon />}
        onClick={() => setOpen(true)}
      >
        Filter setzen
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            boxShadow: 24,
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            borderTopLeftRadius: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Filter</Typography>
          <IconButton onClick={() => setOpen(false)} sx={{ color: "inherit" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Tags als Chips */}
        <FormControl component="fieldset" sx={{ px: 2, mb: 2 }}>
          <FormLabel component="legend">Tags</FormLabel>
          <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {tags.map((tag) => {
              const selected = localTags.includes(tag);
              return (
                <Chip
                  key={tag}
                  label={tag}
                  clickable
                  size="small"
                  variant={selected ? "filled" : "outlined"}
                  color={selected ? "primary" : "default"}
                  onClick={() => toggleTag(tag)}
                />
              );
            })}
          </Box>
        </FormControl>

        <Box sx={{ flexGrow: 1 }} />
        <Divider sx={{ my: 2 }} />

        {/* Footer */}
        <Box
          sx={{
            px: 2,
            pb: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setLocalTags([]);
              onClear?.();
            }}
          >
            Löschen
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onApply({ tagFilters: localTags });
              setOpen(false);
            }}
          >
            Anwenden
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
