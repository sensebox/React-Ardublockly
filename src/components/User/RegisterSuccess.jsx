import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function RegisterSuccess() {
  const history = useHistory();

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
        onClick={() => history.push("/user/login")}
      >
        Zum Login
      </Button>
    </Box>
  );
}
