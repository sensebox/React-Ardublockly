const API = import.meta.env.VITE_BLOCKLY_API;

/* ------------------ Tutorials ------------------ */

export async function fetchTutorial(id, token) {
  const res = await fetch(`${API}/tutorial/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!res.ok) throw new Error("Fetch tutorial failed");
  return res.json();
}

export async function saveTutorial({ id, payload, token }) {
  const method = id ? "PUT" : "POST";
  const url = id ? `${API}/tutorial/${id}` : `${API}/tutorial/`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Save tutorial failed");
  return res.json();
}

/* ------------------ Tutorial Progress ------------------ */

/**
 * Start tutorial (creates progress if not existing)
 * POST /tutorial/:tutorialId/start
 */
export async function startTutorial({ tutorialId, token }) {
  if (!token) return null;

  const res = await fetch(`${API}/tutorial/${tutorialId}/start`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Start tutorial failed");
  return res.json();
}

/**
 * Get tutorial progress
 * GET /tutorial/:tutorialId/progress
 */
export async function fetchTutorialProgress({ tutorialId, token }) {
  if (!token) return null;

  const res = await fetch(`${API}/tutorial/${tutorialId}/progress`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Fetch progress failed");
  return res.json();
}

/**
 * Mark step as seen
 * POST /tutorial/:tutorialId/steps/:stepId/seen
 */
export async function markStepSeen({ tutorialId, stepId, token }) {
  if (!token) return null;

  const res = await fetch(
    `${API}/tutorial/${tutorialId}/steps/${stepId}/seen`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error("Mark step seen failed");
  return res.json();
}

/**
 * Answer question
 * POST /tutorial/:tutorialId/steps/:stepId/questions/answer
 */
export async function answerQuestion(tutorialId, stepId, questionId, token) {
  if (!token) return null;

  const res = await fetch(
    `${API}/tutorial/${tutorialId}/steps/${stepId}/questions/answer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ questionId, correct: true }),
    },
  );
  if (!res.ok) throw new Error("Answer question failed");
  return res.json();
}

/**
 * Fetch ALL tutorial progress entries for logged-in user
 * GET /tutorial/progress
 */
export async function fetchAllTutorialProgress({ token }) {
  if (!token) return null;

  const res = await fetch(`${API}/tutorial/progress`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Fetch all tutorial progress failed");
  }

  return res.json();
}

/**
 * Reset tutorial progress
 * DELETE /tutorial/:tutorialId/progress
 */
export async function resetTutorialProgress({ tutorialId, token }) {
  if (!token) return null;

  const res = await fetch(`${API}/tutorial/${tutorialId}/progress`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Reset progress failed");
  return res.json();
}
