import DeviceSelectionStep from "./DeviceSelectionStep";
import CompileStep from "./CompileStep";
import FlashStep from "./FlashStep";
import SummaryStep from "./SummaryStep";

/**
 * Ordered list of steps for the "Compile and Upload" wizard.
 * Add, remove or reorder steps here to change the flow.
 */
const compileAndUploadSteps = [
  { label: "Kompilieren", Component: CompileStep },
  { label: "Gerät", Component: DeviceSelectionStep },
  { label: "Hochladen", Component: FlashStep },
  { label: "Fertig", Component: SummaryStep },
];

export default compileAndUploadSteps;
