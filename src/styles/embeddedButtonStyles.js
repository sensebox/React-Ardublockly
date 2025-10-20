// Shared size/elevation for embedded touch targets
const embeddedTouchSizing = {
  width: "48px",
  height: "48px",
  padding: "12px",
  "&:hover": { transform: "scale(1.05)" },
  "&:active": { transform: "scale(0.95)" },
};

// Base factory for embedded IconButton-like styles
export const embeddedIconButtonBase = (theme, backgroundColor) => ({
  backgroundColor,
  color: theme.palette.primary.contrastText,
  ...embeddedTouchSizing,
  "&:hover": {
    backgroundColor,
    color: theme.palette.primary.contrastText,
    transform: "scale(1.05)",
  },
});

// Primary embedded button (Reset, Share, etc.)
export const embeddedPrimaryIconButton = (theme) =>
  embeddedIconButtonBase(theme, theme.palette.primary.main);

// Compile embedded button (uses compile color)
export const embeddedCompileIconButton = (theme) =>
  embeddedIconButtonBase(theme, theme.palette.button.compile);

// Workspace name pill for embedded toolbar
export const embeddedWorkspaceName = (theme) => ({
  height: "48px",
  backgroundColor: theme.palette.secondary.main,
  borderRadius: "25px",
  display: "inline-flex",
  cursor: "pointer",
  padding: "12px 16px",
  fontSize: "16px",
  fontWeight: 500,
  minWidth: "120px",
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark || theme.palette.secondary.main,
    transform: "scale(1.02)",
  },
  "&:active": {
    transform: "scale(0.98)",
  },
});

// Backwards-compatible factory to avoid breaking existing imports
// Returns the same shape used previously in components
export const getEmbeddedButtonStyles = (theme) => ({
  buttonEmbedded: embeddedPrimaryIconButton(theme),
  iconButtonEmbedded: embeddedCompileIconButton(theme),
  workspaceNameEmbedded: embeddedWorkspaceName(theme),
});
