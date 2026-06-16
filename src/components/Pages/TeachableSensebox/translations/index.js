// src/components/Pages/TeachableSensebox/translations/index.js
import { teachableSenseboxTranslations_de } from "./de";
import { teachableSenseboxTranslations_en } from "./en";

/**
 * Get teachable machine translations based on current language from localStorage
 * @returns {Object} Translations object
 */
export const getTeachableSenseboxTranslations = () => {
  const locale = window.localStorage.getItem("locale") || "de_DE";
  const language = locale.split("_")[0];

  return language === "en"
    ? teachableSenseboxTranslations_en
    : teachableSenseboxTranslations_de;
};

export { teachableSenseboxTranslations_de, teachableSenseboxTranslations_en };
