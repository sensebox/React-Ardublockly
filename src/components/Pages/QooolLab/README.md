# QOOOL Lab

Open **QOOOL Lab** in the navigation menu, or visit `/qoool`. Measuring with a
real magnetometer requires **MCU-S2** as the selected board; the simulator works
with every board and browser.

Connect the MCU-S2 over USB, with the special QOOOL XBee module and magnetometer
attached and the existing QOOOL firmware installed. The browser port picker
replaces the Python application's serial device path. Web Serial requires a
supported desktop browser and HTTPS (or localhost). This page does not flash
firmware or generate a replacement device sketch.

## Simulator

The whole lab sits in one card with rounded corners. The toggle at its top
right picks the data source: **Simulator** (preselected; it starts when the
page opens) or **MCU-S2** (connect with the **Connect MCU-S2** button, because
the port picker needs a deliberate click). Switching back
to MCU-S2 stops the simulator; switching to the simulator closes a connected
MCU-S2 first.
It shows the sensor and a magnet in a 3D view in its own **Magnet simulator**
card. The magnet can be dragged anywhere around the sensor (from the side,
above, below, front or back). Dragging the background turns the view; with
Shift or the right mouse button it pans. The mouse wheel, a trackpad or two
fingers zoom towards the pointer, as do the buttons at the top right, which
also reset the view. Keys on the focused magnet: ← → change the distance, ↑ ↓ slide it up or
down (along its y arrow), Shift + arrows move it around the sensor in 5°
steps, + and − zoom. While a sweep runs, the plot follows the magnet: a
single NV centre gives one dip at 2.870 GHz that splits into two as the magnet
approaches. The splitting is linear in the magnet distance; this illustrates the
effect.

The split dips are marked in the plot and named f₁, f₂ (in ensembles f₃, f₄, …,
outermost pair first). An unsplit dip gets no marker. Below the plot the page
works out the field from each pair in the column right of the plot (below it on
narrow screens): `B = (f₂ − f₁) / (2γ)` with γ = 28 GHz/T. The column is always
there; before the first sweep (and without the simulator) it follows the magnet,
so with the magnet far away it shows one dip and B = 0.

The Sweep/Waterfall tabs sit on the measurement card. The NV-centre choice
sits in the magnet scene next to the sensor it describes: as a toggle at the
top left and as a menu when the sensor is clicked.

- **NV centres** (toggle in the magnet scene, or click the sensor for a menu) switches between a single NV centre and the ensemble with all
  4 NV orientations. Each orientation adds one pair of dips; its splitting
  follows the field component along that NV axis. Dips are shallower in the
  ensemble so the overlapping centre dip stays in view. The model still accepts
  2 or 3 orientations; the page just doesn't offer them.
- **Help bar** under the scene shows the controls as key caps (⇧, arrows, +/−)
  and mouse icons. It is open by default; × hides it, the ⓘ button in the
  scene brings it back.
- **Axis arrows** on the magnet (x, y in the top view; x, y up, z in 3D) move
  it along one axis only; holding Shift while dragging the magnet locks it to
  the axis closest to the drag. The round knob where the arrows cross moves it
  freely in both directions. The tip at the pointer then names the axis.
- **3D view** (in the magnet scene, off by default: the simulator starts in 2D) switches
  between the 3D view and a fixed 2D top view of the table plane, as in the
  earlier 2D scene: the sensor sits at the left edge and the magnet moves on
  its right, up to the right edge of the scene. Switching to 2D moves the magnet onto the table (a magnet
  straight above or below the sensor goes to the start position). In 2D only
  the magnet can be moved: no turning, panning or zooming. Shift + arrows turn
  it around the sensor in the table plane.
- **Field lines** (in the magnet scene, off by default) draws schematic field lines around the
  magnet. They are decorative and do not enter the model.

