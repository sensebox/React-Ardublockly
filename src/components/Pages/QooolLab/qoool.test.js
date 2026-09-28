import test from "node:test";
import assert from "node:assert/strict";
import { TelegramDecoder, parseTelegram, commandsFor } from "./protocol.js";
import { fitLorentzians, lorentzian } from "./fit.js";
import SerialConnection from "./SerialConnection.js";

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
