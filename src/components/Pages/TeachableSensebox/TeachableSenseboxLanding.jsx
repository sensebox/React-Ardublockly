import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  useTheme,
} from "@mui/material";
import {
  PhotoCamera as CameraIcon,
  Gesture as GestureIcon,
  Explore as OrientationIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getTeachableSenseboxTranslations } from "./translations";

const TeachableSenseboxLanding = () => {
  const navigate = useNavigate();
  const language = useSelector((s) => s.general.language);
  const t = getTeachableSenseboxTranslations();
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }} key={language}>
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t.landing.title}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 4,
        }}
      >
        {/* Orientation Classification Card */}
        <Card
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: theme.shadows[8] },
          }}
        >
          <CardContent sx={{ flexGrow: 1, textAlign: "center", pt: 4 }}>
            <OrientationIcon
              sx={{ fontSize: 64, color: "primary.main", mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              {t.landing.orientationCard.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t.landing.orientationCard.description}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center", pb: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/teachable/orientation")}
            >
              {t.landing.orientationCard.button}
            </Button>
          </CardActions>
        </Card>

        {/* Acceleration Classification Card */}
        <Card
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: theme.shadows[8] },
          }}
        >
          <CardContent sx={{ flexGrow: 1, textAlign: "center", pt: 4 }}>
            <GestureIcon sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              {t.landing.accelerationCard.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t.landing.accelerationCard.description}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center", pb: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/teachable/spell")}
            >
              {t.landing.accelerationCard.button}
            </Button>
          </CardActions>
        </Card>

        {/* Image Classification Card */}
        <Card
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: theme.shadows[8] },
          }}
        >
          <CardContent sx={{ flexGrow: 1, textAlign: "center", pt: 4 }}>
            <CameraIcon sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              {t.landing.imageCard.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t.landing.imageCard.description}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center", pb: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/teachable/image")}
            >
              {t.landing.imageCard.button}
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
};

export default TeachableSenseboxLanding;
