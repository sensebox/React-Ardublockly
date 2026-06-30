import React, { useEffect } from "react";
import PropTypes from "prop-types";
import MemoryIcon from "@mui/icons-material/Memory";
import { useFlash } from "../FlashContext";
import {
  Spinner,
  AnimatedCheck,
  AnimatedCross,
  DetailAccordion,
} from "../StatusIndicators";

/**
 * Step: Sends the Blockly/Arduino program to the online compiler and shows a
 * small spinner while the firmware binary is being built. Once the binary is
 * ready the step advances automatically to the device selection.
 */
function CompileStep({ goNext }) {
  const { compileStatus, compileError, log, compile } = useFlash();

  const isCompiling = compileStatus === "compiling" || compileStatus === "idle";
  const isCompiled = compileStatus === "compiled";
  const isError = compileStatus === "error";

  // Auto-advance once compiled, leaving a moment for the checkmark to play.
  useEffect(() => {
    if (!isCompiled) return undefined;
    const timer = setTimeout(goNext, 1100);
    return () => clearTimeout(timer);
  }, [isCompiled, goNext]);

  return (
    <div className="cau-step">
      {isCompiling && (
        <>
          <Spinner icon={<MemoryIcon style={{ fontSize: 32 }} />} />
          <h3 className="cau-step__title">Programm wird kompiliert</h3>
          <p className="cau-step__text">
            Dein Sketch wird an den Compiler geschickt – das dauert nur einen
            Augenblick.
          </p>
        </>
      )}

      {isCompiled && (
        <>
          <AnimatedCheck />
          <h3 className="cau-step__title">Kompiliert!</h3>
          <p className="cau-step__text">Die Binärdatei ist bereit.</p>
        </>
      )}

      {isError && (
        <>
          <AnimatedCross />
          <h3 className="cau-step__title">Kompilieren fehlgeschlagen</h3>
          <p className="cau-error-text">
            {compileError || "Die Kompilierung ist fehlgeschlagen."}
          </p>
          <button
            type="button"
            className="cau-button"
            onClick={() => compile().catch(() => {})}
          >
            Erneut versuchen
          </button>
          {log && (
            <DetailAccordion title="Fehlerdetails" content={log} isError />
          )}
        </>
      )}
    </div>
  );
}

CompileStep.propTypes = {
  goNext: PropTypes.func.isRequired,
};

export default CompileStep;
