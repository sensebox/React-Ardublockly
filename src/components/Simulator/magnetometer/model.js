import { lorentzian } from "../../Pages/QooolLab/fit.js";

// Estimated from the reference setup; adjust once measured values are known.
export const CENTER = 2870; // MHz, resonance without a magnetic field
export const MAX_SPLIT = 70; // MHz, each dip's shift with the magnet at the sensor
export const DIP_DEPTH = 0.05; // relative to the baseline
export const DIP_WIDTH = 6; // MHz
export const BASE_VOLTAGE = 2; // V, photo sensor output off resonance
export const NOISE = 0.002; // relative to the baseline
export const RANGE = [2770, 2970]; // MHz, sweep window of the reference setup
export const ANGLES = [0, 35, 90]; // degrees, selectable magnet rotations

// The four NV axes of diamond (109.5° apart). The first lies along the scene
// (sensor to magnet). The others are turned 12° around it so that a field in
// the drawing plane separates all four at the tilted magnet angle.
const TILT = Math.sqrt(8) / 3;
export const NV_AXES = [
  [1, 0, 0],
  ...[12, 132, 252].map((degrees) => [
    -1 / 3,
    TILT * Math.cos((degrees * Math.PI) / 180),
    TILT * Math.sin((degrees * Math.PI) / 180),
  ]),
];

// 0 = magnet at the sensor, 1 = magnet far away.
export const clampDistance = (distance) =>
  Math.min(1, Math.max(0, Number(distance) || 0));

export const clampOrientations = (orientations) =>
  Math.min(NV_AXES.length, Math.max(1, Math.round(Number(orientations)) || 1));

// Shallower dips for larger ensembles keep the overlapping centre dip in view.
const dipDepth = (orientations) => (DIP_DEPTH * 2) / (orientations + 1);

// Fixed plot range (baseline 1) that fits every magnet position of one ensemble.
export function yRange(orientations) {
  const count = clampOrientations(orientations);
  return [1 - 2.5 * count * dipDepth(count), 1 + 0.5 * DIP_DEPTH];
}

// One resonance pair per NV axis. The splitting is linear in distance and in the
// field component along the axis; the field is taken to point along the magnet.
export function peaksFor(distance, { orientations = 1, angle = 0 } = {}) {
  const count = clampOrientations(orientations);
  const strength = MAX_SPLIT * (1 - clampDistance(distance));
  const radians = ((Number(angle) || 0) * Math.PI) / 180;
  const field = [Math.cos(radians), Math.sin(radians)];
  return NV_AXES.slice(0, count).flatMap((axis) => {
    const split = strength * Math.abs(field[0] * axis[0] + field[1] * axis[1]);
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
  f1 = RANGE[0],
  f2 = RANGE[1],
  points = 201,
  noise = NOISE,
  random = Math.random,
}) {
  const peaks = peaksFor(distance, { orientations, angle });
  return Array.from({ length: points }, (_, i) => {
    const freq = f1 + ((f2 - f1) * i) / (points - 1);
    return [
      freq,
      BASE_VOLTAGE * (lorentzian(freq, peaks) + noise * (random() * 2 - 1)),
    ];
  });
}
