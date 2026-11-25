import { lorentzian } from "../../Pages/QooolLab/fit.js";

// Estimated from the reference setup; adjust once measured values are known.
export const CENTER = 2870; // MHz, resonance without a magnetic field
export const MAX_SPLIT = 70; // MHz, each dip's shift with the magnet at the sensor
export const DIP_DEPTH = 0.05; // relative to the baseline
export const DIP_WIDTH = 6; // MHz
export const BASE_VOLTAGE = 2; // V, photo sensor output off resonance
export const NOISE = 0.002; // relative to the baseline
export const RANGE = [2770, 2970]; // MHz, sweep window of the reference setup
export const ANGLES = [0, 35, 90]; // degrees, reference field directions in the table plane

// The four NV axes of diamond (109.5° apart). x points from the sensor to the
// magnet's start position, y up, z towards the viewer; x–z is the table plane
// (the 2D top view). The first axis lies along x; the others are turned 12°
// around it so that a field in the table plane separates all four at the
// tilted angle.
const TILT = Math.sqrt(8) / 3;
export const NV_AXES = [
  [1, 0, 0],
  ...[12, 132, 252].map((degrees) => [
    -1 / 3,
    TILT * Math.sin((degrees * Math.PI) / 180),
    TILT * Math.cos((degrees * Math.PI) / 180),
  ]),
];

// 0 = magnet at the sensor, 1 = magnet far away.
export const clampDistance = (distance) =>
  Math.min(1, Math.max(0, Number(distance) || 0));

export const clampOrientations = (orientations) =>
  Math.min(NV_AXES.length, Math.max(1, Math.round(Number(orientations)) || 1));

// The contrast is shared between the NV orientations: without a field all
// dips sit on top of each other and give the same unsplit dip (2 · DIP_DEPTH)
// for every ensemble, and every pair splits off its share of it.
const dipDepth = (orientations) => DIP_DEPTH / orientations;

// Fixed plot range (baseline 1), the same for every ensemble, kept tight so
// the dips fill the plot: from just below the unsplit dip (rounded down to
// 0.01) to just above the baseline noise.
export function yRange() {
  const deepest = 1 - 2 * DIP_DEPTH - 2.5 * NOISE;
  return [Math.floor(deepest * 100) / 100, 1 + 5 * NOISE];
}

// Unit vector in the table plane, `degrees` from the x axis towards z
// (clockwise in the top view).
export const directionFromAngle = (degrees) => {
  const radians = ((Number(degrees) || 0) * Math.PI) / 180;
  return [Math.cos(radians), 0, Math.sin(radians)];
};

// Normalized field direction; falls back to x for a missing or zero vector.
export function normalizeDirection(direction) {
  const [x, y, z] = (direction ?? []).map((v) => Number(v) || 0);
  const length = Math.hypot(x, y, z);
  return length > 1e-9 ? [x / length, y / length, z / length] : [1, 0, 0];
}

// The same direction in the table plane (the 2D top view); straight above or
// below the sensor falls back to x.
export const flattenDirection = (direction) => {
  const [x, , z] = normalizeDirection(direction);
  return normalizeDirection([x, 0, z]);
};

// Angle between the field and an NV axis in whole degrees (0–180).
export const angleToAxis = (direction, axis = NV_AXES[0]) => {
  const [x, y, z] = normalizeDirection(direction);
  const dot = x * axis[0] + y * axis[1] + z * axis[2];
  return Math.round(
    (Math.acos(Math.min(1, Math.max(-1, dot))) * 180) / Math.PI,
  );
};

// One resonance pair per NV axis. The splitting is linear in distance and in the
// field component along the axis. The magnet always faces the sensor with one
// pole, so the field at the sensor points along the line between them:
// `direction` is where the magnet sits, seen from the sensor (3D vector).
// `angle` (degrees in the table plane) is a shortcut when no direction is given.
export function peaksFor(
  distance,
  { orientations = 1, angle = 0, direction } = {},
) {
  const count = clampOrientations(orientations);
  const strength = MAX_SPLIT * (1 - clampDistance(distance));
  const field = normalizeDirection(direction ?? directionFromAngle(angle));
  return NV_AXES.slice(0, count).flatMap((axis) => {
    const split =
      strength *
      Math.abs(field[0] * axis[0] + field[1] * axis[1] + field[2] * axis[2]);
    return [-1, 1].map((sign) => ({
      freq: CENTER + sign * split,
      depth: dipDepth(count),
      width: DIP_WIDTH,
    }));
  });
}

export function spectrum({
  distance,
  orientations = 1,
  angle = 0,
  direction,
  f1 = RANGE[0],
  f2 = RANGE[1],
  points = 201,
  noise = NOISE,
  random = Math.random,
}) {
  const peaks = peaksFor(distance, { orientations, angle, direction });
  return Array.from({ length: points }, (_, i) => {
    const freq = f1 + ((f2 - f1) * i) / (points - 1);
    return [
      freq,
      BASE_VOLTAGE * (lorentzian(freq, peaks) + noise * (random() * 2 - 1)),
    ];
  });
}

// Electron spin: each resonance shifts by GAMMA · B, so a pair is 2 · GAMMA · B apart.
export const GAMMA = 28; // MHz/mT (= 28 GHz/T)

const SUBSCRIPTS = "₀₁₂₃₄₅₆₇₈₉";
export const subscript = (n) =>
  String(n)
    .split("")
    .map((digit) => SUBSCRIPTS[digit])
    .join("");

// Split resonance pairs, outermost first, named f₁/f₂, f₃/f₄, … Pairs with the
// same splitting overlap and are listed once; unsplit pairs have no dips to mark.
export function dipPairs(distance, options) {
  const peaks = peaksFor(distance, options);
  const splits = [];
  for (let i = 0; i < peaks.length; i += 2) {
    const split = (peaks[i + 1].freq - peaks[i].freq) / 2;
    if (split >= 0.5 && !splits.some((s) => Math.abs(s - split) < 0.5))
      splits.push(split);
  }
  return splits
    .sort((a, b) => b - a)
    .map((split, i) => ({
      low: { name: `f${subscript(2 * i + 1)}`, freq: CENTER - split },
      high: { name: `f${subscript(2 * i + 2)}`, freq: CENTER + split },
    }));
}

// Field component along the NV axis of one pair, from f₂ − f₁ = 2 · GAMMA · B.
export const fieldFromPair = (low, high) => (high - low) / (2 * GAMMA); // mT

// Reads the dips of dipPairs() off measured data ([[freq, value], …] in MHz):
// each frequency moves to the lowest point within `window` MHz of it, after a
// 3-point smoothing against noise. This is what a paused plot shows, so its
// markers and the worked example match the curve.
export function readDips(points, pairs, window = 8) {
  const sorted = [...points].sort((a, b) => a[0] - b[0]);
  const smooth = sorted.map(([freq], i) => {
    const near = sorted.slice(Math.max(0, i - 1), i + 2);
    return [freq, near.reduce((sum, p) => sum + p[1], 0) / near.length];
  });
  const lowest = (expected) => {
    let best = null;
    for (const [freq, value] of smooth)
      if (Math.abs(freq - expected) <= window && (!best || value < best[1]))
        best = [freq, value];
    return best ? best[0] : expected;
  };
  return pairs.map(({ low, high }) => ({
    low: { ...low, freq: lowest(low.freq) },
    high: { ...high, freq: lowest(high.freq) },
  }));
}
