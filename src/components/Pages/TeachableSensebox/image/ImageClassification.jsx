import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Box,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getImageTranslations } from "./translations";
import ImageClassificationTool from "./ImageClassificationTool";

const ImageClassification = () => {
  const navigate = useNavigate();
  const language = useSelector((s) => s.general.language);
  const t = getImageTranslations(language);

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ mb: 2, pt: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/teachable")}
        >
          {t.landing?.title || "Machine Learning"}
        </Button>
      </Box>
      <ImageClassificationTool />
    </Container>
  );
};

export default ImageClassification;
