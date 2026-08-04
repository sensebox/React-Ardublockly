// src/components/Pages/TeachableSensebox/image/translations/index.js
import { imageClassificationTranslations_de } from "./de";
import { imageClassificationTranslations_en } from "./en";

/**
 * Get image classification translations based on language
 * @param {string} language - Language code (e.g., "en_US", "de_DE")
 * @returns {Object} Translations object
 */
export const getImageTranslations = (language) => {
  const lang = language.includes("_") ? language.split("_")[0] : language;
  return lang === "en"
    ? imageClassificationTranslations_en
    : imageClassificationTranslations_de;
};

export {
  imageClassificationTranslations_de,
  imageClassificationTranslations_en,
};
