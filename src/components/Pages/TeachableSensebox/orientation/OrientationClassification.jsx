import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Box } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import OrientationClassificationTool from "./OrientationClassificationTool";

const OrientationClassification = () => {
  const navigate = useNavigate();

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
          Machine Learning
        </Button>
      </Box>
      <OrientationClassificationTool />
    </Container>
  );
};

export default OrientationClassification;
