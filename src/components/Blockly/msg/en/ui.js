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
  toolbox_functions: "Functions",
  toolbox_variables: "Variables",
  toolbox_serial: "Serial",
  toolbox_advanced: "Erweitert",
  variable_NUMBER: "Number (int)",
  variable_SHORT_NUMBER: "char",
  variable_LONG: " Zahl (long)",
  variable_DECIMAL: "Decimal (float)",
  variables_TEXT: "Text (string)",
  variables_ARRAY: "Array (array)",
  variables_CHARACTER: "char (char)",
  variables_BOOLEAN: "Boolean (boolean)",
  variables_NULL: "void (void)",
  variables_UNDEF: "undefined",

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
  tooltip_copy_link: "Copy link",
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

  /**
   * Share Dialog
   */

  sharedialog_headline: "Your link has been created.",
  sharedialog_text: "You can share your program using the following link.",
  sharedialog_expiration: `The link is now valid for ${process.env.REACT_APP_SHARE_LINK_EXPIRES} days`,

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

  /**
   * Overlay
   */

  compile_overlay_head: "Your program is now compiled and downloaded",
  compile_overlay_text: "Then copy it to your senseBox MCU",
  compile_overlay_help: "You need help? Have a look here: ",

  /**
   * Tooltip Viewer
   */

  tooltip_viewer: "Help",
  tooltip_moreInformation: "More informations can be found ",
  tooltip_hint: "Select a Block to show the hint",

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
    "For documentation, view the installed libraries and their examples",
  codeeditor_save_code: "Download code",
  codeeditor_open_code: "Open code",
  codeeditor_reset_code: "Reset code",
  codeeditor_blockly_code: "Load blockly code",
  codeeditor_compile_progress:
    "Your code will now be compiled and then downloaded to your computer",
};
