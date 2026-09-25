import React from "react";
import { useSelector } from "react-redux";
import { getImageTranslations } from "./translations";
import ConvertDeployBase from "../utils/ConvertDeployBase";

/**
 * Image Classification ConvertDeploy Component
 *
 * Wrapper component that provides image-specific conversion and deployment
 * using the generic ConvertDeployBase component.
 */
const ConvertDeploy = ({ model }) => {
  const language = useSelector((s) => s.general.language);
  const t = getImageTranslations(language);

  return (
    <ConvertDeployBase
      model={model}
      translations={t}
      boardType="sensebox_mcu_eye"
      modelName="image_classification"
      modelType="image"
    />
  );
};

export default ConvertDeploy;
