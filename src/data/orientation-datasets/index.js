import mailDataset from "./mail.json";

/**
 * Registry of built-in orientation example datasets.
 * Add further entries here as new datasets are created.
 */
export const ORIENTATION_DATASETS = [
  {
    id: "mail",
    labelDe: "Paket",
    labelEn: "Box",
    data: mailDataset,
  },
];
