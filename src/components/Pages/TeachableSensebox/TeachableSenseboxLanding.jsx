import React, { useEffect, useMemo } from "react";
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
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  PhotoCamera as CameraIcon,
  Gesture as GestureIcon,
  Explore as OrientationIcon,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { getTutorials } from "../../../actions/tutorialActions";
import { getTeachableSenseboxTranslations } from "./translations";
import TutorialItemSummary from "../../Tutorial/Overview/TutorialItemSummary";

const TeachableSenseboxLanding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language = useSelector((s) => s.general.language);
  const tutorials = useSelector((s) => s.tutorial.tutorials);
  const t = getTeachableSenseboxTranslations(language);
  const theme = useTheme();

  // Hardcoded tutorial IDs
  const ORIENTATION_TUTORIAL_IDS = [
    "6a4cccea9729e200110fdb4e",
    "6a4cef0b9729e200110ff36c",
  ];
  const IMAGE_TUTORIAL_IDS = [
    "6a4bc15b9729e200110f7207",
    "6a4cb7a49729e200110fa22b",
  ];

  // Fetch tutorials on component mount
  useEffect(() => {
    dispatch(getTutorials());
  }, [dispatch]);

  // Filter tutorials for each tool
  const orientationTutorials = useMemo(() => {
    return tutorials.filter(
      (tutorial) =>
        tutorial.public &&
        tutorial.review &&
        ORIENTATION_TUTORIAL_IDS.includes(tutorial._id),
    );
  }, [tutorials]);

  const imageTutorials = useMemo(() => {
    return tutorials.filter(
      (tutorial) =>
        tutorial.public &&
        tutorial.review &&
        IMAGE_TUTORIAL_IDS.includes(tutorial._id),
    );
  }, [tutorials]);

  // Helper component to render tutorial accordion
  const TutorialAccordion = ({ title, tutorialList, viewTutorialText }) => {
    if (!tutorialList || tutorialList.length === 0) return null;

    return (
      <Accordion sx={{ boxShadow: 1 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          id={`tutorial-accordion-${tutorialList[0]._id}-header`}
          aria-controls={`tutorial-accordion-${tutorialList[0]._id}-content`}
          sx={{
            backgroundColor: theme.palette.background.default,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <Typography variant="h5" component="div">
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          id={`tutorial-accordion-${tutorialList[0]._id}-content`}
          sx={{ display: "block", pt: 3 }}
        >
          <Grid container spacing={3}>
            {tutorialList.map((tutorial) => (
              <Grid
                item
                xs={12}
                key={tutorial._id}
                sx={{
                  display: "flex",
                }}
              >
                <Card
                  elevation={2}
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: theme.shadows[6],
                      transform: "translateY(-2px)",
                    },
                  }}
                  onClick={() => navigate(`/tutorial/${tutorial._id}`)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <TutorialItemSummary tutorial={tutorial} />
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tutorial/${tutorial._id}`);
                      }}
                    >
                      {viewTutorialText}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

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
          alignItems: "start",
        }}
      >
        {/* Orientation Classification Card + Tutorials */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
          {TutorialAccordion({
            title: t.landing.tutorials.title,
            tutorialList: orientationTutorials,
            viewTutorialText: t.landing.tutorials.viewTutorial,
          })}
        </Box>

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

        {/* Image Classification Card + Tutorials */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
          {TutorialAccordion({
            title: t.landing.tutorials.title,
            tutorialList: imageTutorials,
            viewTutorialText: t.landing.tutorials.viewTutorial,
          })}
        </Box>
      </Box>
    </Container>
  );
};

export default TeachableSenseboxLanding;
