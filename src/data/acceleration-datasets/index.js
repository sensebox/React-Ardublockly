/**
 * Acceleration Datasets Loader
 *
 * Provides pre-built motion/orientation datasets for the acceleration classifier.
 * Each dataset category contains multiple classes with ~20 samples each.
 */

// Import category catalogs
import orientationsCatalogRaw from "./orientations/catalog.json";

// Import orientation class data (only existing files)
import flatUpData from "./orientations/flat-up.json";
import flatDownData from "./orientations/flat-down.json";
import tiltedLeftData from "./orientations/tilted-left.json";

/**
 * Map of all class data keyed by "categoryId/classId"
 */
const classDataMap = {
  // Orientations
  "orientations/flat-up": flatUpData,
  "orientations/flat-down": flatDownData,
  "orientations/tilted-left": tiltedLeftData,
};

// Filter catalog to only include classes with data
const orientationsCatalog = {
  ...orientationsCatalogRaw,
  classes: orientationsCatalogRaw.classes.filter(
    (cls) => classDataMap[`orientations/${cls.id}`],
  ),
};

/**
 * All available dataset categories (only those with data)
 */
const categories = [orientationsCatalog];

/**
 * Get the full catalog of all dataset categories
 * @returns {Array} Array of category objects with metadata and class info
 */
export function getDatasetCatalog() {
  return categories;
}

/**
 * Load samples for a specific class
 * @param {string} categoryId - Category identifier (e.g., 'orientations')
 * @param {string} classId - Class identifier (e.g., 'flat-up')
 * @returns {Object|null} Class data with samples, or null if not found
 */
export function loadDatasetClass(categoryId, classId) {
  const key = `${categoryId}/${classId}`;
  return classDataMap[key] || null;
}

/**
 * Load all classes from a category
 * @param {string} categoryId - Category identifier
 * @returns {Array} Array of class data objects with samples
 */
export function loadFullDataset(categoryId) {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return [];

  return category.classes.map((cls) => {
    const data = loadDatasetClass(categoryId, cls.id);
    return {
      ...cls,
      samples: data?.samples || [],
    };
  });
}

/**
 * Load selected classes from potentially multiple categories
 * @param {Array<{categoryId: string, classId: string}>} selections
 * @returns {Array} Array of class objects ready for training
 */
export function loadSelectedClasses(selections) {
  return selections
    .map(({ categoryId, classId }) => {
      const category = categories.find((c) => c.id === categoryId);
      const classMeta = category?.classes.find((c) => c.id === classId);
      const data = loadDatasetClass(categoryId, classId);

      if (!classMeta || !data) return null;

      return {
        id: `${categoryId}-${classId}-${Date.now()}`,
        name: classMeta.name,
        samples: data.samples.map((s, idx) => ({
          id: `${classId}-sample-${idx}-${Date.now() + idx}`,
          readings: s.readings,
          recordedAt: s.recordedAt || Date.now(),
        })),
      };
    })
    .filter(Boolean);
}

export default {
  getDatasetCatalog,
  loadDatasetClass,
  loadFullDataset,
  loadSelectedClasses,
};
