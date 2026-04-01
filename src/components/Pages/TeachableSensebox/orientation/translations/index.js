// src/components/Pages/TeachableSensebox/orientation/translations/index.js
import { orientationTranslations_de } from "./de";
import { orientationTranslations_en } from "./en";

/**
 * Get orientation classification translations based on current language from localStorage
 * @returns {Object} Translations object
 */
export const getOrientationTranslations = () => {
  const locale = window.localStorage.getItem("locale") || "de_DE";
  const language = locale.split("_")[0];

  return language === "en"
    ? orientationTranslations_en
    : orientationTranslations_de;
};

export { orientationTranslations_de, orientationTranslations_en };
