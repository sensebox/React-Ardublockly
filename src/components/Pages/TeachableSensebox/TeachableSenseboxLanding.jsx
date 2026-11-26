import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  PhotoCamera as CameraIcon,
  Gesture as GestureIcon,
  Explore as OrientationIcon,
  ExpandMore as ExpandMoreIcon,
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
      color="primary.dark"
      sx={{ display: "block", lineHeight: 1.5, mb: 0.5, fontWeight: "bold" }}
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
  const language = useSelector((s) => s.general.language);
  const t = getTeachableSenseboxTranslations(language);
  const theme = useTheme();
  // Set on card and accordion directly so both animate their shadow equally
  const shadowTransition = theme.transitions.create("box-shadow");

  const cards = [
    {
      key: "orientation",
      Icon: OrientationIcon,
      texts: t.landing.orientationCard,
      path: "/teachable/orientation",
      // Shown between texts.context and texts.contextAfterImage
      contextImage: "/media/teachable/paket_simple.png",
      hardwareImage: "/media/teachable/accelerometer.png",
    },
    {
      key: "spell",
      Icon: GestureIcon,
      texts: t.landing.accelerationCard,
      path: "/teachable/spell",
      hardwareImage: "/media/teachable/accelerometer.png",
      contextExamples: [
        { key: "smartwatch", image: "/media/teachable/smartwatch.png" },
      ],
    },
    {
      key: "image",
      Icon: CameraIcon,
      texts: t.landing.imageCard,
      path: "/teachable/image",
      hardwareImage: "/media/teachable/camera.png",
      contextExamples: [
        {
          key: "selfDrivingCar",
          image: "/media/teachable/self_driving_car.png",
        },
        {
          key: "faceRecognition",
          image: "/media/teachable/person_classification.png",
        },
        {
          key: "textRecognition",
          image: "/media/teachable/text_recognition.png",
        },
      ],
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
        {cards.map(
          ({
            key,
            Icon,
            hardwareImage,
            contextImage,
            contextExamples,
            texts,
            path,
          }) => (
            // Invisible wrapper spanning four rows of the outer grid via
            // subgrid. The card body (header, topic, hardware) fills rows 1–3
            // so these sections line up across cards. The context accordion
            // sits in row 4 with alignSelf "start", so expanding one card's
            // context does not stretch its neighbours.
            <Box
              key={key}
              sx={{
                display: "grid",
                gridRow: "span 4",
                gridTemplateRows: "subgrid",
                rowGap: 0,
                "&:hover > *": { boxShadow: theme.shadows[8] },
              }}
            >
              <Card
                elevation={3}
                sx={{
                  gridRow: "1 / span 3",
                  display: "grid",
                  gridTemplateRows: "subgrid",
                  rowGap: 0,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  // Hide the bottom shadow so card and accordion look like one
                  clipPath: "inset(-24px -24px 0 -24px)",
                  transition: shadowTransition,
                }}
              >
                <CardActionArea
                  component={Link}
                  to={path}
                  sx={{
                    gridRow: "1 / span 3",
                    display: "grid",
                    gridTemplateRows: "subgrid",
                    rowGap: 0,
                    alignItems: "stretch",
                    // No darkening on hover (the shadow already signals it),
                    // but keep the highlight for keyboard focus
                    "&:hover:not(.Mui-focusVisible) .MuiCardActionArea-focusHighlight":
                      { opacity: 0 },
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
                    {/* Rendered as span: the whole card is already the link */}
                    <Button
                      component="span"
                      variant="contained"
                      size="large"
                      sx={{ mt: 1 }}
                    >
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
                </CardActionArea>
              </Card>

              <Accordion
                disableGutters
                elevation={3}
                // Only load the (large) example images once the context is opened
                TransitionProps={{ unmountOnExit: true }}
                square
                sx={{
                  gridRow: 4,
                  alignSelf: "start",
                  borderTop: 1,
                  borderColor: "divider",
                  borderBottomLeftRadius: `${theme.shape.borderRadius}px`,
                  borderBottomRightRadius: `${theme.shape.borderRadius}px`,
                  // Hide the top shadow so card and accordion look like one
                  clipPath: "inset(0 -24px -24px -24px)",
                  // Overrides the Accordion's own margin-only transition
                  transition: shadowTransition,
                  "&::before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ px: 3 }}
                >
                  <Typography
                    variant="overline"
                    color="primary.dark"
                    sx={{ lineHeight: 1.5, fontWeight: "bold" }}
                  >
                    {t.landing.sections.context}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pt: 0 }}>
                  {texts.context && (
                    <Typography variant="body2">{texts.context}</Typography>
                  )}
                  {contextImage && (
                    <Box
                      component="img"
                      src={contextImage}
                      alt={texts.contextImageAlt}
                      sx={{
                        display: "block",
                        width: "100%",
                        maxHeight: 180,
                        objectFit: "contain",
                        my: 2,
                      }}
                    />
                  )}
                  {texts.contextAfterImage && (
                    <Typography variant="body2">
                      {texts.contextAfterImage}
                    </Typography>
                  )}
                  {contextExamples && (
                    <>
                      <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                        {t.landing.sections.examples}
                      </Typography>
                      {contextExamples.map(({ key: exampleKey, image }) => (
                        <Box
                          key={exampleKey}
                          component="figure"
                          sx={{ m: 0, mb: 2 }}
                        >
                          <Box
                            component="img"
                            src={image}
                            alt={texts.contextExamples[exampleKey]}
                            sx={{
                              display: "block",
                              width: "100%",
                              maxHeight: 180,
                              objectFit: "contain",
                            }}
                          />
                          <Typography
                            component="figcaption"
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "block",
                              mt: 0.5,
                              textAlign: "center",
                            }}
                          >
                            {texts.contextExamples[exampleKey]}
                          </Typography>
                        </Box>
                      ))}
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            </Box>
          ),
        )}
      </Box>
    </Container>
  );
};

export default TeachableSenseboxLanding;
