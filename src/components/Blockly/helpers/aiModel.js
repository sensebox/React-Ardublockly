/**
 * Helpers for the uploaded Teachable Machine model (.cpp file).
 */

export const AI_MODEL_TYPE_CAMERA = "camera";
export const AI_MODEL_TYPE_SPELL = "spell";

/**
 * Detects the model type from the input size in the uploaded model code:
 * camera models use 96x96 images, spell models 32x32 images.
 * Models without a known size are treated as camera models (previous behaviour).
 * @param {?string} code uploaded model code
 * @return {?string} "camera", "spell" or null if no model is uploaded
 */
export const getAiModelType = (code) => {
  if (!code) return null;
  const match = code.match(/kNumCols\s*=\s*(\d+)/);
  if (match && parseInt(match[1], 10) === 32) return AI_MODEL_TYPE_SPELL;
  return AI_MODEL_TYPE_CAMERA;
};
