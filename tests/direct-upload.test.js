import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getBoardProfile,
  matchesPort,
} from "../src/components/Workspace/ToolbarItems/CompileAndUploadDialog/boardProfiles.js";
import {
  waitForBootloaderPort,
  resetEsp32S3,
} from "../src/components/Workspace/ToolbarItems/CompileAndUploadDialog/esptoolService.js";
import { createSamBATransport } from "../src/components/Workspace/ToolbarItems/CompileAndUploadDialog/sambaTransport.js";

const port = (usbVendorId, usbProductId) => ({
  getInfo: () => ({ usbVendorId, usbProductId }),
  connected: true,
});

test("MCU and Eye accept their own devices and reject other application ports", () => {
  const mcu = getBoardProfile("MCU");
  const eye = getBoardProfile("MCU-Eye");
  assert.equal(mcu.compilerBoard, "sensebox-mcu");
  assert.equal(eye.compilerBoard, "sensebox_mcu_eye");
  assert.ok(matchesPort(port(0x04d8, 0xef67), mcu));
  assert.ok(matchesPort(port(0x04d8, 0xef66), mcu, true));
  assert.ok(!matchesPort(port(0x04d8, 0xef67), mcu, true));
  assert.ok(matchesPort(port(0x303a, 0x82d1), eye));
  assert.ok(!matchesPort(port(0x303a, 0x81b8), eye));
  assert.ok(!matchesPort(port(0x303a, 0x0002), mcu, true));
  assert.equal(getBoardProfile("unknown"), null);
});

test("bootloader discovery ignores unrelated newly connected serial devices", async () => {
  const serial = new EventTarget();
  serial.getPorts = async () => [];
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { serial },
  });
  const profile = getBoardProfile("MCU");
  const result = waitForBootloaderPort([], 100, (p) =>
    matchesPort(p, profile, true),
  );
  const emit = (p) => {
    const event = new Event("connect");
    Object.defineProperty(event, "target", { value: p });
    serial.dispatchEvent(event);
  };
  emit(port(0x303a, 0x0002));
  const bootloader = port(0x04d8, 0xef66);
  emit(bootloader);
  assert.equal(await result, bootloader);
});

test("SAM-BA binary replies preserve embedded zero bytes and reject truncation", async () => {
  const Transport = createSamBATransport(class {});
  const transport = new Transport();
  transport.inputBuffer = [0x12, 0, 0x34, 0];
  assert.deepEqual(
    await transport.readBuffer(100, 4),
    new Uint8Array([0x12, 0, 0x34, 0]),
  );
  transport.inputBuffer = [0x12, 0];
  await assert.rejects(transport.readBuffer(20, 4), /Incomplete/);
});

test("SAM-BA disconnect waits for the serial reader to release its lock", async () => {
  let finish;
  const Transport = createSamBATransport(
    class {
      readLoop() {
        return new Promise((resolve) => {
          finish = resolve;
        });
      }
    },
  );
  const transport = new Transport();
  transport.readLoop();
  let released = false;
  transport.serialReader = {
    cancel: async () => {
      released = true;
      finish();
    },
  };
  await transport.disconnect();
  assert.ok(released);
  assert.ok(transport.closed);
});

test("SAM-BA accepts short version text without relaxing binary reads", async () => {
  const calls = [];
  const Transport = createSamBATransport(
    class {
      async sendCommand(command, size) {
        calls.push([command, size]);
        this.inputBuffer = [
          ...new TextEncoder().encode("v1.1 [Arduino:XYZ]\n\r"),
        ];
      }
    },
  );
  const transport = new Transport();
  assert.equal(await transport.readVersion(), "v1.1 [Arduino:XYZ]");
  assert.deepEqual(calls, [["V", 0]]);
});

test("SAM-BA reads fragmented version text through its terminator", async () => {
  const Transport = createSamBATransport(
    class {
      async sendCommand() {
        this.inputBuffer = [...new TextEncoder().encode("v1.1 ")];
        setTimeout(
          () =>
            this.inputBuffer.push(
              ...new TextEncoder().encode("[Arduino:XY]\0"),
            ),
          15,
        );
      }
    },
  );
  assert.equal(await new Transport().readVersion(), "v1.1 [Arduino:XY]");
});

test("SAM-BA verification reads fill every byte across USB chunk boundaries", async () => {
  const source = Uint8Array.from({ length: 256 }, (_, index) => index);
  const calls = [];
  const Transport = createSamBATransport(
    class {
      hex(value) {
        return value.toString(16);
      }
      async sendCommand(command, length) {
        const address = parseInt(command.slice(1).split(",")[0], 16);
        calls.push([address, length]);
        return source.slice(address - 0x2000, address - 0x2000 + length);
      }
    },
  );
  const buffer = new Uint8Array(256);
  await new Transport().read(0x2000, buffer, buffer.length);
  assert.deepEqual(buffer, source);
  assert.deepEqual(
    calls.map(([, length]) => length),
    [63, 63, 63, 63, 4],
  );
});

