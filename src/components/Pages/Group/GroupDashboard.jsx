import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, useTheme } from "@mui/material";



export default function GroupDashboard() {

  const { groupId } = useParams();
 //const groupId = "69c11f27a00fd81147f96180"; 
  const theme = useTheme();
  console.log("Group ID from params:", groupId);

useEffect(() => {
  axios.get(`${import.meta.env.VITE_BLOCKLY_API}/group/${groupId}`)
    .then((response) => {
      console.log("Dashboard data:", response.data);
    })
    .catch((err) => {
      console.error("Fehler beim Abrufen des Dashboards:", err);
    });
}, [groupId]);

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
      <h1>Gruppen Dashboard</h1>
    </Box>
   );
}
