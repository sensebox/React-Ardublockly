export const sdCreateFile = { kind: "block", type: "sensebox_sd_create_file" };
export const sdWriteFile = { kind: "block", type: "sensebox_sd_write_file" };
export const sdOpenFile = {
  kind: "block",
  type: "sensebox_sd_open_file",
  inputs: { SD: { block: { kind: "block", type: "sensebox_sd_write_file" } } },
};
export const sdSaveForOsem = {
  kind: "block",
  type: "sensebox_sd_save_for_osem",
};

// TODO: This block is not working
export const sdOpenFileSave = {
  kind: "block",
  type: "sensebox_sd_open_file",
  inputs: {
    SD: {
      block: {
        kind: "block",
        type: "sensebox_sd_osem",
        inputs: {
          DO: {
            block: {
              kind: "block",
              type: "sensebox_sd_save_for_osem",
            },
          },
        },
      },
    },
  },
};
export const sdOsem = { kind: "block", type: "sensebox_sd_osem" };

export const esp32SDCreateFile = {
  kind: "block",
  type: "sensebox_esp32s2_sd_create_file",
};
export const esp32SDWriteFile = {
  kind: "block",
  type: "sensebox_esp32s2_sd_write_file",
};
export const esp32SDOpenFile = {
  kind: "block",
  type: "sensebox_esp32s2_sd_open_file",
  inputs: {
    SD: { block: esp32SDWriteFile },
  },
};
export const esp32SDOpenFileSave = {
  kind: "block",
  type: "sensebox_esp32s2_sd_open_file",
  inputs: {
    SD: {
      block: {
        kind: "block",
        type: "sensebox_sd_osem",
        inputs: {
          DO: {
            block: {
              kind: "block",
              type: "sensebox_sd_save_for_osem",
            },
          },
        },
      },
    },
  },
};

export default {
  mcu: [
    sdCreateFile,
    sdOpenFile,
    sdWriteFile,
    sdOpenFileSave,
    sdOsem,
    sdSaveForOsem,
  ],
  mini: [
    sdCreateFile,
    sdOpenFile,
    sdWriteFile,
    sdOpenFileSave,
    sdOsem,
    sdSaveForOsem,
  ],
  esp32: [
    esp32SDCreateFile,
    esp32SDOpenFile,
    esp32SDWriteFile,
    esp32SDOpenFileSave,
    sdOsem,
    sdSaveForOsem,
  ],
};
