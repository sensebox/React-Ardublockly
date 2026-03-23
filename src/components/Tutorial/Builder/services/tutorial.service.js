const API = import.meta.env.VITE_BLOCKLY_API;

export async function fetchTutorial(id, token) {
  const res = await fetch(`${API}/tutorial/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Fetch failed");
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

  if (!res.ok) throw new Error("Save failed");
  return res.json();
}
