import { useEffect, useState } from "react";
import { Box, Button, TextField, useTheme } from "@mui/material";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";

export default function Group() {
  const theme = useTheme();
  
  const [gruppenname, setGruppenname] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

   axios.post(`${import.meta.env.VITE_BLOCKLY_API}/group`, { name: gruppenname })
     .then((response) => {
       console.log("Gruppe erstellt:", response.data);
       window.location.href = "/group/" + response.data.group._id;
     })
     .catch((err) => {
       setError("Fehler beim Erstellen der Gruppe." + err.message);
     });

  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "85vh",
        backgroundColor: theme.palette.background.default,
        padding: "20px",
      }}
    >
      <h1>Gruppen erstellen</h1>

      <form onSubmit={handleSubmit}>
        <TextField
          variant="standard"
          style={{ marginBottom: "10px" }}
          type="text"
          label="Gruppenname"
          name="Gruppenname"
          value={gruppenname}
          onChange={(e) => setGruppenname(e.target.value)}
          fullWidth
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginTop: "10px" }}
        >
          Neue Gruppe erstellen
        </Button>
      </form>

      <Link to="/archiveGroup" style={{ color: "green", marginTop: "20px" }}>
        Bestehende Gruppen
      </Link>
    </Box>
  );
}
