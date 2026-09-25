import React from "react";
import PropTypes from "prop-types";
import "./wizardAnimations.css";

/**
 * Small spinner with a centred icon, used while a step is working (e.g.
 * compiling). The icon gently pulses inside a rotating ring.
 */
export function Spinner({ icon }) {
  return (
    <div className="cau-spinner">
      <span className="cau-spinner__ring" />
      <span className="cau-spinner__icon">{icon}</span>
    </div>
  );
}

Spinner.propTypes = {
  icon: PropTypes.node,
};

/**
 * Checkmark that draws itself in (circle first, then the tick), signalling that
 * a step finished successfully.
 */
export function AnimatedCheck({ size = 72, color = "#4EAF47" }) {
  return (
    <svg
      className="cau-check"
      width={size}
      height={size}
      viewBox="0 0 52 52"
      aria-hidden="true"
    >
      <circle
        className="cau-check__circle"
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke={color}
        strokeWidth="3"
      />
      <path
        className="cau-check__mark"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 27 l8 8 l16 -18"
      />
    </svg>
  );
}

AnimatedCheck.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

/**
 * Cross that draws itself in, signalling that a step failed.
 */
export function AnimatedCross({ size = 72, color = "#e53935" }) {
  return (
    <svg
      className="cau-cross"
      width={size}
      height={size}
      viewBox="0 0 52 52"
      aria-hidden="true"
    >
      <circle
        className="cau-cross__circle"
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke={color}
        strokeWidth="3"
      />
      <path
        className="cau-cross__line"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        d="M18 18 L34 34"
      />
      <path
        className="cau-cross__line cau-cross__line--second"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        d="M34 18 L18 34"
      />
    </svg>
  );
}

AnimatedCross.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

/**
 * Slim, rounded progress bar with a soft shimmer. Used while flashing.
 */
export function CuteProgress({ value }) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="cau-progress">
      <div className="cau-progress__track">
        <div className="cau-progress__fill" style={{ width: `${clamped}%` }} />
      </div>
      <div className="cau-progress__value">{clamped}%</div>
    </div>
  );
}

CuteProgress.propTypes = {
  value: PropTypes.number,
};

/**
 * Expandable accordion to show detailed error messages or logs.
 * Useful for debugging – click the header to reveal the full log.
 */
export function DetailAccordion({ title, content, isError = false }) {
  const [open, setOpen] = React.useState(false);

  if (!content || !content.trim()) return null;

  return (
    <div className="cau-accordion">
      <button
        type="button"
        className="cau-accordion__header"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={`${open ? "Hide" : "Show"} ${title}`}
      >
        <span>{title}</span>
        <span
          className={`cau-accordion__icon ${
            open ? "cau-accordion__icon--open" : ""
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      <div
        className={`cau-accordion__content ${
          open ? "cau-accordion__content--open" : ""
        }`}
      >
        <div
          className={`cau-accordion__body ${
            isError ? "cau-accordion__body--error" : "cau-accordion__body--log"
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

DetailAccordion.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  isError: PropTypes.bool,
};
