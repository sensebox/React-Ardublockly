import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * Sanitize class name for use in filenames
 * @param {string} name - The class name
 * @returns {string} Sanitized name safe for filenames
 */
export const sanitizeClassName = (name) => {
  return name.replace(/[/\\?%*:|"<>\s]/g, "_");
};

/**
 * Create a training data zip file for download
 * @param {Array} classes - Array of class objects with samples
 * @param {string} type - The type identifier for filename ("image" or "spell")
 * @param {Function} getSampleData - Callback to get sample data for a given sample
 *        Should return {filename: string, data: Blob|string}
 * @returns {Promise<void>}
 */
export const downloadTrainingData = async (classes, type, getSampleData) => {
  const zip = new JSZip();

  for (const cls of classes) {
    const folderName = sanitizeClassName(cls.name);
    const folder = zip.folder(folderName);

    for (let i = 0; i < cls.samples.length; i++) {
      const sample = cls.samples[i];
      const { filename, data } = await getSampleData(sample, i);
      folder.file(filename, data);
    }
  }

  // Create filename with class names
  const classNames = classes
    .map((cls) => sanitizeClassName(cls.name))
    .join("_");
  const timestamp = Date.now();
  const filename = `${type}-${classNames}-${timestamp}.zip`;

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, filename);
};

/**
 * Parse a training data zip file for upload
 * @param {File} file - The zip file to parse
 * @param {Function} processFile - Callback to process each file in the zip
 *        Should return {isValid: boolean, classObj?: object, sample?: object} or null
 * @returns {Promise<{classes: Array, error: string|null}>}
 */
export const parseTrainingDataZip = async (file, processFile) => {
  try {
    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    const newClasses = [];
    let classId = Date.now();
    let foundValid = false;

    for (const [path, zipEntry] of Object.entries(contents.files)) {
      if (zipEntry.dir) continue;

      const pathParts = path.split("/");
      if (pathParts.length < 2) continue;

      const className = pathParts[0];
      const fileName = pathParts[pathParts.length - 1];

      try {
        const result = await processFile(zipEntry, className, fileName);
        if (!result) continue;

        const { isValid, sample } = result;
        if (!isValid) continue;

        foundValid = true;
        let classObj = newClasses.find((c) => c.name === className);
        if (!classObj) {
          classObj = { id: classId++, name: className, samples: [] };
          newClasses.push(classObj);
        }

        classObj.samples.push(sample);
      } catch (parseError) {
        // Skip files that can't be processed
        continue;
      }
    }

    if (!foundValid || newClasses.length === 0) {
      return { classes: null, error: "NO_VALID_DATA" };
    }

    return { classes: newClasses, error: null };
  } catch (error) {
    console.error("Error parsing training data zip:", error);
    return { classes: null, error: "INVALID_ZIP" };
  }
};
