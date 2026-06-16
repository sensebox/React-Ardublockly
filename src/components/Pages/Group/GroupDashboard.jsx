import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import axios from "axios";
import { DoorBack } from "@mui/icons-material";

export default function GroupDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [members, setMembers] = useState([]);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);

  const [memberProgress, setMemberProgress] = useState({});

  useEffect(() => {
    localStorage.setItem("lastGroupId", groupId);
  }, [groupId]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BLOCKLY_API}/group/getOne/${groupId}`)
      .then((response) => {
        console.log("Group data:", response.data);
        setGroup(response.data.group || response.data.groups || response.data);
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen der Gruppe:", err);
      });
  }, [groupId]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BLOCKLY_API}/group/dashboard/${groupId}`)
      .then((response) => {
        console.log("Dashboard data:", response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen des Dashboards:", err);
        setError("Fehler beim Abrufen des Dashboards.");
        setLoading(false);
      });
  }, [groupId]);

  useEffect(() => {
    const fetchMembers = () => {
      axios
        .get(
          `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/member/getAll`,
        )
        .then((response) => {
          const fetchedMembers = response.data.members || [];
          console.log("Members data:", response.data);
          setMembers(fetchedMembers);
          setLoading(false);

          // Fetch progress for each member
          fetchedMembers.forEach((member) => {
            axios
              .get(
                `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/progress/getTutorialProgress/${member._id}`,
              )
              .then((res) => {
                setMemberProgress((prev) => ({
                  ...prev,
                  [member._id]: res.data,
                }));
              })
              .catch(() => {
                setMemberProgress((prev) => ({
                  ...prev,
                  [member._id]: null,
                }));
              });
          });
        })
        .catch((err) => {
          console.error("Fehler beim Abrufen der Mitglieder:", err);
          setError("Fehler beim Abrufen der Mitglieder.");
          setLoading(false);
        });
    };

    fetchMembers();
    const interval = setInterval(fetchMembers, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, [groupId]);

  const onSubmit = async () => {
    try {
      const membersResponse = await axios.get(
        `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/member/getAll`,
      );
      const membersToRemove = membersResponse.data?.members || [];

      await Promise.allSettled(
        membersToRemove.map((member) =>
          axios.put(
            `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/member/leave`,
            {
              groupId,
              memberId: member._id,
            },
          ),
        ),
      );

      const response = await axios.patch(
        `${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}/archive`,
        { archived: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log("Gruppe archiviert:", response.data);
      navigate("/group");
    } catch (err) {
      console.error("Fehler beim Archivieren:", err);
    }
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
      {/* Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab
            label="Schüler*innen"
            onClick={() => navigate(`/groups/${groupId}`)}
          />
          <Tab
            label="Tutorials"
            onClick={() => navigate(`/groups/${groupId}/tutorials`)}
          />
          <Tab
            label="Lösungsgallerie"
            onClick={() => navigate(`/groups/${groupId}/solutions`)}
          />
        </Tabs>
        <Box sx={{ ml: "auto", right: 10 }}>
          <Button startIcon={<DoorBack />} onClick={onSubmit}>
            verlassen & archivieren
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => navigate(`/createStudent/${groupId}`)}
          sx={{
            backgroundColor: "#4caf50",
            "&:hover": { backgroundColor: "#388e3c" },
          }}
        >
          Hinzufügen
        </Button>

        <Button
          variant="contained"
          startIcon={<VpnKeyIcon />}
          onClick={() => setShowPopUp(true)}
          sx={{
            backgroundColor: "#4caf50",
            "&:hover": { backgroundColor: "#388e3c" },
          }}
        >
          Zugangscode anzeigen
        </Button>

        <Dialog open={showPopUp} onClose={() => setShowPopUp(false)}>
          <DialogTitle>Zugangscode für die Gruppe:</DialogTitle>
          <DialogContent sx={{ minWidth: 320 }}>
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                color: "success.main",
                fontWeight: 800,
                letterSpacing: 2,
                py: 1,
              }}
            >
              {group?.accessCode}
            </Typography>
          </DialogContent>
        </Dialog>
      </Box>

      {!loading && !error && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Spitzname</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Tutorial</strong>
                </TableCell>
                <TableCell>
                  <strong>Fortschritt</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member, index) => {
                const user = member;
                const isOnline = user?.onlineStatus;
                const name = user?.name || "Unbekannt";
                const nickname = user?.nickname || "-";
                const lastSeenTs = user?.lastSeen
                  ? new Date(user.lastSeen).getTime()
                  : null;
                const isOfflineTooLong =
                  !isOnline &&
                  lastSeenTs !== null &&
                  Date.now() - lastSeenTs > 60 * 1000;
                return (
                  <TableRow key={member._id || `member-${index}`} hover>
                    <TableCell>{name}</TableCell>
                    <TableCell>{nickname}</TableCell>
                    <TableCell sx={{ verticalAlign: "middle" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: isOnline
                              ? "success.main"
                              : "error.main",
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: isOnline ? "text.primary" : "text.secondary",
                          }}
                        >
                          {isOnline ? "Online" : "Offline"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {isOfflineTooLong
                        ? "-"
                        : memberProgress[member._id]?.tutorialTitle || "–"}
                    </TableCell>
                    <TableCell>
                      {isOfflineTooLong
                        ? "-"
                        : memberProgress[member._id]?.currentStep &&
                            memberProgress[member._id]?.totalSteps
                          ? `${memberProgress[member._id].currentStep} / ${memberProgress[member._id].totalSteps}`
                          : "–"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
