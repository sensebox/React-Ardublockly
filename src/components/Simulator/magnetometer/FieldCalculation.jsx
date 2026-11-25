import React, { createContext, useContext, useEffect, useState } from "react";
import {
  alpha,
  Box,
  Button,
  Collapse,
  Typography,
  useTheme,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { CENTER, fieldFromPair, GAMMA, subscript } from "./model.js";

// Typeset with MathML, which current browsers render natively (no library).

// Values read from the plot (f₁, f₂, Δf) are highlighted in the readout
// colour, like the plot's dip markers, so students see where each number comes
// from. A page can set it as palette.readout (the QOOOL Lab uses its green);
// otherwise it is the senseBox green. Without a plot to read from there is no
// highlight (null).
const Highlight = createContext(null);
// Hovering a value read from the plot reports what it refers to
// ({markers: [names], spans: [names]}, null on leave), so the page can point
// at it in the plot. Null while nothing is highlighted.
const Focus = createContext(null);
const fName = (index) => `f${subscript(index)}`;
const pairTarget = (row) => ({
  markers: [fName(row.lowIndex), fName(row.highIndex)],
  spans: [row.field ? `Δf${subscript(row.field)}` : "Δf"],
});
// Mouse handlers that focus target while hovered.
const useHover = (target) => {
  const onFocus = useContext(Focus);
  return onFocus && target
    ? {
        onMouseEnter: () => onFocus(target),
        onMouseLeave: () => onFocus(null),
      }
    : {};
};
export const readoutColour = (theme) =>
  theme.palette.readout?.main ??
  theme.palette.senseboxColors?.green ??
  theme.palette.success.main;

// Rounded to what the plot shows, so the worked example adds up on paper.
const ghz = (mhz) => Number((mhz / 1000).toFixed(3));

const Formula = ({ children }) => (
  <math displaystyle="true">
    <mrow>{children}</mrow>
  </math>
);
const Unit = ({ children }) => (
  <>
    <mspace width="0.2em" />
    <mtext>{children}</mtext>
  </>
);
const Sub = ({ symbol, index }) =>
  index ? (
    <msub>
      <mi>{symbol}</mi>
      <mn>{index}</mn>
    </msub>
  ) : (
    <mi>{symbol}</mi>
  );
const Op = ({ children }) => <mo>{children}</mo>;
// Bold, so light readout colours stay legible on white.
const Read = ({ children, target }) => {
  const colour = useContext(Highlight);
  const hover = useHover(target);
  return (
    <mrow
      {...hover}
      data-focusable={hover.onMouseEnter ? "" : undefined}
      style={colour ? { color: colour, fontWeight: 700 } : undefined}
    >
      {children}
    </mrow>
  );
};
// f with an index, read from the plot.
const F = ({ index }) => (
  <Read target={{ markers: [fName(index)] }}>
    <Sub symbol="f" index={index} />
  </Read>
);
// Δf of one pair (index for ensembles), read from the plot; row (optional)
// says which pair to point at.
const DeltaF = ({ index, row }) => (
  <Read target={row && pairTarget(row)}>
    {index ? (
      <msub>
        <mrow>
          <mi mathvariant="normal">Δ</mi>
          <mi>f</mi>
        </mrow>
        <mn>{index}</mn>
      </msub>
    ) : (
      <>
        <mi mathvariant="normal">Δ</mi>
        <mi>f</mi>
      </>
    )}
  </Read>
);

// pairs: from dipPairs(); highlight: the plot shows the dips, so values read
// from it are coloured; labels: {title, intro, readout, read, readShort,
// splitting, given, approach, solve, insert, result, showSteps, hideSteps,
// centre, gamma, noSplit, along, decimal}
// At first only one line per pair is shown (Δf read from the plot → B); the
// full worked example, starting with f₁, f₂, … read from the plot, opens on
// request.
// onFocus (optional): called with the hovered value's target in the plot
// ({markers, spans}) and with null when the pointer leaves it.
export default function FieldCalculation({
  pairs,
  labels,
  highlight = false,
  onFocus,
}) {
  const theme = useTheme();
  const [showSteps, setShowSteps] = useState(false);
  const colour = highlight ? readoutColour(theme) : null;
  // Nothing to point at without highlighted values; drop a stale focus.
  useEffect(() => {
    if (!colour) onFocus?.(null);
  }, [colour, onFocus]);
  const number = (value, digits) =>
    value.toFixed(digits).replace(".", labels.decimal ?? ".");
  const Num = ({ value, digits }) => <mn>{number(value, digits)}</mn>;
  const ReadNum = ({ value, target }) => (
    <Read target={target}>
      <Num value={value} digits={3} />
      <Unit>GHz</Unit>
    </Read>
  );
  // Without a splitting both dips sit at the centre: f₁ = f₂.
  const rows = pairs.length
    ? pairs.map(({ low, high }, i) => ({
        low: ghz(low.freq),
        high: ghz(high.freq),
        lowIndex: 2 * i + 1,
        highIndex: 2 * i + 2,
        field: pairs.length > 1 ? i + 1 : null,
      }))
    : [
        {
          low: ghz(CENTER),
          high: ghz(CENTER),
          lowIndex: 1,
          highIndex: 2,
          field: null,
        },
      ];
  const focusOn = colour ? onFocus : null;
  // Hovered values take the plot's focus colour, so both sides match.
  const focusColour = theme.palette.primary.dark;
  const focusTint = alpha(focusColour, 0.1);
  // A whole row of the table points at its pair and is tinted while hovered.
  const [hoveredRow, setHoveredRow] = useState(null);
  const rowHover = (row) =>
    focusOn
      ? {
          onMouseEnter: () => {
            setHoveredRow(row.lowIndex);
            focusOn(pairTarget(row));
          },
          onMouseLeave: () => {
            setHoveredRow(null);
            focusOn(null);
          },
        }
      : {};
  const step = (label) => (
    <Typography
      variant="overline"
      color="text.secondary"
      component="h4"
      sx={{ lineHeight: 1.6, mt: 1.5, mb: 0.5 }}
    >
      {label}
    </Typography>
  );
  const note = (text) => (
    <Typography variant="body2" color="text.secondary" component="div">
      {text}
    </Typography>
  );
  const line = (formula, text, key) => (
    <Box key={key} sx={{ mb: 0.75 }}>
      {formula}
      {text && note(text)}
    </Box>
  );
  // Continues a calculation on the next line, aligned under the first "=".
  const next = (children) => (
    <Box sx={{ pl: 2.5, mt: 0.5 }}>
      <Formula>
        <Op>=</Op>
        {children}
      </Formula>
    </Box>
  );
  // f₂ − f₁ for one pair, as symbols.
  const difference = (row) => (
    <>
      <F index={row.highIndex} />
      <Op>−</Op>
      <F index={row.lowIndex} />
    </>
  );
  const twoGamma = (
    <>
      <mn>2</mn>
      <mi>γ</mi>
    </>
  );
  return (
    <Highlight.Provider value={colour}>
      <Focus.Provider value={focusOn}>
        <Box
          id="magnetometer-field-calculation"
          sx={{
            overflowX: "auto",
            "& math": {
              fontFamily:
                '"Latin Modern Math", "STIX Two Math", "Cambria Math", math',
              fontSize: "1.05rem",
            },
            "& [data-focusable]": { cursor: "default", borderRadius: "3px" },
            "& [data-focusable]:hover": {
              color: `${focusColour} !important`,
              bgcolor: focusTint,
            },
          }}
        >
          <Typography
            variant="subtitle1"
            component="h3"
            sx={{ fontWeight: 600 }}
          >
            {labels.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pairs.length ? labels.intro : labels.noSplit}
          </Typography>

          {/* At a glance: a two-column table, the splitting read from the plot
        and the field B that follows from it. B is what we are after, so it
        stands out as the result. */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto",
              alignItems: "center",
              columnGap: 1.5,
              mt: 1.5,
            }}
          >
            {[labels.readShort ?? labels.read, labels.result].map(
              (heading, i) => (
                <Typography
                  key={heading}
                  variant="overline"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.6,
                    pb: 0.25,
                    justifySelf: i ? "end" : "start",
                  }}
                >
                  {heading}
                </Typography>
              ),
            )}
            {rows.map((row) => {
              const millitesla = fieldFromPair(row.low * 1000, row.high * 1000);
              const hovered = colour && hoveredRow === row.lowIndex;
              const cell = {
                px: 0.5,
                py: 0.75,
                borderTop: 1,
                borderColor: "divider",
                alignSelf: "stretch",
                display: "flex",
                alignItems: "center",
              };
              return (
                <React.Fragment key={row.lowIndex}>
                  <Box
                    sx={{
                      ...cell,
                      bgcolor: hovered ? focusTint : undefined,
                      "& [data-focusable]": hovered
                        ? { color: `${focusColour} !important` }
                        : undefined,
                    }}
                    {...rowHover(row)}
                  >
                    <Formula>
                      <DeltaF index={row.field} row={row} />
                      <Op>=</Op>
                      <ReadNum
                        value={Number((row.high - row.low).toFixed(3))}
                      />
                    </Formula>
                  </Box>
                  <Box
                    sx={{
                      ...cell,
                      justifyContent: "flex-end",
                      bgcolor: hovered ? focusTint : undefined,
                    }}
                    {...rowHover(row)}
                  >
                    <Box
                      data-highlight={colour ? "on" : "off"}
                      data-low={row.low.toFixed(3)}
                      data-high={row.high.toFixed(3)}
                      data-field={millitesla.toFixed(2)}
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        whiteSpace: "nowrap",
                        // Not in the readout colour: B is calculated, not read
                        // from the plot.
                        color: "text.primary",
                        bgcolor: "background.paper",
                        border: 1.5,
                        borderColor: "text.primary",
                        "& math": { fontSize: "1.15rem", fontWeight: 700 },
                      }}
                    >
                      <Formula>
                        <Sub symbol="B" index={row.field} />
                        <Op>=</Op>
                        <Num value={millitesla} digits={2} />
                        <Unit>mT</Unit>
                      </Formula>
                    </Box>
                  </Box>
                </React.Fragment>
              );
            })}
            <Box
              sx={{
                gridColumn: "1 / -1",
                borderTop: 1,
                borderColor: "divider",
              }}
            />
          </Box>
          {colour && (
            <Typography
              variant="caption"
              color="text.secondary"
              component="p"
              id="magnetometer-readout-legend"
              sx={{
                mt: 0.75,
                display: "flex",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: colour,
                  flexShrink: 0,
                }}
              />
              {labels.readout}
            </Typography>
          )}
          <Box sx={{ mt: 1 }}>
            <Button
              id="magnetometer-calculation-toggle"
              size="small"
              sx={{ px: 0, minWidth: 0 }}
              onClick={() => setShowSteps((open) => !open)}
              aria-expanded={showSteps}
              aria-controls="magnetometer-calculation-steps"
              endIcon={
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{
                    transform: showSteps ? "rotate(180deg)" : "none",
                    transition: "transform 150ms",
                  }}
                />
              }
            >
              {showSteps ? labels.hideSteps : labels.showSteps}
            </Button>
          </Box>
          <Collapse in={showSteps}>
            <Box id="magnetometer-calculation-steps">
              {step(labels.read)}
              {rows.map((row) => (
                <React.Fragment key={`given-${row.lowIndex}`}>
                  {line(
                    <Formula>
                      <F index={row.lowIndex} />
                      <Op>=</Op>
                      <ReadNum
                        value={row.low}
                        target={{ markers: [fName(row.lowIndex)] }}
                      />
                      <mo separator="true">,</mo>
                      <mspace width="0.8em" />
                      <F index={row.highIndex} />
                      <Op>=</Op>
                      <ReadNum
                        value={row.high}
                        target={{ markers: [fName(row.highIndex)] }}
                      />
                    </Formula>,
                  )}
                  {line(
                    <Formula>
                      <DeltaF index={row.field} row={row} />
                      <Op>=</Op>
                      {difference(row)}
                    </Formula>,
                    row === rows[0] ? labels.splitting : null,
                  )}
                </React.Fragment>
              ))}
              {step(labels.given)}
              {line(
                <Formula>
                  <mi>D</mi>
                  <Op>=</Op>
                  <Num value={ghz(CENTER)} digits={3} />
                  <Unit>GHz</Unit>
                </Formula>,
                labels.centre,
                "centre",
              )}
              {line(
                <Formula>
                  <mi>γ</mi>
                  <Op>=</Op>
                  <mn>{GAMMA}</mn>
                  <Unit>GHz/T</Unit>
                </Formula>,
                labels.gamma,
                "gamma",
              )}

              {step(labels.approach)}
              <Formula>
                <F index={1} />
                <Op>=</Op>
                <mi>D</mi>
                <Op>−</Op>
                <mi>γ</mi>
                <mi>B</mi>
                <mo separator="true">,</mo>
                <mspace width="0.8em" />
                <F index={2} />
                <Op>=</Op>
                <mi>D</mi>
                <Op>+</Op>
                <mi>γ</mi>
                <mi>B</mi>
              </Formula>
              <Box sx={{ mt: 0.5 }}>
                <Formula>
                  <Op>⇒</Op>
                  <mspace width="0.5em" />
                  <DeltaF />
                  <Op>=</Op>
                  {difference({ lowIndex: 1, highIndex: 2 })}
                  <Op>=</Op>
                  {twoGamma}
                  <mi>B</mi>
                </Formula>
              </Box>

              {step(labels.solve)}
              <Box
                sx={{
                  display: "inline-block",
                  px: 2,
                  py: 1,
                  borderLeft: 3,
                  borderColor: "primary.main",
                  bgcolor: "action.hover",
                }}
              >
                <Formula>
                  <mi>B</mi>
                  <Op>=</Op>
                  <mfrac>
                    <DeltaF />
                    <mrow>{twoGamma}</mrow>
                  </mfrac>
                  <Op>=</Op>
                  <mfrac>
                    <mrow>{difference({ lowIndex: 1, highIndex: 2 })}</mrow>
                    <mrow>{twoGamma}</mrow>
                  </mfrac>
                </Formula>
              </Box>

              {rows.map((row) => {
                const delta = Number((row.high - row.low).toFixed(3));
                const millitesla = fieldFromPair(
                  row.low * 1000,
                  row.high * 1000,
                );
                return (
                  <React.Fragment key={row.lowIndex}>
                    {step(labels.insert)}
                    <Formula>
                      <Sub symbol="B" index={row.field} />
                      <Op>=</Op>
                      <mfrac>
                        <mrow>
                          <ReadNum
                            value={row.high}
                            target={{ markers: [fName(row.highIndex)] }}
                          />
                          <Op>−</Op>
                          <ReadNum
                            value={row.low}
                            target={{ markers: [fName(row.lowIndex)] }}
                          />
                        </mrow>
                        <mrow>
                          <mn>2</mn>
                          <Op>·</Op>
                          <mn>{GAMMA}</mn>
                          <Unit>GHz/T</Unit>
                        </mrow>
                      </mfrac>
                    </Formula>
                    {next(
                      <mfrac>
                        <ReadNum value={delta} target={pairTarget(row)} />
                        <mrow>
                          <mn>{2 * GAMMA}</mn>
                          <Unit>GHz/T</Unit>
                        </mrow>
                      </mfrac>,
                    )}
                    {next(
                      <>
                        {millitesla ? (
                          <>
                            <Num value={millitesla} digits={2} />
                            <Op>·</Op>
                            <msup>
                              <mn>10</mn>
                              <mrow>
                                <mo>−</mo>
                                <mn>3</mn>
                              </mrow>
                            </msup>
                          </>
                        ) : (
                          <mn>0</mn>
                        )}
                        <Unit>T</Unit>
                      </>,
                    )}
                  </React.Fragment>
                );
              })}
            </Box>
          </Collapse>
          {labels.along && (
            <Typography
              variant="body2"
              color="text.secondary"
              component="p"
              sx={{ mt: 2 }}
            >
              {labels.along}
            </Typography>
          )}
        </Box>
      </Focus.Provider>
    </Highlight.Provider>
  );
}
