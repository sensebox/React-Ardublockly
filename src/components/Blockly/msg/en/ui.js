export const UI = {
  /**
   * Toolbox
   */
  toolbox_sensors: "Sensors",
  toolbox_logic: "Logic",
  toolbox_loops: "Loops",
  toolbox_math: "Math",
  toolbox_io: "Input/Output",
  toolbox_time: "Time",
  toolbox_time_control: "Time control",
  toolbox_rtc: "RTC",
  toolbox_ntp: "NTP",
  toolbox_functions: "Functions",
  toolbox_variables: "Variables",
  toolbox_serial: "Serial",
  toolbox_advanced: "Advanced",
  toolbox_motors: "Motors",
  toolbox_label_externalRTC: "External RTC",
  toolbox_label_internalRTC: "Internal RTC",
  toolbox_label_led_matrix: "LED-Matrix",
  toolbox_label_led_ws2812: "RGB-LED",
  variable_NUMBER: "Number (int)",
  variable_SHORT_NUMBER: "char",
  variable_LONG: "Big number (long)",
  variable_DECIMAL: "Decimal (float)",
  variable_BITMAP: "Bitmap (LED-Matrix)",
  variables_TEXT: "Text (string)",
  variables_ARRAY: "Array (array)",
  variables_CHARACTER: "Character (char)",
  variables_BOOLEAN: "Boolean (boolean)",
  variables_NULL: "void (void)",
  variables_UNDEF: "undefined",
  variables_set: "set",
  variables_to: "to",
  toolbox_internet_and_comms: "Data transmission",

  /**
   * Tooltips
   *
   */

  tooltip_compile_code: "Compile code",
  tooltip_save_blocks: "Save blocks",
  tooltip_open_blocks: "Open blocks",
  tooltip_screenshot: "Download screenshot",
  tooltip_clear_workspace: "Reset workspace",
  tooltip_share_blocks: "Share blocks",
  tooltip_show_code: "Show code",
  tooltip_hide_code: "Hide code",
  tooltip_delete_project: "Delete project",
  tooltip_project_name: "Project name",
  tooltip_download_project: "Download project",
  tooltip_open_project: "Open project",
  tooltip_update_project: "Update project",
  tooltip_save_project: "Save project",
  tooltip_create_project: "Create project",
  tooltip_share_project: "Share project",
  tooltip_reset_workspace: "Reset workspace",
  tooltip_copy_link: "Cooy link",
  tooltip_trashcan_hide: "hide deleted blocks",
  tooltip_trashcan_delete: "empty trashcan",
  tooltip_project_title: "Project title",
  tooltip_check_solution: "Check solution",
  tooltip_copy_code: "Copy Code to clipboard",
  tooltip_statistics_current: "Number of current blocks",
  tooltip_statistics_new: "Number of new blocks",
  tooltip_statistics_changed: "Number of changed blocks",
  tooltip_statistics_moved: "Number of moved blocks",
  tooltip_statistics_deleted: "Number of deleted blocks",
  tooltip_statistics_remaining: "Remaining blocks",
  tooltip_statistics_show: "Show statistics",
  tooltip_start_tour: "start Tour",

  /**
   * Messages
   *
   */

  messages_delete_project_failed: "Error deleting the project. Try again.",
  messages_reset_workspace_success: "The project has been successfully reset.",
  messages_PROJECT_UPDATE_SUCCESS: "The project was successfully updated.",
  messages_GALLERY_UPDATE_SUCCESS:
    "The gallery project was successfully updated.",
  messages_PROJECT_UPDATE_FAIL: "Error updating the project. Try again.",
  messages_GALLERY_UPDATE_FAIL:
    "Error updating the gallery project. Try again.",
  messages_gallery_save_fail_1: "Error saving the ",
  messages_gallery_save_fail_2: "Project. Try again.",
  messages_SHARE_SUCCESS: "Share program",
  messages_SHARE_FAIL:
    "Error creating a link to share your program. Try again.",
  messages_copylink_success: "Link successfully saved to clipboard.",
  messages_rename_success_01: "The project was successfully saved to ",
  messages_rename_success_02: "renamed.",
  messages_newblockly_head:
    "Welcome to the new version Blockly for the senseBox",
  messages_newblockly_text:
    "The new Blockly version is currently in testing. If you find any errors please report them in our [forum](https://forum.sensebox.de/t/neue-blockly-version-beta-test-und-feedback/1176). You can find an overview of all new features [here](/news)",
  messages_GET_TUTORIAL_FAIL: "Back to tutorials overview",
  messages_LOGIN_FAIL: "The username or password is incorrect.",
  messages_login_error: "Enter both a username and a password.",
  messages_copy_code: "Copy code to clipboard succesfull",
  messages_reserve_word:
    "is a reserved word and cannot be used as a variable name.",
  messages_invalid_variable_name:
    "Invalid variable name, only letters, numbers and underscores are allowed.",

  /**
   * Tablet Dialog
   */
  tabletDialog_headline: "Tablet mode is enabled!",
  tabletDialog_text:
    "Tablet mode has been activated. You can now copy program codes to your senseBox via the senseBox Connect app. Tablet mode can be deactivated in the settings",
  tabletDialog_more:
    "For more information and the link to download the app, please visit: ",

  /**
   * Reset Dialog
   */

  resetDialog_headline: "Reset workspace?",
  resetDialog_text:
    "Do you really want to reset the workspace? All blocks will be deleted!",
  reset_text: "Reset",

  /**
   * Share Dialog
   */

  sharedialog_headline: "Your link has been created.",
  sharedialog_text: "You can share your program using the following link.",

  /**
   * Project rename Dialog
   */

  renamedialog_headline: "Rename project",
  renamedialog_text:
    "Please enter a name for the project and confirm it by clicking 'Confirm'.",
  /**
   * Compile Dialog
   *
   */

  compiledialog_headline: "Error",
  compiledialog_text:
    "While compiling an error occured. Please check your blocks and try again",
  compile_animation_downloads: "Downloads",
  compile_animation_downloading: "Downloading...",
  compile_animation_downloadComplete: "Download complete",
  compile_animation_fileName: "sketch.bin",
  dragdrop_icon_quickAccess: "Quick Access",
  dragdrop_icon_desktop: "Desktop",
  dragdrop_icon_downloads: "Downloads",
  dragdrop_icon_documents: "Documents",
  dragdrop_icon_pictures: "Pictures",
  dragdrop_icon_sensebox: "SENSEBOX (E:)",
  dragdrop_icon_fileName: "sketch.bin",

  /**
   * File Upload Dialog
   */
  warning_file_board:
    "The selected board type differs from the board type of the loaded project. The project may not work as expected.",
  dialog_confirm:
    "Do you really want to insert the project from the XML file? All current blocks will be deleted.",
  warning_old_xml_file:
    "The XML file is from an older version of Blockly. The board will be defaulted to 'senseBox MCU.",

  /** Open Project */
  dialog_title: "Load blocks from XML file",
  no_blocks_found_title: "No Blocks Found",
  no_blocks_found_text:
    "No blocks were detected. Please check the XML code and try again.",
  xml_loaded: "The project from the XML file has been successfully inserted.",
  no_valid_data_type_title: "Invalid File Type",
  no_valid_data_type_text:
    "The provided file did not match the required format. Only XML files are allowed.",
  no_valid_xml_title: "Invalid XML",
  no_valid_xml_text:
    "The XML file could not be parsed into blocks. Please check the XML code and try again.",

  /**
   * Buttons
   *
   */

  button_cancel: "Cancel",
  button_close: "Close",
  button_accept: "Ok",
  button_compile: "Compile",
  button_create_variableCreate: "Create Variable",
  button_back: "Back",
  button_next: "Next step",
  button_tutorial_overview: "Tutorial overview",
  button_login: "Login",
  button_createVariable: "Create Typed Variable",

  /**
   *
   */

  filename: "Filename",
  projectname: "Projectname",
  /**
   * Settings
   */
  settings_head: "Settings",
  settings_language: "Language",
  settings_language_text:
    "Selection of the language applies to the entire application. A distinction can be made between German and English.",
  settings_language_de: "German",
  settings_language_en: "English",
  settings_renderer: "Renderer",
  settings_renderer_text:
    "The selected renderer determines the appearance of the blocks. A distinction can be made between 'Geras' and 'Zelos', whereby 'Zelos' is particularly suitable for a touch application.",
  settings_statistics: "Statistics",
  settings_statistics_text:
    "The display of statistics on the usage of the blocks above the workspace can be shown or hidden.",
  settings_statistics_on: "On",
  settings_statistics_off: "Off",
  settings_ota_head: "Tablet mode",
  settings_ota_text:
    "Tablet mode disables the code display and enables the possibility to transfer the program code via the senseBox Connect app. You can find more information on: ",
  settings_ota_on: "Activated",
  settings_ota_off: "Deactivated",
  settings_sounds: "Sound",
  settings_sounds_text:
    "Enable or disable sounds when adding and deleting blocks. Disabled by default",
  settings_board: "Board",
  settings_board_text: "Choose your board",
  settings_compiler: "Compiler URL",
  settings_compiler_text:
    "Enter the URL of the compiler you want to use. The default compiler is: https://compiler.sensebox.de",
  settings_compiler_helperText: "Die URL must start https:// or http://",
  settings_compiler_readOnly: "Change compiler URL",

  /**
   * 404
   */

  notfound_head: "The page you requested cannot be found.",
  notfound_text:
    "The page you are looking for may have been removed, its name changed, or it may be temporarily unavailable.",

  /**
   * Labels
   */
  labels_donotshowagain: "Do not show dialog again",
  labels_here: "here",
  labels_username: "Email or username",
  labels_password: "Password",

  /**
   * Tutorials
   */
  tutorials_home_head: "Tutorials",
  tutorials_assessment_task: "Task",
  tutorials_hardware_head:
    "For the implementation you need the following hardware:",
  tutorials_hardware_moreInformation:
    "You can find more information about the hardware component.",
  tutorials_hardware_here: "here",
  tutorials_requirements:
    "Before continuing with this tutorial, you should have successfully completed the following tutorials:",

  /**
   * Tutorial Builder
   */
  uilder_createNew: "create new Tutorial",
  builder_changeExisting: "change existing Tutorial",
  builder_deleteExisting: "remove existing Tutorial",
  builder_solution: "Solution",
  builder_solution_submit: "Submit Solution",
  builder_example_submit: "Submit example",
  builder_comment:
    "Note: You can delete the initial setup() or infinite loop() block. Additionally, it is possible to select only any block, among others, without displaying it as disabled.",
  builder_hardware_order: "Note that the order of selection is authoritative.",
  builder_hardware_helper: "Select at least one hardware component.",
  builder_requirements_head: "Requirements.",
  builder_requirements_order:
    "Note that the order of ticking is authoritative.",
  builder_difficulty: "Difficulty level",
  builder_public_head: "Publish tutorial",
  builder_public_label: "Publish tutorial for all users",
  builder_review_head: "Publish tutorial",
  builder_review_text:
    "You can share your tutorial with other people directly from the link. If you want to publish your tutorial for all users in the overview you can activate it here. An administrator will view your tutorial and then activate it.",

  // Gallery

  gallery_home_head: "Gallery",
  show_in_blockly: "Show",
  searchQuery_placeholder: "Search for project title",
  my_projects: "Show only my projects",
  no_projects_found: "No projects found.",
  delete_project: "Are you sure you want to delete this project?",
  delete: "Delete",
  edit_project: "Edit project",
  confirm: "Confirm",
  /**
   * Login
   */

  login_head: "Login",
  login_osem_account_01: "You need to have an ",
  login_osem_account_02: "Account to login",
  login_lostpassword: "Lost your password?",
  login_createaccount:
    "If you don't have an openSenseMap account please register on ",

  /**
   * Navbar
   */
  navbar_blockly: "Blockly",
  navbar_tutorials: "Tutorials",
  navbar_tutorialbuilder: "Create tutorial",
  navbar_gallery: "Gallery",
  navbar_projects: "Projects",

  navbar_menu: "Menu",
  navbar_login: "Login",
  navbar_account: "Account",
  navbar_logout: "Logout",
  navbar_settings: "Settings",

  /**
   * Codeviewer
   */

  codeviewer_arduino: "Arduino Source Code",
  codeviewer_xml: "XML Blocks",
  codeviewer_simulator: "Simulator",
  codeviewer_debug: "Debug",
  codeviewer_graph: "Graph",

  /**
   * Overlay
   */

  compile_overlay_head: "Your program is now compiled and downloaded",
  compile_overlay_text: "Then copy it to your senseBox MCU",
  compile_overlay_text_esp32:
    "Then you can transfer it to your MCU-S2 but please be patient for a moment.\n As soon as the program code has been successfully transferred, the RGB LED lights up green.\n This process can take up to 60 seconds.",
  compile_overlay_help: "You need help? Have a look here: ",

  /**
   * Tooltip Viewer
   */

  tooltip_viewer: "Help",
  tooltip_moreInformation: "More information",
  tooltip_moreInformation_02: "Information about the Block",
  tooltip_hint: "Select a Block to show the hint",

  // path: src/components/Blockly/msg/en/ui.js
  /**
   * IDEDrawer
   */
  drawer_ideerror_head: "Oops something went wrong",
  drawer_ideerror_text: "An error occurred while compiling, check your blocks",

  /**
   * Code Editor
   * */
  codeeditor_libraries_head: "Installed Arduino Libraries",
  codeeditor_libraries_text:
    "Below are all arduino libraries which are installed on the compiler. You can use them in your code. For more information click on the library.",
  codeeditor_compile_code: "Compile code",
  codeeditor_save_code: "Download code",
  codeeditor_open_code: "Open code",
  codeeditor_reset_code: "Reset code",
  codeeditor_blockly_code: "Load blockly code",
  codeeditor_compile_progress:
    "Your code will now be compiled and then downloaded to your computer",

  /**
   * Error view
   */

  suggestion_pre_text: "Maybe you should try:",
  display_not_declared: "Initialise the display in the setup() function",
  variable_redeclared:
    "Make sure that you do not use any special characters in your variable names. This includes spaces, asterisks or quotation marks.",
  /**
   * Device Selection
   * */

  deviceselection_head: "Which board are you using?",
  deviceselection_keep_selection:
    "Save my choice (You can change the board later in the settings)",
  deviceselection_footnote:
    "Here you can access the old blockly Version for the",
  deviceselection_footnote_02: "or the",

  /**
   * Sensor Markdown Information
   * */
  sensorinfo_info: "Informationen regarding the Sensor",
  sensorinfo_description: "Description",
  sensorinfo_measurable_phenos: "Measurable Phenomena",
  sensorinfo_manufacturer: "Manufacturer",
  sensorinfo_lifetime: "Lifetime",
  sensorinfo_explanation:
    "This information was fetched from [sensors.wiki](https://sensors.wiki). For more information visit the section on this sensor ",

  /**
   * Compile Dialog
   */
  compile_overlay_compile: "Compilation in progress...",
  compile_overlay_download: "Preparing download...",
  compile_overlay_transfer: "Transfer the file to your senseBox",
  compile_overlay_error: "An error has occurred",
  compile_overlay_app_transfer: "Preparing app transfer...",
  compile_overlay_code_compiled: "Code successfully compiled!",
  compile_overlay_start_transfer: "Start transfer",
  compile_overlay_close: "Close",
  compile_overlay_head: "Your program is now compiled and downloaded",
  compile_overlay_text: "Then copy it to your senseBox MCU",
  compile_overlay_help: "You need help? Have a look here: ",
  compile: "Compile",
  download: "Download",
  transfer: "Transfer",
  dialog_close: "Back to Blockly",
  goToApp: "Go to the Connect App",
  goToApp_text:
    "The code has been compiled successfully. Start with the transfer by clicking on the button below, redirecting you to the senseBox:connect App ! ",
  goToApp_title: "Over-The-Air Transfer",

  transfer_headline: "Transfer file",
  transfer_subline: "Drag the file from your downloads folder to the senseBox",
  steps_to_transfer: "Steps for transfer:",

  step_1: "1. Open the Downloads folder",
  file: "2. Find the file ",
  step_2: "",
  mcu_to_learnmode:
    "3. Set the MCU to learning mode (press the red reset button twice quickly)",
  step_3_mcu: "4. Drag and drop {filename}.bin onto the senseBox",
  step_3_esp32: "3. Drag and drop {filename}.bin onto the senseBox",

  // Labels for the icons below (Steps row)
  transfer_label_downloads: "Downloads",
  transfer_label_file: "{filename}.bin",
  transfer_label_sensebox: "senseBox",

  // Help link
  need_help: "Need help?",
  compile_overlay_help_2: "Check out our documentation!",

  button_register: "Register now",
  register_head: "Create your account",
  labels_confirm_password: "Confirm password",
  messages_password_mismatch: "Passwords do not match.",
  messages_password_too_short: "Password must be at least 6 characters.",
  messages_register_error: "Please fill in all fields.",
  already_have_account: "Already have an account?",
  no_account: "If you don't have an account ",
  register_success_head: "Account created!",
  register_success_message: "Your account has been successfully created.",
  register_success_login_prompt: "You can now log in with your credentials.",
};
