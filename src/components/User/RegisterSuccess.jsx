import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function RegisterSuccess() {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: "center", mt: 8 }}>
      <FontAwesomeIcon icon={faCheckCircle} color="#4CAF50" size="4x" />
      <Typography variant="h4" sx={{ mt: 2 }}>
        Konto erfolgreich erstellt!
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
        Du kannst dich jetzt mit deinen Zugangsdaten anmelden.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={() => navigate("/user/login")}
      >
        Zum Login
      </Button>
    </Box>
  );
}
