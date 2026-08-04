import StreamlinedUploadStep from "./StreamlinedUploadStep";
import SummaryStep from "./SummaryStep";

/**
 * Streamlined single-step wizard for compile and upload.
 * User selects device and clicks upload once - everything happens automatically.
 */
const compileAndUploadSteps = [
  { label: "Upload", Component: StreamlinedUploadStep },
  { label: "Fertig", Component: SummaryStep },
];

export default compileAndUploadSteps;
