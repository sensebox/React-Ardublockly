import { useEffect, useState } from "react";
import { Box, Button, TextField, useTheme } from "@mui/material";
import axios from "axios";

export default function JoinGroup() {
  const theme = useTheme();

  const [accessCode, setAccessCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const normalizedAccessCode = accessCode.trim().toUpperCase();

    axios
      .post(`${import.meta.env.VITE_BLOCKLY_API}/group/join`, {
        accessCode: normalizedAccessCode,
        nickname: nickname.trim(),
      })
      .then((response) => {
        console.log("HEHEE");
        console.log("Join response:", response.data);
        const { groupId, memberId } = response.data;
        if (groupId && memberId) {
          console.log("HALLLOOOO", groupId, memberId);
          window.location.href = `/group/${groupId}/member/dashboard/${memberId}`;
        } else {
          setError("Beigetreten, aber Gruppe konnte nicht gefunden werden.");
        }
      })
      .catch((err) => {
        setError("Fehler beim Beitreten der Gruppe." + err.message);
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
      }}
    >
      <h1>Gruppen beitreten</h1>

      <form onSubmit={handleSubmit}>
        <TextField
          variant="standard"
          style={{ marginBottom: "10px" }}
          type="text"
          label="Zugangscode"
          name="Zugangscode"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
          fullWidth
        />

        <TextField
          variant="standard"
          style={{ marginBottom: "10px" }}
          type="text"
          label="Nickname"
          name="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          fullWidth
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginTop: "10px" }}
        >
          Gruppe beitreten
        </Button>
      </form>
    </Box>
  );
}
