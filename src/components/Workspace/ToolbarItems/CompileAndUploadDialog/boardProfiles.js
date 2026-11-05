const esp = {
  vendorId: 0x303a,
  bootloaderProductId: 0x0002,
  address: 0x10000,
  flashMode: "dio",
  flashFreq: "80m",
  backend: "esp",
};

const profiles = {
  MCU: {
    compilerBoard: "sensebox-mcu",
    deviceName: "senseBox MCU",
    bootloaderName: "senseBox MCU",
    vendorId: 0x04d8,
    productIds: [0xef66, 0xef67],
    bootloaderProductId: 0xef66,
    backend: "samd",
  },
  "MCU-S2": {
    ...esp,
    compilerBoard: "sensebox-esp32s2",
    deviceName: "senseBox MCU-S2 ESP32-S2",
    bootloaderName: "ESP32-S2",
    productIds: [0x81b8, 0x81b9, 0x81ba, 0x0002],
    chip: "ESP32-S2",
    flashSize: "4MB",
  },
  "MCU-EYE": {
    ...esp,
    compilerBoard: "sensebox_mcu_eye",
    deviceName: "senseBox MCU Eye",
    bootloaderName: "ESP32-S3",
    productIds: [0x82d1, 0x82d2, 0x82d3, 0x0002, 0x1001],
    bootloaderProductIds: [0x0002, 0x1001],
    chip: "ESP32-S3",
    flashSize: "16MB",
  },
};

export const getBoardProfile = (board) =>
  profiles[board?.toUpperCase()] ?? null;
export const portFilters = (profile, bootloader = false) =>
  (bootloader
    ? (profile.bootloaderProductIds ?? [profile.bootloaderProductId])
    : profile.productIds
  ).map((usbProductId) => ({ usbVendorId: profile.vendorId, usbProductId }));
export function matchesPort(port, profile, bootloader = false) {
  const info = port.getInfo?.() ?? {};
  return portFilters(profile, bootloader).some(
    (filter) =>
      filter.usbVendorId === info.usbVendorId &&
      filter.usbProductId === info.usbProductId,
  );
}
