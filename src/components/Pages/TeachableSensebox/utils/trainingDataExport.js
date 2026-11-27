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
 * Create a zip with separate training and test samples for download,
 * structured as `train/<class>/<file>` and `test/<class>/<file>` (the format
 * read by parseTrainTestZip)
 * @param {Array} classes - Array of class objects with `samples` and `testSamples`
 * @param {string} type - The type identifier for filename (e.g. "image")
 * @param {Function} getSampleData - Same callback as for downloadTrainingData
 * @returns {Promise<void>}
 */
export const downloadTrainTestData = async (classes, type, getSampleData) => {
  const zip = new JSZip();
  const splits = [
    ["train", "samples"],
    ["test", "testSamples"],
  ];

  for (const [split, key] of splits) {
    const splitFolder = zip.folder(split);
    for (const cls of classes) {
      const folder = splitFolder.folder(sanitizeClassName(cls.name));
      const samples = cls[key] || [];
      for (let i = 0; i < samples.length; i++) {
        const { filename, data } = await getSampleData(samples[i], i);
        folder.file(filename, data);
      }
    }
  }

  const classNames = classes
    .map((cls) => sanitizeClassName(cls.name))
    .join("_");
  const timestamp = Date.now();
  const filename = `${type}-${classNames}-${timestamp}.zip`;

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, filename);
};

/**
 * Check whether a zip file uses the `train/` + `test/` layout
 * @param {Blob} file - The zip file to check
 * @returns {Promise<boolean>}
 */
export const isTrainTestZip = async (file) => {
  try {
    const contents = await new JSZip().loadAsync(file);
    return Object.keys(contents.files).some(
      (path) => path.startsWith("train/") || path.startsWith("test/"),
    );
  } catch {
    return false;
  }
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

      // Ignore macOS metadata folders
      if (pathParts.some((part) => part === "__MACOSX" || part.startsWith(".")))
        continue;

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

/**
 * Parse a zip with separate training and test images, structured as
 * `train/<class>/<file>` and `test/<class>/<file>`. Other entries are ignored.
 * @param {Blob} file - The zip file to parse
 * @param {Function} processFile - Same callback as for parseTrainingDataZip
 * @returns {Promise<{classes: Array, error: string|null}>} Classes with
 *          `samples` (training images) and `testSamples` (test images)
 */
export const parseTrainTestZip = async (file, processFile) => {
  try {
    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    const newClasses = [];
    let classId = Date.now();

    // Training entries first, so the class order follows the train folder
    const entries = Object.entries(contents.files).sort(
      ([a], [b]) => a.startsWith("test/") - b.startsWith("test/"),
    );

    for (const [path, zipEntry] of entries) {
      if (zipEntry.dir) continue;

      const pathParts = path.split("/");
      if (pathParts.length !== 3) continue;
      const [split, className, fileName] = pathParts;
      if (split !== "train" && split !== "test") continue;
      if (fileName.startsWith(".")) continue;

      try {
        const result = await processFile(zipEntry, className, fileName);
        if (!result || !result.isValid) continue;

        let classObj = newClasses.find((c) => c.name === className);
        if (!classObj) {
          classObj = {
            id: classId++,
            name: className,
            samples: [],
            testSamples: [],
          };
          newClasses.push(classObj);
        }
        classObj[split === "train" ? "samples" : "testSamples"].push(
          result.sample,
        );
      } catch {
        // Skip files that can't be processed
        continue;
      }
    }

    if (newClasses.length === 0) {
      return { classes: null, error: "NO_VALID_DATA" };
    }

    return { classes: newClasses, error: null };
  } catch (error) {
    console.error("Error parsing train/test zip:", error);
    return { classes: null, error: "INVALID_ZIP" };
  }
};
