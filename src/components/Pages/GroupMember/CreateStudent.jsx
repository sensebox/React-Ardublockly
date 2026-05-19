import { useState } from "react";
import { Box, Button, IconButton, TextField, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function CreateStudent() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    axios
      .post(
        `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/member/createStudent`,
        { name: name, nickname: nickname },
      )
      .then((response) => {
        console.log("Schüler*in erstellt:", response.data);
        navigate(`/group/${groupId}`);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Fehler beim Erstellen des Accounts." + err.message,
        );
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "85vh",
        backgroundColor: theme.palette.background.default,
        padding: "20px",
        position: "relative",
      }}
    >
      <IconButton
        aria-label="Schließen"
        onClick={() => navigate(`/group/${groupId}`)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <h1>Schüler*in Hinzufügen</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="standard"
          style={{ marginBottom: "10px" }}
          type="text"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <TextField
          variant="standard"
          style={{ marginBottom: "10px" }}
          type="text"
          label="Spitzname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          fullWidth
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button
          variant="contained"
          type="submit"
          style={{ marginTop: "10px" }}
          sx={{
            backgroundColor: "#4caf50",
            "&:hover": { backgroundColor: "#388e3c" },
          }}
          fullWidth
        >
          Hinzufügen
        </Button>
      </form>
    </Box>
  );
}
