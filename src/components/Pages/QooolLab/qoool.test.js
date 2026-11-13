import test from "node:test";
import assert from "node:assert/strict";
import { TelegramDecoder, parseTelegram, commandsFor } from "./protocol.js";
import { fitLorentzians, lorentzian } from "./fit.js";
import SerialConnection from "./SerialConnection.js";
import SimulatedConnection from "./SimulatedConnection.js";
import {
  ANGLES,
  BASE_VOLTAGE,
  CENTER,
  MAX_SPLIT,
  peaksFor,
  spectrum,
} from "../../Simulator/magnetometer/model.js";

test("split UTF-8 transport frames, noise and consecutive telegrams", () => {
  const decoder = new TelegramDecoder();
  assert.deepEqual(decoder.push("noise<po"), []);
  assert.deepEqual(decoder.push("ng><batch,[[1,2,3,4,"), ["<pong>"]);
  assert.deepEqual(decoder.push("5,6,7,8]]><end>\n"), [
    "<batch,[[1,2,3,4,5,6,7,8]]>",
    "<end>",
  ]);
  assert.deepEqual(decoder.push("<broken<pong>"), ["<pong>"]);
});
test("batch parser supports signed values and exponents, rejects malformed measurements", () => {
  assert.deepEqual(parseTelegram("<data,[1e3,-2,3,4,5,6,7,8]>").rows, [
    [1000, -2, 3, 4, 5, 6, 7, 8],
  ]);
  assert.equal(
    parseTelegram("<batch,[[1,2,3,4,5,6,7,8],[2,3,4,5,6,7,8,9]]>").rows.length,
    2,
  );
  assert.throws(() => parseTelegram("<batch,[[1,2]]>"));
  assert.throws(() => parseTelegram("<data,[1,2,3,4,5,6,7,null]>"));
  assert.throws(() => parseTelegram("<xscale,[3,1]>"));
  assert.deepEqual(parseTelegram("<yscale,[-1,2]>").value, [-1, 2]);
  assert.equal(parseTelegram("<text,hello, world>").value, "hello, world");
});
const settings = {
  f1: 2700,
  f2: 3000,
  blink: 5,
  s1: 10,
  s2: 20,
  s3: 30,
  option1: true,
  option2: false,
};
test("all five mode command sequences match the Python wire protocol", () => {
  assert.deepEqual(commandsFor("sweep", settings, "sample"), [
    "<f1,2700>",
    "<f2,3000>",
    "<text,sample>",
    "<start,sweep>",
  ]);
  assert.deepEqual(commandsFor("waterfall", settings), [
    "<f1,2700>",
    "<f2,3000>",
    "<start,waterfall>",
  ]);
  assert.deepEqual(commandsFor("hopp", settings), [
    "<f1,2700>",
    "<f2,3000>",
    "<s1,5>",
    "<text,>",
    "<start,hopp>",
  ]);
  assert.deepEqual(commandsFor("roll", settings), [
    "<f1,2700>",
    "<s1,10>",
    "<s2,20>",
    "<s3,30>",
    "<option1,1>",
    "<option2,0>",
    "<text,>",
    "<start,roll>",
  ]);
  assert.deepEqual(commandsFor("xy", settings), [
    "<f1,2700>",
    "<f2,3000>",
    "<s1,10>",
    "<s2,20>",
    "<s3,30>",
    "<option1,1>",
    "<option2,0>",
    "<text,>",
    "<start,xy>",
  ]);
  assert.throws(() => commandsFor("sweep", { ...settings, f1: "" }));
  assert.throws(() => commandsFor("sweep", { ...settings, f2: 2699 }));
  assert.throws(() => commandsFor("sweep", settings, "<end>"));
});
test("fit recovers a pair of known resonances and individual uncertainties", () => {
  const truth = [
    { freq: 2842, depth: 0.06, width: 4 },
    { freq: 2881, depth: 0.04, width: 7 },
  ];
  const points = Array.from({ length: 301 }, (_, i) => [
    2700 + i,
    lorentzian(2700 + i, truth) + Math.sin(i * 13) * 0.00001,
  ]);
  const fit = fitLorentzians(points, [
    { freq: 2840, depth: 0.05, width: 5 },
    { freq: 2880, depth: 0.05, width: 5 },
  ]);
  assert.ok(fit.rmse < 0.00002);
  fit.peaks.forEach((p, i) => {
    assert.ok(Math.abs(p.freq - truth[i].freq) < 0.01);
    assert.ok(p.uncertainty > 0);
  });
  assert.throws(() => fitLorentzians([[1, 1]], truth));
});
test("serial handshake, ordered writes and disconnect release locks and stop firmware", async () => {
  let input,
    closed = false;
  const written = [],
    states = [];
  const port = {
    async open(options) {
      assert.equal(options.baudRate, 115200);
    },
    readable: new ReadableStream({
      start(controller) {
        input = controller;
      },
    }),
    writable: new WritableStream({
      write(value) {
        const text = new TextDecoder().decode(value);
        written.push(text);
        if (text === "<ping>")
          input.enqueue(new TextEncoder().encode("<pong>"));
      },
    }),
    async close() {
      closed = true;
    },
  };
  const original = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { serial: { requestPort: async () => port } },
  });
  const service = new SerialConnection({
    onTelegram() {},
    onStatus: (s) => states.push(s),
    onLog() {},
    onError: (e) => {
      throw e;
    },
  });
  try {
    await service.connect();
    await Promise.all([service.send("<f1,2700>"), service.send("<f2,3000>")]);
    await service.disconnect();
    assert.ok(states.includes("connected"));
    assert.equal(states.at(-1), "disconnected");
    assert.deepEqual(written, ["<ping>", "<f1,2700>", "<f2,3000>", "<end>"]);
    assert.equal(port.readable.locked, false);
    assert.equal(port.writable.locked, false);
    assert.ok(closed);
  } finally {
    await service.disconnect();
    if (original) Object.defineProperty(globalThis, "navigator", original);
    else delete globalThis.navigator;
  }
});

