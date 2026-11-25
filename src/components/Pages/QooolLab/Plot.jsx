import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { useTheme } from "@mui/material";
import { lorentzian } from "./fit";
export const COLORS = ["#1976d2", "#ed6c02", "#2e7d32", "#9c27b0"];

// axis (optional) relabels the ticks: {xFactor, xDigits, yFactor, yDigits, yRange, xLabel, yLabel}.
// axis.xTickAnchor (data units, e.g. 2870 MHz) puts the x ticks on round steps
// through that value, as many as fit the width; xDigits then follows the step.
// axis.roundYTicks puts the y ticks on round values (1, 2, 2.5 or 5 steps
// after yFactor) instead of five equal divisions of the range.
// axis.colourRange ([low, high], relative to each row's first sample) fixes the
// waterfall colour scale; without it the colours span the data's own range.
// axis.markers ([{name, freq}]) labels dips on axis.markerChannel (default 0),
// in axis.markerColour. axis.spans ([{name, low, high}]) draws a double arrow
// between two marked dips, e.g. the splitting Δf = f₂ − f₁.
// axis.focus ({markers: [names], spans: [names]}) emphasises those markers and
// spans in axis.focusColour (default: the marker colour) with a halo, and
// mutes the others, e.g. while the worked example is hovered.
// pausedAt (ms timestamp) freezes the rolling time window at that moment.
// height: CSS height of the plot (number in px or a CSS length); drawing follows it.
// The ref exposes toPng(), which resolves to a PNG blob on an opaque background.
const Plot = forwardRef(function Plot(
  {
    data,
    mode,
    settings,
    visible,
    channel,
    peaks,
    labels,
    axis,
    pausedAt,
    height: cssHeight = 400,
  },
  ref,
) {
  const canvas = useRef(null);
  const theme = useTheme();
  useImperativeHandle(
    ref,
    () => ({
      toPng: () =>
        new Promise((resolve, reject) => {
          const source = canvas.current;
          const copy = document.createElement("canvas");
          copy.width = source.width;
          copy.height = source.height;
          const ctx = copy.getContext("2d");
          ctx.fillStyle = theme.palette.background.paper;
          ctx.fillRect(0, 0, copy.width, copy.height);
          ctx.drawImage(source, 0, 0);
          copy.toBlob(
            (blob) =>
              blob ? resolve(blob) : reject(new Error("PNG export failed")),
            "image/png",
          );
        }),
    }),
    [theme],
  );
  useEffect(() => {
    const element = canvas.current;
    function draw() {
      const width = element.clientWidth || 800,
        height = element.clientHeight || 400,
        ratio = window.devicePixelRatio || 1;
      element.width = width * ratio;
      element.height = height * ratio;
      const ctx = element.getContext("2d");
      ctx.scale(ratio, ratio);
      const left = 75,
        top = 25,
        w = width - 100,
        h = height - 85;
      const rolling = mode === "roll",
        waterfall = mode === "waterfall";
      const now = (pausedAt ?? Date.now()) / 1000;
      const rows = rolling
        ? data.points.filter((p) => p.time >= now - settings.window)
        : data.points;
      const series = [0, 1, 2, 3].map((ch) =>
        rows.map((p) => [
          rolling ? p.time - now : p.row[ch * 2],
          p.row[ch * 2 + 1] / (rolling ? 1 : data.normalizers[ch]),
        ]),
      );
      const values = series.filter((_, i) => visible[i]).flat();
      const extent = (index, fallback) => {
        if (!values.length) return fallback;
        let min = Infinity,
          max = -Infinity;
        values.forEach((p) => {
          min = Math.min(min, p[index]);
          max = Math.max(max, p[index]);
        });
        const margin = (max - min || Math.abs(min) * 0.01 || 1) * 0.05;
        return [min - margin, max + margin];
      };
      const xr = waterfall
        ? [settings.f1, settings.f2]
        : rolling
          ? [-settings.window, 0]
          : data.xscale || extent(0, [settings.f1, settings.f2]);
      const yr = waterfall
        ? [settings.history, 0]
        : data.yscale || axis?.yRange || extent(1, [0, 1.1]);
      const px = (x) => left + ((x - xr[0]) / (xr[1] - xr[0])) * w;
      const py = (y) => top + h - ((y - yr[0]) / (yr[1] - yr[0])) * h;
      const font = theme.typography.fontFamily;
      ctx.font = `12px ${font}`;
      ctx.fillStyle = theme.palette.text.secondary;
      ctx.strokeStyle = theme.palette.divider;
      ctx.lineWidth = 1;
      const yFactor = axis?.yFactor ?? 1;
      let yTicks = [0, 1, 2, 3, 4, 5].map(
        (i) => yr[1] - ((yr[1] - yr[0]) * i) / 5,
      );
      if (axis?.roundYTicks && !waterfall) {
        const span = Math.abs(yr[1] - yr[0]) * yFactor;
        const magnitude = 10 ** Math.floor(Math.log10(span / 5));
        const step =
          ([1, 2, 2.5, 5, 10]
            .map((s) => s * magnitude)
            .find((s) => span / s <= 6) ?? 10 * magnitude) / yFactor;
        yTicks = [];
        for (
          let tick = Math.floor(Math.max(...yr) / step) * step;
          tick >= Math.min(...yr) - 1e-9;
          tick -= step
        )
          yTicks.push(tick);
      }
      yTicks.forEach((value) => {
        const y = top + h - ((value - yr[0]) / (yr[1] - yr[0])) * h;
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(left + w, y);
        ctx.stroke();
        const tick = value * yFactor;
        ctx.textAlign = "right";
        ctx.fillText(
          axis?.yDigits == null
            ? tick.toPrecision(4)
            : tick.toFixed(axis.yDigits),
          left - 8,
          y + 4,
        );
      });
      const xFactor = axis?.xFactor ?? 1;
      let xTicks = [0, 1, 2, 3, 4, 5].map(
        (i) => xr[0] + ((xr[1] - xr[0]) * i) / 5,
      );
      let xDigits = axis?.xDigits ?? 1;
      const anchor = axis?.xTickAnchor;
      if (anchor != null && !rolling) {
        // Smallest 1-2-5 step that leaves room for each label.
        const span = Math.abs(xr[1] - xr[0]);
        const minGap = (span * 60) / w;
        const magnitude = 10 ** Math.floor(Math.log10(minGap));
        const step = [1, 2, 5, 10]
          .map((s) => s * magnitude)
          .find((s) => s >= minGap);
        const [low, high] = [Math.min(...xr), Math.max(...xr)];
        xTicks = [];
        for (
          let tick = anchor + Math.ceil((low - anchor) / step) * step;
          tick <= high + 1e-9;
          tick += step
        )
          xTicks.push(tick);
        xDigits = Math.max(0, -Math.floor(Math.log10(step * xFactor) + 1e-9));
      }
      xTicks.forEach((value) => {
        const x = left + ((value - xr[0]) / (xr[1] - xr[0])) * w;
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x, top + h);
        ctx.stroke();
        ctx.textAlign = "center";
        ctx.fillText((value * xFactor).toFixed(xDigits), x, top + h + 22);
      });
      ctx.textAlign = "center";
      ctx.fillText(
        data.xlabel ||
          axis?.xLabel ||
          (rolling ? labels.time : mode === "xy" ? "x" : labels.frequency),
        left + w / 2,
        height - 10,
      );
      ctx.save();
      ctx.translate(16, top + h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(
        data.ylabel ||
          axis?.yLabel ||
          (waterfall ? labels.newest : mode === "xy" ? "y" : labels.intensity),
        0,
        0,
      );
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      // A little headroom so a curve at exactly 0 or 1 is not cut in half.
      ctx.rect(left, top - 3, w, h + 6);
      ctx.clip();
      if (waterfall) {
        const sweeps = data.sweeps.slice(0, settings.history);
        // With axis.colourRange each row is read relative to its first sample
        // (like a sweep), so the colours keep the dips' true depths.
        const fixed = axis?.colourRange;
        const value = (sweep, p) =>
          p.row[channel * 2 + 1] /
          (fixed ? sweep[0]?.row[channel * 2 + 1] || 1 : 1);
        let low = Infinity,
          high = -Infinity;
        if (fixed) [low, high] = fixed;
        else
          sweeps.forEach((s) =>
            s.forEach((p) => {
              low = Math.min(low, value(s, p));
              high = Math.max(high, value(s, p));
            }),
          );
        sweeps.forEach((sweep, row) => {
          const sorted = [...sweep].sort(
            (a, b) => a.row[channel * 2] - b.row[channel * 2],
          );
          sorted.forEach((p, i) => {
            const x = p.row[channel * 2],
              previous = sorted[i - 1]?.row[channel * 2],
              next = sorted[i + 1]?.row[channel * 2];
            const a = previous == null ? x : (previous + x) / 2,
              b = next == null ? x : (next + x) / 2;
            const strength = Math.min(
              1,
              Math.max(0, (value(sweep, p) - low) / (high - low || 1)),
            );
            ctx.fillStyle = `hsl(${270 - strength * 215}, 75%, ${25 + strength * 40}%)`;
            ctx.fillRect(
              px(a),
              top + (row * h) / settings.history,
              Math.max(1, px(b) - px(a)),
              h / settings.history + 0.5,
            );
          });
        });
        ctx.restore();
        ctx.fillStyle = theme.palette.text.secondary;
        ctx.textAlign = "right";
        ctx.fillText(
          !Number.isFinite(low)
            ? ""
            : fixed
              ? `${low.toFixed(2)} → ${high.toFixed(2)}`
              : `${low.toPrecision(4)} → ${high.toPrecision(4)}`,
          left + w,
          15,
        );
      } else {
        const markerChannel = axis?.markerChannel ?? 0;
        series.forEach((points, ch) => {
          if (!visible[ch]) return;
          ctx.strokeStyle = COLORS[ch];
          ctx.lineWidth = 2;
          ctx.beginPath();
          points.forEach(([x, y], i) =>
            i ? ctx.lineTo(px(x), py(y)) : ctx.moveTo(px(x), py(y)),
          );
          ctx.stroke();
          if (points.length === 1) {
            ctx.fillStyle = COLORS[ch];
            ctx.fillRect(px(points[0][0]) - 2, py(points[0][1]) - 2, 4, 4);
          }
        });
        if (peaks?.length && rows.length) {
          const fit = (x) => py(lorentzian(x, peaks));
          ctx.strokeStyle = theme.palette.text.primary;
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          for (let i = 0; i <= 500; i++) {
            const x = xr[0] + ((xr[1] - xr[0]) * i) / 500;
            i ? ctx.lineTo(px(x), fit(x)) : ctx.moveTo(px(x), fit(x));
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.restore();
        // Dip markers sit on the nearest sample; the label points away from
        // the centre so it stays clear of the dip's walls.
        const points = series[markerChannel];
        const centre = (xr[0] + xr[1]) / 2;
        // Labels of close dips (a freely turned magnet) step down instead of overlapping.
        const placed = [];
        const markerColour = axis?.markerColour ?? theme.palette.text.primary;
        // With a focus, the focused markers and spans grow, take the focus
        // colour and get a halo; the rest fade.
        const focus = axis?.focus;
        const focusColour = axis?.focusColour ?? markerColour;
        const focused = (kind, name) => !!focus?.[kind]?.includes(name);
        const alphaFor = (kind, name) =>
          !focus || focused(kind, name) ? 1 : 0.15;
        const colourFor = (kind, name) =>
          focused(kind, name) ? focusColour : markerColour;
        // Screen position of the sample nearest to freq, or null off the plot.
        const dip = (freq) => {
          if (freq < xr[0] || freq > xr[1] || !points.length) return null;
          const [x, y] = points.reduce((best, p) =>
            Math.abs(p[0] - freq) < Math.abs(best[0] - freq) ? p : best,
          );
          return [px(x), Math.min(top + h, Math.max(top, py(y)))];
        };
        // Double arrows from dip point to dip point; the tips stop at the
        // marker circles drawn on top.
        if (!rolling && visible[markerChannel])
          (axis?.spans || []).forEach(({ name, low, high }) => {
            const a = dip(low),
              b = dip(high);
            if (!a || !b) return;
            ctx.globalAlpha = alphaFor("spans", name);
            const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
            if (length < 24) return;
            const [ux, uy] = [(b[0] - a[0]) / length, (b[1] - a[1]) / length];
            const tip1 = [a[0] + ux * 5, a[1] + uy * 5],
              tip2 = [b[0] - ux * 5, b[1] - uy * 5];
            const spanColour = colourFor("spans", name);
            if (focused("spans", name)) {
              // Soft wide stroke under the arrow as a halo.
              ctx.strokeStyle = spanColour;
              ctx.globalAlpha = 0.2;
              ctx.lineWidth = 10;
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.moveTo(...tip1);
              ctx.lineTo(...tip2);
              ctx.stroke();
              ctx.lineCap = "butt";
              ctx.globalAlpha = 1;
            }
            ctx.strokeStyle = spanColour;
            ctx.fillStyle = spanColour;
            ctx.lineWidth = focused("spans", name) ? 3 : 1.5;
            ctx.beginPath();
            ctx.moveTo(...tip1);
            ctx.lineTo(...tip2);
            ctx.stroke();
            // Arrowheads pointing outwards at both dips.
            [
              [tip1, -1],
              [tip2, 1],
            ].forEach(([[x, y], dir]) => {
              const [bx, by] = [x - dir * ux * 8, y - dir * uy * 8];
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(bx - uy * 4, by + ux * 4);
              ctx.lineTo(bx + uy * 4, by - ux * 4);
              ctx.closePath();
              ctx.fill();
            });
            ctx.font = `bold 13px ${font}`;
            const width = ctx.measureText(name).width;
            const cx = (a[0] + b[0]) / 2,
              y = (a[1] + b[1]) / 2 - 8;
            ctx.fillStyle = theme.palette.background.paper;
            ctx.fillRect(cx - width / 2 - 3, y - 13, width + 6, 16);
            ctx.fillStyle = spanColour;
            ctx.textAlign = "center";
            ctx.fillText(name, cx, y);
            ctx.font = `12px ${font}`;
            placed.push({ x: cx - width / 2, y, width });
          });
        if (!rolling && visible[markerChannel] && points.length)
          (axis?.markers || []).forEach(({ name, freq }) => {
            const position = dip(freq);
            if (!position) return;
            const [mx, my] = position;
            const big = focused("markers", name);
            const dotColour = colourFor("markers", name);
            if (big) {
              // Halo around the focused dip.
              ctx.globalAlpha = 0.22;
              ctx.fillStyle = dotColour;
              ctx.beginPath();
              ctx.arc(mx, my, 13, 0, 2 * Math.PI);
              ctx.fill();
            }
            ctx.globalAlpha = alphaFor("markers", name);
            ctx.fillStyle = big ? dotColour : theme.palette.background.paper;
            ctx.strokeStyle = dotColour;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(mx, my, big ? 6 : 4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            const leftSide = freq < (axis?.markerCentre ?? centre);
            ctx.font = `bold 13px ${font}`;
            const labelWidth = ctx.measureText(name).width;
            const lx = leftSide ? mx - 8 - labelWidth : mx + 8;
            let ly = my + 4;
            while (
              placed.some(
                (p) =>
                  lx < p.x + p.width + 2 &&
                  p.x < lx + labelWidth + 2 &&
                  Math.abs(p.y - ly) < 15,
              )
            )
              ly += 15;
            placed.push({ x: lx, y: ly, width: labelWidth });
            ctx.textAlign = "left";
            ctx.fillStyle = dotColour;
            ctx.fillText(name, lx, ly);
            ctx.font = `12px ${font}`;
          });
        ctx.globalAlpha = 1;
      }
      if (!rows.length && !data.sweeps.length) {
        ctx.fillStyle = theme.palette.text.secondary;
        ctx.textAlign = "center";
        ctx.fillText(labels.empty, left + w / 2, top + h / 2);
      }
    }
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(element);
    const timer =
      mode === "roll" && pausedAt == null ? setInterval(draw, 250) : null;
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [
    data,
    mode,
    settings,
    visible,
    channel,
    peaks,
    labels,
    axis,
    theme,
    pausedAt,
  ]);
  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label={`${mode} measurement plot`}
      style={{ width: "100%", height: cssHeight, display: "block" }}
    />
  );
});

export default Plot;
