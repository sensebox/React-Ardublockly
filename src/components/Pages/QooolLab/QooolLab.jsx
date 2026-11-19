import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { saveAs } from "file-saver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faDownload,
  faPause,
  faPlay,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import SerialConnection from "./SerialConnection";
import SimulatedConnection from "./SimulatedConnection";
import MagnetScene from "@/components/Simulator/magnetometer/MagnetScene";
import {
  FieldLinesSwitch,
  ViewSwitch,
  OrientationToggle,
} from "@/components/Simulator/magnetometer/MagnetControls";
import FieldCalculation, {
  readoutColour,
} from "@/components/Simulator/magnetometer/FieldCalculation";
import {
  CENTER,
  dipPairs,
  flattenDirection,
  readDips,
  RANGE,
  subscript,
} from "@/components/Simulator/magnetometer/model";
import { commandsFor, MODES, parseTelegram } from "./protocol";
import Plot from "./Plot";

// Hopp, Roll and X–Y stay in the protocol but are not offered in the tab bar.
// "both" is a view, not a device mode: it measures a waterfall and also plots
// the newest of its sweeps as a curve.
const TABS = ["sweep", "waterfall", "both"];
const modeOf = (tab) => (tab === "both" ? "waterfall" : tab);

// Joins PNG blobs side by side into one PNG, like the tiles on the page.
async function joinPngs(blobs) {
  const images = await Promise.all(
    blobs.map((blob) => createImageBitmap(blob)),
  );
  const canvas = document.createElement("canvas");
  canvas.width = images.reduce((sum, image) => sum + image.width, 0);
  canvas.height = Math.max(...images.map((image) => image.height));
  const ctx = canvas.getContext("2d");
  let x = 0;
  for (const image of images) {
    ctx.drawImage(image, x, 0);
    x += image.width;
  }
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("PNG export failed"))),
      "image/png",
    ),
  );
}
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

// Shows value / scale (e.g. MHz as GHz) and keeps the typed text while editing,
// so "2.80" does not collapse to "2.8" before the next digit.
function ScaledField({ value, scale = 1, onValue, ...props }) {
  const format = (v) =>
    v === "" ? "" : String(Number((v / scale).toFixed(6)));
  const [text, setText] = useState(() => format(value));
  // Only outside changes (or a new scale) replace the typed text.
  useEffect(() => {
    const typed = text === "" ? "" : Number(text) * scale;
    if (
      typed === "" || value === ""
        ? typed !== value
        : Math.abs(typed - value) > 1e-6
    )
      setText(format(value));
  }, [value, scale]);
  return (
    <TextField
      {...props}
      type="number"
      size="small"
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onValue(e.target.value === "" ? "" : Number(e.target.value) * scale);
      }}
    />
  );
}

export default function QooolLab() {
  const board = useSelector((s) => s.board.board);
  return <Lab board={board} />;
}

// With the simulator, the magnet scene and the plot share the window height so
// the lab and the footer fit on one screen (see useFitToWindow). These CSS
// estimates only apply until the first measurement. The page has no
// breadcrumbs, to leave the room to the lab.
const SCENE_HEIGHT = "clamp(220px, calc((100vh - 460px) * 0.45), 440px)";
const PLOT_HEIGHT = "clamp(240px, calc((100vh - 460px) * 0.55), 460px)";
const SCENE_SHARE = 0.45,
  FIT_LIMITS = { scene: [200, 520], plot: [200, 560] };