test("failed open reports recovery steps and does not close another owner’s port", async () => {
  const errors = [],
    states = [];
  let closes = 0;
  const port = {
    readable: {},
    async open() {
      throw new Error(
        "Failed to execute 'open' on 'SerialPort': Failed to open serial port.",
      );
    },
    async close() {
      closes++;
    },
  };
  const original = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { serial: { requestPort: async () => port } },
  });
  const service = new SerialConnection({
    onTelegram() {},
    onStatus: (s) => states.push(s),
    onLog() {},
    onError: (e) => errors.push(e),
  });
  try {
    await service.connect();
    assert.equal(closes, 0);
    assert.match(errors[0].message, /Python QOOOL/);
    assert.match(errors[0].message, /Failed to open serial port/);
    assert.equal(states.at(-1), "disconnected");
  } finally {
    await service.disconnect();
    if (original) Object.defineProperty(globalThis, "navigator", original);
    else delete globalThis.navigator;
  }
});

test("disconnect waits for an in-flight open and closes it before allowing a retry", async () => {
  let completeOpen,
    closes = 0;
  const states = [];
  const port = {
    open() {
      return new Promise((resolve) => {
        completeOpen = resolve;
      });
    },
    async close() {
      closes++;
    },
  };
  const original = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { serial: { requestPort: async () => port } },
  });
  const service = new SerialConnection({
    onTelegram() {},
    onStatus: (s) => states.push(s),
    onLog() {},
    onError: (e) => {
      throw e;
    },
  });
  try {
    const connecting = service.connect();
    await Promise.resolve();
    const closing = service.disconnect();
    assert.equal(states.at(-1), "connecting");
    completeOpen();
    await Promise.all([connecting, closing]);
    assert.equal(closes, 1);
    assert.equal(states.at(-1), "disconnected");
  } finally {
    await service.disconnect();
    if (original) Object.defineProperty(globalThis, "navigator", original);
    else delete globalThis.navigator;
  }
});

test("magnet distance splits the resonance linearly around the centre", () => {
  assert.deepEqual(
    peaksFor(1).map((p) => p.freq),
    [CENTER, CENTER],
  );
  assert.deepEqual(
    peaksFor(0).map((p) => p.freq),
    [CENTER - MAX_SPLIT, CENTER + MAX_SPLIT],
  );
  assert.deepEqual(
    peaksFor(0.5).map((p) => p.freq),
    [CENTER - MAX_SPLIT / 2, CENTER + MAX_SPLIT / 2],
  );
  // Positions outside the track are clamped.
  assert.deepEqual(peaksFor(-3), peaksFor(0));
  assert.deepEqual(peaksFor(7), peaksFor(1));
});

test("noise-free spectrum has its minima at the two resonances", () => {
  const points = spectrum({ distance: 0.5, noise: 0 });
  assert.equal(points.length, 201);
  assert.equal(points[0][0], 2770);
  assert.equal(points.at(-1)[0], 2970);
  const minimum = (from, to) =>
    points
      .filter(([x]) => x >= from && x < to)
      .reduce((low, p) => (p[1] < low[1] ? p : low))[0];
  assert.equal(minimum(2770, CENTER), CENTER - MAX_SPLIT / 2);
  assert.equal(minimum(CENTER, 2971), CENTER + MAX_SPLIT / 2);
  assert.ok(points[0][1] > BASE_VOLTAGE * 0.99);
  assert.ok(points[0][1] <= BASE_VOLTAGE);
});

