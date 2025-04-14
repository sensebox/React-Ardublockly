import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";

export const StyledIconButton = styled(IconButton)(() => ({
  padding: 6,
  color: "#9AA0A6",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  "& .MuiSvgIcon-root": {
    // Hinzugefügt
    fontSize: "1.25rem",
  },
}));

export const StyledInput = styled("input")(() => ({
  background: "none",
  border: "none",
  color: "white",
  fontSize: 13,
  width: "100%",
  "&:focus": {
    outline: "none",
  },
  "&::placeholder": {
    color: "#9AA0A6",
  },
}));
