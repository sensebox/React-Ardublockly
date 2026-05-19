import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { DoorBack } from "@mui/icons-material";

export default function ArchiveGroup() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BLOCKLY_API}/group/getAll`)
      .then((response) => {
        console.log("Groups data:", response.data);
        setGroups(response.data.groups || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen der Gruppenliste:", err);
        setError("Fehler beim Laden der Gruppen.");
        setLoading(false);
      });
  }, []);

  const handleUnarchive = (groupId) => {
    axios
      .patch(
        `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/archive`,
        { archived: false },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .then((response) => {
        console.log("Gruppe wiederhergestellt:", response.data);
        setGroups((prevGroups) =>
          prevGroups.map((group) =>
            group._id === groupId ? { ...group, archived: false } : group,
          ),
        );
      })
      .catch((err) => {
        console.error("Fehler beim Wiederherstellen der Gruppe:", err);
      });
  };

  const handleDelete = (groupId) => {
    axios
      .delete(
        `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/leave/delete`,
      )
      .then(() => {
        setGroups((prevGroups) =>
          prevGroups.filter((group) => group._id !== groupId),
        );
      })
      .catch((err) => {
        console.error("Fehler beim Löschen der Gruppe:", err);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "85vh",
        width: "100%",
        padding: "20px",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Archivierte Gruppen
      </Typography>

      {loading && <CircularProgress />}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && groups.length === 0 && (
        <p>Keine Gruppen gefunden.</p>
      )}

      {!loading && !error && groups.length > 0 && (
        <Box sx={{ width: "100%", maxWidth: "400px" }}>
          {groups.map((group, index) => (
            <Box key={group._id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                }}
              >
                <Typography
                  sx={{
                    cursor: "pointer",
                    textAlign: "center",
                    flex: 0.2,
                  }}
                  onClick={() => {
                    handleUnarchive(group._id);
                    navigate(`/group/${group._id}`);
                  }}
                >
                  {group.name}
                </Typography>

                <IconButton
                  aria-label="Gruppe löschen"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(group._id);
                  }}
                  sx={{ ml: 1 }}
                >
                  <DoorBack fontSize="small" />
                </IconButton>
              </Box>

              {index < groups.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      )}

      <Button
        variant="contained"
        onClick={() => navigate("/group")}
        sx={{ mt: 3, alignSelf: "flex-start" }}
      >
        Neue Gruppe erstellen
      </Button>
    </Box>
  );
}
