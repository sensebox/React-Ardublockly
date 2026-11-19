/**
 * Registry of built-in image example datasets.
 *
 * Each zip contains a `train/` and a `test/` folder, each with one folder
 * per class holding the images (96x96 JPEGs, as exported by the tool).
 *
 * The zips live in `public/datasets/image/` and are referenced via
 * `import.meta.env.BASE_URL`, so both the app and the tutorial widget (Vite
 * library mode, which would inline imported assets into tutorial.js) serve
 * them as separate files that are only downloaded when a user loads them.
 * Public files get no content hash: when replacing a dataset, give the zip a
 * new filename (e.g. `_v2`) so browsers don't keep using a cached old one.
 *
 * `classNamesEn` optionally maps the class folder names to English names.
 * Add further entries here as new datasets are created.
 */
const DATASET_BASE_URL = `${import.meta.env.BASE_URL}datasets/image/`;

export const IMAGE_DATASETS = [
  {
    id: "wuerfel-apfel",
    labelDe: "Würfel & Apfel",
    labelEn: "Dice & Apple",
    url: `${DATASET_BASE_URL}wuerfel_apfel.zip`,
    classNamesEn: {
      Apfel: "Apple",
      Würfel: "Dice",
    },
  },
];
