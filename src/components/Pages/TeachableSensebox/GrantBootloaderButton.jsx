import React from "react";
import { Usb as UsbIcon } from "@mui/icons-material";
import BlinkingButton from "./BlinkingButton";

/**
 * GrantBootloaderButton
 *
 * Green call-to-action shown while the sketch flash flow waits for the user
 * to grant access to the board's bootloader port. Blinks for 5 seconds every
 * time it appears (i.e. every time the flash flow enters the "grant" phase),
 * but not again once it was clicked.
 */
const GrantBootloaderButton = ({ onClick, disabled, children }) => (
  <BlinkingButton startIcon={<UsbIcon />} onClick={onClick} disabled={disabled}>
    {children}
  </BlinkingButton>
);

export default GrantBootloaderButton;
