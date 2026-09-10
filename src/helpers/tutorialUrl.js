// Grav natively supports trailing URL params in the form `/key:value`
// (see `param_sep` in system.yaml) and strips them before resolving the
// page, so appending `/tutorial:<id>` to the current page path still
// resolves to the same page while giving each tutorial its own URL.
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
