import React from "react";
import useCompileProgress from "../../hooks/useCompileProgress";

const CompileStatus = ({ sketchPath, fqbn }) => {
  const progress = useCompileProgress(sketchPath, fqbn);

  return (
    <div style={{ textAlign: "center" }}>
      <p>Fortschritt: {progress.toFixed(0)}%</p>
    </div>
  );
};

export default CompileStatus;
