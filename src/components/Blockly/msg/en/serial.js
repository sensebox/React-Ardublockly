// src/components/Blockly/msg/en/serial.js
export const SERIAL = {
  /**
   * Web Serial Connection
   */
  serial_connected: "Connected",
  serial_not_connected: "Not connected",
  serial_connect: "Connect",
  serial_disconnect: "Disconnect",
  serial_play: "Play",
  serial_stop: "Stop",
  serial_loop: "Loop",
  serial_loop_tooltip: "Loop mode: Program runs repeatedly",
  serial_help: "Help",
  serial_save_project: "Save project",
  serial_save: "Save",
  serial_status_prefix: "Web Serial —",

  /**
   * Help Modal
   */
  serial_help_welcome_title: "Welcome!",
  serial_help_welcome_text:
    "With this toolbar you can connect the senseBox, start, stop and loop programs.",
  serial_help_controls_title: "Run / Stop / Loop",
  serial_help_controls_text:
    "Play sends RUN, Stop sends STOP. Loop enables repeated execution (sends LOOP).",
  serial_help_back: "Back",
  serial_help_next: "Next",

  /**
   * Unsupported Browser Modal
   */
  serial_unsupported_title: "Browser not supported",
  serial_unsupported_description:
    "Your browser does not support the Web Serial API, which is required to connect to the senseBox.",
  serial_unsupported_use_browser: "Please use one of the following browsers:",
  serial_unsupported_chrome: "Google Chrome (version 89 or higher)",
  serial_unsupported_edge: "Microsoft Edge (version 89 or higher)",
  serial_unsupported_opera: "Opera (version 75 or higher)",
  serial_unsupported_note:
    "Note: The Web Serial API currently only works on desktop browsers, not on mobile devices. Use the senseBox Basic App for mobile devices!",
  serial_unsupported_understood: "Got it",

  /**
   * Save Project Dialog
   */
  serial_save_dialog_title: "Save project",
  serial_save_dialog_title_field: "Title",
  serial_save_dialog_description_field: "Description",
};
