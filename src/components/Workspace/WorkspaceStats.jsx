import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as Blockly from "blockly/core";
import {
  Box,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Popover,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPuzzlePiece,
  faPlus,
  faPen,
  faArrowsAlt,
  faTrash,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";

const WorkspaceStats = () => {
  const theme = useTheme();
  const isBig = useMediaQuery(theme.breakpoints.up("sm"));

  // Redux-State
  const stats = useSelector((s) => s.workspace.stats);
  const workspaceChange = useSelector((s) => s.workspace.change);

  // Popover-Anker
  const [anchorEl, setAnchorEl] = useState(null);

  // Workspace-Metriken
  const [wsMetrics, setWsMetrics] = useState({ total: 0, remaining: null });
  useEffect(() => {
    const ws = Blockly.getMainWorkspace();
    setWsMetrics({
      total: ws?.getAllBlocks().length ?? 0,
      remaining:
        ws && ws.remainingCapacity() !== Infinity
          ? ws.remainingCapacity()
          : null,
    });
  }, [workspaceChange]);

  // Daten für Chips
  const chipData = [
    {
      label: wsMetrics.total,
      icon: faPuzzlePiece,
      title: Blockly.Msg.tooltip_statistics_current,
    },
    {
      label: stats.create > 0 ? stats.create : 0,
      icon: faPlus,
      title: Blockly.Msg.tooltip_statistics_new,
    },
    {
      label: stats.change,
      icon: faPen,
      title: Blockly.Msg.tooltip_statistics_changed,
    },
    {
      label: stats.move > 0 ? stats.move : 0,
      icon: faArrowsAlt,
      title: Blockly.Msg.tooltip_statistics_moved,
    },
    {
      label: stats.delete,
      icon: faTrash,
      title: Blockly.Msg.tooltip_statistics_deleted,
    },
    ...(wsMetrics.remaining != null
      ? [
          {
            label: wsMetrics.remaining,
            icon: null,
            title: Blockly.Msg.tooltip_statistics_remaining,
          },
        ]
      : []),
  ];

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Alle Chips rendern
  const chips = chipData.map(({ label, icon, title }, idx) => (
    <Tooltip key={idx} title={title} arrow>
      <Chip
        variant="outlined"
        color="primary"
        style={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
        avatar={
          icon ? (
            <Avatar>
              <FontAwesomeIcon icon={icon} />
            </Avatar>
          ) : undefined
        }
        label={label}
        sx={{ mr: 1, mb: isBig ? 0 : 1 }}
      />
    </Tooltip>
  ));

  // Großes Display: Chips unten fix anzeigen
  if (isBig) {
    return (
      <Box
        sx={{
          display: "flex",
          whiteSpace: "nowrap",
          position: "absolute",
          bottom: 0,
          width: "100%",
          p: 1,
          bgcolor: "transparent",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            whiteSpace: "nowrap",
            gap: 1,
          }}
        >
          {chips}
        </Box>{" "}
      </Box>
    );
  }

  // Kleines Display: Popover über Ellipsis-Button
  return (
    <>
      <Tooltip title={Blockly.Msg.tooltip_statistics_show} arrow>
        <IconButton size="large" onClick={handleOpen} sx={{}}>
          <FontAwesomeIcon icon={faEllipsisH} />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{ sx: { m: 1, p: 1 } }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>{chips}</Box>
      </Popover>
    </>
  );
};

export default WorkspaceStats;
