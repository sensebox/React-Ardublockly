// bossa-web 0.9.7 terminates binary replies at NUL and doesn't await its read
// loop on disconnect. Keep exact-length replies intact and release the reader
// before closing the Web Serial port (including when a reset disconnects USB).
export function createSamBATransport(SamBA) {
  return class extends SamBA {
    async connect() {
      // Native USB CDC does not use CTS/RTS hardware flow control. In
      // particular, don't inherit bossa-web's flowControl: "hardware".
      await this.serialPort.open({
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
        flowControl: "none",
        bufferSize: 4096,
      });
      await this.serialPort.setSignals({
        dataTerminalReady: true,
        requestToSend: true,
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
      await this._connect();
    }

    async setBinaryMode() {
      // BOSSA's Samba::init() drains the optional N# acknowledgement without
      // requiring two bytes. A valid subsequent V# reply establishes that the
      // bootloader is responding; memory reads must still have exact lengths.
      await this.sendCommand("N", 0);
      await this.readBuffer(100);
    }

    readLoop() {
      this.activeReadLoop = super.readLoop();
      return this.activeReadLoop;
    }

    async disconnect() {
      this.closed = true;
      try {
        await this.serialReader?.cancel();
      } finally {
        await this.activeReadLoop;
      }
    }

    async sendCommand(...args) {
      try {
        return await super.sendCommand(...args);
      } catch (error) {
        throw new Error(`SAM-BA command ${args[0]}: ${error.message ?? error}`);
      }
    }

    async readVersion() {
      // In BOSSA, 256 is a maximum text buffer size, not an exact wire length.
      // Read the version through its line/NUL terminator, while retaining exact
      // lengths for memory reads, where zero and newline bytes are valid data.
      await this.sendCommand("V", 0);
      const reply = [];
      const deadline = Date.now() + 3000;
      while (Date.now() < deadline && reply.length < 256) {
        if (this.inputBuffer.length) {
          const byte = this.inputBuffer.shift();
          if (byte === 0 || byte === 10 || byte === 13) {
            if (reply.length)
              return new TextDecoder().decode(Uint8Array.from(reply));
          } else {
            reply.push(byte);
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      }
      throw new Error(
        "SAM-BA handshake failed: no complete version reply to V#. " +
          "Double-press the MCU reset button, reconnect its bootloader port, and retry.",
      );
    }

    async read(address, buffer, size) {
      // SAMD bootloaders require USB reads below 64 bytes. The dependency's
      // chunked read advances the destination twice and leaves gaps in readback.
      for (let offset = 0; offset < size;) {
        const length = Math.min(63, size - offset);
        const data = await this.sendCommand(
          `R${this.hex(address + offset)},${this.hex(length)}`,
          length,
        );
        buffer.set(data, offset);
        offset += length;
      }
    }

    async readBuffer(timeout = 3000, responseSize) {
      const reply = [];
      const deadline = Date.now() + timeout;
      while (Date.now() < deadline) {
        if (this.inputBuffer.length) {
          const byte = this.inputBuffer.shift();
          reply.push(byte);
          if (responseSize ? reply.length === responseSize : byte === 0) {
            return Uint8Array.from(reply);
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      }
      if (responseSize) {
        throw new Error(
          `Incomplete SAM-BA response: expected ${responseSize} bytes, received ${reply.length}.`,
        );
      }
      return reply.length ? Uint8Array.from(reply) : null;
    }
  };
}
