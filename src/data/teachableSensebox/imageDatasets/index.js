import wuerfelApfelUrl from "./Würfel_Apfel.zip?url";

/**
 * Registry of built-in image example datasets.
 *
 * Each zip contains a `train/` and a `test/` folder, each with one folder
 * per class holding the images (96x96 JPEGs, as exported by the tool).
 * The zips are imported with `?url` so they are emitted as separate files
 * and only downloaded when a user loads the dataset.
 *
 * `classNamesEn` optionally maps the class folder names to English names.
 * Add further entries here as new datasets are created.
 */
export const IMAGE_DATASETS = [
  {
    id: "wuerfel-apfel",
    labelDe: "Würfel & Apfel",
    labelEn: "Dice & Apple",
    url: wuerfelApfelUrl,
    classNamesEn: {
      Apfel: "Apple",
      Würfel: "Dice",
    },
  },
];
