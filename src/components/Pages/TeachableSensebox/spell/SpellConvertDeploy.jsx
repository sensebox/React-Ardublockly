import React from "react";
import { useSelector } from "react-redux";
import { getSpellTranslations } from "./translations";
import ConvertDeployBase from "../utils/ConvertDeployBase";

/**
 * Spell Classification ConvertDeploy Component
 *
 * Wrapper component that provides spell-specific conversion and deployment
 * using the generic ConvertDeployBase component.
 */
const SpellConvertDeploy = ({ model }) => {
  const language = useSelector((s) => s.general.language);
  const t = getSpellTranslations(language);

  return (
    <ConvertDeployBase
      model={model}
      translations={t}
      boardType="sensebox_mcu_eye"
      modelName="spell_classification"
    />
  );
};

export default SpellConvertDeploy;