// Measures the page and returns pixel heights for the magnet scene and the
// plot so that the page ends with the footer at the bottom of the window.
// The rest of the page (app bar, lab header, tabs, help bar, …) is measured,
// not guessed, and re-measured whenever the page or the window changes size.
function useFitToWindow(page, active) {
  const [fit, setFit] = useState(null);
  useEffect(() => {
    if (!active) {
      setFit(null);
      return undefined;
    }
    const measure = () => {
      const root = page.current;
      const scene = root?.querySelector("#magnetometer-scene svg");
      const plots = [
        ...(root?.querySelectorAll('canvas[aria-label$="measurement plot"]') ??
          []),
      ];
      if (!scene || !plots.length) return;
      // Plots side by side count once, stacked (narrow screens) twice.
      const rows = new Set(
        plots.map((plot) => Math.round(plot.getBoundingClientRect().top)),
      ).size;
      const sceneHeight = scene.getBoundingClientRect().height,
        plotHeight = plots[0].getBoundingClientRect().height;
      const footer =
        document.querySelector("footer")?.getBoundingClientRect().height ?? 0;
      const bottom = root.getBoundingClientRect().bottom + window.scrollY;
      // Everything that is neither scene nor plot.
      const rest = bottom + footer - sceneHeight - rows * plotHeight;
      const room = window.innerHeight - rest;
      const unit = room / (SCENE_SHARE + rows * (1 - SCENE_SHARE));
      const limit = (value, [low, high]) =>
        Math.round(Math.min(high, Math.max(low, value)));
      const next = {
        scene: limit(unit * SCENE_SHARE, FIT_LIMITS.scene),
        plot: limit(unit * (1 - SCENE_SHARE), FIT_LIMITS.plot),
      };
      setFit((old) =>
        old &&
        Math.abs(old.scene - next.scene) < 2 &&
        Math.abs(old.plot - next.plot) < 2
          ? old
          : next,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(page.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [active, page]);
  return fit;
}

function Lab({ board }) {
  const language = useSelector((s) => s.general.language);
  const de = language === "de_DE";
  const theme = useTheme();
  const t = (en, german) => (de ? german : en);
  const pageRef = useRef(null);
  // NV-centre choices, offered on the sensor and as a toggle in the scene.
  const nvChoices = [
    t("Single NV", "Einzelnes NV"),
    t("4 orientations", "4 Ausrichtungen"),
  ];
  const [tab, setTab] = useState("sweep");
  const mode = modeOf(tab);
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
  // One channel for plot and waterfall; the simulator only fills CH 1.
  const [channel, setChannel] = useState(0);
  const visible = useMemo(
    () => [0, 1, 2, 3].map((i) => i === channel),
    [channel],
  );
  const [snapshot, setSnapshot] = useState(
    Object.fromEntries(MODES.map((m) => [m, blank()])),
  );
  const [log, setLog] = useState([]);
  const [simulated, setSimulated] = useState(false);
  // Scene and plot heights that fit the page to the window (simulator only).
  const fit = useFitToWindow(pageRef, simulated);
  const [distance, setDistance] = useState(1);
  const [magnet, setMagnet] = useState({
    orientations: 1,
    direction: [1, 0, 0],
    fieldLines: false,
    threeD: false, // the simulator starts in the 2D top view
  });
  const [measured, setMeasured] = useState(null);
  // A paused plot keeps showing this copy while the measurement goes on.
  const [frozen, setFrozen] = useState(null);
  const plotRef = useRef(null),
    waterfallRef = useRef(null);
  const simulatedRef = useRef(false);
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
      setMeasured(connection.current?.measured ?? null);
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
      } else if (event.type === "clf" && current !== "waterfall") {
        data.current[current] = blank();
        // Simulated sweeps repeat; keep only the latest one for export.
        if (simulatedRef.current) rawRows.current = [];
      } else if (
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

  const handlers = () => ({
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
        simulatedRef.current = false;
        setSimulated(false);
      }
    },
  });
  async function connect() {
    setError("");
    setStatus("connecting");
    const service = new SerialConnection(handlers());
    connection.current = service;
    await service.connect();
  }
  async function startSimulator() {
    setError("");
    simulatedRef.current = true;
    setSimulated(true);
    setDistance(1);
    setMagnet({
      orientations: 1,
      direction: [1, 0, 0],
      fieldLines: false,
      threeD: false,
    });
    setChannel(0);
    setTab("sweep");
    setFrozen(null);
    setSettings((old) => ({
      ...old,
      sweep: { ...old.sweep, f1: RANGE[0], f2: RANGE[1] },
      waterfall: { ...old.waterfall, f1: RANGE[0], f2: RANGE[1] },
    }));
    const service = new SimulatedConnection({
      ...handlers(),
      unsupportedText: t(
        "The simulator supports sweep and waterfall mode only.",
        "Der Simulator unterstützt nur den Sweep- und Wasserfall-Modus.",
      ),
    });
    connection.current = service;
    await service.connect();
  }
  // The toggle picks the data source: the real MCU-S2 (connected with its own
  // button, since the port picker needs a deliberate click) or the simulator.
  async function switchSource(next) {
    if ((next === "simulator") === simulated) return;
    operation.current++;
    await connection.current?.disconnect();
    if (next === "simulator") await startSimulator();
  }
  const moveMagnet = (value, direction) => {
    setDistance(value);
    connection.current?.setDistance?.(value);
    changeMagnet({ direction });
  };
  const changeMagnet = (patch) => {
    setMagnet((old) => ({ ...old, ...patch }));
    if ("orientations" in patch)
      connection.current?.setOrientations?.(patch.orientations);
    if ("direction" in patch)
      connection.current?.setDirection?.(patch.direction);
  };
  // The 2D view shows the table from above, so the magnet moves onto it.
  const switchView = (threeD) => {
    changeMagnet({ threeD });
    if (!threeD) moveMagnet(distance, flattenDirection(magnet.direction));
  };
  // The real device needs the MCU-S2; the simulator keeps running on any board.
  useEffect(() => {
    if (board !== "MCU-S2" && !simulatedRef.current)
      void connection.current?.disconnect();
  }, [board]);
  // The simulator is the default source: it starts when the page opens, so
  // the lab works right away without hardware.
  useEffect(() => {
    void startSimulator();
  }, []);
  async function start(target = mode) {
    try {
      const commands = commandsFor(target, settings[target], message);
      // Switching modes while measuring: end the old mode first, so none of
      // its telegrams (e.g. a waterfall <end>) land in the new one.
      if (active.current && active.current !== target) {
        stopping.current = true;
        await connection.current.send("<end>");
      }
      setError("");
      setBusy(true);
      stopping.current = false;
      const token = ++operation.current;
      data.current[target] = blank();
      rawRows.current = [];
      recordingMode.current = target;
      active.current = target;
      setRunning(target);
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
  async function downloadPlot() {
    try {
      const blob =
        tab === "both"
          ? await joinPngs([
              await plotRef.current.toPng(),
              await waterfallRef.current.toPng(),
            ])
          : await plotRef.current.toPng();
      saveAs(
        blob,
        `qoool-${tab}-${new Date().toISOString().replace(/[:.]/g, "-")}.png`,
      );
    } catch (e) {
      reportError(e);
    }
  }
  const selected = settings[mode],
    currentData = snapshot[mode];
  const update = (key, value) =>
    setSettings((old) => ({ ...old, [mode]: { ...old[mode], [key]: value } }));
  // Every frequency is shown in GHz; settings, commands and data stay in MHz
  // as the firmware expects.
  const frequencyField = (key, label) => (
    <ScaledField
      key={key}
      label={label}
      scale={1000}
      value={selected[key]}
      disabled={!!running || busy}
      inputProps={{ min: 2.7, max: 3, step: 0.001 }}
      sx={{ width: 105 }}
      onValue={(value) => update(key, value)}
    />
  );
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
  const labels = {
    frequency: t("Frequency (GHz)", "Frequenz (GHz)"),
    time: t("Time (s)", "Zeit (s)"),
    intensity: t("Fluorescence intensity", "Fluoreszenzintensität"),
    newest: t("Sweep (newest at top)", "Sweep (neueste oben)"),
    empty: simulated
      ? t(
          "Start the sweep, then drag the magnet.",
          "Sweep starten und dann den Magneten ziehen.",
        )
      : t(
          "Connect the MCU-S2 or start the simulator, then start a measurement.",
          "MCU-S2 verbinden oder Simulator starten, dann Messung starten.",
        ),
  };
  // Split dips of the latest simulated sweep, named f₁, f₂, … Before the first
  // sweep (or without the simulator) the worked example follows the magnet.
  const paused = frozen?.mode === mode;
  const shownData = paused ? frozen.data : currentData;
  // "both": the newest complete waterfall row (or the one still coming in)
  // as a sweep, first-sample normalized like a sweep measurement.
  const latestSweep = (d) => {
    const points = d.sweeps[0] ?? d.points;
    return {
      points,
      sweeps: [],
      normalizers: points.length
        ? [1, 3, 5, 7].map((i) => points[0].row[i] || 0.5)
        : [1, 1, 1, 1],
    };
  };
  const fieldSource = measured ?? { distance, ...magnet };
  const modelPairs = dipPairs(fieldSource.distance, fieldSource);
  // Paused: the dips as read off the frozen curve (see togglePause), so the
  // markers, Δf and the worked example match what the plot shows.
  const pairs = (paused && frozen.pairs) || modelPairs;
  // Frequency axes read in GHz. The simulator also scales each curve to 0–1
  // for display; data stay in MHz and first-sample normalized.
  const ghzAxis = { xFactor: 0.001, xDigits: 3, xLabel: labels.frequency };
  const sweepAxis = simulated
    ? {
        ...ghzAxis,
        normalize: true,
        yRange: [0, 1],
        yDigits: 1,
        yLabel: t("Fluorescence intensity", "Fluoreszenzintensität"),
        markers: pairs.flatMap(({ low, high }) => [low, high]),
        markerColour: readoutColour(theme),
        // Δf per pair, numbered like B₁, B₂, … in the worked example.
        spans: pairs.map(({ low, high }, i) => ({
          name: pairs.length > 1 ? `Δf${subscript(i + 1)}` : "Δf",
          low: low.freq,
          high: high.freq,
        })),
        markerChannel: channel,
        markerCentre: CENTER,
      }
    : ghzAxis;
  const axis =
    mode === "sweep"
      ? sweepAxis
      : mode === "waterfall"
        ? simulated
          ? { ...ghzAxis, normalize: true }
          : ghzAxis
        : simulated || mode === "roll" || mode === "xy"
          ? null
          : ghzAxis;
  const hasPlotData =
    currentData.points.length > 0 || currentData.sweeps.length > 0;
  // The worked example highlights values only while the plot shows the dips
  // to read them from.
  const readable =
    simulated &&
    pairs.length > 0 &&
    (tab === "both"
      ? latestSweep(shownData).points.length > 0
      : tab === "sweep" && shownData.points.length > 0);
  const togglePause = () => {
    if (paused) return setFrozen(null);
    // The sweep the plot shows: the sweep itself, or the newest waterfall row.
    const sweep =
      mode === "sweep" ? currentData.points : latestSweep(currentData).points;
    setFrozen({
      mode,
      data: currentData,
      axis,
      at: Date.now(),
      pairs: simulated
        ? readDips(
            sweep.map((p) => [p.row[channel * 2], p.row[channel * 2 + 1]]),
            modelPairs,
          )
        : null,
    });
  };
  const modeName = (m) =>
    m === "both"
      ? t("Sweep + Waterfall", "Sweep + Wasserfall")
      : m === "waterfall"
        ? t("Waterfall", "Wasserfall")
        : m === "sweep"
          ? "Sweep"
          : m.toUpperCase();
  const fieldLabels = {
    title: t(
      "Calculating the magnetic field B",
      "Berechnung der Magnetfeldstärke B",
    ),
    intro: t(
      "The magnetic field shifts the two dips apart (Zeeman splitting). Their distance gives the field strength B.",
      "Das Magnetfeld schiebt die beiden Dips auseinander (Zeeman-Aufspaltung). Aus ihrem Abstand folgt die Feldstärke B.",
    ),
    noSplit: t(
      "Only one dip: without a magnetic field there is no splitting.",
      "Nur ein Dip: Ohne Magnetfeld gibt es keine Aufspaltung.",
    ),
    given: t("Given", "Gegeben"),
    approach: t("Approach", "Ansatz"),
    solve: t("Solve for B", "Nach B umstellen"),
    insert: t("Insert values", "Einsetzen"),
    result: t("Result", "Ergebnis"),
    centre: t("resonance without a magnetic field", "Resonanz ohne Magnetfeld"),
    gamma: t(
      "gyromagnetic ratio of the electron",
      "gyromagnetisches Verhältnis des Elektrons",
    ),
    decimal: t(".", ","),
    readout: t(
      "Green values can be read from the plot.",
      "Grüne Werte kannst du im Diagramm ablesen.",
    ),
    splitting: t(
      "Distance between the dips, shown as Δf in the plot",
      "Abstand der Dips, im Diagramm als Δf eingezeichnet",
    ),
    // along:
    //   fieldSource.orientations === 1
    //     ? t(
    //         "A pair only measures the part of B along its NV axis. Move the magnet around the sensor to see it shrink.",
    //         "Ein Dip-Paar misst nur den Anteil von B entlang seiner NV-Achse. Bewege den Magneten um den Sensor herum, dann wird er kleiner.",
    //       )
    //     : t(
    //         "Each pair belongs to one NV orientation and measures the part of B along its axis. Pairs with the same splitting overlap and are listed once.",
    //         "Jedes Paar gehört zu einer NV-Ausrichtung und misst den Anteil von B entlang ihrer Achse. Paare mit gleicher Aufspaltung liegen übereinander und sind nur einmal aufgeführt.",
    //       ),
  };
  return (
    <Container ref={pageRef} maxWidth="xl" sx={{ py: 2 }}>
      <Stack spacing={2}>
        <>
          {/* <Typography variant="h4" component="h1">
            QOOOL Lab
          </Typography> */}
          {/* <Typography color="text.secondary" sx={{ maxWidth: 820, mt: 1 }}>
            {t(
              "Measure magnetic fields with NV centres in diamond. Connect your MCU-S2 with the QOOOL XBee module and magnetometer via USB. The board must already run the firmware used by the Python lab. Without hardware, switch to the simulator at the top right.",
              "Miss Magnetfelder mit NV-Zentren im Diamanten. Verbinde deine MCU-S2 mit dem QOOOL-XBee-Modul und Magnetometer über USB. Auf dem Board muss bereits die Firmware des Python-Labs installiert sein. Ohne Hardware kannst du oben rechts auf den Simulator umschalten.",
            )}
          </Typography> */}
        </>
        <Paper
          variant="outlined"
          id="qoool-lab"
          sx={{ borderRadius: 3, overflow: "hidden" }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            useFlexGap
            flexWrap="wrap"
            alignItems="center"
            sx={{
              px: { xs: 2, sm: 3 },
              py: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            {/* The main action of the lab: big, coloured and first in the bar.
                It starts the selected tab's measurement and becomes Stop. */}
            {running ? (
              <Button
                id="qoool-run"
                size="large"
                variant="contained"
                color="error"
                disableElevation
                disabled={status !== "connected"}
                onClick={stop}
                startIcon={<FontAwesomeIcon icon={faStop} />}
                sx={{ px: 3, fontWeight: 700 }}
              >
                {t("Stop", "Stoppen")}
              </Button>
            ) : (
              <Button
                id="qoool-run"
                size="large"
                variant="contained"
                disableElevation
                disabled={status !== "connected" || busy}
                onClick={() => start()}
                startIcon={<FontAwesomeIcon icon={faPlay} />}
                sx={{
                  px: 3,
                  fontWeight: 700,
                  color: "#fff",
                  bgcolor: readoutColour(theme),
                  "&:hover": { bgcolor: "#3d8e37" },
                }}
              >
                {t(`Start ${modeName(tab)}`, `${modeName(tab)} starten`)}
              </Button>
            )}
            {/* <Chip
              color={status === "connected" ? "primary" : "default"}
              variant={status === "connected" ? "filled" : "outlined"}
              label={
                status === "connected"
                  ? simulated
                    ? t("Simulator running", "Simulator aktiv")
                    : t("Connected", "Verbunden")
                  : status === "connecting"
                    ? t("Connecting…", "Verbinde…")
                    : t("Disconnected", "Nicht verbunden")
              }
            /> */}
            {latency != null && (
              <Typography variant="body2" color="text.secondary">
                Ping: {latency} ms
              </Typography>
            )}
            {!simulated && (
              <Button
                variant="contained"
                disableElevation
                disabled={
                  !navigator.serial ||
                  board !== "MCU-S2" ||
                  status !== "disconnected"
                }
                onClick={connect}
              >
                {t("Connect MCU-S2", "MCU-S2 verbinden")}
              </Button>
            )}
            {!simulated && (
              <Button
                disabled={status === "disconnected"}
                onClick={() => {
                  operation.current++;
                  void connection.current?.disconnect();
                }}
              >
                {t("Disconnect", "Trennen")}
              </Button>
            )}
            {/* Measured data only exist with the real device. */}
            {!simulated && (
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
            )}
            <Button onClick={() => download(logs.current.join("\n"), "txt")}>
              {t("Download log", "Log herunterladen")}
            </Button>
            <Box sx={{ flex: 1 }} />
            <ToggleButtonGroup
              exclusive
              size="small"
              color="primary"
              id="qoool-source"
              aria-label={t("Data source", "Datenquelle")}
              value={simulated ? "simulator" : "device"}
              disabled={status === "connecting" || busy}
              onChange={(_, next) => next && void switchSource(next)}
            >
              <ToggleButton
                value="device"
                sx={{ textTransform: "none", px: 2 }}
              >
                MCU-S2
              </ToggleButton>
              <ToggleButton
                value="simulator"
                sx={{ textTransform: "none", px: 2 }}
              >
                {t("Simulator", "Simulator")}
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Stack spacing={2} sx={{ p: 2 }}>
            {board !== "MCU-S2" && !simulated && (
              <Alert severity="info">
                {t(
                  "Measuring with a real magnetometer requires the MCU-S2. Select it in the board menu. The simulator works with every board.",
                  "Die Messung mit einem echten Magnetometer benötigt die MCU-S2. Wähle sie im Board-Menü aus. Der Simulator funktioniert mit jedem Board.",
                )}
              </Alert>
            )}
            {!navigator.serial && !simulated && (
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
            {/* Desktop: scene and measurement on the left, the worked example
                as a full-height column on the right. */}
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 360px" },
              }}
            >
              <Stack spacing={2} sx={{ minWidth: 0 }}>
                {simulated && (
                  <Paper
                    variant="outlined"
                    id="magnetometer-simulator"
                    sx={{ overflow: "hidden" }}
                  >
                    <Box sx={{ p: 1.5 }}>
                      <MagnetScene
                        height={fit ? fit.scene : SCENE_HEIGHT}
                        onOrientationsChange={(orientations) =>
                          changeMagnet({ orientations })
                        }
                        controls={
                          <Stack
                            direction="row"
                            spacing={2}
                            useFlexGap
                            flexWrap="wrap"
                            alignItems="center"
                            sx={{ py: 0.5 }}
                          >
                            <OrientationToggle
                              orientations={magnet.orientations}
                              onChange={(orientations) =>
                                changeMagnet({ orientations })
                              }
                              labels={{
                                centres: t("NV centres", "NV-Zentren"),
                                orientations: nvChoices,
                              }}
                            />
                            <ViewSwitch
                              threeD={magnet.threeD}
                              onChange={switchView}
                              label={t("3D view", "3D-Ansicht")}
                            />
                            <FieldLinesSwitch
                              checked={magnet.fieldLines}
                              onChange={(fieldLines) =>
                                changeMagnet({ fieldLines })
                              }
                              label={t("Field lines", "Feldlinien")}
                            />
                          </Stack>
                        }
                        distance={distance}
                        direction={magnet.direction}
                        onChange={moveMagnet}
                        orientations={magnet.orientations}
                        showFieldLines={magnet.fieldLines}
                        threeD={magnet.threeD}
                        labels={{
                          scene: magnet.threeD
                            ? t(
                                "3D view of the sensor and the magnet",
                                "3D-Ansicht von Sensor und Magnet",
                              )
                            : t(
                                "Top view of the sensor and the magnet",
                                "Draufsicht auf Sensor und Magnet",
                              ),
                          sensor: t(
                            "Magnetometer with NV diamonds",
                            "Magnetometer mit NV-Diamanten",
                          ),
                          magnet: t(
                            "Magnet, distance to the sensor",
                            "Magnet, Abstand zum Sensor",
                          ),
                          distance: t("Distance", "Abstand"),
                          angle: t(
                            "Angle to NV axis 1",
                            "Winkel zu NV-Achse 1",
                          ),
                          alongAxis: t(
                            "Drag to move the magnet along axis",
                            "Ziehen, um den Magneten entlang der Achse zu bewegen:",
                          ),
                          moveFreely: t(
                            "Drag to move the magnet freely",
                            "Ziehen, um den Magneten frei zu bewegen",
                          ),
                          zoomIn: t("Zoom in", "Hineinzoomen"),
                          zoomOut: t("Zoom out", "Herauszoomen"),
                          resetView: t("Reset view", "Ansicht zurücksetzen"),
                          sensorMenu: {
                            title: t("NV centres", "NV-Zentren"),
                            open: t(
                              "Sensor: choose the NV centres",
                              "Sensor: NV-Zentren wählen",
                            ),
                            choices: nvChoices,
                          },
                          help: {
                            show: t("How to use", "So geht's"),
                            title: t("How to use:", "So geht's:"),
                            hide: t("Hide help", "Hilfe ausblenden"),
                            magnet: t("Magnet", "Magnet"),
                            arrow: t("x/y arrow", "x/y-Pfeil"),
                            background: t("Background", "Hintergrund"),
                            or: t("or", "oder"),
                            move: t("move", "bewegen"),
                            axis: t("along one axis", "entlang einer Achse"),
                            distance: t("distance", "Abstand"),
                            slide: t("up / down", "nach oben / unten"),
                            turn: t("around the sensor", "um den Sensor"),
                            orbit: t("turn the view", "Ansicht drehen"),
                            pan: t("move the view", "Ansicht verschieben"),
                            zoom: t("zoom", "zoomen"),
                            sensor: t("Sensor", "Sensor"),
                            centres: t(
                              "choose NV centres",
                              "NV-Zentren wählen",
                            ),
                          },
                        }}
                      />
                    </Box>
                  </Paper>
                )}
                <Paper variant="outlined" sx={{ overflow: "hidden" }}>
                  <Stack
                    direction="row"
                    useFlexGap
                    flexWrap="wrap"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ pr: 2, borderBottom: 1, borderColor: "divider" }}
                  >
                    <Tabs
                      value={tab}
                      onChange={(_, value) => {
                        setTab(value);
                        setFrozen(null);
                        // The simulator keeps measuring in the newly selected mode.
                        if (simulated && running && running !== modeOf(value))
                          void start(modeOf(value));
                      }}
                      variant="scrollable"
                      scrollButtons="auto"
                      aria-label="Measurement modes"
                      sx={{ flex: 1, minWidth: 200 }}
                    >
                      {TABS.map((m) => (
                        <Tab
                          key={m}
                          value={m}
                          label={modeName(m)}
                          sx={{ textTransform: "none", fontSize: "1rem" }}
                        />
                      ))}
                    </Tabs>
                    {running && (
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        role="status"
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                          }}
                        />
                        <Typography variant="body2">
                          {t("Measuring", "Messung läuft")}:{" "}
                          {modeName(running === mode ? tab : running)}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                  <Box sx={{ p: 2, minWidth: 0 }}>
                    <Box
                      sx={{
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Stack
                        id="qoool-parameters"
                        role="group"
                        aria-label={t("Measurement settings", "Messparameter")}
                        direction="row"
                        spacing={1.5}
                        useFlexGap
                        flexWrap="wrap"
                        alignItems="center"
                        sx={{
                          px: 2,
                          py: 1.25,
                          borderBottom: 1,
                          borderColor: "divider",
                          bgcolor: "background.grey",
                        }}
                      >
                        {frequencyField(
                          "f1",
                          mode === "roll"
                            ? labels.frequency
                            : simulated
                              ? t("Start (GHz)", "Start (GHz)")
                              : "f1 (GHz)",
                        )}
                        {mode !== "roll" &&
                          frequencyField(
                            "f2",
                            simulated
                              ? t("End (GHz)", "Ende (GHz)")
                              : "f2 (GHz)",
                          )}
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
                                    onChange={(e) =>
                                      update(key, e.target.checked)
                                    }
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
                        {!simulated && (
                          <TextField
                            select
                            size="small"
                            label={t("Channel", "Kanal")}
                            sx={{ width: 110 }}
                            value={channel}
                            onChange={(e) => {
                              setChannel(Number(e.target.value));
                              setAutoResult(null);
                            }}
                          >
                            {[0, 1, 2, 3].map((ch) => (
                              <MenuItem key={ch} value={ch}>
                                CH {ch + 1}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                        {mode === "waterfall" && (
                          <TextField
                            label={t("Sweeps", "Sweeps")}
                            sx={{ width: 100 }}
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
                        )}
                        {!simulated && (
                          <TextField
                            label={t("Measurement text", "Messtext")}
                            sx={{ width: 160 }}
                            value={message}
                            disabled={!!running}
                            onChange={(e) => setMessage(e.target.value)}
                            size="small"
                          />
                        )}
                        <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
                          <Button
                            id="qoool-plot-pause"
                            variant={paused ? "contained" : "outlined"}
                            disableElevation
                            size="small"
                            aria-pressed={paused}
                            disabled={!paused && !hasPlotData}
                            onClick={togglePause}
                            startIcon={
                              <FontAwesomeIcon
                                icon={paused ? faPlay : faPause}
                              />
                            }
                            title={
                              paused
                                ? t("Resume plot", "Graph fortsetzen")
                                : t("Pause plot", "Graph pausieren")
                            }
                          >
                            {paused
                              ? t("Resume", "Weiter")
                              : t("Pause", "Pause")}
                          </Button>
                          <Button
                            id="qoool-plot-png"
                            variant="outlined"
                            size="small"
                            disabled={!paused && !hasPlotData}
                            onClick={downloadPlot}
                            startIcon={<FontAwesomeIcon icon={faDownload} />}
                            title={t(
                              "Download plot as PNG",
                              "Graph als PNG herunterladen",
                            )}
                          >
                            PNG
                          </Button>
                        </Stack>
                      </Stack>
                      {tab === "both" ? (
                        <Box
                          id="qoool-both"
                          sx={{
                            display: "grid",
                            gap: 1.5,
                            gridTemplateColumns: {
                              xs: "1fr",
                              md: "repeat(2, minmax(0, 1fr))",
                            },
                          }}
                        >
                          {[
                            {
                              key: "sweep",
                              title: t("Newest sweep", "Neuester Sweep"),
                              ref: plotRef,
                              data: latestSweep(shownData),
                              plotAxis: sweepAxis,
                            },
                            {
                              key: "waterfall",
                              title: t(
                                "Waterfall · newest sweep at the top",
                                "Wasserfall · neuester Sweep oben",
                              ),
                              ref: waterfallRef,
                              data: shownData,
                              plotAxis: paused ? frozen.axis : axis,
                            },
                          ].map(({ key, title, ref, data, plotAxis }) => (
                            <Paper
                              key={key}
                              variant="outlined"
                              data-tile={key}
                              sx={{ p: 1, minWidth: 0 }}
                            >
                              <Typography
                                variant="subtitle2"
                                component="h3"
                                sx={{ px: 0.5, pb: 0.5 }}
                              >
                                {title}
                              </Typography>
                              <Plot
                                ref={ref}
                                data={data}
                                pausedAt={paused ? frozen.at : null}
                                mode={key}
                                settings={selected}
                                visible={visible}
                                channel={channel}
                                labels={labels}
                                axis={plotAxis}
                                height={
                                  simulated
                                    ? fit
                                      ? fit.plot
                                      : PLOT_HEIGHT
                                    : 400
                                }
                              />
                            </Paper>
                          ))}
                        </Box>
                      ) : (
                        <Plot
                          ref={plotRef}
                          data={shownData}
                          pausedAt={paused ? frozen.at : null}
                          mode={mode}
                          settings={selected}
                          visible={visible}
                          channel={channel}
                          labels={labels}
                          // The sweep axis follows the paused dips; others stay frozen.
                          axis={paused && mode !== "sweep" ? frozen.axis : axis}
                          height={
                            simulated ? (fit ? fit.plot : PLOT_HEIGHT) : 400
                          }
                        />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {tab === "both"
                        ? null
                        : mode === "waterfall"
                          ? t(
                              "Raw intensity · newest sweep at the top",
                              "Rohintensität · neuester Sweep oben",
                            )
                          : mode === "roll"
                            ? t(
                                "Raw intensity in a rolling time window",
                                "Rohintensität im rollenden Zeitfenster",
                              )
                            : simulated && axis
                              ? magnet.orientations === 1
                                ? t(
                                    "Simulated photo sensor signal of a single NV centre, scaled to 0–1",
                                    "Simuliertes Signal des Fotosensors für ein einzelnes NV-Zentrum, auf 0–1 normiert",
                                  )
                                : t(
                                    `Simulated photo sensor signal of an ensemble with ${magnet.orientations} NV orientations, scaled to 0–1`,
                                    `Simuliertes Signal des Fotosensors für ein Ensemble mit ${magnet.orientations} NV-Ausrichtungen, auf 0–1 normiert`,
                                  )
                              : null}
                    </Typography>
                  </Box>
                </Paper>
              </Stack>
              {/* On desktop the row height follows the left column; the worked
                example scrolls inside its column instead of adding white space. */}
              <Paper
                variant="outlined"
                component="aside"
                sx={{
                  position: "relative",
                  minWidth: 0,
                  bgcolor: "background.grey",
                }}
              >
                <Box
                  sx={{
                    p: 2.5,
                    position: { lg: "absolute" },
                    inset: { lg: 0 },
                    overflowY: { lg: "auto" },
                  }}
                >
                  <FieldCalculation
                    pairs={pairs}
                    labels={fieldLabels}
                    highlight={readable}
                  />
                </Box>
              </Paper>
            </Box>
            <Accordion variant="outlined" disableGutters>
              <AccordionSummary
                expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
              >
                <Typography variant="h6" component="h2">
                  {t("Serial terminal", "Serielles Terminal")}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ ml: 2, alignSelf: "center" }}
                  variant="body2"
                >
                  {t("for advanced users", "für Fortgeschrittene")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  {deviceText && <Alert severity="info">{deviceText}</Alert>}
                  <Stack direction="row" spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label={t("Raw command or text", "Rohbefehl oder Text")}
                      value={rawCommand}
                      onChange={(e) => setRawCommand(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          status === "connected" &&
                          rawCommand
                        )
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
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