The magnet always faces the sensor with its north pole, so the field at the
sensor points along the line between them and the magnet's position alone sets
the field direction. The sensor shows one diamond per NV orientation (one, or
four at the corners of a tetrahedron, each along its own NV axis), each with
its NV axis drawn in colour; an axis glows
stronger the more of the field lies along it. With all four orientations and the
magnet on the table (e.g. in the 2D view), 0° gives two pairs (along one NV
axis), 35° four separate pairs, and 90° one unsplit dip plus three pairs.

The measurement settings (NV centres and sweep range in the simulator, and for the real device channel and
measurement text) sit in a bar on top of the plot. One channel setting drives
plot and waterfall; the simulator only fills CH 1.

- `SimulatedConnection.js` has the interface of `SerialConnection.js` and sends
  the same telegrams, so plot and CSV export work unchanged. It repeats the
  sweep about ten times per second (`<clf>` followed by one `<batch>`); the CSV
  holds the latest sweep. Waterfall sends one `<batch>` and `<end>` per sweep,
  so each sweep becomes one row. Other modes are not simulated.
- The model and the scene live in `src/components/Simulator/magnetometer/`
  (`model.js`, `MagnetScene.jsx`, `MagnetControls.jsx`) so the Blockly simulator can reuse them. Curve
  constants (centre, maximum splitting, depth, width, voltage, noise) are at the
  top of `model.js` and are estimates. The images in `assets/` are placeholders.
- All frequencies in the lab are shown in GHz, for the real device too. In the
  simulator the plot also scales the curve to 0–1. Commands, data and the CSV
  export stay in MHz and first-sample normalized, as the firmware expects.

## Features and reference behavior

- The tab bar offers Sweep, Waterfall and **Sweep + Waterfall** (`TABS` in
  `QooolLab.jsx`). The third tab measures a waterfall and also plots its newest
  row as a sweep (with f₁, f₂, Δf in the simulator); it works with the real
  device too. Both plots sit side by side as tiles, and the PNG export joins
  them. Pausing reads f₁, f₂ and Δf off the frozen curve, so the markers and
  the worked example match it.
  Hopp, Roll and X–Y are still in the protocol code but not offered.
  While the simulator measures, switching the tab carries on in the other mode.
- Sweep, Waterfall, Hopp, Roll and X–Y protocol support, with the reference frequency,
  slider, option and text commands at 115200 baud.
- Four selectable channels; Sweep/Hopp/X–Y use first-sample normalization
  (a zero first sample uses 0.5), as in `NV_Website_V15.py`. Roll and Waterfall
  show raw intensity. Roll uses browser receipt time.
- Waterfall retains 10–100 completed sweeps, newest at the top. It sends
  `<start,waterfall>`, accepts `<start,sweep>` acknowledgements without leaving
  waterfall mode, and resends frequency parameters at each `<end>` boundary.
  This follows the executable V15 code: the restart command in that code is
  commented out, so firmware must continue waterfall acquisition itself.
- The page has no Lorentzian fit panel. `fit.js` (bounded Levenberg–Marquardt
  fit of up to four dips) and its unit tests remain, but nothing in the UI uses it.
- Incoming `data`/`batch`, `text`, `clf`, axis labels and axis limits are
  supported. Axis commands apply to X–Y; Roll accepts y-axis commands.
- Raw CSV (all four x/y pairs) and timestamped serial-log downloads. A new
  measurement replaces the current recording, so download it before starting
  another. Charts retain at most 30,000 points; recording stops at 500,000
  samples. The terminal retains 200 displayed / 20,000 downloadable messages.
- Ping every three seconds, six-second response timeout, and serial lock
  cleanup on disconnect, navigation, or board changes.

The Python reference embeds `NV_To_Go.html`, `einfuehrung.html`, and
`neural_burst.html` from absolute paths on its author's computer. Those files
were not supplied with the reference sketch and are not included here.

## Verification

```sh
node --test src/components/Pages/QooolLab/qoool.test.js
npm run build
# With the app running on localhost:3000:
npx cypress run --spec cypress/e2e/qoool-lab.cy.js
```

The automated tests use a fake serial port and the simulator. Validate all five modes,
waterfall continuation, and unplug/reconnect against recorded
Python output on the physical MCU-S2 before classroom deployment.
