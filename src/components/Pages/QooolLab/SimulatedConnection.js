import {
  clampDistance,
  clampOrientations,
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
    unsupportedText = "The simulator supports sweep mode only.",
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
    this.angle = 0;
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
  setAngle(angle) {
    this.angle = Number(angle) || 0;
  }
  async send(command) {
    if (!this.connected) throw new Error("Device disconnected.");
    this.onLog(`TX: ${command}`);
    const [type, value] = command.slice(1, -1).split(",");
    if (type === "f1" || type === "f2") this[type] = Number(value);
    else if (type === "start" && value === "sweep") {
      this.halt();
      this.emit("<start,sweep>");
      this.sweep();
      this.timer = setInterval(() => this.sweep(), this.interval);
    } else if (type === "start") {
      this.halt();
      this.emit(`<text,${this.unsupportedText}>`);
      this.emit("<end>");
    } else if (type === "end") {
      this.halt();
      this.emit("<end>");
    }
  }
  // The magnet can move at any time, so every tick replaces the whole sweep.
  sweep() {
    const rows = spectrum({
      distance: this.distance,
      orientations: this.orientations,
      angle: this.angle,
      f1: this.f1,
      f2: this.f2,
      random: this.random,
    }).map(([freq, volt]) => {
      const x = Number(freq.toFixed(1));
      return [x, Number(volt.toFixed(5)), x, 0, x, 0, x, 0];
    });
    this.onTelegram("<clf>");
    this.onTelegram(`<batch,${JSON.stringify(rows)}>`);
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
