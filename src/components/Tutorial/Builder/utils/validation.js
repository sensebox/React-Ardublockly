export function validateRequiredFields({ title, subtitle }) {
  const missing = [];
  if (!title?.trim()) missing.push("title");
  if (!subtitle?.trim()) missing.push("subtitle");
  return missing;
}