test("simulated magnetometer speaks the sweep protocol and follows the magnet", async () => {
  const telegrams = [],
    states = [];
  const device = new SimulatedConnection({
    onTelegram: (t) => telegrams.push(t),
    onStatus: (s) => states.push(s),
    onLog() {},
    onError: (e) => {
      throw e;
    },
    interval: 5,
  });
  const lastSweep = () => {
    const rows = parseTelegram(
      telegrams.findLast((t) => t.startsWith("<batch")),
    ).rows;
    return rows.map((row) => [row[0], row[1] / rows[0][1]]);
  };
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  try {
    await device.connect();
    assert.deepEqual(states, ["connected"]);
    await device.send("<f1,2770>");
    await device.send("<f2,2970>");
    await device.send("<start,sweep>");
    assert.deepEqual(telegrams.slice(0, 2), ["<start,sweep>", "<clf>"]);
    assert.equal(lastSweep().length, 201);
    const far = fitLorentzians(lastSweep(), [
      { freq: 2860, depth: 0.05, width: 5 },
    ]);
    assert.ok(Math.abs(far.peaks[0].freq - CENTER) < 1);

    device.setDistance(0);
    const before = telegrams.length;
    await wait(30);
    assert.ok(telegrams.length > before, "sweeps repeat while running");
    const near = fitLorentzians(lastSweep(), [
      { freq: 2805, depth: 0.05, width: 5 },
      { freq: 2935, depth: 0.05, width: 5 },
    ]);
    assert.ok(Math.abs(near.peaks[0].freq - (CENTER - MAX_SPLIT)) < 1);
    assert.ok(Math.abs(near.peaks[1].freq - (CENTER + MAX_SPLIT)) < 1);

    // A full ensemble with the field along one NV axis: that axis splits fully,
    // the other three share a third of it.
    device.setOrientations(4);
    device.setAngle(0);
    await wait(30);
    const ensemble = fitLorentzians(lastSweep(), [
      { freq: 2802, depth: 0.02, width: 5 },
      { freq: 2845, depth: 0.05, width: 5 },
      { freq: 2895, depth: 0.05, width: 5 },
      { freq: 2938, depth: 0.02, width: 5 },
    ]);
    [-MAX_SPLIT, -MAX_SPLIT / 3, MAX_SPLIT / 3, MAX_SPLIT].forEach((shift, i) =>
      assert.ok(Math.abs(ensemble.peaks[i].freq - (CENTER + shift)) < 1),
    );
    assert.ok(ensemble.peaks[1].depth > 2 * ensemble.peaks[0].depth);

    await device.send("<end>");
    assert.equal(telegrams.at(-1), "<end>");
    const stopped = telegrams.length;
    await wait(30);
    assert.equal(telegrams.length, stopped, "no sweeps after <end>");

    await device.send("<start,roll>");
    assert.match(telegrams.at(-2), /^<text,.*sweep/);
    assert.equal(telegrams.at(-1), "<end>");

    await device.disconnect();
    assert.equal(states.at(-1), "disconnected");
    await assert.rejects(device.send("<start,sweep>"));
  } finally {
    await device.disconnect();
  }
});

test("ensembles add one resonance pair per NV axis, set by the field direction", () => {
  const splits = (options) => [
    ...new Set(
      peaksFor(0, options).map((p) =>
        Number(Math.abs(p.freq - CENTER).toFixed(3)),
      ),
    ),
  ];
  const [along, tilted, across] = ANGLES;
  // A single NV centre does not respond to a field across its axis.
  assert.deepEqual(splits({ orientations: 1, angle: across }), [0]);
  for (const orientations of [1, 2, 3, 4]) {
    const peaks = peaksFor(0.3, { orientations, angle: tilted });
    assert.equal(peaks.length, 2 * orientations);
    // Every pair is symmetric around the centre.
    for (let i = 0; i < peaks.length; i += 2)
      assert.ok(
        Math.abs(peaks[i].freq + peaks[i + 1].freq - 2 * CENTER) < 1e-9,
      );
  }
  assert.deepEqual(splits({ orientations: 4, angle: along }), [
    MAX_SPLIT,
    Number((MAX_SPLIT / 3).toFixed(3)),
  ]);
  const separated = splits({ orientations: 4, angle: tilted }).sort(
    (a, b) => a - b,
  );
  assert.equal(separated.length, 4);
  [0, ...separated].forEach((value, i, all) => {
    if (i) assert.ok(value - all[i - 1] >= 10, "dips at least 10 MHz apart");
  });
  const crossed = splits({ orientations: 4, angle: across });
  assert.equal(crossed.length, 4);
  assert.ok(crossed.includes(0));
  // Out-of-range ensemble sizes are clamped.
  assert.equal(peaksFor(0, { orientations: 9 }).length, 8);
  assert.equal(peaksFor(0, { orientations: 0 }).length, 2);
});