test("SAM-BA errors identify the command and received byte count", async () => {
  const Transport = createSamBATransport(
    class {
      async sendCommand() {
        return this.readBuffer(20, 4);
      }
    },
  );
  const transport = new Transport();
  transport.inputBuffer = [0x12, 0];
  await assert.rejects(
    transport.sendCommand("w00000000,4", 4),
    /command w00000000,4: Incomplete SAM-BA response: expected 4 bytes, received 2/,
  );
});

test("SAM-BA opens USB CDC without hardware flow control before handshaking", async () => {
  const events = [];
  const Transport = createSamBATransport(
    class {
      async _connect() {
        events.push("handshake");
      }
    },
  );
  const transport = new Transport();
  transport.serialPort = {
    async open(options) {
      events.push(["open", options]);
    },
    async setSignals(signals) {
      events.push(["signals", signals]);
    },
  };
  await transport.connect();
  assert.equal(events[0][1].flowControl, "none");
  assert.equal(events[0][1].baudRate, 115200);
  assert.deepEqual(events[1], [
    "signals",
    {
      dataTerminalReady: true,
      requestToSend: true,
    },
  ]);
  assert.equal(events[2], "handshake");
});

for (const acknowledgement of [[], [10, 13]]) {
  test(`SAM-BA accepts ${acknowledgement.length}-byte N acknowledgement followed by valid V reply`, async () => {
    const commands = [];
    const Transport = createSamBATransport(
      class {
        async sendCommand(command) {
          commands.push(command);
          this.inputBuffer =
            command === "N"
              ? [...acknowledgement]
              : [...new TextEncoder().encode("v1.1 [Arduino:XYZ]\0")];
        }
      },
    );
    const transport = new Transport();
    await transport.setBinaryMode();
    assert.equal(await transport.readVersion(), "v1.1 [Arduino:XYZ]");
    assert.deepEqual(commands, ["N", "V"]);
  });
}

test("SAM-BA does not continue initialization if the USB port cannot open", async () => {
  let handshake = false;
  const Transport = createSamBATransport(
    class {
      async _connect() {
        handshake = true;
      }
    },
  );
  const transport = new Transport();
  transport.serialPort = {
    async open() {
      throw new Error("Port unavailable");
    },
  };
  await assert.rejects(transport.connect(), /Port unavailable/);
  assert.equal(handshake, false);
});

test("SAM-BA still rejects a nonresponsive bootloader after optional N acknowledgement", async () => {
  const Transport = createSamBATransport(
    class {
      async sendCommand() {
        this.inputBuffer = [];
      }
    },
  );
  const transport = new Transport();
  await transport.setBinaryMode();
  await assert.rejects(
    transport.readVersion(),
    /no complete version reply to V#/,
  );
});

test("MCU Eye connection profile matches the uppercase Redux board identifier", () => {
  const profile = getBoardProfile("MCU-EYE");
  assert.ok(profile);
  assert.equal(profile.chip, "ESP32-S3");
  assert.equal(profile.compilerBoard, "sensebox_mcu_eye");
  assert.equal(profile, getBoardProfile("MCU-Eye"));
  assert.equal(getBoardProfile(null), null);
});

test("MCU Eye reset clears forced download mode before arming the RTC watchdog", async () => {
  const writes = [];
  await resetEsp32S3({
    chip: { CHIP_NAME: "ESP32-S3" },
    writeReg: async (...args) => {
      writes.push(args);
    },
  });
  assert.deepEqual(writes, [
    [0x6000812c, 0, 1],
    [0x600080b0, 0x50d83aa1],
    [0x6000809c, 2000],
    [0x60008098, 0xd0000102],
    [0x600080b0, 0],
  ]);
});

test("MCU Eye reset does not hide failures or write S3 registers to other chips", async () => {
  let writes = 0;
  const loader = {
    chip: { CHIP_NAME: "ESP32-S2" },
    writeReg: async () => {
      writes++;
      throw new Error("USB write failed");
    },
  };
  await assert.rejects(resetEsp32S3(loader), /different chip/);
  assert.equal(writes, 0);
  loader.chip.CHIP_NAME = "ESP32-S3";
  await assert.rejects(resetEsp32S3(loader), /USB write failed/);
  assert.equal(writes, 1);
});
