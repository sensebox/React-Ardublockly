// src/components/Pages/TeachableMachine/translations/index.js
import { teachableMachineTranslations_de } from "./de";
import { teachableMachineTranslations_en } from "./en";

/**
 * Get teachable machine translations based on current language from localStorage
 * @returns {Object} Translations object
 */
export const getTeachableMachineTranslations = () => {
  const locale = window.localStorage.getItem("locale") || "de_DE";
  const language = locale.split("_")[0];

  return language === "en"
    ? teachableMachineTranslations_en
    : teachableMachineTranslations_de;
};

export { teachableMachineTranslations_de, teachableMachineTranslations_en };
