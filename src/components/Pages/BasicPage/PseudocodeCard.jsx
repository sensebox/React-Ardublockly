import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import { useSelector } from "react-redux";

const PseudocodeCard = ({ script, setScript, connected, onSend }) => {
  const theme = useTheme();
  const basicCode = useSelector((s) => s.workspace.code.basic);

  useEffect(() => {
    console.log("basicCode", basicCode);
  }, [basicCode]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        value={basicCode}
        multiline
        fullWidth
        sx={{
          flex: 1,
          "& .MuiInputBase-root": {
            height: "100%",
            alignItems: "start",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            overflow: "auto",
          },
          "& textarea": {
            height: "100% !important",
          },
        }}
        minRows={6}
      />

      <Button
        onClick={onSend}
        disabled={!connected}
        startIcon={<Send />}
        fullWidth
        sx={{
          background: theme.palette.background.white,
          color: theme.palette.primary.main,
          borderRadius: "50px",
          fontWeight: "bold",
          border: "1px solid",
          borderColor: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.white,
          },
        }}
      >
        Send Lines
      </Button>
    </Box>
  );
};

export default PseudocodeCard;
