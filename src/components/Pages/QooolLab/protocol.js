export const MODES = ["sweep", "waterfall", "hopp", "roll", "xy"];

// USB reads can split a telegram anywhere, or contain multiple telegrams.
export class TelegramDecoder {
  buffer = "";
  push(chunk) {
    this.buffer += chunk;
    const messages = [];
    while (true) {
      const start = this.buffer.indexOf("<");
      if (start < 0) {
        this.buffer = "";
        break;
      }
      this.buffer = this.buffer.slice(start);
      const end = this.buffer.indexOf(">");
      if (end < 0) break;
      const nested = this.buffer.lastIndexOf("<", end);
      messages.push(this.buffer.slice(nested, end + 1));
      this.buffer = this.buffer.slice(end + 1);
    }
    if (this.buffer.length > 1000000) this.buffer = "";
    return messages;
  }
}

export function parseTelegram(telegram) {
  const body = telegram.slice(1, -1);
  const comma = body.indexOf(",");
  const type = comma < 0 ? body : body.slice(0, comma);
  const value = comma < 0 ? "" : body.slice(comma + 1);
  if (type === "data" || type === "batch") {
    const parsed = JSON.parse(value);
    const rows = type === "data" ? [parsed] : parsed;
    if (
      !Array.isArray(rows) ||
      !rows.every(
        (row) =>
          Array.isArray(row) && row.length === 8 && row.every(Number.isFinite),
      )
    ) {
      throw new Error(
        "Invalid measurement: expected eight finite numbers per row.",
      );
    }
    return { type: "data", rows };
  }
  if (type === "xscale" || type === "yscale") {
    const limits = JSON.parse(value);
    if (
      !Array.isArray(limits) ||
      limits.length !== 2 ||
      !limits.every(Number.isFinite) ||
      limits[0] >= limits[1]
    )
      throw new Error("Invalid axis limits.");
    return { type, value: limits };
  }
  return { type, value };
}

export function commandsFor(mode, settings, text = "") {
  if (!MODES.includes(mode)) throw new Error("Unknown measurement mode.");
  if (/[<>]/.test(text)) throw new Error("Text must not contain < or >.");
  const parameters = [["f1", settings.f1]];
  if (mode !== "roll") parameters.push(["f2", settings.f2]);
  if (mode === "hopp") parameters.push(["s1", settings.blink]);
  if (mode === "roll" || mode === "xy") {
    ["s1", "s2", "s3", "option1", "option2"].forEach((key) =>
      parameters.push([key, Number(settings[key])]),
    );
  }
  parameters.forEach(([key, value]) => {
    const [min, max] = key.startsWith("f")
      ? [2700, 3000]
      : key.startsWith("option")
        ? [0, 1]
        : mode === "hopp"
          ? [1, 50]
          : [0, 1024];
    if (!Number.isFinite(value) || value < min || value > max)
      throw new Error(`Invalid ${key}: ${min}–${max}.`);
  });
  if (mode !== "roll" && mode !== "hopp" && settings.f1 >= settings.f2)
    throw new Error(
      "The lower frequency must be smaller than the upper frequency.",
    );
  const commands = parameters.map(
    ([key, value]) => `<${key},${Math.round(value)}>`,
  );
  if (mode !== "waterfall") commands.push(`<text,${text}>`);
  return [...commands, `<start,${mode}>`];
}
