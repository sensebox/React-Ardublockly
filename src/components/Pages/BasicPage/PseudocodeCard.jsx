import React from "react";
import {
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

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        flex: "1 1 0",
        minHeight: 0,
        "&:hover": { boxShadow: 6 },
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="h6"
            sx={{ fontWeight: 900, color: theme.palette.primary.main }}
          >
            Pseudocode (jede Zeile wird mit \n gesendet)
          </Typography>
        }
      />
      <CardContent sx={{ pt: 0, flex: "1 1 0", minHeight: 0, display: "flex" }}>
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
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
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
      </CardActions>
    </Card>
  );
};

export default PseudocodeCard;
