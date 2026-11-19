# CLAUDE.md – React-Ardublockly

Blockly-based visual programming environment for senseBox boards, live at https://blockly.sensebox.de. Users (mostly students and teachers) build programs from blocks, the app generates Arduino C++ code, compiles it via the senseBox compiler service and flashes it to the board (WebSerial / senseBox Connect App).

## Stack

- React 18, Vite, JavaScript/JSX (no TypeScript – don't add `.ts` files)
- Blockly 12 with `@blockly/*` plugins
- MUI v5 (mixed with `@mui/styles`, Emotion, styled-components), Redux + redux-thunk, React Router 7
- Cypress for E2E tests, Prettier + ESLint
- Package manager: **yarn** (`yarn.lock`; never create a `package-lock.json`)
- Import alias: `@/` → `src/`

## Commands

- `yarn` – install
- `yarn start` – dev server on http://localhost:3000 (`yarn dev` uses Windows `set` syntax and only works on Windows)
- `yarn build` – production build into `build/`
- `yarn build:tutorial` – build the tutorial widget
- `yarn e2e` – Cypress against http://localhost:3000. Mirror CI: `yarn build && npx serve -s build -l 3000`, then `yarn e2e` in a second shell
- `npx prettier --check <files>` / `npx eslint <files>` – on changed files

## Project structure

- `src/components/Blockly/blocks/` – block definitions (`Blockly.Blocks[...]`), registered in `blocks/index.js`
- `src/components/Blockly/generator/arduino/` – Arduino code generators (`Blockly.Generator.Arduino.forBlock[...]`), registered in `generator/arduino/index.js`
- `src/components/Blockly/generator/basic/`, `blocks/basic/`, `toolbox/ToolboxBasic.jsx` – separate senseBox:basic mode with its own generator
- `src/components/Blockly/msg/de/`, `msg/en/` – block texts, tooltips, help URLs, UI strings; aggregated in `msg/de.js` and `msg/en.js`
- `src/components/Blockly/toolbox/` – per-board toolboxes: `ToolboxEsp.jsx` (MCU-S2), `ToolboxEye.jsx` (MCU-Eye), `ToolboxMcu.jsx` (MCU, Mini)
- `src/components/Blockly/helpers/board.js` – boards, pins, ports, compiler flags
- `src/components/Workspace/ToolbarItems/` – compile, upload, flash, save, share
- `src/components/Pages/`, `Tutorial/`, `Gallery/`, `Settings/`, `User/` – app pages
- `src/actions/`, `src/reducers/`, `src/store.js` – Redux
- `cypress/e2e/` – E2E tests

## Boards

| Board                  | Store value                       | Compiler board                               | Status           |
| ---------------------- | --------------------------------- | -------------------------------------------- | ---------------- |
| MCU-S2 (ESP32-S2)      | `MCU-S2`                          | `sensebox-esp32s2`                           | **primary**      |
| MCU-Eye (camera board) | `MCU-EYE` (board title `MCU-Eye`) | see `CompilationDialog.jsx` / `useFlash.jsx` | **primary**      |
| MCU (SAMD21)           | `MCU`                             | `sensebox-mcu`                               | maintenance only |
| Mini (SAMD21)          | `MCU:MINI`                        | `sensebox-mcu`                               | maintenance only |

- New features and blocks target MCU-S2 and MCU-Eye. MCU and Mini only get bug fixes, unless explicitly requested.
- Before implementing, check whether the hardware/library actually supports the target board, and state which boards a change covers.

## Simulators and QOOOL Lab (NV magnetometer)

There are two separate simulators. Don't mix them up:

- **Blockly simulator** (`src/components/Simulator/`): runs the block program in `js-interpreter` and shows it on the editor page (`/`) in `CodeViewer.jsx`, MCU-S2 only. It uses its own generator in `Blockly/generator/simulator/`, and its state lives in Redux under `simulator`. QOOOL blocks there are only the "fluoro bee" (`fluoroASM`), which has nothing to do with the magnetometer.
- **Magnetometer simulator** in the QOOOL Lab (`/qoool`, `src/components/Pages/QooolLab/`): no Blockly, no Redux.
  - `SimulatedConnection.js` has the same interface as `SerialConnection.js` (`connect`/`send`/`disconnect`, `onTelegram`/`onStatus`/`onLog`/`onError`) and speaks the firmware protocol from `protocol.js`. Plot and CSV export therefore work unchanged.
  - Sweep and Waterfall are simulated. Each Sweep tick sends `<clf>` + one `<batch>` with the whole sweep, so the plot follows the magnet live; each Waterfall tick sends one `<batch>` + `<end>` (one row). `measured` holds the magnet state of the latest sweep, so dip markers and the B calculation match the plot even after stopping.
  - With the simulator, the magnet scene and the plot share the window height (`SCENE_HEIGHT`, `PLOT_HEIGHT` in `QooolLab.jsx`; `height` props of `MagnetScene` and `Plot`) so both fit on one screen; the view switches sit in the scene (`controls` prop). Under the scene a help bar (`ControlsHelp.jsx`) shows the controls as key caps and mouse icons (3D adds orbit, pan, zoom); it is open by default, closes with ×, and the info button in the scene toggles it. The tab bar offers Sweep, Waterfall and Sweep + Waterfall (`TABS` in `QooolLab.jsx`). "both" is a view, not a device mode: it runs a waterfall (`modeOf`) and also plots its newest row as a sweep with the dip markers (`latestSweep`); both plots sit side by side as tiles (stacked on narrow screens), and the PNG joins them side by side. Pausing the plot reads the dips off the frozen curve (`readDips` in `model.js`: lowest smoothed point within 8 MHz of each expected dip); until it resumes, the markers, Δf and the worked example use those frequencies. Hopp, Roll and X–Y remain in `protocol.js`. While the simulator measures, a tab switch ends the old mode (`<end>`) and starts the new one.
  - The page works with every board and browser. Only "Connect MCU-S2" needs the MCU-S2 and Web Serial.
  - The lab is one rounded card (`#qoool-lab`). The toggle at its top right (`#qoool-source`, `switchSource` in `QooolLab.jsx`) switches between MCU-S2 and the simulator. The simulator is the default: it starts when the page opens; it is derived from `simulated`, not separate state. Choosing the simulator starts it at once; MCU-S2 still needs the "Connect MCU-S2" click for the port picker.

The physics and UI live in `src/components/Simulator/magnetometer/` (`model.js`, `MagnetScene.jsx`, `MagnetControls.jsx` with `OrientationToggle` and `FieldLinesSwitch`), not in `Pages/QooolLab/`. On the page the magnet scene has its own card (with the field-lines switch); the Sweep/Waterfall tabs belong to the measurement card. The NV-centre choice sits in the magnet scene: as a toggle in its controls and as a menu when the sensor is clicked (`onOrientationsChange`). The plan is to reuse them as a node in the Blockly simulator later, so keep them free of QOOOL-Lab specifics: texts come in via a `labels` prop, and the magnet uses the `nodrag nopan` classes for React Flow.

### NV-centre model (ODMR)

What is simulated: a diamond with NV centres fluoresces red under green light, and a microwave sweep from 2.77 to 2.97 GHz shows dips (Lorentzian curves) at the resonances. With no field there is one dip at 2.87 GHz. A magnet splits it into a pair (Zeeman splitting), and the field strength is read from the distance between the dips, not their depth. The goal is to illustrate the effect. The page shows the worked example `B = (f₂ − f₁) / (2γ)` with γ = 28 GHz/T (`GAMMA`, `dipPairs`, `fieldFromPair` in `model.js`, shown by `FieldCalculation.jsx` as a textbook-style worked example typeset in native MathML, no math library); with `MAX_SPLIT = 70` the magnet at the sensor gives 2.5 mT. The project partners (André, Daniela) asked for a linear model.

- Splitting per NV axis: `Δ = MAX_SPLIT · (1 − distance) · |b · n|`, with `distance` 0 = magnet at the sensor and 1 = far away. Each axis gives one pair at `CENTER ± Δ`.
- Simplification: the magnet always faces the sensor with its north pole, so the field at the sensor points along the line between them. `direction` is a 3D unit vector (where the magnet sits, seen from the sensor; x = start position, y up, z towards the viewer). `angle` is a shortcut for a direction in the table plane x–z, clockwise in the top view (`directionFromAngle`).
- `MagnetScene.jsx` is a 3D view drawn as SVG with its own orthographic projection (no 3D library): the magnet is dragged in the screen plane and kept between `NEAR` and `FAR`, dragging the background orbits the camera. The simulator starts in the 2D top view (`threeD: false`). The `3D view` switch (`ViewSwitch` in `MagnetControls.jsx`, prop `threeD`) shows a fixed 2D top view instead, like the earlier 2D scene: only the magnet can be moved (no orbit, pan or zoom), and switching to 2D flattens the magnet direction onto the table plane x–z (`flattenDirection`). The top view is a strip: the sensor at the left edge, the magnet only to its right within `Y_MAX` of the x axis, and the track reaching to the right edge (the viewBox follows the scene's aspect ratio, measured with a ResizeObserver; `fitTop` keeps the magnet in the strip). Axis handles on the magnet (`HANDLES_2D`/`HANDLES_3D`; in 2D "y" is screen up = world −z) and Shift-drag move it along one axis only; the round knob where the arrows cross (`#magnetometer-free-handle`) moves it freely (`alongLine` keeps it between `NEAR` and `FAR`). It draws one diamond per NV orientation, each with its axis; the ensemble's four diamonds sit at the corners of a tetrahedron, each along its own NV axis. The top view looks straight down one tetrahedron edge, so there the sensor (board, diamonds, tetrahedron) is drawn as a small oblique sketch (`SENSOR_VIEW_2D`) while the magnet stays in the top view.
- `NV_AXES`: the four tetrahedral axes of diamond. Axis 1 lies along the scene, so Single-NV at 0° shows the full splitting. The other three are turned 12° around it so that, in the table plane, all four pairs separate at the tilted angle (35°, at least 13 MHz apart). `ANGLES = [0, 35, 90]` with all 4 orientations gives:
  - 0°: two pairs (±70 and 3 × ±23 MHz)
  - 35°: four separate pairs
  - 90°: one unsplit dip plus three pairs
- `MAX_SPLIT = 70`, not larger: the outermost dips must stay well inside the 2770–2970 MHz window, otherwise the first sample (used for normalization) falls into a dip.
- Dip depth per dip is `DIP_DEPTH · 2 / (orientations + 1)`, so larger ensembles stay readable. `yRange(orientations)` gives a fixed Y scale so the plot doesn't jump while dragging.
- Values in `model.js` (voltage, depth, width, noise) are estimates, not measurements. The field lines in `MagnetScene.jsx` are schematic dipole lines and don't enter the model.

Constraints:

- Data stay in MHz and first-sample normalized (baseline 1), as from the real device, because `fit.js` relies on that. Every frequency in the lab is shown in GHz (plot, inputs, errors), for the real device too; commands and CSV stay in MHz. In the simulator the plot also scales each curve to 0–1 for display only (`axis.normalize`). Both happen in the UI, via the `axis` prop of `Plot.jsx` and `ScaledField` in `QooolLab.jsx`. Dips are labelled f₁, f₂, … outermost pair first, and each pair's splitting is drawn as a double arrow Δf (Δf₁, Δf₂, … in ensembles, numbered like B₁, B₂). Markers, Δf and the matching values in the worked example share the senseBox green (`readoutColour` in `FieldCalculation.jsx`), so students see what is read from the plot. The worked example highlights only while the plot shows the dips (`highlight` prop, `readable` in `QooolLab.jsx`). The y axis is labelled fluorescence intensity; an unsplit pair gets no marker, and pairs with equal splitting are listed once.
- The lab page has no Lorentzian fit panel (removed on purpose). `fit.js` (at most 4 dips) and its unit tests remain but aren't used in the UI; don't bring the panel back on the side.
- A fit with a single starting dip doesn't converge reliably on ensemble data. Tests that fit ensembles need one starting value per expected dip.

Tests: `node --test src/components/Pages/QooolLab/qoool.test.js` (model, protocol, fit, both connections) and `cypress/e2e/qoool-lab.cy.js`.

## Adding or changing a block – definition of done

1. Block definition in `blocks/<area>.js`, using `getColour()` and the type helpers like neighbouring blocks
2. Generator in `generator/arduino/<area>.js`: put includes in `libraries_`, globals in `definitions_`, setup code in `setupCode_` with stable keys so they aren't duplicated
3. All texts in **both** `msg/de/` and `msg/en/` – label, tooltip and help URL. No hardcoded strings in blocks
4. Help URL pointing to the matching page on https://docs.sensebox.de (use `withBoardParam` from `helpers/helpUrlBuilder.js` where board-specific)
5. Added to the toolbox of every supported board
6. Pins/ports from `helpers/board.js`, never hardcoded
7. Generated code uses only libraries available on the compiler service – verify by compiling (see below)
8. Cypress test in `cypress/e2e/` for new blocks or features
9. In the summary, list what still needs **testing on real hardware** – generated code is never considered verified without it
   **Never rename existing block types, field names or input names.** Saved projects, tutorials, gallery entries and share links store them as XML and would break. If a change is unavoidable, ask first and plan a migration.

## Compiling generated code

The compiler service is at `VITE_INITIAL_COMPILER_URL` (https://compiler.sensebox.de). See `Workspace/ToolbarItems/CompileAndUploadDialog/compileBinary.js` for the request format:

```bash
curl -s -X POST https://compiler.sensebox.de/compile \
  -H "Content-Type: application/json" \
  -d '{"sketch": "<generated code>", "board": "sensebox-esp32s2"}'
```

A successful response contains `data.id`. Compile at least for every board the block is offered on.

## Code style

- **Follow the existing style of the file you're editing** (class vs. function components, `withStyles` vs. `sx`/styled, Redux pattern). Don't refactor unrelated code on the side.
- Prettier config in `.prettierrc.json` (double quotes, trailing commas, 2 spaces)
- Reuse existing helpers, hooks and components before writing new ones
- UI text must exist in German and English
- Prefer open-source dependencies, but don't add any without asking (see below)

## Before finishing a task

1. `yarn build` passes
2. Prettier and ESLint are clean on changed files
3. Relevant Cypress tests pass (`yarn e2e`), new ones added where needed
4. Generated Arduino code compiles for the target boards
5. Summary includes: affected boards, what was tested, what still needs hardware testing
   If a check can't be run (e.g. no browser for Cypress, no network for the compiler), say so explicitly instead of skipping it silently.

## Git workflow

- Branch from `development`. Name branches `feat/…`, `fix/…`, `chore/…`
- PRs target `development`, never `main` (`main` = production)
- Commit messages: short, English, imperative
- **Ask before committing, pushing or opening a PR**
- Dependabot handles dependency updates – don't mix dependency bumps into feature PRs

## Ask first before changing

- `.env`, `.github/workflows/`, `vite.config.js`, `vite.config.tutorial.js`, `cypress.config.js`
- `package.json` / `yarn.lock` (new dependencies or upgrades)
- Existing block types, field names, input names (see above)

## Security and privacy

- Everything in `VITE_*` variables is bundled into the public JavaScript. Never put secrets, API keys or personal data (names, email addresses) there.
- Never output, log or commit API keys, tokens or personal data. Use placeholders in examples.
- Users are often children and students: don't add tracking, third-party calls or data collection without explicit approval.

## Related services and repos

- Compiler service: https://compiler.sensebox.de
- Blockly backend (projects, tutorials, auth, share links): `VITE_BLOCKLY_API`, repo https://github.com/sensebox/React-Ardublockly-Backend
- senseBox MCU board support: https://github.com/sensebox/senseBoxMCU-core
- Documentation (help URLs): https://docs.sensebox.de, repo https://github.com/sensebox/docs
- openSenseMap API (used by OSeM blocks): https://github.com/sensebox/openSenseMap-API
