// src/components/Pages/TeachableSensebox/translations/index.js
import { teachableSenseboxTranslations_de } from "./de";
import { teachableSenseboxTranslations_en } from "./en";

/**
 * Get teachable machine translations based on language
 * @param {string} language - Language code (e.g., "en_US", "de_DE")
 * @returns {Object} Translations object
 */
export const getTeachableSenseboxTranslations = (language) => {
  const lang = language.includes("_") ? language.split("_")[0] : language;
  return lang === "en"
    ? teachableSenseboxTranslations_en
    : teachableSenseboxTranslations_de;
};

export { teachableSenseboxTranslations_de, teachableSenseboxTranslations_en };
