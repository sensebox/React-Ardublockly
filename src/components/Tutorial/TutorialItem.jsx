import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
  Button,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import DifficultyLabel from "./DifficultyLabel";

function getDifficultyLevel(value) {
  if (value <= 1) return 1;
  if (value <= 2) return 2;
  if (value <= 3) return 3;
  if (value <= 4) return 4;
  return 5;
}

function TutorialItem({ tutorial, level }) {
  const theme = useTheme();
  const labels = ["Sehr leicht", "Leicht", "Mittel", "Schwer", "Sehr schwer"];
  const getTutorialImage = (t) => t.imageUrl || "/placeholder-image.png";
  const getDifficultyLabel = (value) => {
    const idx = Math.max(
      0,
      Math.min(labels.length - 1, getDifficultyLevel(value) - 1),
    );
    return labels[idx].toLocaleUpperCase();
  };

  return (
    <Grid item xs={12} sm={6} md={4} xl={3} key={tutorial._id}>
      <Card
        elevation={3}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": { boxShadow: 6 },
        }}
      >
        <CardActionArea sx={{ textAlign: "left", flexGrow: 1, p: 1 }}>
          <DifficultyLabel level={getDifficultyLabel(level)} />
          <Box
            sx={{
              height: 160,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={getTutorialImage(tutorial)}
              alt={tutorial.title}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
                backgroundColor: "#f5f5f5",

                padding: "40px",
              }}
            />
          </Box>
          {/* Titel & Beschreibung */}
          <CardContent
            sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
          >
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 900,
                textTransform: "capitalize",
                color: theme.palette.primary.main,
                textAlign: "center",
                lineHeight: 1.2,
                mb: 1.5,
              }}
            >
              {tutorial.title}
            </Typography>

            <hr
              style={{ color: "#eee", width: "80%", margin: "0 auto 10px" }}
            />

            {tutorial.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", mb: "auto" }} // mb:auto → drückt den Button nach unten
              >
                {tutorial.description}
              </Typography>
            )}
          </CardContent>
        </CardActionArea>

        {/* Button-Bereich IMMER unten */}
        <Box sx={{ p: 2, pt: 0 }}>
          <Button
            component={Link}
            to={`/tutorial/${tutorial._id}`}
            fullWidth
            startIcon={<FontAwesomeIcon icon={faEye} />}
            sx={{
              background: theme.palette.background.white,
              color: theme.palette.primary.main,
              borderRadius: "50px",
              fontWeight: "bold",
              border: "1px solid",
              borderColor: theme.palette.primary.main,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.white,
              },
            }}
          >
            Anzeigen
          </Button>
        </Box>
      </Card>
    </Grid>
  );
}

TutorialItem.propTypes = {
  tutorial: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string,
  }).isRequired,
};

export default TutorialItem;
