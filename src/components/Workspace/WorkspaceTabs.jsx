import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Blockly from "blockly/core";

import {
  Box,
  Button,
  IconButton,
  InputBase,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClone,
  faPen,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import Dialog from "@/components/ui/Dialog";
import {
  addTab,
  closeAllTabs,
  closeTab,
  duplicateTab,
  MAX_TAB_NAME_LENGTH,
  renameTab,
  reorderTabs,
  switchTab,
} from "@/actions/tabActions";
import { MAX_TABS } from "@/reducers/tabsReducer";

const CLOSE_ALL = "__all__";

// names are shown in full up to this length, longer ones get an ellipsis
const NAME_DISPLAY_LENGTH = 24;
const displayName = (name = "") =>
  name.length > NAME_DISPLAY_LENGTH
    ? `${name.slice(0, NAME_DISPLAY_LENGTH)}…`
    : name;

// Inline name editor shown inside the tab. Enter or leaving the field saves,
// Escape cancels.
function TabNameInput({ name, onCommit, onCancel }) {
  const cancelled = useRef(false);
  return (
    <InputBase
      autoFocus
      defaultValue={name}
      onFocus={(event) => event.target.select()}
      inputProps={{
        maxLength: MAX_TAB_NAME_LENGTH,
        "aria-label": Blockly.Msg.tabs_rename_input,
        "data-testid": "workspace-tab-name-input",
      }}
      // keep keys and clicks away from the tab (arrow-key navigation, switching)
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      onKeyUp={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === "Enter") {
          event.preventDefault();
          event.target.blur();
        } else if (event.key === "Escape") {
          cancelled.current = true;
          onCancel();
        }
      }}
      onBlur={(event) => {
        if (cancelled.current) return;
        onCommit(event.target.value);
      }}
      sx={{
        flex: 1,
        minWidth: 0,
        fontSize: "inherit",
        fontWeight: "inherit",
        px: 0.5,
        borderRadius: 1,
        bgcolor: "action.hover",
        "& input": { p: 0 },
      }}
    />
  );
}

