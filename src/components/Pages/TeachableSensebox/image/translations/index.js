// src/components/Pages/TeachableSensebox/image/translations/index.js
import { imageClassificationTranslations_de } from "./de";
import { imageClassificationTranslations_en } from "./en";

/**
 * Get image classification translations based on current language from localStorage
 * @returns {Object} Translations object
 */
export const getImageTranslations = () => {
  const locale = window.localStorage.getItem("locale") || "de_DE";
  const language = locale.split("_")[0];

  return language === "en"
    ? imageClassificationTranslations_en
    : imageClassificationTranslations_de;
};

export {
  imageClassificationTranslations_de,
  imageClassificationTranslations_en,
};
