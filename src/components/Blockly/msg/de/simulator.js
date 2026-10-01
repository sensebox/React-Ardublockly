export const SIMULATOR = {
  /**
   * Simulator panel
   */
  simulator_start: "Simulation starten",
  simulator_stop: "Simulation stoppen",
  simulator_info_title: "Simulation",
  simulator_info_status: "Status:",
  simulator_status_running: "läuft",
  simulator_status_stopped: "gestoppt",
  simulator_info_modules: "Module:",
  simulator_unsupported_blocks:
    "Diese Blöcke unterstützt der Simulator nicht, er überspringt sie:",
  simulator_generation_error: "Der Simulator-Code konnte nicht erzeugt werden:",
  simulator_runtime_error: "Die Simulation wurde wegen eines Fehlers beendet:",

  /**
   * Graph and debug buttons of the simulator
   */
  simulator_tab_graph: "Graph",
  simulator_tab_debug: "Debug",

  /**
   * Cables between board and modules
   */
  simulator_unplug: "Kabel abziehen",
  simulator_not_connected: "Nicht angeschlossen",
  simulator_wrong_port: "Im Block: Port %1",
  simulator_info_cables:
    "Kabel: vom Anschluss am Board zum Modul ziehen. Zum Abziehen das Kabelende ins Leere ziehen oder das Kabel anklicken und ✕ drücken.",

  /**
   * Graph view
   */
  simulator_graph_empty: "Noch keine Messwerte. Starte die Simulation.",
  simulator_graph_settings: "Einstellungen",
  simulator_graph_settings_title: "Graph-Einstellungen",
  simulator_graph_history_limit: "Anzahl angezeigter Messwerte (0 = alle)",
  simulator_graph_clear: "Messwerte löschen",
  simulator_graph_apply: "Übernehmen",

  /**
   * Debug log
   */
  simulator_debug_empty: "Noch keine Einträge.",
  simulator_log_started: "Simulation gestartet",
  simulator_log_stopped: "Simulation gestoppt",
  simulator_log_error: "Fehler in der Simulation",
  simulator_log_block_created: "Block erstellt",
  simulator_log_block_deleted: "Block gelöscht",
  simulator_log_block_changed: "Block geändert",
  simulator_log_filter_up: "Filter nach oben verschoben",
  simulator_log_filter_down: "Filter nach unten verschoben",

  /**
   * Values of the simulated sensors
   */
  simulator_value_temperature: "Temperatur (°C)",
  simulator_value_humidity: "Luftfeuchte (%)",
  simulator_value_pressure: "Luftdruck (hPa)",
  simulator_value_altitude: "Höhe (m)",
  simulator_value_illuminance: "Beleuchtungsstärke (lx)",
  simulator_value_uv: "UV-Intensität (µW/cm²)",
  simulator_value_light: "Helligkeit",
  simulator_value_water_temperature: "Wassertemperatur (°C)",
  simulator_value_distance_cm: "Distanz (cm)",
  simulator_value_distance_mm: "Distanz (mm)",
  simulator_value_iaq: "IAQ (0–500)",
  simulator_value_iaq_accuracy: "IAQ-Genauigkeit (0–3)",
  simulator_value_co2: "CO₂ (ppm)",
  simulator_value_co2_equivalent: "CO₂-Äquivalent (ppm)",
  simulator_value_voc: "bVOC-Äquivalent (ppm)",
  simulator_value_soil_temperature: "Bodentemperatur (°C)",
  simulator_value_soil_moisture: "Bodenfeuchte (%)",
  simulator_value_acceleration_x: "Beschleunigung X (g)",
  simulator_value_acceleration_y: "Beschleunigung Y (g)",
  simulator_value_acceleration_z: "Beschleunigung Z (g)",
  simulator_value_pm1: "PM1 (µg/m³)",
  simulator_value_pm25: "PM2.5 (µg/m³)",
  simulator_value_pm4: "PM4 (µg/m³)",
  simulator_value_pm10: "PM10 (µg/m³)",
  simulator_value_rain_total: "Niederschlag gesamt (mm)",
  simulator_value_rain_intensity: "Niederschlagsintensität (mm/h)",
};
