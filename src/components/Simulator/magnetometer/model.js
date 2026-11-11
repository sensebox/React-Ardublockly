import { lorentzian } from "../../Pages/QooolLab/fit.js";

// Estimated from the reference setup; adjust once measured values are known.
export const CENTER = 2870; // MHz, resonance without a magnetic field
export const MAX_SPLIT = 70; // MHz, each dip's shift with the magnet at the sensor
export const DIP_DEPTH = 0.05; // relative to the baseline
export const DIP_WIDTH = 6; // MHz
export const BASE_VOLTAGE = 2; // V, photo sensor output off resonance
export const NOISE = 0.002; // relative to the baseline
export const RANGE = [2770, 2970]; // MHz, sweep window of the reference setup

// 0 = magnet at the sensor, 1 = magnet far away.
export const clampDistance = (distance) =>
  Math.min(1, Math.max(0, Number(distance) || 0));

// One resonance pair of a single NV centre; the splitting is linear in distance.
export function peaksFor(distance) {
  const split = MAX_SPLIT * (1 - clampDistance(distance));
  return [-1, 1].map((sign) => ({
    freq: CENTER + sign * split,
    depth: DIP_DEPTH,
    width: DIP_WIDTH,
  }));
}

export function spectrum({
  distance,
  f1 = RANGE[0],
  f2 = RANGE[1],
  points = 201,
  noise = NOISE,
  random = Math.random,
}) {
  const peaks = peaksFor(distance);
  return Array.from({ length: points }, (_, i) => {
    const freq = f1 + ((f2 - f1) * i) / (points - 1);
    return [
      freq,
      BASE_VOLTAGE * (lorentzian(freq, peaks) + noise * (random() * 2 - 1)),
    ];
  });
}
