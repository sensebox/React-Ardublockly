import React, { createContext, useContext } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { CENTER, fieldFromPair, GAMMA } from "./model.js";

// Typeset with MathML, which current browsers render natively (no library).

// Values read from the plot (f₁, f₂, Δf) are highlighted in the senseBox
// green, like the plot's dip markers, so students see where each number comes
// from. Without a plot to read from there is no highlight (null).
const Highlight = createContext(null);
export const readoutColour = (theme) =>
  theme.palette.senseboxColors?.green ?? theme.palette.success.main;

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
const Read = ({ children }) => {
  const colour = useContext(Highlight);
  return <mrow style={colour ? { color: colour } : undefined}>{children}</mrow>;
};
// f with an index, read from the plot.
const F = ({ index }) => (
  <Read>
    <Sub symbol="f" index={index} />
  </Read>
);
// Δf of one pair (index for ensembles), read from the plot.
const DeltaF = ({ index }) => (
  <Read>
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
// from it are coloured; labels: {title, intro, readout, splitting, given,
// approach, solve, insert, result, centre, gamma, noSplit, along, decimal}
export default function FieldCalculation({ pairs, labels, highlight = false }) {
  const theme = useTheme();
  const colour = highlight ? readoutColour(theme) : null;
  const number = (value, digits) =>
    value.toFixed(digits).replace(".", labels.decimal ?? ".");
  const Num = ({ value, digits }) => <mn>{number(value, digits)}</mn>;
  const ReadNum = ({ value }) => (
    <Read>
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
      <Box
        id="magnetometer-field-calculation"
        sx={{
          overflowX: "auto",
          "& math": {
            fontFamily:
              '"Latin Modern Math", "STIX Two Math", "Cambria Math", math',
            fontSize: "1.15rem",
          },
        }}
      >
        <Typography variant="h6" component="h3">
          {labels.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {pairs.length ? labels.intro : labels.noSplit}
        </Typography>
        {colour && (
          <Typography
            variant="body2"
            id="magnetometer-readout-legend"
            sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}
          >
            <Box
              component="span"
              sx={{
                width: 12,
                height: 12,
                borderRadius: "2px",
                bgcolor: colour,
                flexShrink: 0,
              }}
            />
            {labels.readout}
          </Typography>
        )}

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
        {rows.map((row) => (
          <React.Fragment key={`given-${row.lowIndex}`}>
            {line(
              <Formula>
                <F index={row.lowIndex} />
                <Op>=</Op>
                <ReadNum value={row.low} />
                <mo separator="true">,</mo>
                <mspace width="0.8em" />
                <F index={row.highIndex} />
                <Op>=</Op>
                <ReadNum value={row.high} />
              </Formula>,
            )}
            {line(
              <Formula>
                <DeltaF index={row.field} />
                <Op>=</Op>
                {difference(row)}
                <Op>=</Op>
                <ReadNum value={Number((row.high - row.low).toFixed(3))} />
              </Formula>,
              row === rows[0] ? labels.splitting : null,
            )}
          </React.Fragment>
        ))}

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
          const millitesla = fieldFromPair(row.low * 1000, row.high * 1000);
          return (
            <React.Fragment key={row.lowIndex}>
              {step(labels.insert)}
              <Formula>
                <Sub symbol="B" index={row.field} />
                <Op>=</Op>
                <mfrac>
                  <mrow>
                    <ReadNum value={row.high} />
                    <Op>−</Op>
                    <ReadNum value={row.low} />
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
                  <ReadNum value={delta} />
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
              {step(labels.result)}
              <Box
                data-highlight={colour ? "on" : "off"}
                data-low={row.low.toFixed(3)}
                data-high={row.high.toFixed(3)}
                data-field={millitesla.toFixed(2)}
                sx={{
                  display: "inline-block",
                  px: 2,
                  py: 0.5,
                  border: 2,
                  borderColor: "primary.main",
                  borderRadius: 1,
                }}
              >
                <Formula>
                  <Sub symbol="B" index={row.field} />
                  <Op>=</Op>
                  <Num value={millitesla} digits={2} />
                  <Unit>mT</Unit>
                </Formula>
              </Box>
            </React.Fragment>
          );
        })}
        <Typography
          variant="body2"
          color="text.secondary"
          component="p"
          sx={{ mt: 2 }}
        >
          {labels.along}
        </Typography>
      </Box>
    </Highlight.Provider>
  );
}
