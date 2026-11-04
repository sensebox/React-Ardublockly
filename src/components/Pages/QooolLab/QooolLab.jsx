import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { saveAs } from "file-saver";
import SerialConnection from "./SerialConnection";
import { commandsFor, MODES, parseTelegram } from "./protocol";
import { fitLorentzians, rmse } from "./fit";
import Plot, { COLORS } from "./Plot";

const blank = () => ({ points: [], sweeps: [], normalizers: [1, 1, 1, 1] });
const defaults = (mode) => ({
  f1: mode === "roll" ? 2850 : 2700,
  f2: mode === "hopp" ? 2700 : 3000,
  blink: 5,
  s1: 0,
  s2: 0,
  s3: 0,
  option1: false,
  option2: false,
  window: 3,
  history: 50,
});
const initialPeaks = () =>
  Array.from({ length: 4 }, (_, i) => ({
    enabled: i === 0,
    freq: 2840 + i * 20,
    depth: 0.05,
    width: 5,
  }));

export default function QooolLab() {
  const board = useSelector((s) => s.board.board);
  return board === "MCU-S2" ? (
    <Lab />
  ) : (
    <Alert severity="info" sx={{ my: 4 }}>
      QOOOL Lab is available for senseBox MCU-S2 only. Select MCU-S2 in the
      board menu.
    </Alert>
  );
}