function WorkspaceTabs() {
  const dispatch = useDispatch();
  const { tabs, activeId } = useSelector((state) => state.tabs);
  // re-render on language change so Blockly.Msg texts update
  useSelector((state) => state.general.language);

  // id of the tab to close, or CLOSE_ALL for "close all tabs"
  const [tabToClose, setTabToClose] = useState(null);
  const closingAll = tabToClose === CLOSE_ALL;
  const [editingId, setEditingId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);
  const limitReached = tabs.length >= MAX_TABS;

  const handleClose = (event, id) => {
    event.stopPropagation();
    setTabToClose(id);
  };

  const commitRename = (id, name) => {
    dispatch(renameTab(id, name));
    setEditingId(null);
  };

  // drag & drop reordering (native HTML5 drag events)
  const indexOf = (id) => tabs.findIndex((tab) => tab.id === id);

  const dropIndicator = (id) => {
    if (!draggingId || dropTargetId !== id || draggingId === id) return null;
    // the dragged tab lands on the side it is coming from
    return indexOf(draggingId) < indexOf(id) ? "right" : "left";
  };

  const dragHandlers = (tab) => ({
    draggable: editingId !== tab.id,
    onDragStart: (event) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", tab.id);
      setDraggingId(tab.id);
    },
    onDragOver: (event) => {
      if (!draggingId || draggingId === tab.id) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      if (dropTargetId !== tab.id) setDropTargetId(tab.id);
    },
    onDragLeave: (event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        setDropTargetId((current) => (current === tab.id ? null : current));
      }
    },
    onDrop: (event) => {
      event.preventDefault();
      if (draggingId && draggingId !== tab.id) {
        dispatch(reorderTabs(draggingId, tab.id));
      }
      setDraggingId(null);
      setDropTargetId(null);
    },
    onDragEnd: () => {
      setDraggingId(null);
      setDropTargetId(null);
    },
  });

  const confirmClose = () => {
    dispatch(closingAll ? closeAllTabs() : closeTab(tabToClose));
    setTabToClose(null);
  };

  return (
    // Browser-like tab strip: rounded, bordered tabs on a tinted bar
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 0.5,
        borderRadius: 2.5,
        bgcolor: "action.hover",
        border: 1,
        borderColor: "divider",
      }}
    >
      <Tabs
        value={activeId}
        onChange={(event, id) => dispatch(switchTab(id))}
        variant="scrollable"
        scrollButtons="auto"
        aria-label={Blockly.Msg.tabs_label}
        TabIndicatorProps={{ sx: { display: "none" } }}
        sx={{
          minHeight: 34,
          flexShrink: 1,
          "& .MuiTabs-flexContainer": { gap: 0.75 },
        }}
      >
        {tabs.map((tab) => {
          const editing = editingId === tab.id;
          const indicator = dropIndicator(tab.id);
          return (
            <Tab
              key={tab.id}
              value={tab.id}
              // div instead of button so the rename input is valid and focusable
              component="div"
              disableRipple={editing}
              data-testid="workspace-tab"
              {...dragHandlers(tab)}
              onKeyDown={(event) => {
                if (event.key === "F2" && !editing) {
                  event.preventDefault();
                  setEditingId(tab.id);
                }
              }}
              sx={{
                minHeight: 34,
                minWidth: 140,
                maxWidth: "none",
                py: 0.5,
                px: 1.5,
                textTransform: "none",
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
                color: "text.secondary",
                opacity: draggingId === tab.id ? 0.5 : 1,
                cursor: editing ? "text" : "pointer",
                // drop position while dragging another tab over this one
                boxShadow: (theme) =>
                  indicator
                    ? `inset ${indicator === "left" ? 3 : -3}px 0 0 ${theme.palette.primary.main}`
                    : "none",
                transition: "background-color 120ms, border-color 120ms",
                "&:hover": { borderColor: "text.disabled" },
                "&.Mui-selected": {
                  color: "text.primary",
                  fontWeight: 600,
                  borderColor: "primary.main",
                  boxShadow: (theme) =>
                    [
                      `0 0 0 1px ${theme.palette.primary.main}`,
                      indicator &&
                        `inset ${indicator === "left" ? 3 : -3}px 0 0 ${theme.palette.primary.main}`,
                    ]
                      .filter(Boolean)
                      .join(", "),
                },
                "&.Mui-focusVisible": {
                  outline: 2,
                  outlineColor: "primary.main",
                  outlineOffset: 2,
                },
              }}
              label={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    width: "100%",
                    minWidth: 0,
                  }}
                >
                  {editing ? (
                    <TabNameInput
                      name={tab.name}
                      onCommit={(name) => commitRename(tab.id, name)}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <Tooltip
                      title={
                        tab.name.length > NAME_DISPLAY_LENGTH ? (
                          <>
                            {tab.name}
                            <br />
                            {Blockly.Msg.tabs_rename}
                          </>
                        ) : (
                          Blockly.Msg.tabs_rename
                        )
                      }
                      enterDelay={800}
                      enterNextDelay={800}
                    >
                      <Box
                        component="span"
                        data-testid="workspace-tab-name"
                        onDoubleClick={() => setEditingId(tab.id)}
                        sx={{
                          flex: 1,
                          textAlign: "left",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {displayName(tab.name)}
                      </Box>
                    </Tooltip>
                  )}
                  {!editing && tab.id === activeId && (
                    <Tooltip title={Blockly.Msg.tabs_rename_button}>
                      <IconButton
                        component="span"
                        size="small"
                        aria-label={Blockly.Msg.tabs_rename_button}
                        data-testid="workspace-tab-rename"
                        onMouseDown={(event) => event.stopPropagation()}
                        onClick={(event) => {
                          event.stopPropagation();
                          setEditingId(tab.id);
                        }}
                        sx={{ p: 0.5, borderRadius: 1, opacity: 0.7 }}
                      >
                        <FontAwesomeIcon icon={faPen} size="xs" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {!editing && tab.id === activeId && (
                    <Tooltip
                      title={
                        limitReached
                          ? Blockly.Msg.tabs_limit_reached
                          : Blockly.Msg.tabs_duplicate
                      }
                    >
                      {/* span wrapper so the tooltip also works when disabled */}
                      <span>
                        <IconButton
                          component="span"
                          size="small"
                          aria-label={Blockly.Msg.tabs_duplicate}
                          data-testid="workspace-tab-duplicate"
                          disabled={limitReached}
                          onMouseDown={(event) => event.stopPropagation()}
                          onClick={(event) => {
                            event.stopPropagation();
                            dispatch(duplicateTab(tab.id));
                          }}
                          sx={{ p: 0.5, borderRadius: 1, opacity: 0.7 }}
                        >
                          <FontAwesomeIcon icon={faClone} size="xs" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )}
                  {tabs.length > 1 && (
                    <Tooltip title={Blockly.Msg.tabs_close}>
                      <IconButton
                        component="span"
                        size="small"
                        aria-label={Blockly.Msg.tabs_close}
                        data-testid="workspace-tab-close"
                        onClick={(event) => handleClose(event, tab.id)}
                        sx={{ p: 0.5, ml: 0.25, borderRadius: 1 }}
                      >
                        <FontAwesomeIcon icon={faXmark} size="xs" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              }
            />
          );
        })}
      </Tabs>

      <Tooltip
        title={
          limitReached ? Blockly.Msg.tabs_limit_reached : Blockly.Msg.tabs_new
        }
      >
        {/* span wrapper so the tooltip also works on the disabled button */}
        <span>
          <IconButton
            size="small"
            aria-label={Blockly.Msg.tabs_new}
            data-testid="workspace-tab-add"
            onClick={() => dispatch(addTab())}
            disabled={limitReached}
            sx={{ borderRadius: 2, width: 32, height: 32 }}
          >
            <FontAwesomeIcon icon={faPlus} size="xs" />
          </IconButton>
        </span>
      </Tooltip>

      {tabs.length > 1 && (
        <Button
          size="small"
          data-testid="workspace-tab-close-all"
          onClick={() => setTabToClose(CLOSE_ALL)}
          startIcon={<FontAwesomeIcon icon={faXmark} size="xs" />}
          sx={{
            ml: "auto",
            flexShrink: 0,
            textTransform: "none",
            borderRadius: 2,
            color: "text.secondary",
            whiteSpace: "nowrap",
          }}
        >
          {Blockly.Msg.tabs_close_all}
        </Button>
      )}

      <Dialog
        open={tabToClose !== null}
        title={
          closingAll
            ? Blockly.Msg.tabs_close_all_headline
            : Blockly.Msg.tabs_close_headline
        }
        content={
          closingAll
            ? Blockly.Msg.tabs_close_all_confirm
            : Blockly.Msg.tabs_close_confirm
        }
        onClose={() => setTabToClose(null)}
        actions={
          <>
            <Button onClick={() => setTabToClose(null)}>
              {Blockly.Msg.button_cancel}
            </Button>
            <Button
              variant="contained"
              color="primary"
              data-testid="workspace-tab-close-confirm"
              onClick={confirmClose}
            >
              {closingAll
                ? Blockly.Msg.tabs_close_all
                : Blockly.Msg.tabs_close_button}
            </Button>
          </>
        }
      />
    </Box>
  );
}

export default WorkspaceTabs;
