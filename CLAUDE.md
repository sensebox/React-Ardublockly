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
