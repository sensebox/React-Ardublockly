import { TelegramDecoder } from "./protocol.js";

export default class SerialConnection {
  constructor({ onTelegram, onStatus, onLog, onError }) {
    Object.assign(this, { onTelegram, onStatus, onLog, onError });
    this.queue = Promise.resolve();
    this.cancelled = false;
  }
  async connect() {
    try {
      this.onStatus("connecting");
      this.port = await navigator.serial.requestPort();
      if (this.cancelled) return;
      await this.port.open({ baudRate: 115200 });
      if (this.cancelled) {
        await this.port.close();
        return;
      }
      this.writer = this.port.writable.getWriter();
      this.reader = this.port.readable.getReader();
      this.readTask = this.readLoop();
      this.lastPong = Date.now();
      await this.ping();
      if (this.cancelled) return;
      this.timer = setInterval(() => {
        if (Date.now() - this.lastPong > 6000) {
          this.onError(
            new Error("No response from QOOOL firmware (pong timeout)."),
          );
          void this.disconnect();
        } else this.ping().catch((error) => this.fail(error));
      }, 3000);
    } catch (error) {
      if (error.name !== "NotFoundError") this.onError(error);
      await this.disconnect();
    }
  }
  async ping() {
    this.lastPing = Date.now();
    await this.send("<ping>");
  }
  send(command) {
    const task = this.queue.then(async () => {
      if (!this.writer || this.cancelled)
        throw new Error("Device disconnected.");
      await this.writer.write(new TextEncoder().encode(command));
      this.onLog(`TX: ${command}`);
    });
    this.queue = task.catch(() => {});
    return task;
  }
  async readLoop() {
    const decoder = new TextDecoder();
    const framing = new TelegramDecoder();
    try {
      while (!this.cancelled) {
        const { value, done } = await this.reader.read();
        if (done) break;
        for (const telegram of framing.push(
          decoder.decode(value, { stream: true }),
        )) {
          this.onLog(`RX: ${telegram}`);
          if (telegram === "<pong>") {
            this.lastPong = Date.now();
            this.onStatus("connected", this.lastPong - this.lastPing);
          } else this.onTelegram(telegram);
        }
      }
      if (!this.cancelled) this.fail(new Error("USB connection closed."));
    } catch (error) {
      if (!this.cancelled) this.fail(error);
    } finally {
      this.reader.releaseLock();
      this.reader = null;
    }
  }
  fail(error) {
    this.onError(error);
    void this.disconnect();
  }
  disconnect() {
    if (this.closing) return this.closing;
    this.cancelled = true;
    clearInterval(this.timer);
    this.closing = (async () => {
      try {
        if (this.reader) {
          try {
            await this.reader.cancel();
          } catch (error) {
            this.onLog(`Read cancellation: ${error.message}`);
          }
        }
        await this.readTask;
        await this.queue;
        if (this.writer) {
          try {
            await this.writer.write(new TextEncoder().encode("<end>"));
          } catch {
            /* USB may be unplugged. */
          }
          this.writer.releaseLock();
          this.writer = null;
        }
        if (this.port?.readable) await this.port.close();
      } catch (error) {
        this.onLog(`Disconnect: ${error.message}`);
      } finally {
        this.onStatus("disconnected");
      }
    })();
    return this.closing;
  }
}
