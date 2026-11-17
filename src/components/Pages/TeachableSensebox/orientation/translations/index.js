// src/components/Pages/TeachableSensebox/orientation/translations/index.js
import { orientationTranslations_de } from "./de";
import { orientationTranslations_en } from "./en";

/**
 * Get orientation classification translations based on language
 * @param {string} language - Language code (e.g., "en_US", "de_DE")
 * @returns {Object} Translations object
 */
export const getOrientationTranslations = (language) => {
  const lang = language.includes("_") ? language.split("_")[0] : language;
  return lang === "en"
    ? orientationTranslations_en
    : orientationTranslations_de;
};

export { orientationTranslations_de, orientationTranslations_en };
