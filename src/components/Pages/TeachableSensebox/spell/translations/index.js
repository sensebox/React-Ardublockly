import { spellTranslations_de } from "./de";
import { spellTranslations_en } from "./en";

/**
 * Get spell classification translations based on current language from localStorage
 * @returns {Object} Translations object
 */
export const getSpellTranslations = () => {
  const locale = window.localStorage.getItem("locale") || "de_DE";
  const language = locale.split("_")[0];

  return language === "en" ? spellTranslations_en : spellTranslations_de;
};

export { spellTranslations_de, spellTranslations_en };
