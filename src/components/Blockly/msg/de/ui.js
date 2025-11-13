// src/components/Blockly/msg/de/ui.js
export const UI = {
  /**
   * Toolbox
   */
  toolbox_sensors: "Sensoren",
  toolbox_logic: "Logik",
  toolbox_loops: "Schleifen",
  toolbox_math: "Mathematik",
  toolbox_io: "Eingang/Ausgang",
  toolbox_time: "Zeit",
  toolbox_time_control: "Zeitsteuerung",
  toolbox_rtc: "RTC",
  toolbox_ntp: "NTP",
  toolbox_functions: "Funktionen",
  toolbox_variables: "Variablen",
  toolbox_serial: "Seriell",
  toolbox_advanced: "Erweitert",
  toolbox_motors: "Motoren",
  toolbox_label_externalRTC: "Externe RTC",
  toolbox_label_internalRTC: "Interne RTC",
  toolbox_label_led_matrix: "LED-Matrix",
  toolbox_label_led_ws2812: "RGB-LED",
  variable_NUMBER: "Zahl (int)",
  variable_SHORT_NUMBER: "char",
  variable_LONG: "große Zahl (long)",
  variable_DECIMAL: "Kommazahl (float)",
  variable_BITMAP: "Bitmap (LED-Matrix)",
  variables_TEXT: "Text (string)",
  variables_ARRAY: "Array (array)",
  variables_CHARACTER: "Buchstabe (char)",
  variables_BOOLEAN: "Boolean (boolean)",
  variables_NULL: "void (void)",
  variables_UNDEF: "undefined",
  variables_set: "Schreibe",
  variables_to: "",
  toolbox_internet_and_comms: "Datenübertragung",

  /**
   * Tooltips
   *
   */

  tooltip_compile_code: "Code kompilieren",
  tooltip_save_blocks: "Blöcke speichern",
  tooltip_open_blocks: "Blöcke öffnen",
  tooltip_screenshot: "Screenshot erstellen",
  tooltip_clear_workspace: "Workspace zurücksetzen",
  tooltip_share_blocks: "Blöcke teilen",
  tooltip_show_code: "Code anzeigen",
  tooltip_hide_code: "Code ausblenden",
  tooltip_delete_project: "Projekt löschen",
  tooltip_project_name: "Name des Projektes",
  tooltip_download_project: "Projekt herunterladen",
  tooltip_open_project: "Projekt öffnen",
  tooltip_update_project: "Projekt aktualisieren",
  tooltip_save_project: "Projekt speichern",
  tooltip_create_project: "Projekt erstellen",
  tooltip_share_project: "Projekt teilen",
  tooltip_reset_workspace: "Workspace zurücksetzen",
  tooltip_copy_link: "Link kopieren",
  tooltip_trashcan_hide: "gelöschte Blöcke ausblenden",
  tooltip_trashcan_delete: "Blöcke endgültig löschen",
  tooltip_project_title: "Titel des Projektes",
  tooltip_check_solution: "Lösung kontrollieren",
  tooltip_copy_code: "Code in die Zwischenablage kopieren",
  tooltip_statistics_current: "Anzahl aktueller Blöcke",
  tooltip_statistics_new: "Anzahl neuer Blöcke",
  tooltip_statistics_changed: "Anzahl veränderter Blöcke",
  tooltip_statistics_moved: "Anzahl bewegter Blöcke",
  tooltip_statistics_deleted: "Anzahl gelöschter Blöcke",
  tooltip_statistics_remaining: "Verbleibende Blöcke",
  tooltip_statistics_show: "Statistiken anzeigen",
  tooltip_start_tour: "Tour starten",
  /**
   * Messages
   *
   */

  messages_delete_project_failed:
    "Fehler beim Löschen des Projektes. Versuche es noch einmal.",
  messages_reset_workspace_success:
    "Das Projekt wurde erfolgreich zurückgesetzt",
  messages_PROJECT_UPDATE_SUCCESS:
    "Das Projekt wurde erfolgreich aktualisiert.",
  messages_GALLERY_UPDATE_SUCCESS:
    "Das Galerie-Projekt wurde erfolgreich aktualisiert.",
  messages_PROJECT_UPDATE_FAIL:
    "Fehler beim Aktualisieren des Projektes. Versuche es noch einmal.",
  messages_GALLERY_UPDATE_FAIL:
    "Fehler beim Aktualisieren des Galerie-Projektes. Versuche es noch einmal.",
  messages_gallery_save_fail_1: "Fehler beim Speichern des ",
  messages_gallery_save_fail_2: "Projektes. Versuche es noch einmal.",
  messages_SHARE_SUCCESS: "Programm teilen",
  messages_SHARE_FAIL:
    "Fehler beim Erstellen eines Links zum Teilen deines Programmes. Versuche es noch einmal.",
  messages_copylink_success: "Link erfolgreich in Zwischenablage gespeichert.",
  messages_rename_success_01: "Das Projekt wurde erfolgreich in ",
  messages_rename_success_02: "umbenannt.",
  messages_newblockly_head:
    "Willkommen zur neuen senseBox Lern- und Programmierumgebung",
  messages_newblockly_text:
    "Nach einer Testphase kann die neue senseBox Lern- und Programmierumgebung verwendet werden. Wenn Sie weiterhin Fehler finden, melden Sie diesen bitte in unserem [Forum](https://forum.sensebox.de/t/neue-blockly-version-beta-test-und-feedback/1176). Eine Übersicht über alle neuen Funktionen finden Sie [hier](/news)",
  messages_GET_TUTORIAL_FAIL: "Zurück zur Tutorials-Übersicht",
  messages_LOGIN_FAIL: "Der Benutzername oder das Passwort ist nicht korrekt.",
  messages_copy_code: "Code wurde in die Zwischenablage kopiert",
  messages_reserve_word:
    "ist ein reserviertes Wort und kann nicht als Variablenname verwendet werden",
  messages_invalid_variable_name:
    "Der Variablenname ist ungültig. Verwende nur Buchstaben, Zahlen und Unterstriche.",
  /**
   * Tablet Dialog
   */

  tabletDialog_headline: "Tablet Modus ist aktiviert!",
  tabletDialog_text:
    "Der Tablet Modus wurde aktiviert. Du kannst nun Programmcodes über die senseBox Connect App auf deine senseBox kopieren. Der Tablet Modus kann in den Einstellungen deaktiviert werden",
  tabletDialog_more:
    "Weitere Informationen und den Link zum Download der App findest du unter: ",

  /**
   * Reset Dialog
   */

  resetDialog_headline: "Workspace zurücksetzen?",
  resetDialog_text:
    "Möchtest du wirklich die Workspace zurücksetzen? Hierbei werden alle Blöcke gelöscht!",
  reset_text: "Zurücksetzen",
  /**
   * Share Dialog
   */

  sharedialog_headline: "Dein Link wurde erstellt.",
  sharedialog_text: "Über den folgenden Link kannst du dein Programm teilen.",

  /**
   * Project rename Dialog
   */

  renamedialog_headline: "Projekt benennen",
  renamedialog_text:
    "Bitte gib einen Namen für das Projekt ein und bestätige diesen mit einem Klick auf 'Bestätigen'.",

  /**
   * Compile Dialog
   *
   */

  compiledialog_headline: "Fehler",
  compiledialog_text:
    "Beim kompilieren ist ein Fehler aufgetreten. Überprüfe deine Blöcke und versuche es erneut",
  compile_animation_downloads: "Downloads",
  compile_animation_downloading: "Wird heruntergeladen...",
  compile_animation_downloadComplete: "Herunterladen abgeschlossen",
  compile_animation_fileName: "sketch.bin",
  dragdrop_icon_quickAccess: "Schnellzugriff",
  dragdrop_icon_desktop: "Desktop",
  dragdrop_icon_downloads: "Downloads",
  dragdrop_icon_documents: "Dokumente",
  dragdrop_icon_pictures: "Bilder",
  dragdrop_icon_sensebox: "SENSEBOX (E:)",
  dragdrop_icon_fileName: "sketch.bin",
  /**
   * File Upload Dialog
   */

  warning_file_board:
    "Der ausgewählte Boardtyp unterscheidet sich von dem Boardtyp des geladenen Projekts. Möglicherweise funktioniert das Projekt nicht wie erwartet.",
  dialog_confirm:
    "Möchtest du das Projekt aus der XML-Datei wirklich einfügen? Alle aktuellen Blöcke werden gelöscht.",
  warning_old_xml_file:
    "Die XML-Datei wurde mit einer älteren Version von Blockly erstellt. Standardmäßig wird das Board auf 'senseBox MCU' gesetzt.",

  /** Open Project */
  dialog_title: "Blöcke öffnen",
  no_blocks_found_title: "Keine Blöcke",
  no_blocks_found_text:
    "Es wurden keine Blöcke detektiert. Bitte überprüfe den XML-Code und versuche es erneut.",
  xml_loaded: "Das Projekt aus der XML-Datei wurde erfolgreich eingefügt.",
  no_valid_data_type_title: "Unzulässiger Dateityp",
  no_valid_data_type_text:
    "Die übergebene Datei entsprach nicht dem geforderten Format. Es sind nur XML-Dateien zulässig.",
  no_valid_xml_title: "Ungültige XML",
  no_valid_xml_text:
    "Die XML-Datei konnte nicht in Blöcke zerlegt werden. Bitte überprüfe den XML-Code und versuche es erneut.",
  /**
   * Buttons
   *
   */

  button_cancel: "Abbrechen",
  button_close: "Schließen",
  button_save: "Speichern",
  button_accept: "Bestätigen",
  button_compile: "Kompilieren",
  button_create_variableCreate: "Erstelle Variable",
  button_back: "Zurück",
  button_next: "nächster Schritt",
  button_tutorial_overview: "Tutorial Übersicht",
  button_login: "Anmelden",
  button_createVariable: "Typisierte Variable erstellen",

  /**
   *
   */

  filename: "Dateiname",
  projectname: "Projektname",

  /**
   * Settings
   */
  settings_head: "Einstellungen",
  settings_language: "Sprache",
  settings_language_text:
    "Auswahl der Sprache gilt für die gesamte Anwendung. Es kann zwischen Deutsch und Englisch unterschieden werden.",
  settings_language_de: "Deutsch",
  settings_language_en: "Englisch",
  settings_renderer: "Renderer",
  settings_renderer_text:
    "Der eingestellte Renderer bestimmt das Aussehen der Blöcke. Es kann zwischen 'Geras' und 'Zelos' unterschieden werden, wobei 'Zelos' insbesondere für eine Touch-Anwendung geeignet ist.",
  settings_statistics: "Statistiken",
  settings_statistics_text:
    "Die Anzeige von Statistiken zur Nutzung der Blöcke oberhalb der Arbeitsfläche kann ein- oder ausgeblendet werden.",
  settings_statistics_on: "An",
  settings_statistics_off: "Aus",
  settings_ota_head: "Tablet Modus",
  settings_ota_text:
    "Der Tablet Modus deaktiviert die Code anzeige und aktiviert die Möglichkeit den Programmcode über die senseBox Connect App zu übertragen. Weitere Informationen dazu findest du unter: ",
  settings_ota_on: "Aktiviert",
  settings_ota_off: "Deaktiviert",
  settings_sounds: "Töne",
  settings_sounds_text:
    "Aktiviere oder Deaktiviere Töne beim hinzufügen und löschen von Blöcken. Standardmäßig deaktiviert",
  settings_board: "Board",
  settings_board_text: "Wähle dein verwendetes Board aus",
  settings_compiler: "Compiler URL",
  settings_compiler_text:
    "Geben die URL des Compilers ein, den du verwenden möchten. Die Standard-URL ist: https://compiler.sensebox.de",
  settings_compiler_helperText:
    "Die URL muss mit https:// oder http:// beginnen",
  settings_compiler_readOnly: "Compiler URL ändern",

  /**
   * 404
   */

  notfound_head: "Die von Ihnen angeforderte Seite kann nicht gefunden werden.",
  notfound_text:
    "Die gesuchte Seite wurde möglicherweise entfernt, ihr Name wurde geändert oder sie ist vorübergehend nicht verfügbar.",

  /**
   * Labels
   */

  labels_donotshowagain: "Dialog nicht mehr anzeigen",
  labels_here: "hier",
  labels_username: "E-Mail oder Nutzername",
  labels_password: "Passwort",

  /**
   * Tutorials
   */
  tutorials_home_head: "Tutorial-Übersicht",
  tutorials_assessment_task: "Aufgabe",
  tutorials_hardware_head: "Für die Umsetzung benötigst du folgende Hardware:",
  tutorials_hardware_moreInformation:
    "Weitere Informationen zur Hardware-Komponente findest du",
  tutorials_hardware_here: "hier",
  tutorials_requirements:
    "Bevor du mit diesem Tutorial fortfährst solltest du folgende Tutorials erfolgreich abgeschlossen haben:",

  /**
   * Tutorial Builder
   */
  builder_createNew: "neues Tutorial erstellen",
  builder_changeExisting: "bestehendes Tutorial ändern",
  builder_deleteExisting: "bestehendes Tutorial löschen",
  builder_solution: "Lösung",
  builder_solution_submit: "Lösung einreichen",
  builder_example_submit: "Beispiel einreichen",
  builder_comment:
    "Anmerkung: Man kann den initialen Setup()- bzw. Endlosschleifen()-Block löschen. Zusätzlich ist es möglich u.a. nur einen beliebigen Block auszuwählen, ohne dass dieser als deaktiviert dargestellt wird.",
  builder_hardware_order:
    "Beachte, dass die Reihenfolge des Auswählens maßgebend ist.",
  builder_hardware_helper: "Wähle mindestens eine Hardware-Komponente aus.",
  builder_requirements_head: "Voraussetzungen",
  builder_requirements_order:
    "Beachte, dass die Reihenfolge des Anhakens maßgebend ist.",
  builder_difficulty: "Schwierigkeitsgrad",
  builder_public_head: "Tutorial veröffentlichen",
  builder_public_label: "Tutorial für alle Nutzer:innen veröffentlichen",
  builder_review_head: "Tutorial veröffentlichen",
  builder_review_text:
    "Du kannst dein Tutorial direkt über den Link mit anderen Personen teilen. Wenn du dein Tutorial für alle Nutzer:innen in der Überischt veröffenltichen wollen kannst du es hier aktivieren. Ein Administrator wird dein Tutorial ansehen und anschließend freischalten.",

  // Gallery

  gallery_home_head: "Galerie",
  show_in_blockly: "Anzeigen",
  searchQuery_placeholder: "Suche nach Projekttitel",
  my_projects: "Nur meine Projekte anzeigen",
  no_projects_found: "Keine Projekte gefunden",
  delete_project: "Bist du sicher, dass du dieses Projekt löschen möchtest?",
  delete: "Löschen",
  edit_project: "Projekt bearbeiten",
  confirm: "Bestätigen",
  /**
   * Login
   */

  login_head: "Anmelden",
  login_osem_account_01: "Du benötigst einen ",
  login_osem_account_02: "Account um dich einzuloggen",
  login_lostpassword: "Du hast dein Passwort vergessen?",
  login_createaccount: "Falls du noch keinen Account hast erstellen einen auf ",
  /**
   * Navbar
   */
  navbar_blockly: "Blockly",
  navbar_tutorials: "Tutorials",
  navbar_tutorialbuilder: "Tutorial erstellen",
  navbar_gallery: "Galerie",
  navbar_projects: "Projekte",

  navbar_menu: "Menü",
  navbar_login: "Einloggen",
  navbar_account: "Konto",
  navbar_logout: "Abmelden",
  navbar_settings: "Einstellungen",

  /**
   * Codeviewer
   */

  codeviewer_arduino: "Arduino Quellcode",
  codeviewer_xml: "XML Blöcke",
  codeviewer_simulator: "Simulator",
  codeviewer_debug: "Debug",
  codeviewer_graph: " Graph",

  /**
   * Overlay
   */

  compile_overlay_head: "Dein Programm wird nun kompiliert und heruntergeladen",
  compile_overlay_text: "Kopiere es anschließend auf deine senseBox MCU",
  compile_overlay_text_esp32:
    "Übertrage es anschließend auf deine MCU-S2 und habe einen kleinen Moment Geduld.\n Sobald der Programmcode erfolgreich übertragen wurde, leuchtet die RGB-LED grün auf.\n Dieser Prozess kann bis zu 60 Sekunden dauern.",
  compile_overlay_help: "Benötigst du mehr Hilfe? Dann schaue hier: ",

  /**
   * Tooltip Viewer
   */

  tooltip_viewer: "Hilfe",
  tooltip_moreInformation_02: "Informationen zum Block",
  tooltip_moreInformation: "Mehr Informationen",
  tooltip_hint: "Wähle einen Block aus um dir die Hilfe anzeigen zu lassen",

  /**
   * IDEDrawer
   */
  drawer_ideerror_head: "Hoppla da ist was schief gegangen.",
  drawer_ideerror_text:
    "Beim kompilieren ist ein Fehler aufgetreten, überprüfe deine Blöcke.",

  /**
   * Error View
   */
  suggestion_pre_text: "Versuch es mal mit: ",

  display_not_declared:
    "Stelle sicher, dass du das Display im Setup initialisiert hast.",
  variable_redeclared:
    "Stelle sicher, dass du keine Sonderzeichen in deinen Variablennamen verwendest. Dazu gehören z.B. Leerzeichen, Sternchen oder Anführungszeichen.",

  /**
   * Code Editor
   *  */
  codeeditor_libraries_head: "Installierte Arduino Libraries",
  codeeditor_libraries_text:
    "Unten stehen alle Arduino Libraries, welche auf dem Compiler installiert sind. Klicke auf eine Library um mehr Informationen zu erhalten.",
  codeeditor_compile_code: "Code kompilieren",
  codeeditor_save_code: "Code herunterladen",
  codeeditor_open_code: "Code öffnen",
  codeeditor_reset_code: "Code zurücksetzen",
  codeeditor_blockly_code: "Lade Blockly Code",
  codeeditor_compile_progress:
    "Dein Code wird nun kompiliert und anschließend auf deinen Computer heruntergeladen",

  /**
   * Device Selction
   *  */
  deviceselection_head: "Welches Board benutzt du?",
  deviceselection_keep_selection:
    "Speichere meine Auswahl fürs nächste Mal (Du kannst das Board später in den Einstellungen wechseln)",
  deviceselection_footnote: "Hier kommst du zur alten Blockly Version für den ",
  deviceselection_footnote_02: "oder die",

  /**
   * Sensor Markdown Information
   */
  sensorinfo_info: "Informationen zum Sensor",
  sensorinfo_description: "Beschreibung",
  sensorinfo_measurable_phenos: "Messbare Phänomene",
  sensorinfo_manufacturer: "Hersteller",
  sensorinfo_lifetime: "Lebensdauer",
  sensorinfo_explanation:
    "Diese Informationen wurden aus [sensors.wiki](https://sensors.wiki) entnommen. Für weitere Informationen besuchen Sie den Abschnitt über diesen Sensor ",

  /**
   * Compilation dialog
   * */
  compile_overlay_compile: "Code wird kompiliert...",
  compile_overlay_download: "Bereite den Download vor...",
  compile_overlay_transfer: "Datei auf die senseBox übertragen",
  compile_overlay_error: "Ein Fehler ist aufgetreten",
  compile_overlay_app_transfer: "Übertrage die Datei auf die senseBox",
  compile_overlay_code_compiled: "Code wurde kompiliert!",
  compile_overlay_start_transfer: "Starte die Übertragung",
  compile_overlay_close: "Schließen",
  compile_overlay_head: "Dein Programm wird nun kompiliert und heruntergeladen",
  compile_overlay_text: "Kopiere es anschließend auf deine senseBox ",
  compile_overlay_help: " Benötigst du Hilfe? ",
  compile_overlay_help_2: " Schau in unserer Dokumentation vorbei! ",
  compile: "Kompilieren",
  download: "Herunterladen",
  transfer: "Übertragen",
  dialog_close: "Zurück zu Blockly",
  goToApp: "Gehe zur Connect App",
  goToApp_text:
    "Der Code wurde erfolgreich kompiliert! Klicke den unteren Button um zur senseBox:connect App zu gelangen und die Übertragung des Sketches fertigzustellen!",
  goToApp_title: "Over-The-Air Übertragung",

  transfer_headline: "Datei übertragen",
  transfer_subline:
    "Ziehe die Datei aus deinem Downloads-Ordner auf die senseBox",
  steps_to_transfer: "Schritte zur Übertragung:",

  step_1: "1. Downloads-Ordner öffnen",
  file: "2. Datei ",
  step_2: " finden",
  mcu_to_learnmode:
    "3. MCU in den Lernmodus setzen (zweimal schnell den roten Reset-Knopf drücken)",
  step_3_mcu: "4. {filename}.bin per Drag & Drop auf die senseBox kopieren",
  step_3_esp32: "3. {filename}.bin per Drag & Drop auf die senseBox kopieren",

  // Labels für die Icons unten (Steps-Row)
  transfer_label_downloads: "Downloads",
  transfer_label_file: "{filename}.bin",
  transfer_label_sensebox: "senseBox",

  // Hilfe-Link
  need_help: "Benötigst du Hilfe?",
  compile_overlay_help_2: "Schau in unserer Dokumentation vorbei!",

  button_register: "registriere dich hier",
  register_head: "Erstellen Sie Ihr Konto",
  labels_confirm_password: "Passwort bestätigen",
  messages_password_mismatch: "Die Passwörter stimmen nicht überein.",
  messages_password_too_short:
    "Das Passwort muss mindestens 6 Zeichen lang sein.",
  messages_register_error: "Bitte füllen Sie alle Felder aus.",
  already_have_account: "Haben Sie bereits ein Konto?",
  no_account: "Wenn du keinen Account hast,",
  register_success_head: "Konto erstellt!",
  register_success_message: "Dein Konto wurde erfolgreich erstellt.",
  register_success_login_prompt:
    "Du kannst dich jetzt mit deinen Zugangsdaten anmelden.",
};
