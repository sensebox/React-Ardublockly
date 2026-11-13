import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  lighten,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { LightboxComponent } from "./hooks/useLightbox";
import { getImageTranslations } from "./translations";

/**
 * Confusion Matrix visualization component.
 * Rendered as a table: axis titles and class names are header cells, each
 * matrix cell shows the test images of that actual/classified class pair.
 * Images are framed green (correct) or red (incorrect).
 *
 * @param {Array} sampleMatrix - sampleMatrix[actual][classified] = [{id, url}]
 * @param {Array} classNames - class names in matrix order
 *
 * Clicking a cell opens an expanded view of that cell; clicking an image opens
 * a viewer that only steps through the images of that cell.
 */
const ConfusionMatrix = ({ sampleMatrix, classNames }) => {
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const language = useSelector((s) => s.general.language);
  const t = getImageTranslations(language);

  // Expanded view of a single cell: { row, col }
  const [expandedCell, setExpandedCell] = useState(null);
  // Image viewer scoped to a single cell: { row, col, index }
  const [viewer, setViewer] = useState(null);

  const viewerUrls = viewer
    ? (sampleMatrix?.[viewer.row]?.[viewer.col] || []).map((s) => s.url)
    : [];

  const closeViewer = useCallback(() => setViewer(null), []);
  const stepViewer = useCallback(
    (step) =>
      setViewer((v) => {
        if (!v) return v;
        const count = sampleMatrix?.[v.row]?.[v.col]?.length || 1;
        return { ...v, index: (v.index + step + count) % count };
      }),
    [sampleMatrix],
  );
  const showPrev = useCallback(() => stepViewer(-1), [stepViewer]);
  const showNext = useCallback(() => stepViewer(1), [stepViewer]);

  useEffect(() => {
    if (!viewer) return undefined;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewer, showPrev, showNext]);

  // Close dialogs when the results change (e.g. re-test)
  useEffect(() => {
    setViewer(null);
    setExpandedCell(null);
  }, [sampleMatrix]);

  if (!sampleMatrix || sampleMatrix.length === 0) return null;

  const numClasses = sampleMatrix.length;
  const names = classNames.slice(0, numClasses);

  // Opaque colours, since the grid lines are the container showing through
  const lineColor = theme.palette.grey[400];
  const axisBg = theme.palette.grey[300];
  const headerBg = theme.palette.grey[200];
  const correctBg = lighten(theme.palette.success.main, 0.88);
  const incorrectBg = lighten(theme.palette.warning.main, 0.88);

  const headerCellSx = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    p: 1,
  };
  const labelSx = {
    fontWeight: 600,
    fontSize: { xs: "0.875rem", sm: "1rem" },
    lineHeight: 1.2,
    wordBreak: "break-word",
  };
  const axisSx = {
    fontWeight: 700,
    fontSize: { xs: "0.9rem", sm: "1.05rem" },
  };
  const verticalSx = {
    writingMode: "vertical-rl",
    transform: "rotate(180deg)",
  };

  const cellTitle = (row, col) =>
    `${t.training.actual}: ${names[row]} · ${t.training.predicted}: ${names[col]}`;
  const cellDescription = (row, col) =>
    (row === col
      ? t.testing.cellDescriptionCorrect
      : t.testing.cellDescriptionIncorrect
    )
      .replace("{actual}", names[row])
      .replace("{predicted}", names[col]);

  const imageSx = (isCorrect, size) => ({
    width: size,
    height: size,
    objectFit: "cover",
    borderRadius: 1,
    border: "3px solid",
    borderColor: isCorrect ? "success.main" : "error.main",
    cursor: isWideScreen ? "pointer" : "default",
    display: "block",
  });

  const openViewer = (row, col, index) => (e) => {
    e.stopPropagation();
    if (isWideScreen) setViewer({ row, col, index });
  };

  const expandedSamples = expandedCell
    ? sampleMatrix[expandedCell.row]?.[expandedCell.col] || []
    : [];

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: `auto auto repeat(${numClasses}, minmax(0, 1fr))`,
          gap: "1px",
          bgcolor: lineColor,
          border: `1px solid ${lineColor}`,
        }}
      >
        {/* Empty top-left corner */}
        <Box
          sx={{
            gridRow: "1 / span 2",
            gridColumn: "1 / span 2",
            bgcolor: "background.paper",
          }}
        />

        {/* "Classified" axis title */}
        <Box
          sx={{
            ...headerCellSx,
            gridRow: 1,
            gridColumn: `3 / span ${numClasses}`,
            bgcolor: axisBg,
          }}
        >
          <Typography sx={axisSx}>{t.training.predicted}</Typography>
        </Box>

        {/* Column class labels */}
        {names.map((name, i) => (
          <Box
            key={`col-${i}`}
            sx={{
              ...headerCellSx,
              gridRow: 2,
              gridColumn: i + 3,
              bgcolor: headerBg,
            }}
          >
            <Typography sx={labelSx}>{name}</Typography>
          </Box>
        ))}

        {/* "Actual" axis title spanning all rows */}
        <Box
          sx={{
            ...headerCellSx,
            gridRow: `3 / span ${numClasses}`,
            gridColumn: 1,
            bgcolor: axisBg,
          }}
        >
          <Typography sx={{ ...axisSx, ...verticalSx }}>
            {t.training.actual}
          </Typography>
        </Box>

        {sampleMatrix.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {/* Row class label */}
            <Box
              sx={{
                ...headerCellSx,
                gridRow: rowIndex + 3,
                gridColumn: 2,
                bgcolor: headerBg,
              }}
            >
              <Typography sx={{ ...labelSx, ...verticalSx, maxHeight: 260 }}>
                {names[rowIndex]}
              </Typography>
            </Box>

            {row.map((samples, colIndex) => {
              const isCorrect = rowIndex === colIndex;
              return (
                <Box
                  key={`cell-${rowIndex}-${colIndex}`}
                  onClick={
                    isWideScreen
                      ? () => setExpandedCell({ row: rowIndex, col: colIndex })
                      : undefined
                  }
                  sx={{
                    gridRow: rowIndex + 3,
                    gridColumn: colIndex + 3,
                    bgcolor: isCorrect ? correctBg : incorrectBg,
                    cursor: isWideScreen ? "pointer" : "default",
                    "&:hover": isWideScreen
                      ? { boxShadow: `inset 0 0 0 2px ${lineColor}` }
                      : undefined,
                    p: 1,
                    minHeight: 96,
                    maxHeight: 260,
                    overflowY: "auto",
                    display: "flex",
                    flexWrap: "wrap",
                    alignContent: "flex-start",
                    gap: 1,
                  }}
                >
                  {samples.map((sample, index) => (
                    <Box
                      key={sample.id}
                      component="img"
                      src={sample.url}
                      alt={cellTitle(rowIndex, colIndex)}
                      onClick={openViewer(rowIndex, colIndex, index)}
                      sx={imageSx(isCorrect, 60)}
                    />
                  ))}
                </Box>
              );
            })}
          </React.Fragment>
        ))}
      </Box>

      {/* Expanded view of a single cell */}
      <Dialog
        open={Boolean(expandedCell)}
        onClose={() => setExpandedCell(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        {expandedCell && (
          <>
            <DialogTitle
              sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}
            >
              <Typography variant="h6" component="span" sx={{ flex: 1 }}>
                {cellTitle(expandedCell.row, expandedCell.col)}
              </Typography>
              <Chip
                label={`${expandedSamples.length} ${t.training.samples}`}
                size="small"
              />
              <IconButton
                edge="start"
                onClick={() => setExpandedCell(null)}
                size="small"
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {cellDescription(expandedCell.row, expandedCell.col)}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignContent: "flex-start",
                  gap: 1.5,
                  minHeight: 200,
                  maxHeight: 400,
                  overflowY: "auto",
                  p: 1,
                  borderRadius: 1,
                  bgcolor:
                    expandedCell.row === expandedCell.col
                      ? correctBg
                      : incorrectBg,
                }}
              >
                {expandedSamples.length === 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ m: "auto", textAlign: "center" }}
                  >
                    {t.testing.cellEmpty}
                  </Typography>
                )}
                {expandedSamples.map((sample, index) => (
                  <Box
                    key={sample.id}
                    component="img"
                    src={sample.url}
                    alt={cellTitle(expandedCell.row, expandedCell.col)}
                    onClick={openViewer(
                      expandedCell.row,
                      expandedCell.col,
                      index,
                    )}
                    sx={imageSx(expandedCell.row === expandedCell.col, 90)}
                  />
                ))}
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      <LightboxComponent
        open={Boolean(viewer)}
        src={viewer ? viewerUrls[viewer.index] : null}
        flatSamples={viewerUrls}
        onClose={closeViewer}
        onPrev={showPrev}
        onNext={showNext}
        title={viewer ? cellTitle(viewer.row, viewer.col) : undefined}
      />
    </>
  );
};

export default ConfusionMatrix;
