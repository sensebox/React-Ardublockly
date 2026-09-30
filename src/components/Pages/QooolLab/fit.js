export const lorentzian = (x, peaks) =>
  1 -
  peaks
    .filter((p) => p.enabled !== false)
    .reduce(
      (sum, p) =>
        sum + (p.depth * p.width ** 2) / ((x - p.freq) ** 2 + p.width ** 2),
      0,
    );
export const rmse = (points, peaks) =>
  Math.sqrt(
    points.reduce((s, [x, y]) => s + (y - lorentzian(x, peaks)) ** 2, 0) /
      points.length,
  );

function solve(matrix, vector) {
  const a = matrix.map((row, i) => [...row, vector[i]]);
  for (let i = 0; i < a.length; i++) {
    let pivot = i;
    for (let j = i + 1; j < a.length; j++)
      if (Math.abs(a[j][i]) > Math.abs(a[pivot][i])) pivot = j;
    [a[i], a[pivot]] = [a[pivot], a[i]];
    if (Math.abs(a[i][i]) < 1e-15)
      throw new Error(
        "Fit is underdetermined; use fewer peaks or a wider sweep.",
      );
    const divisor = a[i][i];
    a[i] = a[i].map((v) => v / divisor);
    for (let j = 0; j < a.length; j++) {
      if (j === i) continue;
      const factor = a[j][i];
      a[j] = a[j].map((v, k) => v - factor * a[i][k]);
    }
  }
  return a.map((row) => row[a.length]);
}

// Bounded Levenberg–Marquardt least squares, using the reference's baseline of 1.
export function fitLorentzians(points, guesses) {
  const initial = guesses.filter((p) => p.enabled !== false);
  if (!initial.length || points.length <= initial.length * 3)
    throw new Error("More data points than fit parameters are required.");
  const xs = points.map((p) => p[0]);
  const min = Math.min(...xs),
    max = Math.max(...xs);
  if (min === max) throw new Error("The fit needs a frequency range.");
  let params = initial.flatMap((p) => [
    Math.min(max, Math.max(min, p.freq)),
    p.depth,
    p.width,
  ]);
  const peaks = (values) =>
    initial.map((_, i) => ({
      freq: values[i * 3],
      depth: values[i * 3 + 1],
      width: values[i * 3 + 2],
    }));
  const cost = (values) =>
    points.reduce(
      (s, [x, y]) => s + (y - lorentzian(x, peaks(values))) ** 2,
      0,
    );
  function normal(values) {
    const n = values.length,
      matrix = Array.from({ length: n }, () => Array(n).fill(0)),
      vector = Array(n).fill(0);
    for (const [x, y] of points) {
      const predicted = lorentzian(x, peaks(values));
      const derivatives = values.map((v, i) => {
        const shifted = [...values],
          step = i % 3 === 1 ? 1e-6 : 1e-4;
        shifted[i] = v + step;
        return (lorentzian(x, peaks(shifted)) - predicted) / step;
      });
      derivatives.forEach((d, i) => {
        vector[i] += d * (y - predicted);
        derivatives.forEach((e, j) => {
          matrix[i][j] += d * e;
        });
      });
    }
    return { matrix, vector };
  }
  let damping = 0.001,
    error = cost(params),
    converged = false;
  for (let iteration = 0; iteration < 250; iteration++) {
    const { matrix, vector } = normal(params);
    if (Math.max(...vector.map(Math.abs)) < 1e-10) {
      converged = true;
      break;
    }
    const delta = solve(
      matrix.map((row, i) =>
        row.map((v, j) => v + (i === j ? damping * (matrix[i][i] + 1e-8) : 0)),
      ),
      vector,
    );
    const candidate = params.map((v, i) => {
      const bounds =
        i % 3 === 0 ? [min, max] : i % 3 === 1 ? [0, 1] : [0.1, 50];
      return Math.min(bounds[1], Math.max(bounds[0], v + delta[i]));
    });
    const nextError = cost(candidate);
    if (nextError < error) {
      const improvement = error - nextError;
      params = candidate;
      error = nextError;
      damping = Math.max(1e-12, damping / 3);
      if (improvement < 1e-13) {
        converged = true;
        break;
      }
    } else damping *= 10;
    if (damping > 1e14) break;
  }
  if (!converged)
    throw new Error(
      "Fit did not converge. Adjust the initial peak frequencies.",
    );
  const { matrix } = normal(params);
  const variance = error / (points.length - params.length);
  const result = peaks(params).map((p, i) => {
    let uncertainty = null;
    try {
      const column = solve(
        matrix,
        params.map((_, j) => (j === i * 3 ? 1 : 0)),
      );
      uncertainty = Math.sqrt(Math.max(0, column[i * 3] * variance));
    } catch {
      /* Singular covariance: do not report a misleading uncertainty. */
    }
    return { ...p, uncertainty, enabled: true };
  });
  return { peaks: result, rmse: Math.sqrt(error / points.length) };
}
