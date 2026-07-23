import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import TutorialItemSummary from "../../../Tutorial/Overview/TutorialItemSummary";

export default function OverviewPage({
  tutorials: tutorialConfigs = [],
  onSelect,
}) {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      try {
        const results = await Promise.all(
          tutorialConfigs.map(({ id, type }) =>
            axios
              .get(`${import.meta.env.VITE_BLOCKLY_API}/tutorial/${id}`)
              .then((res) => ({ ...res.data.tutorial, _widgetType: type })),
          ),
        );
        if (!cancelled) {
          setTutorials(results);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Tutorials konnten nicht geladen werden.");
          setLoading(false);
        }
      }
    }
    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [tutorialConfigs]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Tutorials
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Wähle ein Tutorial aus, um zu starten.
      </Typography>
      <Grid container spacing={3}>
        {tutorials.map((tutorial) => (
          <Grid item sm={12} md={6} lg={3} key={tutorial._id}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": { boxShadow: 6, transform: "translateY(-2px)" },
              }}
            >
              <CardActionArea
                onClick={() =>
                  onSelect({ id: tutorial._id, type: tutorial._widgetType })
                }
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: "8px" }}>
                  <TutorialItemSummary tutorial={tutorial} />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

OverviewPage.propTypes = {
  tutorials: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ),
  onSelect: PropTypes.func.isRequired,
};
