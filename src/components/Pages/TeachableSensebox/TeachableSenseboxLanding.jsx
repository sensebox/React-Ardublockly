import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";
import {
  PhotoCamera as CameraIcon,
  Gesture as GestureIcon,
  Explore as OrientationIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getTeachableSenseboxTranslations } from "./translations";

const CardSection = ({ label, children }) => (
  <Box sx={{ px: 3, py: 2 }}>
    <Typography
      variant="overline"
      color="primary"
      sx={{ display: "block", lineHeight: 1.5, mb: 0.5 }}
    >
      {label}
    </Typography>
    <Typography variant="body2">{children}</Typography>
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
    },
    {
      key: "spell",
      Icon: GestureIcon,
      texts: t.landing.accelerationCard,
      path: "/teachable/spell",
    },
    {
      key: "image",
      Icon: CameraIcon,
      texts: t.landing.imageCard,
      path: "/teachable/image",
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
          alignItems: "start",
        }}
      >
        {cards.map(({ key, Icon, texts, path }) => (
          <Card
            key={key}
            elevation={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              transition: "box-shadow 0.2s",
              "&:hover": { boxShadow: theme.shadows[8] },
            }}
          >
            <CardContent sx={{ textAlign: "center", pt: 4, pb: 3 }}>
              <Icon sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                {texts.title}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(path)}
                sx={{ mt: 1 }}
              >
                {texts.button}
              </Button>
            </CardContent>

            <Divider />
            <CardSection label={t.landing.sections.topic}>
              {texts.topic}
            </CardSection>

            <Divider />
            <CardSection label={t.landing.sections.hardware}>
              {texts.hardware}
            </CardSection>

            <Divider />
            <Accordion
              disableGutters
              elevation={0}
              square
              sx={{ "&::before": { display: "none" } }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 3 }}>
                <Typography
                  variant="overline"
                  color="primary"
                  sx={{ lineHeight: 1.5 }}
                >
                  {t.landing.sections.context}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pt: 0 }}>
                {texts.context && (
                  <Typography variant="body2">{texts.context}</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default TeachableSenseboxLanding;
