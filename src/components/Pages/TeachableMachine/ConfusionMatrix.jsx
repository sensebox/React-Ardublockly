import React, { useMemo, useRef, useState, useEffect } from "react";
import { Box, Typography, useTheme, Tooltip } from "@mui/material";
import { getTeachableMachineTranslations } from "./translations";

/**
 * Confusion Matrix visualization component
 * Shows the performance of the classification model
 */
const ConfusionMatrix = ({ matrix, classNames, title }) => {
  const theme = useTheme();
  const t = getTeachableMachineTranslations();
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure container width
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = useMemo(() => {
    if (!matrix || matrix.length === 0) return null;

    // Calculate totals and accuracy per class
    // Use matrix dimensions as the source of truth (handles case where classes changed after training)
    const numClasses = matrix.length;

    // Only use class names that match the matrix dimensions
    const validClassNames = classNames.slice(0, numClasses);

    const classStats = validClassNames.map((name, i) => {
      const truePositives = matrix[i][i];
      const rowSum = matrix[i].reduce((a, b) => a + b, 0);
      const colSum = matrix.reduce((sum, row) => sum + row[i], 0);
      const precision = colSum > 0 ? truePositives / colSum : 0;
      const recall = rowSum > 0 ? truePositives / rowSum : 0;
      const f1 =
        precision + recall > 0
          ? (2 * precision * recall) / (precision + recall)
          : 0;
      return { name, precision, recall, f1, truePositives, rowSum, colSum };
    });

    // Overall accuracy
    const totalCorrect = matrix.reduce((sum, row, i) => sum + row[i], 0);
    const totalSamples = matrix.reduce(
      (sum, row) => sum + row.reduce((a, b) => a + b, 0),
      0,
    );
    const accuracy = totalSamples > 0 ? totalCorrect / totalSamples : 0;

    // Find max value for color scaling
    const maxValue = Math.max(...matrix.flat());

    return {
      classStats,
      accuracy,
      totalCorrect,
      totalSamples,
      maxValue,
      numClasses,
      validClassNames,
    };
  }, [matrix, classNames]);

  if (!stats) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.100",
          borderRadius: 1,
        }}
      >
        <Typography color="text.secondary">
          {t.training.noConfusionMatrixData}
        </Typography>
      </Box>
    );
  }

  const getCellColor = (value, isCorrect) => {
    const intensity = stats.maxValue > 0 ? value / stats.maxValue : 0;
    if (isCorrect) {
      // Green for correct predictions
      return `rgba(76, 175, 80, ${0.2 + intensity * 0.6})`;
    } else if (value > 0) {
      // Red for incorrect predictions
      return `rgba(244, 67, 54, ${0.1 + intensity * 0.4})`;
    }
    return theme.palette.grey[50];
  };

  // Calculate cell size based on available width
  // Reserve space for labels (14px for "Actual" + 28px for row labels + 42px margin)
  const reservedSpace = 14 + 28 + 42;
  const availableWidth =
    containerWidth > 0 ? containerWidth - reservedSpace : 400;
  const maxCellSize = 80; // Maximum cell size for readability
  const minCellSize = 30; // Minimum cell size
  const cellSize = Math.min(
    maxCellSize,
    Math.max(minCellSize, availableWidth / stats.numClasses),
  );

  return (
    <Box ref={containerRef} sx={{ width: "100%" }}>
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

      {/* Matrix Grid */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ display: "inline-flex", flexDirection: "column" }}>
          {/* Header row with predicted labels */}
          <Box sx={{ display: "flex", ml: "42px", mb: 0.5 }}>
            <Typography
              variant="caption"
              fontWeight="medium"
              sx={{
                width: cellSize * stats.numClasses,
                textAlign: "center",
                fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
              }}
            >
              {t.training.predicted}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", ml: "42px" }}>
            {stats.validClassNames.map((name, i) => (
              <Tooltip key={i} title={name}>
                <Box
                  sx={{
                    width: cellSize,
                    textAlign: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: "0.55rem", sm: "0.6rem", md: "0.65rem" },
                    }}
                  >
                    {name.length > 6 ? `${name.slice(0, 5)}..` : name}
                  </Typography>
                </Box>
              </Tooltip>
            ))}
          </Box>

          {/* Matrix rows */}
          <Box sx={{ display: "flex", gap: 0 }}>
            {/* Actual label column header */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: 14,
              }}
            >
              <Typography
                variant="caption"
                fontWeight="medium"
                sx={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  height: cellSize * stats.numClasses,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                }}
              >
                {t.training.actual}
              </Typography>
            </Box>

            {/* Row labels and matrix cells */}
            <Box>
              {matrix.map((row, rowIndex) => (
                <Box key={rowIndex} sx={{ display: "flex" }}>
                  <Tooltip title={stats.validClassNames[rowIndex]}>
                    <Box
                      sx={{
                        width: 28,
                        height: cellSize,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: {
                            xs: "0.5rem",
                            sm: "0.52rem",
                            md: "0.55rem",
                          },
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                          textAlign: "center",
                          lineHeight: 1.1,
                          maxHeight: cellSize - 2,
                          maxWidth: 24,
                          overflow: "hidden",
                          wordBreak: "break-all",
                        }}
                      >
                        {stats.validClassNames[rowIndex]}
                      </Typography>
                    </Box>
                  </Tooltip>
                  {row.map((value, colIndex) => {
                    const isCorrect = rowIndex === colIndex;
                    return (
                      <Tooltip
                        key={colIndex}
                        title={`${t.training.tooltipActual}: ${stats.validClassNames[rowIndex]}, ${t.training.tooltipPredicted}: ${stats.validClassNames[colIndex]}, ${t.training.tooltipCount}: ${value}`}
                      >
                        <Box
                          sx={{
                            width: cellSize,
                            height: cellSize,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: getCellColor(value, isCorrect),
                            border: `1px solid ${theme.palette.grey[300]}`,
                            fontWeight: isCorrect ? "bold" : "normal",
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={isCorrect ? "bold" : "normal"}
                            sx={{
                              fontSize: {
                                xs: "0.65rem",
                                sm: "0.7rem",
                                md: "0.75rem",
                              },
                            }}
                          >
                            {value}
                          </Typography>
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfusionMatrix;