function Lab() {
  const language = useSelector((s) => s.general.language);
  const de = language === "de_DE";
  const t = (en, german) => (de ? german : en);
  const [mode, setMode] = useState("sweep");
  const [settings, setSettings] = useState(
    Object.fromEntries(MODES.map((m) => [m, defaults(m)])),
  );
  const [status, setStatus] = useState("disconnected");
  const [latency, setLatency] = useState(null);
  const [running, setRunning] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deviceText, setDeviceText] = useState("");
  const [rawCommand, setRawCommand] = useState("");
  const [visible, setVisible] = useState([true, false, false, false]);
  const [channel, setChannel] = useState(0);
  const [fitChannel, setFitChannel] = useState(0);
  const [peaks, setPeaks] = useState(initialPeaks);
  const [showFit, setShowFit] = useState(false);
  const [autoResult, setAutoResult] = useState(null);
  const [snapshot, setSnapshot] = useState(
    Object.fromEntries(MODES.map((m) => [m, blank()])),
  );
  const [log, setLog] = useState([]);
  const connection = useRef(null),
    active = useRef(null),
    stopping = useRef(false);
  const data = useRef(Object.fromEntries(MODES.map((m) => [m, blank()])));
  const logs = useRef([]),
    rawRows = useRef([]),
    recordingMode = useRef("sweep");
  const mounted = useRef(true),
    settingsRef = useRef(settings),
    operation = useRef(0);
  settingsRef.current = settings;
  const addLog = (line) => {
    logs.current.push(`${new Date().toISOString()} ${line}`);
    if (logs.current.length > 20000)
      logs.current.splice(0, logs.current.length - 20000);
  };
  const reportError = (e) => {
    if (mounted.current) setError(e.message);
    addLog(`ERROR: ${e.message}`);
  };

  useEffect(() => {
    mounted.current = true;
    const timer = setInterval(() => {
      setSnapshot(
        Object.fromEntries(
          MODES.map((m) => [
            m,
            {
              ...data.current[m],
              points: [...data.current[m].points],
              sweeps: [...data.current[m].sweeps],
            },
          ]),
        ),
      );
      setLog(logs.current.slice(-200));
    }, 200);
    return () => {
      mounted.current = false;
      operation.current++;
      clearInterval(timer);
      void connection.current?.disconnect();
    };
  }, []);

  async function receive(telegram) {
    try {
      const event = parseTelegram(telegram),
        current = active.current;
      if (event.type === "text") {
        setDeviceText(event.value);
        return;
      }
      if (event.type === "start") {
        // Firmware may acknowledge a waterfall sweep as "sweep".
        if (!stopping.current && MODES.includes(event.value) && current) {
          active.current =
            current === "waterfall" && event.value === "sweep"
              ? "waterfall"
              : event.value;
          setRunning(active.current);
        }
        return;
      }
      if (!current) return;
      const target = data.current[current];
      if (event.type === "data") {
        for (const row of event.rows) {
          if (
            !target.points.length &&
            current !== "roll" &&
            current !== "waterfall"
          )
            target.normalizers = [1, 3, 5, 7].map((i) => row[i] || 0.5);
          const point = { row, time: Date.now() / 1000 };
          target.points.push(point);
          rawRows.current.push(row.join(","));
        }
        // Keep the live chart bounded while retaining the recording for export.
        if (current === "roll")
          target.points = target.points.filter(
            (p) => p.time >= Date.now() / 1000 - 30,
          );
        if (target.points.length > 30000)
          target.points.splice(0, target.points.length - 30000);
        if (rawRows.current.length >= 500000) {
          await stop();
          setError(
            t(
              "Recording limit reached. Download the data before starting another measurement.",
              "Aufnahmelimit erreicht. Daten vor der nächsten Messung herunterladen.",
            ),
          );
        }
      } else if (event.type === "end") {
        if (current === "waterfall") {
          if (target.points.length) target.sweeps.unshift(target.points);
          target.sweeps = target.sweeps.slice(
            0,
            settingsRef.current.waterfall.history,
          );
          target.points = [];
          if (!stopping.current) {
            // V15 refreshes the frequency range at each boundary; firmware continues sweeps.
            await connection.current.send(
              `<f1,${Math.round(settingsRef.current.waterfall.f1)}>`,
            );
            await connection.current.send(
              `<f2,${Math.round(settingsRef.current.waterfall.f2)}>`,
            );
            return;
          }
        }
        active.current = null;
        setRunning(null);
        setBusy(false);
      } else if (event.type === "clf" && current !== "waterfall")
        data.current[current] = blank();
      else if (
        (event.type === "xscale" || event.type === "xlabel") &&
        current === "xy"
      )
        target[event.type] = event.value;
      else if (
        (event.type === "yscale" || event.type === "ylabel") &&
        (current === "xy" || current === "roll")
      )
        target[event.type] = event.value;
    } catch (e) {
      reportError(e);
    }
  }

  async function connect() {
    setError("");
    setStatus("connecting");
    const service = new SerialConnection({
      onTelegram: (telegram) => {
        if (mounted.current) void receive(telegram);
      },
      onLog: addLog,
      onError: reportError,
      onStatus: (value, ping) => {
        if (!mounted.current) return;
        setStatus(value);
        setLatency(ping ?? null);
        if (value === "disconnected") {
          operation.current++;
          active.current = null;
          setRunning(null);
          setBusy(false);
        }
      },
    });
    connection.current = service;
    await service.connect();
  }
  async function start() {
    try {
      const commands = commandsFor(mode, settings[mode], message);
      setError("");
      setBusy(true);
      stopping.current = false;
      const token = ++operation.current;
      data.current[mode] = blank();
      rawRows.current = [];
      recordingMode.current = mode;
      active.current = mode;
      setRunning(mode);
      setShowFit(false);
      setAutoResult(null);
      for (const command of commands) {
        if (token !== operation.current || !mounted.current) return;
        await connection.current.send(command);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      if (mounted.current && token === operation.current) setBusy(false);
    } catch (e) {
      active.current = null;
      setRunning(null);
      setBusy(false);
      reportError(e);
    }
  }
  async function stop() {
    operation.current++;
    stopping.current = true;
    setBusy(true);
    try {
      await connection.current.send("<end>");
    } catch (e) {
      reportError(e);
    } finally {
      // Keep the current mode until its end acknowledgement to retain final data.
      if (mounted.current) setBusy(false);
    }
  }
  async function sendRaw() {
    try {
      await connection.current.send(rawCommand);
      setRawCommand("");
    } catch (e) {
      reportError(e);
    }
  }
  const download = (content, extension) =>
    saveAs(
      new Blob([content], {
        type:
          extension === "csv"
            ? "text/csv;charset=utf-8"
            : "text/plain;charset=utf-8",
      }),
      `qoool-${recordingMode.current}-${new Date().toISOString().replace(/[:.]/g, "-")}.${extension}`,
    );
  const selected = settings[mode],
    currentData = snapshot[mode];
  const update = (key, value) =>
    setSettings((old) => ({ ...old, [mode]: { ...old[mode], [key]: value } }));
  const field = (key, label, min, max, step = 1) => (
    <TextField
      key={key}
      label={label}
      type="number"
      size="small"
      value={selected[key]}
      disabled={!!running || busy}
      inputProps={{ min, max, step }}
      onChange={(e) =>
        update(key, e.target.value === "" ? "" : Number(e.target.value))
      }
    />
  );
  const fitPoints = snapshot.sweep.points.map((p) => [
    p.row[fitChannel * 2],
    p.row[fitChannel * 2 + 1] / snapshot.sweep.normalizers[fitChannel],
  ]);
  const fitReady = !running && !busy && fitPoints.length > 1;
  const plotPeaks =
    mode === "sweep" && showFit && fitReady ? autoResult?.peaks || peaks : null;
  const labels = {
    frequency: t("Frequency (MHz)", "Frequenz (MHz)"),
    time: t("Time (s)", "Zeit (s)"),
    intensity: t("Intensity", "Intensität"),
    newest: t("Sweep (newest at top)", "Sweep (neueste oben)"),
    empty: t(
      "Connect the MCU-S2 and start a measurement.",
      "MCU-S2 verbinden und Messung starten.",
    ),
  };
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" component="h1">
            QOOOL Lab
          </Typography>
          <Typography color="text.secondary">
            {t(
              "NV-center magnetometry · senseBox MCU-S2",
              "NV-Zentren-Magnetometrie · senseBox MCU-S2",
            )}
          </Typography>
        </Box>
        <Alert severity="info">
          {t(
            "Connect your MCU-S2 with the QOOOL XBee module and magnetometer via USB. The board must already run the firmware used by the Python lab.",
            "Verbinde deine MCU-S2 mit dem QOOOL-XBee-Modul und Magnetometer über USB. Auf dem Board muss bereits die Firmware des Python-Labs installiert sein.",
          )}
        </Alert>
        {!navigator.serial && (
          <Alert severity="warning">
            {t(
              "USB serial requires a supported desktop browser, such as Chrome or Edge, on HTTPS or localhost.",
              "USB-Serial benötigt einen unterstützten Desktop-Browser, z. B. Chrome oder Edge, über HTTPS oder localhost.",
            )}
          </Alert>
        )}
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            useFlexGap
            flexWrap="wrap"
            alignItems="center"
          >
            <Chip
              color={status === "connected" ? "success" : "default"}
              label={
                status === "connected"
                  ? t("Connected", "Verbunden")
                  : status === "connecting"
                    ? t("Connecting…", "Verbinde…")
                    : t("Disconnected", "Nicht verbunden")
              }
            />
            {latency != null && (
              <Typography variant="body2">Ping: {latency} ms</Typography>
            )}
            <Button
              variant="contained"
              disabled={!navigator.serial || status !== "disconnected"}
              onClick={connect}
            >
              {t("Connect MCU-S2", "MCU-S2 verbinden")}
            </Button>
            <Button
              disabled={status === "disconnected"}
              onClick={() => {
                operation.current++;
                void connection.current?.disconnect();
              }}
            >
              {t("Disconnect", "Trennen")}
            </Button>
            <Button
              disabled={!rawRows.current.length}
              onClick={() =>
                download(
                  `x1,y1,x2,y2,x3,y3,x4,y4\n${rawRows.current.join("\n")}\n`,
                  "csv",
                )
              }
            >
              {t("Download data", "Daten herunterladen")}
            </Button>
            <Button onClick={() => download(logs.current.join("\n"), "txt")}>
              {t("Download log", "Log herunterladen")}
            </Button>
          </Stack>
        </Paper>
        <Paper variant="outlined">
          <Tabs
            value={mode}
            onChange={(_, value) => setMode(value)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Measurement modes"
          >
            {MODES.map((m) => (
              <Tab
                key={m}
                value={m}
                label={
                  m === "xy"
                    ? "X–Y"
                    : m === "hopp"
                      ? "Hopp"
                      : m[0].toUpperCase() + m.slice(1)
                }
              />
            ))}
          </Tabs>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 290px" },
              gap: 2,
              p: 2,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Plot
                data={currentData}
                mode={mode}
                settings={selected}
                visible={visible}
                channel={channel}
                peaks={plotPeaks}
                labels={labels}
              />
              {mode !== "waterfall" && (
                <Stack direction="row" useFlexGap flexWrap="wrap">
                  {visible.map((value, i) => (
                    <FormControlLabel
                      key={i}
                      label={`CH ${i + 1}`}
                      control={
                        <Checkbox
                          checked={value}
                          sx={{
                            color: COLORS[i],
                            "&.Mui-checked": { color: COLORS[i] },
                          }}
                          onChange={(e) =>
                            setVisible((v) =>
                              v.map((old, j) =>
                                i === j ? e.target.checked : old,
                              ),
                            )
                          }
                        />
                      }
                    />
                  ))}
                </Stack>
              )}
              <Typography variant="caption" color="text.secondary">
                {mode === "waterfall"
                  ? t(
                      "Raw intensity · newest sweep at the top",
                      "Rohintensität · neuester Sweep oben",
                    )
                  : mode === "roll"
                    ? t(
                        "Raw intensity in a rolling time window",
                        "Rohintensität im rollenden Zeitfenster",
                      )
                    : t(
                        "Each channel is normalized to its first sample, matching the Python lab.",
                        "Jeder Kanal wird wie im Python-Lab auf seinen ersten Messwert normiert.",
                      )}
              </Typography>
            </Box>
            <Stack spacing={2}>
              <Typography variant="h6">
                {t("Measurement controls", "Messparameter")}
              </Typography>
              {field(
                "f1",
                mode === "roll" ? labels.frequency : "f1 (MHz)",
                2700,
                3000,
              )}
              {mode !== "roll" && field("f2", "f2 (MHz)", 2700, 3000)}
              {mode === "hopp" &&
                field(
                  "blink",
                  t("Blink frequency (Hz)", "Blinkfrequenz (Hz)"),
                  1,
                  50,
                )}
              {(mode === "roll" || mode === "xy") && (
                <>
                  {["s1", "s2", "s3"].map((key, i) =>
                    field(key, `Slider ${i + 1}`, 0, 1024),
                  )}
                  {["option1", "option2"].map((key, i) => (
                    <FormControlLabel
                      key={key}
                      label={`Option ${i + 1}`}
                      control={
                        <Checkbox
                          disabled={!!running || busy}
                          checked={selected[key]}
                          onChange={(e) => update(key, e.target.checked)}
                        />
                      }
                    />
                  ))}
                </>
              )}
              {mode === "roll" && (
                <TextField
                  label={t("Time window (s)", "Zeitfenster (s)")}
                  type="number"
                  size="small"
                  value={selected.window}
                  inputProps={{ min: 1, max: 30, step: 0.1 }}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (n >= 1 && n <= 30) update("window", n);
                  }}
                />
              )}
              {mode === "waterfall" && (
                <>
                  <TextField
                    select
                    size="small"
                    label={t("Channel", "Kanal")}
                    value={channel}
                    onChange={(e) => setChannel(Number(e.target.value))}
                  >
                    {[0, 1, 2, 3].map((ch) => (
                      <MenuItem key={ch} value={ch}>
                        CH {ch + 1}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label={t("Sweeps shown", "Angezeigte Sweeps")}
                    type="number"
                    size="small"
                    value={selected.history}
                    inputProps={{ min: 10, max: 100, step: 5 }}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (Number.isInteger(n) && n >= 10 && n <= 100)
                        update("history", n);
                    }}
                  />
                </>
              )}
              <TextField
                label={t("Measurement text", "Messtext")}
                value={message}
                disabled={!!running}
                onChange={(e) => setMessage(e.target.value)}
                size="small"
              />
              <Button
                variant="contained"
                disabled={status !== "connected" || !!running || busy}
                onClick={start}
              >
                {t("Start", "Starten")} {mode.toUpperCase()}
              </Button>
              <Button
                color="error"
                variant="outlined"
                disabled={!running || status !== "connected"}
                onClick={stop}
              >
                {t("Stop", "Stoppen")}
              </Button>
              {running && (
                <Typography role="status">
                  {t("Running", "Aktiv")}: {running.toUpperCase()}
                </Typography>
              )}
            </Stack>
          </Box>
        </Paper>
        {mode === "sweep" && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Typography variant="h6">
                {t("Lorentzian fit", "Lorentz-Fit")}
              </Typography>
              <Typography variant="body2">
                {t(
                  "After a sweep, enable up to four dips and set their initial frequencies. Adjust parameters manually or run the automatic fit.",
                  "Nach einem Sweep bis zu vier Minima aktivieren und Startfrequenzen setzen. Parameter manuell anpassen oder automatisch fitten.",
                )}
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                useFlexGap
                flexWrap="wrap"
                alignItems="center"
              >
                <TextField
                  select
                  label={t("Fit channel", "Fit-Kanal")}
                  value={fitChannel}
                  size="small"
                  onChange={(e) => {
                    setFitChannel(Number(e.target.value));
                    setAutoResult(null);
                  }}
                >
                  {[0, 1, 2, 3].map((ch) => (
                    <MenuItem key={ch} value={ch}>
                      CH {ch + 1}
                    </MenuItem>
                  ))}
                </TextField>
                <FormControlLabel
                  label={t("Show fit", "Fit anzeigen")}
                  control={
                    <Checkbox
                      checked={showFit}
                      disabled={!fitReady}
                      onChange={(e) => setShowFit(e.target.checked)}
                    />
                  }
                />
                <Button
                  disabled={!fitReady}
                  onClick={() => {
                    try {
                      setAutoResult(fitLorentzians(fitPoints, peaks));
                      setShowFit(true);
                      setError("");
                    } catch (e) {
                      reportError(e);
                    }
                  }}
                >
                  {t("Automatic fit", "Automatisch fitten")}
                </Button>
                <Button
                  onClick={() => {
                    setPeaks(initialPeaks());
                    setAutoResult(null);
                    setShowFit(false);
                  }}
                >
                  {t("Reset fit", "Fit zurücksetzen")}
                </Button>
                {showFit && fitReady && (
                  <Typography>
                    RMSE:{" "}
                    {(autoResult?.rmse ?? rmse(fitPoints, peaks)).toFixed(6)}
                  </Typography>
                )}
              </Stack>
              {peaks.map((peak, i) => (
                <Stack
                  key={i}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ sm: "center" }}
                >
                  <FormControlLabel
                    label={`${t("Dip", "Minimum")} ${i + 1}`}
                    control={
                      <Checkbox
                        disabled={!fitReady}
                        checked={peak.enabled}
                        onChange={(e) => {
                          setAutoResult(null);
                          setPeaks((old) =>
                            old.map((p, j) =>
                              i === j ? { ...p, enabled: e.target.checked } : p,
                            ),
                          );
                        }}
                      />
                    }
                  />
                  {[
                    [
                      "freq",
                      t("Frequency (MHz)", "Frequenz (MHz)"),
                      2700,
                      3000,
                      0.1,
                    ],
                    ["depth", t("Depth", "Tiefe"), 0, 1, 0.001],
                    ["width", t("Width (MHz)", "Breite (MHz)"), 0.1, 50, 0.1],
                  ].map(([key, label, min, max, step]) => (
                    <TextField
                      key={key}
                      label={label}
                      type="number"
                      size="small"
                      value={peak[key]}
                      disabled={!fitReady || !peak.enabled}
                      inputProps={{ min, max, step }}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        if (Number.isFinite(n) && n >= min && n <= max) {
                          setAutoResult(null);
                          setPeaks((old) =>
                            old.map((p, j) =>
                              i === j ? { ...p, [key]: n } : p,
                            ),
                          );
                        }
                      }}
                    />
                  ))}
                </Stack>
              ))}
              {autoResult && (
                <Box sx={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", textAlign: "left" }}>
                    <thead>
                      <tr>
                        {[
                          t("Dip", "Minimum"),
                          "f (MHz)",
                          t("Depth", "Tiefe"),
                          t("Width (MHz)", "Breite (MHz)"),
                          "σf (MHz)",
                        ].map((label) => (
                          <th key={label}>{label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {autoResult.peaks.map((p, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{p.freq.toFixed(3)}</td>
                          <td>{p.depth.toFixed(5)}</td>
                          <td>{p.width.toFixed(3)}</td>
                          <td>
                            {p.uncertainty == null
                              ? "—"
                              : p.uncertainty.toFixed(4)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              )}
            </Stack>
          </Paper>
        )}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography variant="h6">
              {t("Serial terminal", "Serielles Terminal")}
            </Typography>
            {deviceText && <Alert severity="info">{deviceText}</Alert>}
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                size="small"
                label={t("Raw command or text", "Rohbefehl oder Text")}
                value={rawCommand}
                onChange={(e) => setRawCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && status === "connected" && rawCommand)
                    void sendRaw();
                }}
              />
              <Button
                disabled={status !== "connected" || !rawCommand}
                onClick={sendRaw}
              >
                {t("Send", "Senden")}
              </Button>
            </Stack>
            <Box
              component="pre"
              aria-label="Serial log"
              sx={{
                m: 0,
                p: 2,
                bgcolor: "action.hover",
                maxHeight: 240,
                overflow: "auto",
                fontSize: 12,
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }}
            >
              {log.join("\n") ||
                t("No messages yet.", "Noch keine Nachrichten.")}
            </Box>
            <Typography variant="caption">
              {t(
                "Terminal: latest 200 messages. Log download: latest 20,000 messages. Data recording stops at 500,000 samples; live plots show up to 30,000 points.",
                "Terminal: letzte 200 Nachrichten. Log-Download: letzte 20.000 Nachrichten. Datenaufnahme bis 500.000 Messpunkte; Live-Diagramme zeigen bis zu 30.000 Punkte.",
              )}
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
