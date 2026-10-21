# QOOOL Lab

Open **QOOOL Lab** in the navigation menu after selecting **MCU-S2**, or visit
`/qoool`. Direct access with another board shows a board-selection notice.

Connect the MCU-S2 over USB, with the special QOOOL XBee module and magnetometer
attached and the existing QOOOL firmware installed. The browser port picker
replaces the Python application's serial device path. Web Serial requires a
supported desktop browser and HTTPS (or localhost). This page does not flash
firmware or generate a replacement device sketch.

## Features and reference behavior

- Sweep, Waterfall, Hopp, Roll and X–Y modes, with the reference frequency,
  slider, option and text commands at 115200 baud.
- Four selectable channels; Sweep/Hopp/X–Y use first-sample normalization
  (a zero first sample uses 0.5), as in `NV_Website_V15.py`. Roll and Waterfall
  show raw intensity. Roll uses browser receipt time.
- Waterfall retains 10–100 completed sweeps, newest at the top. It sends
  `<start,waterfall>`, accepts `<start,sweep>` acknowledgements without leaving
  waterfall mode, and resends frequency parameters at each `<end>` boundary.
  This follows the executable V15 code: the restart command in that code is
  commented out, so firmware must continue waterfall acquisition itself.
- Manual and automatic fits of up to four Lorentzian dips. Automatic fitting
  uses bounded Levenberg–Marquardt least squares, with baseline 1, frequency
  bounded to measured values, depth 0–1, and width 0.1–50 MHz. The table shows
  fitted parameters and each frequency's estimated standard deviation; a dash
  means covariance could not be estimated. This is a JavaScript implementation,
  not SciPy, and numerical results need not be identical.
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

The automated tests use a simulated serial device. Validate all five modes,
waterfall continuation, unplug/reconnect, and numerical fits against recorded
Python output on the physical MCU-S2 before classroom deployment.
