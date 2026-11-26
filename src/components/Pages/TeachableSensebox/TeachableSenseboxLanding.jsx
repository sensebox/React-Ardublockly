import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  PhotoCamera as CameraIcon,
  Gesture as GestureIcon,
  Explore as OrientationIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getTeachableSenseboxTranslations } from "./translations";

const CardSection = ({ label, children, image, divider = false }) => (
  <Box
    sx={{
      px: 3,
      py: 2,
      ...(divider && { borderTop: 1, borderColor: "divider" }),
    }}
  >
    <Typography
      variant="overline"
      color="primary"
      sx={{ display: "block", lineHeight: 1.5, mb: 0.5 }}
    >
      {label}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
      {image && (
        <Box
          component="img"
          src={image}
          alt=""
          sx={{ width: 40, height: 40, objectFit: "contain", flexShrink: 0 }}
        />
      )}
      <Typography variant="body2">{children}</Typography>
    </Box>
  </Box>
);

const TeachableSenseboxLanding = () => {
  const navigate = useNavigate();
  const language = useSelector((s) => s.general.language);
  const t = getTeachableSenseboxTranslations(language);
  const theme = useTheme();

  const cards = [
    {
      key: "orientation",
      Icon: OrientationIcon,
      texts: t.landing.orientationCard,
      path: "/teachable/orientation",
      hardwareImage: "/media/teachable/accelerometer.png",
    },
    {
      key: "spell",
      Icon: GestureIcon,
      texts: t.landing.accelerationCard,
      path: "/teachable/spell",
      hardwareImage: "/media/teachable/accelerometer.png",
    },
    {
      key: "image",
      Icon: CameraIcon,
      texts: t.landing.imageCard,
      path: "/teachable/image",
      hardwareImage: "/media/teachable/camera.png",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
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
        {cards.map(({ key, Icon, hardwareImage, texts, path }) => (
          <Card
            key={key}
            elevation={3}
            onClick={() => navigate(path)}
            sx={{
              // Subgrid: each card spans three rows of the outer grid
              // (header, topic, hardware) so sections line up across cards.
              display: "grid",
              gridRow: "span 3",
              gridTemplateRows: "subgrid",
              rowGap: 0,
              cursor: "pointer",
              transition: "box-shadow 0.2s",
              "&:hover": { boxShadow: theme.shadows[8] },
            }}
          >
            <CardContent
              sx={{
                textAlign: "center",
                pt: 4,
                pb: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              }}
            >
              <Icon sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                {texts.title}
              </Typography>
              {/* Click bubbles up to the card's onClick */}
              <Button variant="contained" size="large" sx={{ mt: 1 }}>
                {texts.button}
              </Button>
            </CardContent>

            <CardSection label={t.landing.sections.topic}>
              {texts.topic}
            </CardSection>

            <CardSection
              label={t.landing.sections.hardware}
              image={hardwareImage}
              divider
            >
              {texts.hardware}
            </CardSection>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default TeachableSenseboxLanding;
