import { useState, useCallback, useEffect, useMemo } from "react";
import React from "react";
import { Dialog, IconButton } from "@mui/material";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
} from "@mui/icons-material";

/**
 * Custom hook for lightbox image navigation
 * Manages state and behavior for viewing images from a specific class in fullscreen
 *
 * @param {Array} classes - Array of class objects with samples
 * @param {boolean} isWideScreen - Whether the viewport is wide enough to show lightbox
 * @param {Function} removeSample - Callback to remove a sample from a class
 * @returns {Object} Lightbox state and handlers
 */
function useLightbox(classes, isWideScreen, removeSample) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxClassId, setLightboxClassId] = useState(null);

  // Helper to find class and sample by image URL
  const getClassAndSampleByImageUrl = useCallback(
    (imageUrl) => {
      for (const cls of classes) {
        const sample = cls.samples.find((samp) => samp.url === imageUrl);
        if (sample) {
          return { classId: cls.id, sampleId: sample.id, cls };
        }
      }
      return null;
    },
    [classes],
  );

  // samples for the current class only (for lightbox navigation)
  const currentClassSamples = useMemo(() => {
    if (!lightboxClassId) return [];
    const cls = classes.find((c) => c.id === lightboxClassId);
    return cls ? cls.samples.map((s) => s.url) : [];
  }, [lightboxClassId, classes]);

  const openLightbox = useCallback(
    (src, e) => {
      // Only open lightbox on wide screens
      if (!isWideScreen) return;
      if (e && e.stopPropagation) e.stopPropagation();
      const found = getClassAndSampleByImageUrl(src);
      if (found) {
        setLightboxClassId(found.classId);
        setLightboxOpen(true);
        setLightboxSrc(src);
      }
    },
    [isWideScreen, getClassAndSampleByImageUrl],
  );

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setLightboxSrc(null);
    setLightboxIndex(0);
    setLightboxClassId(null);
  }, []);

  // when opening lightbox set the index based on current src (within the current class)
  useEffect(() => {
    if (lightboxOpen && lightboxSrc) {
      const idx = currentClassSamples.indexOf(lightboxSrc);
      setLightboxIndex(idx >= 0 ? idx : 0);
    }
  }, [lightboxOpen, lightboxSrc, currentClassSamples]);

  // update lightboxSrc when index changes (within current class)
  useEffect(() => {
    if (lightboxOpen) {
      if (currentClassSamples.length === 0) {
        // nothing left, close
        closeLightbox();
        return;
      }
      const idx = Math.max(
        0,
        Math.min(lightboxIndex, currentClassSamples.length - 1),
      );
      setLightboxIndex(idx);
      setLightboxSrc(currentClassSamples[idx]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, currentClassSamples, lightboxOpen]);

  const showPrev = useCallback(() => {
    if (!currentClassSamples || currentClassSamples.length === 0) return;
    setLightboxIndex(
      (prev) =>
        (prev - 1 + currentClassSamples.length) % currentClassSamples.length,
    );
  }, [currentClassSamples]);

  const showNext = useCallback(() => {
    if (!currentClassSamples || currentClassSamples.length === 0) return;
    setLightboxIndex((prev) => (prev + 1) % currentClassSamples.length);
  }, [currentClassSamples]);

  // keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, showPrev, showNext, closeLightbox]);

  const removeCurrentLightboxImage = useCallback(() => {
    if (!lightboxSrc) return;
    const found = getClassAndSampleByImageUrl(lightboxSrc);
    if (!found) return;

    const idx = currentClassSamples.indexOf(lightboxSrc);
    // perform removal
    removeSample(found.classId, found.sampleId);

    // decide what to show next
    if (currentClassSamples.length <= 1) {
      // last image -> close
      closeLightbox();
      return;
    }
    // if deleting last item, show previous one, else keep same index
    const nextIndex = idx >= currentClassSamples.length - 1 ? idx - 1 : idx;
    setLightboxIndex(Math.max(0, nextIndex));
  }, [
    lightboxSrc,
    getClassAndSampleByImageUrl,
    currentClassSamples,
    removeSample,
    closeLightbox,
  ]);

  return {
    lightboxOpen,
    lightboxSrc,
    currentClassSamples,
    openLightbox,
    closeLightbox,
    showPrev,
    showNext,
    removeCurrentLightboxImage,
  };
}

/**
 * Lightbox UI component for displaying images fullscreen
 * Used with useLightbox hook
 */
const LightboxComponent = ({
  open,
  src,
  flatSamples = [],
  onClose,
  onPrev,
  onNext,
  onDelete,
}) => {
  return (
    <Dialog
      open={!!open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.95)",
          boxShadow: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          position: "relative",
        },
      }}
      BackdropProps={{ sx: { backgroundColor: "rgba(0,0,0,0.7)" } }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
        aria-label="close"
        size="large"
      >
        <CloseIcon />
      </IconButton>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onDelete && onDelete();
        }}
        sx={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          bgcolor: "error.main",
          width: 64,
          height: 64,
          zIndex: 1400,
          "&:hover": { bgcolor: "error.dark" },
          boxShadow: 3,
        }}
        aria-label="delete"
        size="large"
      >
        <DeleteIcon sx={{ fontSize: 22 }} />
      </IconButton>

      {src && (
        <>
          {flatSamples.length > 1 && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onPrev && onPrev();
              }}
              sx={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
              }}
              size="large"
              aria-label="previous"
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          <img
            src={src}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "70vw", height: "70vh", objectFit: "contain" }}
          />

          {flatSamples.length > 1 && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onNext && onNext();
              }}
              sx={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
              }}
              size="large"
              aria-label="next"
            >
              <ArrowForwardIcon />
            </IconButton>
          )}
        </>
      )}
    </Dialog>
  );
};

export { LightboxComponent };
export default useLightbox;
