// src/utils/projectUtils.js

/**
 * Bestimmt eine Schwierigkeitsstufe (Level) von 1-4 anhand der Anzahl von <block>-Tags im XML.
 * @param {string} xml - Der XML-String des Projekts
 * @returns {number} Level 1 bis 4
 */
export function determineLevelFromXML(xml) {
  if (typeof xml !== "string") return 1;
  const count = (xml.match(/<block/g) || []).length;
  if (count < 10) return 1;
  if (count < 25) return 2;
  if (count < 50) return 3;
  return 4;
}

/**
 * Extrahiert Tags aus Titel, Beschreibung und XML anhand von Keywords und Blocktypen.
 * @param {Object} proj - Das Projekt-Objekt
 * @param {string} proj.title - Titel des Projekts
 * @param {string} proj.description - Beschreibungstext
 * @param {string} proj.xml - Blockly-XML-String
 * @returns {string[]} Array mit gefundenen Tags
 */
export function extractTagsFromProject(proj) {
  const tags = [];
  const text =
    `${proj.title || ""} ${proj.description || ""} ${proj.xml || ""}`.toLowerCase();

  // Allgemeine Tags
  if (text.includes("led")) tags.push("LED");
  if (text.includes("sensor")) tags.push("Sensor");
  if (text.includes("display")) tags.push("Display");
  if (text.includes("wifi")) tags.push("WiFi");
  if (text.includes("servo-motor")) tags.push("Motor");
  if (text.includes("buzzer") || text.includes("tone")) tags.push("Musik");
  if (text.includes("matrix")) tags.push("Display");
  if (text.includes("gps")) tags.push("GPS");

  // Tags aus Blocktypen im XML ableiten
  if (text.includes("sensebox_ws2812")) tags.push("LED");
  if (text.includes("sensebox_ws2812_matrix")) tags.push("Display");
  if (text.includes("io_tone")) tags.push("Musik");
  if (text.includes("io_notone")) tags.push("Musik");
  if (text.includes("rgb")) tags.push("LED");

  // Fach- und themenspezifische Tags
  if (text.includes("biologie")) tags.push("Biologie");
  if (text.includes("co2-ampel set")) tags.push("CO2-Ampel Set");
  if (text.includes("edu")) tags.push("Edu");
  if (text.includes("co2-sensor")) tags.push("CO2-Sensor");
  if (text.includes("chemie")) tags.push("Chemie");
  if (text.includes("erste schritte")) tags.push("Erste Schritte");
  if (text.includes("geographie")) tags.push("Geographie");
  if (text.includes("informatik")) tags.push("Informatik");
  if (text.includes("iot")) tags.push("IoT");
  if (text.includes("kalibrierung")) tags.push("Kalibrierung");
  if (text.includes("lora")) tags.push("LoRa");
  if (text.includes("mathematik")) tags.push("Mathematik");
  if (text.includes("musik")) tags.push("Musik");
  if (text.includes("ostern")) tags.push("Ostern");
  if (text.includes("phyphox")) tags.push("Phyphox");
  if (text.includes("physik")) tags.push("Physik");
  if (text.includes("spiel")) tags.push("Spiel");
  if (text.includes("sport")) tags.push("Sport");
  if (text.includes("ttn")) tags.push("TTN");
  if (text.includes("weihnachten")) tags.push("Weihnachten");

  // Duplikate entfernen
  return Array.from(new Set(tags));
}
