// Grav natively supports trailing URL params in the form `/key:value`
// `/tutorial:<id>`
export const TUTORIAL_URL_PARAM = "tutorial";

const TUTORIAL_PARAM_REGEX = new RegExp(`/${TUTORIAL_URL_PARAM}:([^/]+)/?$`);

// Flattens the grouped tutorial config (groups of { group, tutorials }) into
// a single array of { id, type, _group } entries.
export function normalizeTutorialConfigs(tutorialConfigs) {
  return Array.isArray(tutorialConfigs)
    ? tutorialConfigs.flatMap((item) => {
        if (item.group) {
          return Array.isArray(item.tutorials)
            ? item.tutorials.map((t) => ({ ...t, _group: item.group }))
            : [];
        }
        return item;
      })
    : [];
}

// Returns the tutorial id encoded in the current URL, or null if none.
export function getTutorialIdFromUrl() {
  const match = window.location.pathname.match(TUTORIAL_PARAM_REGEX);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

// Returns the current page path with any `/tutorial:<id>` segment removed.
export function getTutorialBasePath() {
  const basePath = window.location.pathname.replace(TUTORIAL_PARAM_REGEX, "");
  return basePath || "/";
}

// Builds the URL (path + search + hash) representing a specific tutorial.
export function buildTutorialUrl(tutorialId) {
  const basePath = getTutorialBasePath().replace(/\/$/, "");
  return `${basePath}/${TUTORIAL_URL_PARAM}:${encodeURIComponent(tutorialId)}${window.location.search}${window.location.hash}`;
}

// Parses a 1-based step selection like "1-3, 5, 8-*" (or [1, 2, 3]) into a
// predicate over 0-based step indices. "N-*" means from step N to the end.
// Returns null when empty, meaning "all steps".
export function parseStepSelection(selection) {
  if (selection === undefined || selection === null || selection === "") {
    return null;
  }
  const parts = Array.isArray(selection)
    ? selection.map(String)
    : String(selection).split(",");
  const ranges = [];
  for (const part of parts) {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+|\*))?$/);
    if (!match) continue;
    const start = Number(match[1]);
    const end =
      match[2] === "*" ? Infinity : match[2] ? Number(match[2]) : start;
    const from = Math.max(Math.min(start, end), 1);
    const to = Math.max(start, end);
    if (to >= 1) ranges.push([from - 1, to - 1]);
  }
  if (ranges.length === 0) return null;
  return (stepIndex) =>
    ranges.some(([from, to]) => stepIndex >= from && stepIndex <= to);
}
