import { getBoardProfile, portFilters } from "@sensebox/flash-tool";

/**
 * Web Serial port filters for the senseBox MCU Eye (app and bootloader
 * product IDs), taken from the flash-tool board profile so the port picker
 * only lists MCU Eye boards.
 */
export const MCU_EYE_PORT_FILTERS = portFilters(getBoardProfile("MCU-EYE"));
