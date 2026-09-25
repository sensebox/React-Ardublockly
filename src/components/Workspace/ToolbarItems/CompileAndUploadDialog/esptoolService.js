import { ESPLoader, Transport } from "esptool-js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// senseBox MCU-S2 (ESP32-S2) USB identifiers. After the 1200bps touch the board
// re-enumerates as the ROM serial bootloader, which always uses product id
// 0x0002, regardless of the application product id (0x81b8/0x81b9/0x81ba).
export const SENSEBOX_USB_VENDOR_ID = 0x303a;
const ESP32_ROM_BOOTLOADER_PRODUCT_ID = 0x0002;

// ESP32-S2 RTC control registers used for an on-chip software reset. Writing the
// SW_SYS_RST bit performs a full digital system reset – functionally the same as
// a power cycle – which works over native USB (no RTS/DTR lines required).
const RTC_CNTL_OPTIONS0_REG = 0x3f408000; // DR_REG_RTCCNTL_BASE + 0x0
const RTC_CNTL_SW_SYS_RST = 0x80000000; // BIT(31)

/**
 * Checks whether a serial port is the ESP32 ROM serial bootloader.
 * @param {SerialPort} port
 * @returns {boolean}
 */
function isRomBootloaderPort(port) {
  try {
    const { usbVendorId, usbProductId } = port.getInfo();
    return (
      usbVendorId === SENSEBOX_USB_VENDOR_ID &&
      usbProductId === ESP32_ROM_BOOTLOADER_PRODUCT_ID
    );
  } catch {
    return false;
  }
}

/**
 * Performs a real hardware reset by pulsing the EN/RST pin via the RTS line,
 * exactly like the Arduino IDE / esptool.py do. esptool-js' built-in
 * "hard_reset" only ever releases RTS (`setRTS(false)`) and never asserts it,
 * so it produces no EN pulse – we do the full pulse here.
 *
 * IO0 is kept HIGH (`setDTR(false)`) so the chip boots the application instead
 * of dropping back into the ROM download mode.
 *
 * @param {Transport} transport A connected esptool-js transport.
 */
async function hardResetViaRts(transport) {
  await transport.setDTR(false); // IO0 HIGH -> normal boot (not download mode)
  await transport.setRTS(true); // EN LOW  -> hold chip in reset
  await sleep(150);
  await transport.setRTS(false); // EN HIGH -> release; chip boots the new app
  await sleep(150);
}

/**
 * Triggers a full on-chip software reset on an ESP32-S2 by setting the
 * RTC_CNTL_SW_SYS_RST bit. This is equivalent to a power-on reset and works
 * over native USB because it is just a register-write command sent to the
 * running flasher stub. Used as a fallback for boards without an RTS->EN
 * auto-reset circuit.
 *
 * The command is fired without waiting for an acknowledgement: the chip resets
 * the instant the register is written, so it never sends a response.
 *
 * @param {ESPLoader} loader A connected esptool-js loader.
 */
async function softResetViaRegister(loader) {
  const pkt = new Uint8Array(16);
  const view = new DataView(pkt.buffer);
  view.setUint32(0, RTC_CNTL_OPTIONS0_REG, true); // address
  view.setUint32(4, RTC_CNTL_SW_SYS_RST, true); // value
  view.setUint32(8, RTC_CNTL_SW_SYS_RST, true); // mask (only touch the reset bit)
  view.setUint32(12, 0, true); // delay (µs)

  // waitResponse = false: the chip reboots immediately and cannot ACK.
  await loader.command(loader.ESP_WRITE_REG, pkt, undefined, false);
}

/**
 * Puts an ESP32-S2 with native USB into the ROM download mode without the user
 * having to press BOOT + RESET, mirroring the Arduino IDE behaviour
 * (`use_1200bps_touch=true`). Opening the port at 1200 baud is detected by the
 * running firmware, which then reboots into the serial bootloader. The device
 * re-enumerates on the USB bus (usually with a different product id), so the
 * original port handle becomes unusable afterwards.
 *
 * @param {SerialPort} port The currently selected (application) serial port.
 */
