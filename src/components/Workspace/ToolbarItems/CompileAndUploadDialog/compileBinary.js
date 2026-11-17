/**
 * Compiles an Arduino sketch via the senseBox compiler service and returns the
 * sketch ID. Used when you need just the ID (e.g., for a download link).
 *
 * @param {object} params
 * @param {string} params.compilerUrl Base URL of the compiler service.
 * @param {string} params.sketch      Arduino source code to compile.
 * @param {string} params.board       Compiler board identifier (e.g. "sensebox-esp32s2").
 * @param {string} [params.projectId] Optional session/project id.
 * @param {AbortSignal} [params.signal] Optional signal to cancel the request.
 * @returns {Promise<string>} The sketch ID from the compiler.
 */
export async function compileToSketchId({
  compilerUrl,
  sketch,
  board,
  projectId,
  signal,
}) {
  const compileResponse = await fetch(`${compilerUrl}/compile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sketch, board, projectId }),
    signal,
  });

  const compileData = await compileResponse.json();
  if (!compileResponse.ok) {
    throw new Error(compileData?.message || "Kompilierung fehlgeschlagen.");
  }

  const sketchId = compileData?.data?.id;
  if (!sketchId) {
    throw new Error("Der Compiler hat keine Sketch-ID zurückgegeben.");
  }

  return sketchId;
}

/**
 * Compiles an Arduino sketch via the senseBox compiler service and returns the
 * resulting firmware binary, ready to be flashed onto the microcontroller.
 *
 * @param {object} params
 * @param {string} params.compilerUrl Base URL of the compiler service.
 * @param {string} params.sketch      Arduino source code to compile.
 * @param {string} params.board       Compiler board identifier (e.g. "sensebox-esp32s2").
 * @param {string} [params.projectId] Optional session/project id.
 * @param {string} [params.filename]  Name used for the downloaded binary.
 * @param {AbortSignal} [params.signal] Optional signal to cancel the requests.
 * @returns {Promise<Uint8Array>} The compiled firmware binary.
 */
export async function compileToBinary({
  compilerUrl,
  sketch,
  board,
  projectId,
  filename = "sketch",
  signal,
}) {
  const sketchId = await compileToSketchId({
    compilerUrl,
    sketch,
    board,
    projectId,
    signal,
  });

  const downloadResponse = await fetch(
    `${compilerUrl}/download?id=${sketchId}&board=${board}&filename=${encodeURIComponent(
      filename,
    )}`,
    { signal },
  );
  if (!downloadResponse.ok) {
    throw new Error("Die Binärdatei konnte nicht heruntergeladen werden.");
  }

  const buffer = await downloadResponse.arrayBuffer();
  return new Uint8Array(buffer);
}
