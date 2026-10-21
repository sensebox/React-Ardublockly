import React, { useEffect, useRef } from "react";
import { useTheme } from "@mui/material";
import { lorentzian } from "./fit";
export const COLORS = ["#1976d2", "#ed6c02", "#2e7d32", "#9c27b0"];

export default function Plot({
  data,
  mode,
  settings,
  visible,
  channel,
  peaks,
  labels,
}) {
  const canvas = useRef(null);
  const theme = useTheme();
  useEffect(() => {
    const element = canvas.current;
    function draw() {
      const width = element.clientWidth || 800,
        height = 400,
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
      const now = Date.now() / 1000;
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
        : data.yscale || extent(1, [0, 1.1]);
      const px = (x) => left + ((x - xr[0]) / (xr[1] - xr[0])) * w;
      const py = (y) => top + h - ((y - yr[0]) / (yr[1] - yr[0])) * h;
      ctx.font = "12px sans-serif";
      ctx.fillStyle = theme.palette.text.secondary;
      ctx.strokeStyle = theme.palette.divider;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const x = left + (w * i) / 5,
          y = top + (h * i) / 5;
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x, top + h);
        ctx.moveTo(left, y);
        ctx.lineTo(left + w, y);
        ctx.stroke();
        ctx.textAlign = "center";
        ctx.fillText(
          (xr[0] + ((xr[1] - xr[0]) * i) / 5).toFixed(1),
          x,
          top + h + 22,
        );
        ctx.textAlign = "right";
        ctx.fillText(
          (yr[1] - ((yr[1] - yr[0]) * i) / 5).toPrecision(4),
          left - 8,
          y + 4,
        );
      }
      ctx.textAlign = "center";
      ctx.fillText(
        data.xlabel ||
          (rolling ? labels.time : mode === "xy" ? "x" : labels.frequency),
        left + w / 2,
        height - 10,
      );
      ctx.save();
      ctx.translate(16, top + h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(
        data.ylabel ||
          (waterfall ? labels.newest : mode === "xy" ? "y" : labels.intensity),
        0,
        0,
      );
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.rect(left, top, w, h);
      ctx.clip();
      if (waterfall) {
        const sweeps = data.sweeps.slice(0, settings.history);
        let low = Infinity,
          high = -Infinity;
        sweeps.forEach((s) =>
          s.forEach((p) => {
            low = Math.min(low, p.row[channel * 2 + 1]);
            high = Math.max(high, p.row[channel * 2 + 1]);
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
            const strength = (p.row[channel * 2 + 1] - low) / (high - low || 1);
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
          Number.isFinite(low)
            ? `${low.toPrecision(4)} → ${high.toPrecision(4)}`
            : "",
          left + w,
          15,
        );
      } else {
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
          ctx.strokeStyle = theme.palette.text.primary;
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          for (let i = 0; i <= 500; i++) {
            const x = xr[0] + ((xr[1] - xr[0]) * i) / 500;
            i
              ? ctx.lineTo(px(x), py(lorentzian(x, peaks)))
              : ctx.moveTo(px(x), py(lorentzian(x, peaks)));
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.restore();
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
    const timer = mode === "roll" ? setInterval(draw, 250) : null;
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [data, mode, settings, visible, channel, peaks, labels, theme]);
  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label={`${mode} measurement plot`}
      style={{ width: "100%", height: 400, display: "block" }}
    />
  );
}