export async function touchTo1200bps(port) {
  // Make sure the port is fully closed before re-opening it at 1200 baud.
  // This includes waiting for the OS to fully release the port.
  try {
    await port.close();
  } catch {
    // Port was not open – ignore.
  }

  // Wait for the OS to fully release the port
  await sleep(300);

  // Warm-up open at a standard baud rate. On a freshly enumerated native-USB
  // CDC port (ESP32-S2/S3) the very first open at the unusual 1200 baud rate is
  // frequently rejected by the OS driver ("Failed to open port"), whereas a
  // standard rate opens fine. Opening and immediately closing at 115200 first
  // initialises the CDC line coding so the following 1200-baud open – the rate
  // the firmware watches for to enter download mode – succeeds on the very
  // first try, instead of only after a failed attempt warmed the port up.
  try {
    await port.open({ baudRate: 115200 });
    await port.close();
    await sleep(200);
  } catch {
    // If the warm-up could not open the port, the retry loop below still tries.
  }

  // Open at 1200 baud (with retries) to trigger the reset into the bootloader.
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await port.open({ baudRate: 1200 });

      try {
        // Some stacks only trigger the reset once DTR is de-asserted.
        await port.setSignals({
          dataTerminalReady: false,
          requestToSend: false,
        });
      } catch {
        // setSignals is optional – the 1200 baud open alone is usually enough.
      }

      await sleep(250);
      return; // Success
    } catch (err) {
      lastError = err;

      // Chrome-specific race: the 1200-baud open makes the firmware reset and
      // the USB device re-enumerate as the ROM bootloader *during* the open()
      // call, so Chrome rejects with "Failed to open serial port" even though
      // the touch physically succeeded. When that happens the original port is
      // no longer connected – detect that and treat it as success instead of
      // retrying against the now-stale handle (which can only keep failing).
      // The disconnect can land a moment after the open() rejection, so give it
      // a brief grace period before deciding.
      await sleep(150);
      if (port.connected === false) {
        return;
      }

      // Release a potentially half-open handle before the next attempt.
      try {
        await port.close();
      } catch {
        // Nothing to close – ignore.
      }
      if (attempt < 2) {
        // Wait before retrying
        await sleep(300);
      }
    }
  }

  // All open attempts failed but the port still vanished in the meantime: the
  // board re-enumerated into the bootloader, so the touch effectively worked.
  if (port.connected === false) {
    return;
  }

  throw new Error(
    `Failed to open port at 1200bps after 3 attempts: ${lastError?.message}`,
  );
}

/**
 * Waits for the serial bootloader port to become available after a reset into
 * the bootloader (mirrors the Arduino IDE `wait_for_upload_port=true`).
 *
 * The board re-enumerates as the ESP32 ROM serial bootloader (product id
 * 0x0002). We therefore prefer that port as soon as it is *connected*, even if
 * the browser already had permission for it from a previous session (in which
 * case it is part of `knownPorts` and the old "is this port new?" check would
 * miss it). As a fallback we accept any genuinely new port that appears.
 *
 * Resolves with the bootloader port, or `null` if none shows up within the
 * timeout (e.g. the board was already in the bootloader, or the browser has no
 * permission for the re-enumerated device).
 *
 * @param {SerialPort[]} knownPorts Ports that already existed before the reset.
 * @param {number} [timeoutMs] How long to wait for the new port.
 * @returns {Promise<SerialPort|null>}
 */
