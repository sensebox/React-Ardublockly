import React, { useMemo } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { getTeachableSenseboxTranslations } from "./translations";

/**
 * Simple SVG-based line chart for training metrics visualization
 * With dual y-axis: left for loss, right for accuracy (%)
 */
const TrainingMetricsChart = ({
  metrics,
  width = 400,
  height = 220,
  title,
}) => {
  const theme = useTheme();
  const t = getTeachableSenseboxTranslations();

  // Fixed colors: greens for accuracy, reds for loss
  const colors = {
    accuracy: "#81c784", // lighter green
    val_accuracy: "#2e7d32", // darker green
    loss: "#ef9a9a", // lighter red
    val_loss: "#c62828", // darker red
  };

  const chartData = useMemo(() => {
    if (!metrics || metrics.length === 0) {
      return null;
    }

    // Responsive padding based on viewport
    const isMobile = typeof window !== "undefined" && window.innerWidth < 600;
    const padding = isMobile
      ? { top: 20, right: 40, bottom: 30, left: 40 }
      : { top: 25, right: 50, bottom: 35, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate scales
    const epochs = metrics.map((_, i) => i + 1);
    const maxEpoch = Math.max(...epochs);
    const minEpoch = 1;

    // Separate scales for loss and accuracy
    const lossValues = metrics.flatMap((m) => [m.loss, m.val_loss]);
    const maxLoss = Math.max(...lossValues);
    const minLoss = Math.min(...lossValues, 0);

    // Accuracy is always 0-1, display as 0-100%
    const minAcc = 0;
    const maxAcc = 1;

    // Scale functions
    const xScale = (epoch) =>
      padding.left +
      ((epoch - minEpoch) / (maxEpoch - minEpoch || 1)) * chartWidth;

    // Left Y-axis: Loss
    const yScaleLoss = (value) =>
      padding.top +
      (1 - (value - minLoss) / (maxLoss - minLoss || 1)) * chartHeight;

    // Right Y-axis: Accuracy
    const yScaleAcc = (value) =>
      padding.top +
      (1 - (value - minAcc) / (maxAcc - minAcc || 1)) * chartHeight;

    // Generate path data
    const createPath = (data, accessor, yScale) => {
      const points = data.map((d, i) => ({
        x: xScale(i + 1),
        y: yScale(accessor(d)),
      }));
      if (points.length === 0) return "";
      return points
        .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
        .join(" ");
    };

    return {
      padding,
      chartWidth,
      chartHeight,
      xScale,
      yScaleLoss,
      yScaleAcc,
      maxLoss,
      minLoss,
      maxEpoch,
      paths: {
        accuracy: createPath(metrics, (m) => m.accuracy, yScaleAcc),
        val_accuracy: createPath(metrics, (m) => m.val_accuracy, yScaleAcc),
        loss: createPath(metrics, (m) => m.loss, yScaleLoss),
        val_loss: createPath(metrics, (m) => m.val_loss, yScaleLoss),
      },
    };
  }, [metrics, width, height]);

  if (!chartData) {
    return (
      <Box
        sx={{
          width: "100%",
          aspectRatio: `${width} / ${height}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.100",
          borderRadius: 1,
        }}
      >
        <Typography color="text.secondary">No training data yet</Typography>
      </Box>
    );
  }

  const legendItems = [
    {
      key: "accuracy",
      label: t.training.trainingAccuracy,
      color: colors.accuracy,
    },
    {
      key: "val_accuracy",
      label: t.training.validationAccuracy,
      color: colors.val_accuracy,
    },
    { key: "loss", label: t.training.trainingLoss, color: colors.loss },
    {
      key: "val_loss",
      label: t.training.validationLoss,
      color: colors.val_loss,
    },
  ];

  // Responsive font size
  const baseFontSize =
    typeof window !== "undefined" && window.innerWidth < 600 ? 9 : 10;
  const axisLabelSize = baseFontSize + 2;
  const tickLabelSize = baseFontSize;

  return (
    <Box sx={{ width: "100%" }}>
      {title && (
        <Typography
          variant="subtitle1"
          fontWeight="medium"
          sx={{
            mb: 1,
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          {title}
        </Typography>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block", width: "100%", height: "auto" }}
      >
        {/* Background */}
        <rect
          x={chartData.padding.left}
          y={chartData.padding.top}
          width={chartData.chartWidth}
          height={chartData.chartHeight}
          fill={theme.palette.grey[50]}
          stroke={theme.palette.grey[300]}
          strokeWidth={1}
        />

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = chartData.padding.top + ratio * chartData.chartHeight;
          const lossValue =
            chartData.maxLoss - ratio * (chartData.maxLoss - chartData.minLoss);
          const accValue = 100 - ratio * 100; // 100% to 0%
          return (
            <g key={i}>
              <line
                x1={chartData.padding.left}
                y1={y}
                x2={chartData.padding.left + chartData.chartWidth}
                y2={y}
                stroke={theme.palette.grey[200]}
                strokeDasharray="4,4"
              />
              {/* Left Y-axis: Loss (red) */}
              <text
                x={chartData.padding.left - 8}
                y={y}
                textAnchor="end"
                alignmentBaseline="middle"
                fontSize={tickLabelSize}
                fill={colors.val_loss}
              >
                {lossValue.toFixed(2)}
              </text>
              {/* Right Y-axis: Accuracy % (green) */}
              <text
                x={chartData.padding.left + chartData.chartWidth + 8}
                y={y}
                textAnchor="start"
                alignmentBaseline="middle"
                fontSize={tickLabelSize}
                fill={colors.val_accuracy}
              >
                {accValue.toFixed(0)}%
              </text>
            </g>
          );
        })}

        {/* Y-axis labels */}
        <text
          x={10}
          y={chartData.padding.top + chartData.chartHeight / 2}
          textAnchor="middle"
          fontSize={tickLabelSize * 1.2}
          fill={colors.val_loss}
          transform={`rotate(-90, 10, ${chartData.padding.top + chartData.chartHeight / 2})`}
        >
          {t.training.loss}
        </text>
        <text
          x={width - 10}
          y={chartData.padding.top + chartData.chartHeight / 2}
          textAnchor="middle"
          fontSize={tickLabelSize * 1.2}
          fill={colors.val_accuracy}
          transform={`rotate(90, ${width - 10}, ${chartData.padding.top + chartData.chartHeight / 2})`}
        >
          {t.training.accuracy}
        </text>

        {/* X-axis labels */}
        {metrics.length <= 20
          ? metrics.map((_, i) => (
              <text
                key={i}
                x={chartData.xScale(i + 1)}
                y={chartData.padding.top + chartData.chartHeight + 20}
                textAnchor="middle"
                fontSize={tickLabelSize}
                fill={theme.palette.text.secondary}
              >
                {i + 1}
              </text>
            ))
          : [0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const epoch = Math.round(1 + ratio * (chartData.maxEpoch - 1));
              return (
                <text
                  key={i}
                  x={chartData.xScale(epoch)}
                  y={chartData.padding.top + chartData.chartHeight + 20}
                  textAnchor="middle"
                  fontSize={tickLabelSize}
                  fill={theme.palette.text.secondary}
                >
                  {epoch}
                </text>
              );
            })}

        {/* X-axis label */}
        <text
          x={chartData.padding.left + chartData.chartWidth / 2}
          y={height - 5}
          textAnchor="middle"
          fontSize={axisLabelSize}
          fill={theme.palette.text.primary}
        >
          {t.training.epoch}
        </text>

        {/* Lines */}
        {Object.entries(chartData.paths).map(([key, path]) => (
          <path
            key={key}
            d={path}
            fill="none"
            stroke={colors[key]}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Data points for last epoch */}
        {metrics.length > 0 && (
          <>
            {legendItems.map(({ key, color }) => {
              const lastMetric = metrics[metrics.length - 1];
              const isAccuracy = key === "accuracy" || key === "val_accuracy";
              const value =
                key === "accuracy"
                  ? lastMetric.accuracy
                  : key === "val_accuracy"
                    ? lastMetric.val_accuracy
                    : key === "loss"
                      ? lastMetric.loss
                      : lastMetric.val_loss;
              const yScale = isAccuracy
                ? chartData.yScaleAcc
                : chartData.yScaleLoss;
              return (
                <circle
                  key={key}
                  cx={chartData.xScale(metrics.length)}
                  cy={yScale(value)}
                  r={4}
                  fill={color}
                />
              );
            })}
          </>
        )}
      </svg>

      {/* Legend */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 1, sm: 1.5 },
          mt: { xs: 1.5, sm: 1 },
          justifyContent: "center",
        }}
      >
        {legendItems.map(({ key, label, color }) => (
          <Box
            key={key}
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Box
              sx={{
                width: { xs: 14, sm: 16 },
                height: 3,
                bgcolor: color,
                borderRadius: 1,
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.65rem", sm: "0.75rem" },
              }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TrainingMetricsChart;
