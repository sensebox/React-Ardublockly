// src/components/Pages/TeachableSensebox/acceleration/translations/index.js
import { accelerationTranslations_de } from "./de";
import { accelerationTranslations_en } from "./en";

/**
 * Get acceleration/gesture classification translations based on current language from localStorage
 * @returns {Object} Translations object
 */
export const getAccelerationTranslations = () => {
  const locale = window.localStorage.getItem("locale") || "de_DE";
  const language = locale.split("_")[0];

  return language === "en"
    ? accelerationTranslations_en
    : accelerationTranslations_de;
};

export { accelerationTranslations_de, accelerationTranslations_en };