export function waitForBootloaderPort(knownPorts, timeoutMs = 8000) {
  return new Promise((resolve) => {
    const known = new Set(knownPorts);
    let settled = false;

    const cleanup = () => {
      navigator.serial.removeEventListener("connect", onConnect);
      clearInterval(pollId);
      clearTimeout(timerId);
    };
    const finish = (result) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };

    // The `connect` event only fires on an actual physical (re)connection, so a
    // matching bootloader port here is guaranteed to be live, not a stale entry.
    const onConnect = (event) => {
      const candidate = event.target;
      if (isRomBootloaderPort(candidate) || !known.has(candidate)) {
        finish(candidate);
      }
    };
    navigator.serial.addEventListener("connect", onConnect);

    // Poll as well: the `connect` event is not guaranteed for every UA. A
    // previously-granted bootloader port is already listed (but disconnected)
    // before the touch, so require `connected === true` to avoid a stale match.
    const pollId = setInterval(async () => {
      const ports = await navigator.serial.getPorts();
      const bootloader = ports.find(
        (candidate) =>
          isRomBootloaderPort(candidate) && candidate.connected === true,
      );
      if (bootloader) {
        finish(bootloader);
        return;
      }
      const fresh = ports.find(
        (candidate) => !known.has(candidate) && candidate.connected !== false,
      );
      if (fresh) finish(fresh);
    }, 400);

    const timerId = setTimeout(() => finish(null), timeoutMs);
  });
}

/**
 * Flashes one or more binary images to an ESP32 (e.g. senseBox MCU-S2 / ESP32-S2)
 * using Espressif's esptool-js over the Web Serial API.
 *
 * @param {object}   params
 * @param {SerialPort} params.port        A Web Serial port chosen by the user.
 * @param {Array<{ data: Uint8Array, address: number }>} params.fileArray
 * @param {number}   [params.baudrate]    Baud rate for the flashing session.
 * @param {string}   [params.flashMode]   SPI flash mode (e.g. "dio").
 * @param {string}   [params.flashFreq]   SPI flash frequency (e.g. "80m").
 * @param {string}   [params.flashSize]   Flash size (e.g. "4MB").
 * @param {boolean}  [params.eraseAll]    Erase the whole flash before writing.
 * @param {boolean}  [params.usingUsbOtg] Reset via the USB-OTG sequence (ESP32-S2/S3).
 * @param {(msg: string) => void} [params.onLog]      Receives console output.
 * @param {(percent: number) => void} [params.onProgress] 0–100 progress.
 * @returns {Promise<string>} The detected chip description.
 */
export async function flashBinary({
  port,
  fileArray,
  baudrate = 115200,
  flashMode = "keep",
  flashFreq = "keep",
  flashSize = "keep",
  eraseAll = false,
  usingUsbOtg = false,
  onLog,
  onProgress,
}) {
  const terminal = {
    clean: () => {},
    write: (data) => onLog?.(data),
    writeLine: (data) => onLog?.(`${data}\n`),
  };

  const transport = new Transport(port, false);
  const loader = new ESPLoader({ transport, baudrate, terminal });

  try {
    // Connects, syncs and detects the chip.
    const chip = await loader.main();

    await loader.writeFlash({
      fileArray,
      flashSize,
      flashMode,
      flashFreq,
      eraseAll,
      compress: true,
      reportProgress: (_fileIndex, written, total) => {
        if (total > 0) {
          onProgress?.(Math.round((written / total) * 100));
        }
      },
    });

    // Reboot the board into the freshly flashed firmware. The senseBox MCU-S2
    // has the classic auto-reset circuit, so pulsing EN via the RTS line resets
    // it just like the Arduino IDE does. (esptool-js' own "hard_reset" only
    // releases RTS and never asserts it, which is why it never reset the board.)
    if (usingUsbOtg) {
      try {
        await hardResetViaRts(transport);
      } catch {
        // The chip drops off the USB bus the instant it resets, so the trailing
        // RTS write may fail – that is expected and means the reset worked.
      }
      // Fallback for boards without an RTS->EN circuit: ask the chip to reset
      // itself in software. Harmless if the pulse above already restarted it.
      try {
        await softResetViaRegister(loader);
      } catch {
        // Ignore – the chip is already rebooting.
      }
    } else {
      await loader.after("hard_reset");
    }
    return chip;
  } finally {
    try {
      await transport.disconnect();
    } catch {
      // Ignore errors while releasing the port.
    }
  }
}
