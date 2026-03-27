/**
 * accelerationFeatures.js
 *
 * Extracts a fixed-length statistical feature vector from a window of
 * accelerometer samples. The feature vector has NUM_FEATURES = 18 values:
 * for each of the three axes (x, y, z) the following 6 statistics are computed:
 *   1. mean
 *   2. standard deviation
 *   3. RMS (root mean square)
 *   4. skewness (standardised 3rd central moment)
 *   5. kurtosis (excess kurtosis, 4th central moment − 3)
 *   6. spectral power (sum of squared DFT bin magnitudes, DC bin excluded)
 */

export const NUM_FEATURES = 18; // 6 features × 3 axes

/**
 * Keys of the six per-axis feature types, ordered by their position in the
 * axisFeatures() output: [mean, std, rms, skewness, kurtosis, spectralPower].
 */
export const FEATURE_GROUP_KEYS = [
  "mean",
  "std",
  "rms",
  "skewness",
  "kurtosis",
  "spectralPower",
];

/**
 * Returns the number of features produced for the given set of active group
 * keys (3 axes × number of active groups).
 *
 * @param {string[]|null|undefined} activeGroupKeys
 * @returns {number}
 */
export function getNumFeaturesForGroups(activeGroupKeys) {
  const count =
    !activeGroupKeys || activeGroupKeys.length === 0
      ? FEATURE_GROUP_KEYS.length
      : activeGroupKeys.length;
  return count * 3;
}

/**
 * Compute spectral power of a real-valued signal via a naïve DFT.
 * Only the positive-frequency bins (1 … floor(N/2)) are included so the
 * DC offset (bin 0) does not dominate and so we don't double-count bins.
 *
 * @param {number[]} signal
 * @returns {number}
 */
function spectralPower(signal) {
  const N = signal.length;
  if (N < 2) return 0;

  let power = 0;
  const limit = Math.floor(N / 2);

  for (let k = 1; k <= limit; k++) {
    let re = 0;
    let im = 0;
    const angle = (2 * Math.PI * k) / N;
    for (let n = 0; n < N; n++) {
      re += signal[n] * Math.cos(angle * n);
      im -= signal[n] * Math.sin(angle * n);
    }
    power += re * re + im * im;
  }

  // Normalise by N² so the value is independent of window length
  return power / (N * N);
}

/**
 * Compute all 6 statistical features for a single axis signal.
 *
 * @param {number[]} values  Raw axis values for the window
 * @returns {number[]}       [mean, std, rms, skewness, kurtosis, spectralPower]
 */
function axisFeatures(values) {
  const N = values.length;

  if (N === 0) return [0, 0, 0, 0, 0, 0];

  // Mean
  let sum = 0;
  for (let i = 0; i < N; i++) sum += values[i];
  const mean = sum / N;

  // Variance / std, RMS, 3rd & 4th central moments
  let m2 = 0; // sum of (v - mean)^2
  let m3 = 0; // sum of (v - mean)^3
  let m4 = 0; // sum of (v - mean)^4
  let sumSq = 0; // sum of v^2 for RMS

  for (let i = 0; i < N; i++) {
    const d = values[i] - mean;
    const d2 = d * d;
    m2 += d2;
    m3 += d2 * d;
    m4 += d2 * d2;
    sumSq += values[i] * values[i];
  }

  const variance = m2 / N;
  const std = Math.sqrt(variance);
  const rms = Math.sqrt(sumSq / N);

  // Skewness and kurtosis — guard against zero std (constant signal)
  let skewness = 0;
  let kurtosis = 0;
  if (std > 1e-10) {
    const std3 = std * std * std;
    const std4 = std3 * std;
    skewness = m3 / (N * std3);
    kurtosis = m4 / (N * std4) - 3; // excess kurtosis
  }

  const power = spectralPower(values);

  return [mean, std, rms, skewness, kurtosis, power];
}

/**
 * Extract a fixed-length feature vector from an array of accelerometer samples.
 *
 * For a standard 2-second window at ~50 Hz this produces a vector of length 18.
 * The function handles edge cases (empty input, single sample, constant signal)
 * by returning a zero vector.
 *
 * @param {Array<{x: number, y: number, z: number}>} samples
 * @returns {number[]} feature vector of length NUM_FEATURES (18)
 */
export function extractFeatures(samples) {
  if (!samples || samples.length < 2) {
    return new Array(NUM_FEATURES).fill(0);
  }

  const xs = samples.map((s) => s.x);
  const ys = samples.map((s) => s.y);
  const zs = samples.map((s) => s.z);

  return [...axisFeatures(xs), ...axisFeatures(ys), ...axisFeatures(zs)];
}

/**
 * Extract a feature vector that includes only the selected feature groups.
 * Each group contributes 3 values (x, y, z axes).
 *
 * When activeGroupKeys is null/undefined/empty the full 18-feature vector is
 * returned (identical to extractFeatures).
 *
 * @param {Array<{x: number, y: number, z: number}>} samples
 * @param {string[]|null|undefined} activeGroupKeys
 * @returns {number[]}
 */
export function extractFeaturesFiltered(samples, activeGroupKeys) {
  if (!activeGroupKeys || activeGroupKeys.length === 0) {
    return extractFeatures(samples);
  }

  const numOut = activeGroupKeys.length * 3;
  if (!samples || samples.length < 2) {
    return new Array(numOut).fill(0);
  }

  const xs = samples.map((s) => s.x);
  const ys = samples.map((s) => s.y);
  const zs = samples.map((s) => s.z);

  const allX = axisFeatures(xs);
  const allY = axisFeatures(ys);
  const allZ = axisFeatures(zs);

  const result = [];
  for (const key of activeGroupKeys) {
    const idx = FEATURE_GROUP_KEYS.indexOf(key);
    if (idx === -1) continue;
    result.push(allX[idx], allY[idx], allZ[idx]);
  }
  return result;
}
