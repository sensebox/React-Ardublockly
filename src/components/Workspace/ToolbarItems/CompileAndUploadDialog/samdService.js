import { createSamBATransport } from "./sambaTransport";

// The MCU linker script reserves the first 8 KiB for its SAM-BA bootloader.
const APPLICATION_OFFSET = 0x2000;

export async function flashSamdBinary({ port, firmware, onLog, onProgress }) {
  const { SamBA, Device, Family, Flasher } = await import("bossa-web");
  const logger = {
    debug: () => {},
    log: (...args) => onLog?.(`${args.join(" ")}\n`),
    error: (...args) => onLog?.(`${args.join(" ")}\n`),
  };
  const Transport = createSamBATransport(SamBA);
  const samba = new Transport(port, { logger });
  try {
    await samba.connect();
    const device = new Device(samba);
    await device.create();
    const flash = device.flash;
    if (device.family !== Family.FAMILY_SAMD21 || !flash) {
      throw new Error("The connected device is not a SAMD21 senseBox MCU.");
    }
    if (
      !firmware.length ||
      firmware.length > flash.totalSize - APPLICATION_OFFSET
    ) {
      throw new Error("Firmware does not fit in the MCU application flash.");
    }
    const flasher = new Flasher(samba, flash, {
      onStatus: (message) => onLog?.(message),
      onProgress: (current, total) => {
        if (total) onProgress?.(Math.round((current / total) * 100));
      },
    });
    await flasher.erase(APPLICATION_OFFSET);
    await flasher.write(firmware, APPLICATION_OFFSET);
    // bossa-web's verify() is unimplemented, so compare flash readback directly.
    onLog?.("Verify firmware\n");
    for (let offset = 0; offset < firmware.length; offset += 256) {
      const expected = firmware.subarray(offset, offset + 256);
      const actual = new Uint8Array(expected.length);
      await samba.read(APPLICATION_OFFSET + offset, actual, actual.length);
      if (actual.some((byte, index) => byte !== expected[index])) {
        throw new Error(`Firmware verification failed at offset ${offset}.`);
      }
    }
    await device.reset();
  } finally {
    try {
      await samba.disconnect();
    } catch {
      // Reset can already have disconnected the device.
    }
    try {
      await port.close();
    } catch {
      // Release partially opened ports as well as successful connections.
    }
  }
}
