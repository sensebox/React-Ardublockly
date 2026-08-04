import { spellTranslations_de } from "./de";
import { spellTranslations_en } from "./en";

/**
 * Get spell classification translations based on language
 * @param {string} language - Language code (e.g., "en_US", "de_DE")
 * @returns {Object} Translations object
 */
export const getSpellTranslations = (language) => {
  const lang = language.includes("_") ? language.split("_")[0] : language;
  return lang === "en" ? spellTranslations_en : spellTranslations_de;
};

export { spellTranslations_de, spellTranslations_en };
