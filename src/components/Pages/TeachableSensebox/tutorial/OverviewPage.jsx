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

  // Normalize tutorials: flatten groups into a single array with group metadata
  const normalizedConfigs = Array.isArray(tutorialConfigs)
    ? tutorialConfigs.flatMap((item) =>
        item.group && Array.isArray(item.tutorials)
          ? item.tutorials.map((t) => ({ ...t, _group: item.group }))
          : item,
      )
    : [];

  // Group tutorials for display
  const groupedTutorials = normalizedConfigs.reduce((groups, tutorial) => {
    const group = tutorial._group || "default";
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(tutorial);
    return groups;
  }, {});

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      try {
        const results = await Promise.all(
          normalizedConfigs.map(({ id, type }) =>
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
  }, [normalizedConfigs]);

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
      {Object.entries(groupedTutorials).map(([groupName, tutorialsInGroup]) => (
        <Box key={groupName} sx={{ mb: 4 }}>
          {groupName !== "default" && (
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: 2,
                borderBottom: "2px solid",
                pb: 1,
              }}
            >
              {groupName}
            </Typography>
          )}
          <Grid container spacing={3}>
            {tutorials
              .filter((tutorial) => tutorialsInGroup.some((c) => c.id === tutorial._id))
              .map((tutorial) => (
                <Grid item sm={12} md={6} lg={3} key={tutorial._id}>
                  <Card
                    elevation={3}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        boxShadow: 6,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() =>
                        onSelect({
                          id: tutorial._id,
                          type: tutorial._widgetType,
                          group: groupName !== "default" ? groupName : null,
                        })
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
      ))}
    </Box>
  );
}

OverviewPage.propTypes = {
  tutorials: PropTypes.arrayOf(
    PropTypes.oneOf([
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      }),
      PropTypes.shape({
        group: PropTypes.string.isRequired,
        tutorials: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
          }),
        ).isRequired,
      }),
    ]),
  ),
  onSelect: PropTypes.func.isRequired,
};
