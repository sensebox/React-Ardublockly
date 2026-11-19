import {
  clampDistance,
  clampOrientations,
  normalizeDirection,
  RANGE,
  spectrum,
} from "../../Simulator/magnetometer/model.js";

// Stands in for SerialConnection: a simulated magnetometer speaking the same telegrams.
export default class SimulatedConnection {
  constructor({
    onTelegram,
    onStatus,
    onLog,
    onError,
    unsupportedText = "The simulator supports sweep and waterfall mode only.",
    interval = 100,
    random = Math.random,
  }) {
    Object.assign(this, {
      onTelegram,
      onStatus,
      onLog,
      onError,
      unsupportedText,
      interval,
      random,
    });
    this.distance = 1;
    this.orientations = 1;
    this.direction = [1, 0, 0];
    [this.f1, this.f2] = RANGE;
    this.connected = false;
  }
  async connect() {
    this.connected = true;
    this.onLog("Simulated magnetometer started");
    this.onStatus("connected");
  }
  setDistance(distance) {
    this.distance = clampDistance(distance);
  }
  setOrientations(orientations) {
    this.orientations = clampOrientations(orientations);
  }
  // Where the magnet sits, seen from the sensor (3D vector).
  setDirection(direction) {
    this.direction = normalizeDirection(direction);
  }
  async send(command) {
    if (!this.connected) throw new Error("Device disconnected.");
    this.onLog(`TX: ${command}`);
    const [type, value] = command.slice(1, -1).split(",");
    if (type === "f1" || type === "f2") this[type] = Number(value);
    else if (type === "start" && (value === "sweep" || value === "waterfall")) {
      this.halt();
      this.emit(`<start,${value}>`);
      const tick = () => this.sweep(value === "waterfall");
      tick();
      this.timer = setInterval(tick, this.interval);
    } else if (type === "start") {
      this.halt();
      this.emit(`<text,${this.unsupportedText}>`);
      this.emit("<end>");
    } else if (type === "end") {
      this.halt();
      this.emit("<end>");
    }
  }
  // The magnet can move at any time, so every tick sends a whole sweep: it
  // replaces the plot (<clf>) or, in waterfall mode, ends one row (<end>).
  sweep(waterfall = false) {
    // What the latest sweep was measured with, so markers match the plot.
    this.measured = {
      distance: this.distance,
      orientations: this.orientations,
      direction: this.direction,
    };
    const rows = spectrum({
      distance: this.distance,
      orientations: this.orientations,
      direction: this.direction,
      f1: this.f1,
      f2: this.f2,
      random: this.random,
    }).map(([freq, volt]) => {
      const x = Number(freq.toFixed(1));
      return [x, Number(volt.toFixed(5)), x, 0, x, 0, x, 0];
    });
    if (!waterfall) this.onTelegram("<clf>");
    this.onTelegram(`<batch,${JSON.stringify(rows)}>`);
    if (waterfall) this.onTelegram("<end>");
  }
  emit(telegram) {
    this.onLog(`RX: ${telegram}`);
    this.onTelegram(telegram);
  }
  halt() {
    clearInterval(this.timer);
    this.timer = null;
  }
  async disconnect() {
    if (!this.connected) return;
    this.halt();
    this.connected = false;
    this.onLog("Simulated magnetometer stopped");
    this.onStatus("disconnected");
  }
}
