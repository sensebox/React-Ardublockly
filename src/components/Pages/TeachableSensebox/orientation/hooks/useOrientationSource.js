/**
 * useOrientationSource
 *
 * Thin re-export of useAccelerometerSource.
 * The two pages (acceleration, orientation) are never mounted simultaneously
 * (they live on separate routes), so reusing the same singleton service is safe.
 */
export { default } from "../../acceleration/hooks/useAccelerometerSource";
