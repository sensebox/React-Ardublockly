import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  ListSubheader,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import ControlsHelp from "./ControlsHelp.jsx";
import { ORIENTATION_CHOICES } from "./MagnetControls.jsx";
import {
  angleToAxis,
  clampDistance,
  clampOrientations,
  normalizeDirection,
  NV_AXES,
} from "./model.js";

// A small 3D scene drawn as SVG with an orthographic camera. World axes match
// model.js: x from the sensor to the magnet's start position, y up, z towards
// the viewer. One world unit is SCALE · zoom viewBox pixels.
const VIEW_WIDTH = 600,
  VIEW_HEIGHT = 360,
  SCALE = 36,
  // Magnet centre distance from the sensor at distance 0 and 1.
  NEAR = 2.3,
  FAR = 4.4,
  MAGNET_HALF = 0.7,
  MAGNET_THICKNESS = 0.3,
  BOARD = [1, 0.08, 1],
  BOARD_Y = -0.45,
  FLOOR_Y = BOARD_Y - BOARD[1],
  DIAMOND = [0.28, 0.36],
  AXIS_LENGTH = 0.5,
  STEP = 0.05,
  MOVE_STEP = 0.25, // world units per Up/Down key press
  ANGLE_STEP = 5,
  ORBIT_SPEED = 0.4, // degrees per viewBox pixel
  MIN_ZOOM = 0.6,
  MAX_ZOOM = 4,
  ZOOM_STEP = 1.25,
  WHEEL_SPEED = 0.0015,
  // pan: offset of the sensor from the view centre, in viewBox pixels.
  // Zoomed in and shifted left so sensor and magnet fill the scene.
  DEFAULT_VIEW = { yaw: -25, pitch: 22, zoom: 1.6, pan: [-60, 0] },
  // 2D: fixed, straight down onto the table plane (x right, z down).
  TOP_VIEW = { yaw: 0, pitch: 90, zoom: 1, pan: [0, 0] },
  // The sensor's oblique sketch in the top view.
  SENSOR_VIEW_2D = { yaw: -30, pitch: 40 },
  // Corners of the board's top face; in the 2D sketch the one facing the
  // magnet (rightmost) sits on the x axis, where the line from the magnet ends.
  BOARD_CORNERS = [-1, 1].flatMap((x) =>
    [-1, 1].map((z) => [x * BOARD[0], BOARD_Y + BOARD[1], z * BOARD[2]]),
  ),
  // The top view is a strip: the sensor at the left edge, the magnet on its
  // right within ±Y_MAX of the x axis, and its far end at the right edge, so
  // the track grows with the scene's width.
  Y_MAX = 2.6,
  MARGIN_2D = 0.35,
  HALF_2D = (Y_MAX + MAGNET_HALF + MARGIN_2D) * SCALE, // viewBox units
  // The sensor sketch (SENSOR_VIEW_2D) reaches about 1.45 units left of its centre.
  LEFT_2D = (1.45 + MARGIN_2D) * SCALE;

// Zooms by factor while the viewBox point [x, y] stays in place.
const zoomAround = (view, [x, y], factor) => {
  const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.zoom * factor));
  const k = zoom / view.zoom;
  const [cx, cy] = [x - VIEW_WIDTH / 2, y - VIEW_HEIGHT / 2];
  return {
    ...view,
    zoom,
    pan: [cx - (cx - view.pan[0]) * k, cy - (cy - view.pan[1]) * k],
  };
};

// One diamond per NV orientation: a single one at the sensor's centre, or the
// ensemble at the corners of a tetrahedron. Each ensemble diamond sits along
// its own NV axis, seen from the tetrahedron's centre, so the four axes point
// outwards like the bonds in the diamond lattice. The field is evaluated at the
// sensor's centre for all of them.
const ENSEMBLE_CENTRE = [0, 0.32, 0],
  ENSEMBLE_RADIUS = 0.6,
  ENSEMBLE_DIAMOND = [0.21, 0.27],
  ENSEMBLE_AXIS_LENGTH = 0.38;
// Axis handles on the magnet: dragging one moves the magnet along that axis
// only. The top view has the screen axes (y up on screen = −z in the world),
// the 3D view the world axes.
const HANDLES_2D = [
    { name: "x", axis: [1, 0, 0], colour: "#1565c0" },
    { name: "y", axis: [0, 0, -1], colour: "#6a1b9a" },
  ],
  HANDLES_3D = [
    { name: "x", axis: [1, 0, 0], colour: "#1565c0" },
    { name: "y", axis: [0, 1, 0], colour: "#6a1b9a" },
    { name: "z", axis: [0, 0, 1], colour: "#00897b" },
  ],
  HANDLE_LENGTH = MAGNET_HALF + 0.55,
  FREE_HANDLE = 8; // radius in viewBox units of the knob where the arrows cross

// Moves p0 by t along the unit axis, keeping the magnet between near and far
// on that line. Inside near it jumps to the closer side of the sensor.
function alongLine(p0, axis, t, near, far) {
  const b = dot(p0, axis),
    c = dot(p0, p0);
  const outer = Math.sqrt(Math.max(0, b * b - c + far * far));
  let s = clamp(t, -b - outer, -b + outer);
  const inner = b * b - c + near * near;
  if (inner > 0) {
    const r = Math.sqrt(inner);
    if (s > -b - r && s < -b + r) s = s < -b ? -b - r : -b + r;
  }
  return add(p0, scale(axis, s));
}

const AXIS_COLOURS = ["#ef6c00", "#5e35b1", "#0097a7", "#c0ca33"];
const COLOURS = {
  board: "#1f6f4a",
  diamond: "#f4b6c2",
  diamondEdge: "#c2185b",
  north: "#d32f2f",
  south: "#2e7d32",
  edge: "#333333",
};

const add = (a, b) => a.map((v, i) => v + b[i]);
const scale = (a, k) => a.map((v) => v * k);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const unit = (a) => scale(a, 1 / Math.hypot(...a));

const ENSEMBLE_SPOTS = NV_AXES.map((axis) =>
  add(ENSEMBLE_CENTRE, scale(axis, ENSEMBLE_RADIUS)),
);
const radians = (degrees) => (degrees * Math.PI) / 180;
const degrees = (rad) => (rad * 180) / Math.PI;
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

// Screen axes of a camera turned by yaw around y and tilted down by pitch.
function camera({ yaw, pitch }) {
  const [cy, sy] = [Math.cos(radians(yaw)), Math.sin(radians(yaw))];
  const [cp, sp] = [Math.cos(radians(pitch)), Math.sin(radians(pitch))];
  return {
    right: [cy, 0, -sy],
    up: [-sp * sy, cp, -sp * cy],
    toward: [sy * cp, sp, cy * cp],
  };
}

// Azimuth around y (from x towards −z) and elevation, both in degrees.
const toSpherical = ([x, y, z]) => ({
  azimuth: degrees(Math.atan2(-z, x)),
  elevation: degrees(Math.asin(clamp(y, -1, 1))),
});
const fromSpherical = (azimuth, elevation) => [
  Math.cos(radians(elevation)) * Math.cos(radians(azimuth)),
  Math.sin(radians(elevation)),
  -Math.cos(radians(elevation)) * Math.sin(radians(azimuth)),
];
// Keeps pointer events coming during a drag. Synthetic events (tests) have
// no active pointer, which makes the browser throw.
const capture = (element, pointerId) => {
  try {
    element.setPointerCapture(pointerId);
  } catch {
    // Dragging still works while the pointer stays over the scene.
  }
};
const snap = (value) => Math.round(value / ANGLE_STEP) * ANGLE_STEP;

// Two axes perpendicular to `axis`, the first kept horizontal where possible.
function perpendicular(axis) {
  const helper = Math.abs(axis[1]) < 0.95 ? [0, 1, 0] : [1, 0, 0];
  const first = unit(cross(helper, axis));
  return [first, cross(axis, first)];
}

// Faces of a box: centre, three unit axes, three half sizes.
function boxFaces(centre, axes, halves) {
  return axes.flatMap((axis, i) =>
    [-1, 1].map((sign) => {
      const [j, k] = [(i + 1) % 3, (i + 2) % 3];
      const middle = add(centre, scale(axis, sign * halves[i]));
      const a = scale(axes[j], halves[j]),
        b = scale(axes[k], halves[k]);
      return {
        normal: scale(axis, sign),
        points: [
          add(add(middle, a), b),
          add(add(middle, a), scale(b, -1)),
          add(add(middle, scale(a, -1)), scale(b, -1)),
          add(add(middle, scale(a, -1)), b),
        ],
      };
    }),
  );
}

// Faces of an octahedron (cut gem): half width r, half height h.
function gemFaces(centre, [r, h]) {
  const faces = [];
  for (const sx of [-1, 1])
    for (const sy of [-1, 1])
      for (const sz of [-1, 1])
        faces.push({
          normal: unit([sx / r, sy / h, sz / r]),
          points: [
            add(centre, [sx * r, 0, 0]),
            add(centre, [0, sy * h, 0]),
            add(centre, [0, 0, sz * r]),
          ],
        });
  return faces;
}

// Darkens a #rrggbb colour by factor (1 = unchanged).
function shade(hex, factor) {
  const value = parseInt(hex.slice(1), 16);
  const channel = (shift) => Math.round(((value >> shift) & 255) * factor);
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
}

// Dipole field lines r = L · sin²θ in four planes through the magnet axis,
// split at the equator so the arrow sits in the middle of each loop.
const LOOPS = [1.1, 1.8, 2.6];
const SAMPLES = 16;
function fieldLinePaths(centre, axis, sides) {
  const point = (length, theta, side) =>
    add(
      centre,
      add(
        scale(axis, length * Math.sin(theta) ** 2 * Math.cos(theta)),
        scale(side, length * Math.sin(theta) ** 3),
      ),
    );
  const halves = [];
  for (const side of [
    sides[0],
    sides[1],
    scale(sides[0], -1),
    scale(sides[1], -1),
  ])
    for (const length of LOOPS) {
      const start = Math.asin(Math.sqrt((0.9 * MAGNET_HALF) / length));
      const half = (from, to) =>
        Array.from({ length: SAMPLES + 1 }, (_, i) =>
          point(length, from + ((to - from) * i) / SAMPLES, side),
        );
      halves.push({
        points: half(start, Math.PI / 2),
        arrow: true,
      });
      halves.push({ points: half(Math.PI / 2, Math.PI - start) });
    }
  // Straight lines along the axis: out of the north pole through the sensor,
  // and into the south pole from behind.
  const north = add(centre, scale(axis, MAGNET_HALF));
  const south = add(centre, scale(axis, -MAGNET_HALF));
  halves.push({
    points: [north, add(north, scale(axis, Math.hypot(...centre) + 0.6))],
    arrow: true,
  });
  halves.push({
    points: [add(south, scale(axis, -1.4)), south],
    arrow: true,
  });
  return halves;
}

// Sensor with its diamonds at the origin, and a bar magnet that can be dragged
// anywhere around it within NEAR…FAR; in the top view only to its right, up to
// the scene's right edge. The magnet always faces the sensor with its north pole, so its position alone sets the field direction.
// distance: 0 = magnet at the sensor, 1 = far away. direction: where the magnet
// sits, seen from the sensor (3D vector). onChange(distance, direction).
// orientations: number of NV centres (diamonds) to draw.
// threeD: false shows a fixed top view of the table plane (x–z) where only the
// magnet can be moved; the caller keeps the magnet in that plane
// (flattenDirection in model.js).
// height: CSS height of the scene (both views); the viewBox follows its width.
// controls: optional node shown at the top left (e.g. view switches).
// onOrientationsChange: if given, clicking the sensor (or Enter on it) opens a
// menu to choose a single NV centre or the ensemble.
// labels: {scene, sensor, magnet, distance, angle, alongAxis, moveFreely, zoomIn, zoomOut,
// resetView, sensorMenu: {title, open, choices: [single, ensemble]},
// help: {show, …ControlsHelp labels}}
export default function MagnetScene({
  distance,
  direction = [1, 0, 0],
  onChange,
  labels,
  orientations = 1,
  showFieldLines = false,
  threeD = true,
  height = 360,
  controls = null,
  onOrientationsChange = null,
}) {
  const theme = useTheme();
  const svg = useRef(null),
    gesture = useRef(null),
    // Pointers down on the background, for two-finger pinch and pan.
    touches = useRef(new Map()),
    // A press on the sensor: opens the NV menu on release unless it dragged.
    sensorPress = useRef(null);
  const [sensorMenu, setSensorMenu] = useState(null);
  const sensorProps = onOrientationsChange
    ? { "data-sensor": true, style: { cursor: "pointer" } }
    : {};
  const [view, setView] = useState(DEFAULT_VIEW);
  // Switching to 3D starts from the default view again.
  useEffect(() => {
    if (threeD) setView(DEFAULT_VIEW);
  }, [threeD]);
  // Pointer position in the scene while the magnet is dragged, for the angle tip.
  const frame = useRef(null);
  const [tip, setTip] = useState(null);
  // The controls help under the scene is shown until it is closed.
  const [helpOpen, setHelpOpen] = useState(true);
  // Width / height of the scene, for the top view's strip.
  const [aspect, setAspect] = useState(2);
  const showTip = (event, axisName = null) => {
    const rect = frame.current.getBoundingClientRect();
    setTip({
      axis: axisName,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      width: rect.width,
    });
  };
  const shown = threeD ? view : TOP_VIEW;
  const size = SCALE * shown.zoom;
  const { right, up, toward } = camera(shown);
  const towards = normalizeDirection(direction);
  // Axis handles with their direction on screen (viewBox pixels per world
  // unit); axes pointing at the viewer can't be dragged and are left out.
  const handles = (threeD ? HANDLES_3D : HANDLES_2D)
    .map((handle) => {
      const screen = [
        dot(handle.axis, right) * size,
        -dot(handle.axis, up) * size,
      ];
      const length = Math.hypot(...screen);
      return {
        ...handle,
        screen,
        unit: [screen[0] / length, screen[1] / length],
        length,
      };
    })
    .filter(({ length }) => length > 0.3 * size);
  // Top view: the viewBox follows the scene's aspect ratio, and the track
  // reaches from the sensor to the right edge.
  const width2D = 2 * HALF_2D * aspect;
  const far = threeD
    ? FAR
    : Math.max(NEAR + 1, (width2D - LEFT_2D) / SCALE - MAGNET_HALF - MARGIN_2D);
  const radius = NEAR + clampDistance(distance) * (far - NEAR);
  const centre = scale(towards, radius);
  // Magnet axis from its south to its north pole, pointing at the sensor.
  const axis = scale(towards, -1);
  const sides = perpendicular(axis);
  const angle = angleToAxis(towards);
  const count = clampOrientations(orientations);

  // Projection helpers for one camera.
  // shift: screen offset in viewBox units, for the 2D sensor sketch.
  const projector = (cam, shift = [0, 0]) => {
    const project = (p) => [
      VIEW_WIDTH / 2 + shown.pan[0] + shift[0] + size * dot(p, cam.right),
      VIEW_HEIGHT / 2 + shown.pan[1] + shift[1] - size * dot(p, cam.up),
    ];
    const pointList = (points) =>
      points.map((p) => project(p).join(",")).join(" ");
    const pathOf = (points) =>
      points
        .map((p, i) => `${i ? "L" : "M"} ${project(p).join(" ")}`)
        .join(" ");
    // Headlight from the upper left of the viewer.
    const light = unit(
      add(add(cam.toward, scale(cam.up, 0.6)), scale(cam.right, -0.3)),
    );
    const faces = (list, colour, stroke, key) =>
      list
        .filter(({ normal }) => dot(normal, cam.toward) > 1e-6)
        .map(({ normal, points }, i) => (
          <polygon
            key={`${key}-${i}`}
            points={pointList(points)}
            fill={shade(colour, 0.55 + 0.45 * Math.max(0, dot(normal, light)))}
            stroke={stroke}
            strokeWidth="0.75"
            strokeLinejoin="round"
          />
        ));
    return {
      project,
      pointList,
      pathOf,
      faces,
      depth: (p) => dot(p, cam.toward),
    };
  };
  const { project, pointList, pathOf, faces } = projector({
    right,
    up,
    toward,
  });
  // The top view looks straight down an edge of the ensemble's tetrahedron, so
  // there the sensor is drawn as a small oblique sketch; the magnet stays in
  // the top view.
  // The sketch is shifted up or down so the board corner facing the magnet
  // lies on the x axis: the line from the magnet runs straight into it.
  const sketch = camera(SENSOR_VIEW_2D);
  const corner = BOARD_CORNERS.reduce((best, c) =>
    dot(c, sketch.right) > dot(best, sketch.right) ? c : best,
  );
  const sensorView = threeD
    ? projector({ right, up, toward })
    : projector(sketch, [0, size * dot(corner, sketch.up)]);

  // Scene objects, painted back to front.
  const objects = [];
  objects.push({
    depth: sensorView.depth([0, BOARD_Y, 0]),
    node: (
      <g
        key="board"
        id="magnetometer-sensor"
        {...sensorProps}
        {...(onOrientationsChange && {
          tabIndex: 0,
          role: "button",
          "aria-haspopup": "menu",
          "aria-label": labels.sensorMenu.open,
          onKeyDown: (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            setSensorMenu(event.currentTarget);
          },
        })}
      >
        <title>
          {onOrientationsChange ? labels.sensorMenu.open : labels.sensor}
        </title>
        {sensorView.faces(
          boxFaces(
            [0, BOARD_Y, 0],
            [
              [1, 0, 0],
              [0, 1, 0],
              [0, 0, 1],
            ],
            BOARD,
          ),
          COLOURS.board,
          shade(COLOURS.board, 0.6),
          "board",
        )}
      </g>
    ),
  });
  const single = count === 1;
  const spots = single ? [[0, 0, 0]] : ENSEMBLE_SPOTS.slice(0, count);
  // Edges of the tetrahedron, behind the diamonds at its corners.
  if (!single)
    objects.push({
      depth: Math.min(...spots.map(sensorView.depth)) - 1e-3,
      node: (
        <g
          key="tetrahedron"
          {...sensorProps}
          id="magnetometer-tetrahedron"
          stroke={COLOURS.diamondEdge}
          strokeWidth="1.25"
          strokeLinejoin="round"
        >
          {/* Lightly filled faces make the solid readable. */}
          {spots.map((_, skip) => (
            <polygon
              key={`face-${skip}`}
              points={sensorView.pointList(spots.filter((__, i) => i !== skip))}
              fill={COLOURS.diamond}
              fillOpacity="0.12"
              stroke="none"
            />
          ))}
          {spots.flatMap((a, i) =>
            spots
              .slice(i + 1)
              .map((b, j) => (
                <path
                  key={`${i}-${j}`}
                  d={sensorView.pathOf([a, b])}
                  fill="none"
                  opacity="0.75"
                />
              )),
          )}
        </g>
      ),
    });
  NV_AXES.slice(0, count).forEach((nv, i) => {
    const spot = spots[i];
    const length = single ? AXIS_LENGTH : ENSEMBLE_AXIS_LENGTH;
    // The axis glows with the field component along it.
    const strength = Math.abs(dot(nv, towards));
    objects.push({
      depth: sensorView.depth(spot),
      node: (
        <g key={`diamond-${i}`} data-diamond={i + 1} {...sensorProps}>
          {sensorView.faces(
            gemFaces(spot, single ? DIAMOND : ENSEMBLE_DIAMOND),
            COLOURS.diamond,
            COLOURS.diamondEdge,
            `diamond-${i}`,
          )}
          <path
            d={sensorView.pathOf([
              add(spot, scale(nv, -length)),
              add(spot, scale(nv, length)),
            ])}
            stroke={AXIS_COLOURS[i]}
            strokeWidth={1.5 + 1.5 * strength}
            strokeLinecap="round"
            opacity={0.35 + 0.65 * strength}
          />
        </g>
      ),
    });
  });
  // The magnet: north half towards the sensor, south half away from it.
  const halves = [
    { sign: 1, colour: COLOURS.north, letter: "N" },
    { sign: -1, colour: COLOURS.south, letter: "S" },
  ]
    .map((half) => ({
      ...half,
      middle: add(centre, scale(axis, (half.sign * MAGNET_HALF) / 2)),
    }))
    .sort((a, b) => dot(a.middle, toward) - dot(b.middle, toward));
  const [cx, cy] = project(centre);
  objects.push({
    // The top view mixes two cameras; the magnet never overlaps the sensor there.
    depth: threeD ? dot(centre, toward) : Infinity,
    node: (
      <g
        key="magnet"
        id="magnetometer-magnet"
        className="nodrag nopan"
        role="slider"
        tabIndex={0}
        aria-label={labels.magnet}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(distance * 100)}
        aria-valuetext={`${Math.round(distance * 100)} %, ${angle}°`}
        data-angle={angle}
        data-direction={towards.map((v) => v.toFixed(2)).join(",")}
        onPointerDown={(event) => {
          // Other buttons pan the view, like on the background.
          if (event.button !== 0) return;
          event.stopPropagation();
          gesture.current = {
            type: "magnet",
            start: toSvg(event),
            position: centre,
          };
          capture(svg.current, event.pointerId);
          showTip(event);
        }}
        onKeyDown={keyDown}
        style={{ cursor: "grab", outline: "none", touchAction: "none" }}
      >
        <circle
          className="focus-ring"
          cx={cx}
          cy={cy}
          r={(MAGNET_HALF + 0.25) * size}
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth="2"
          strokeDasharray="4 3"
        />
        {halves.map(({ middle, colour, letter }) => {
          const [x, y] = project(middle);
          return (
            <g key={letter}>
              {faces(
                boxFaces(
                  middle,
                  [axis, ...sides],
                  [MAGNET_HALF / 2, MAGNET_THICKNESS, MAGNET_THICKNESS],
                ),
                colour,
                COLOURS.edge,
                letter,
              )}
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#fff"
                pointerEvents="none"
              >
                {letter}
              </text>
            </g>
          );
        })}
        <g className="axis-handles">
          {handles.map(({ name, axis: handleAxis, colour, screen }) => {
            const d = pathOf([
              add(centre, scale(handleAxis, -HANDLE_LENGTH)),
              add(centre, scale(handleAxis, HANDLE_LENGTH)),
            ]);
            const [tx, ty] = project(
              add(centre, scale(handleAxis, HANDLE_LENGTH + 0.25)),
            );
            const active = tip?.axis === name;
            return (
              <g
                key={name}
                id={`magnetometer-axis-${name}`}
                data-axis={name}
                style={{
                  cursor:
                    screen[0] ** 2 > screen[1] ** 2 ? "ew-resize" : "ns-resize",
                }}
                onPointerDown={(event) => {
                  if (event.button !== 0) return;
                  event.stopPropagation();
                  gesture.current = {
                    type: "axis",
                    axis: handleAxis,
                    name,
                    start: toSvg(event),
                    position: centre,
                  };
                  capture(svg.current, event.pointerId);
                  showTip(event, name);
                }}
              >
                <title>{`${labels.alongAxis} ${name}`}</title>
                <path
                  d={d}
                  stroke="transparent"
                  strokeWidth="14"
                  pointerEvents="stroke"
                />
                <path
                  d={d}
                  stroke={colour}
                  strokeWidth={active ? 3 : 2}
                  markerStart={`url(#magnetometer-handle-${name})`}
                  markerEnd={`url(#magnetometer-handle-${name})`}
                  pointerEvents="none"
                />
                <text
                  x={tx}
                  y={ty + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill={colour}
                  pointerEvents="none"
                >
                  {name}
                </text>
              </g>
            );
          })}
          {/* Where the arrows cross: a knob for moving freely in both
              directions. It has no handler of its own, so the press reaches
              the magnet's free drag instead of an axis. */}
          <circle
            id="magnetometer-free-handle"
            cx={cx}
            cy={cy}
            r={FREE_HANDLE}
            fill="#fff"
            stroke={theme.palette.text.primary}
            strokeWidth="1.5"
            style={{ cursor: "move" }}
          >
            <title>{labels.moveFreely}</title>
          </circle>
        </g>
      </g>
    ),
  });
  objects.sort((a, b) => a.depth - b.depth);

  // Floor grid and the magnet's shadow give depth cues while orbiting.
  // The top view spans the whole, wider scene.
  const reach = threeD ? 4 : 40;
  const grid = [];
  for (let i = -reach; i <= reach; i++) {
    grid.push(
      pathOf([
        [i, FLOOR_Y, -reach],
        [i, FLOOR_Y, reach],
      ]),
    );
    grid.push(
      pathOf([
        [-reach, FLOOR_Y, i],
        [reach, FLOOR_Y, i],
      ]),
    );
  }
  const foot = [centre[0], FLOOR_Y, centre[2]];
  const shadow = Array.from({ length: 24 }, (_, i) => {
    const t = (i / 24) * 2 * Math.PI;
    return add(foot, [0.45 * Math.cos(t), 0, 0.45 * Math.sin(t)]);
  });
  const lineColour =
    theme.palette.senseboxColors?.blue ?? theme.palette.info.main;

  function toSvg(event) {
    const point = svg.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const { x, y } = point.matrixTransform(
      svg.current.getScreenCTM().inverse(),
    );
    return [x, y];
  }
  // Keeps a top-view position right of the sensor, within ±Y_MAX and between
  // NEAR and far. mirror flips a position left of the sensor to the right
  // instead of pushing it onto the y axis.
  const fitTop = ([x, , z], mirror = false) => {
    let p = [mirror ? Math.abs(x) : Math.max(0, x), 0, clamp(z, -Y_MAX, Y_MAX)];
    const length = Math.hypot(...p);
    if (length > far) p = scale(p, far / length);
    else if (length < NEAR)
      p = length > 1e-6 ? scale(p, NEAR / length) : [NEAR, 0, 0];
    return p;
  };
  const place = (raw) => {
    const position = threeD ? raw : fitTop(raw);
    const length = Math.hypot(...position);
    const next = length > 1e-6 ? scale(position, 1 / length) : towards;
    onChange(clampDistance((length - NEAR) / (far - NEAR)), next);
  };
  // The magnet moves in the screen plane through its position; the sensor
  // keeps it between NEAR and FAR. Dragging the background turns the view,
  // with Shift or the right mouse button it pans; two fingers pinch and pan.
  const pinch = () => {
    const [a, b] = [...touches.current.values()];
    return {
      gap: Math.hypot(a[0] - b[0], a[1] - b[1]),
      middle: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
    };
  };
  const press = (event) => {
    const sensor = event.target.closest?.("[data-sensor]");
    sensorPress.current = sensor
      ? { start: [event.clientX, event.clientY], moved: false }
      : null;
    // The 2D view is fixed: only the magnet moves.
    if (!threeD) return;
    const point = toSvg(event);
    touches.current.set(event.pointerId, point);
    capture(event.currentTarget, event.pointerId);
    if (touches.current.size === 2) {
      gesture.current = { type: "pinch", ...pinch(), view };
      return;
    }
    gesture.current = {
      type: event.shiftKey || event.button !== 0 ? "pan" : "orbit",
      start: point,
      view,
    };
  };
  const move = (event) => {
    const current = gesture.current;
    if (!current) return;
    const [x, y] = toSvg(event);
    if (touches.current.has(event.pointerId))
      touches.current.set(event.pointerId, [x, y]);
    if (current.type === "pinch") {
      if (touches.current.size < 2) return;
      const { gap, middle } = pinch();
      const zoomed = zoomAround(
        current.view,
        current.middle,
        gap / Math.max(current.gap, 1),
      );
      setView({
        ...zoomed,
        pan: [
          zoomed.pan[0] + middle[0] - current.middle[0],
          zoomed.pan[1] + middle[1] - current.middle[1],
        ],
      });
      return;
    }
    const [dx, dy] = [x - current.start[0], y - current.start[1]];
    // Shift while dragging the magnet locks it to the axis closest to the
    // drag direction.
    const locked =
      current.type === "axis"
        ? handles.find((handle) => handle.name === current.name)
        : current.type === "magnet" && event.shiftKey && Math.hypot(dx, dy) > 2
          ? handles.reduce((best, handle) =>
              Math.abs(dx * handle.unit[0] + dy * handle.unit[1]) >
              Math.abs(dx * best.unit[0] + dy * best.unit[1])
                ? handle
                : best,
            )
          : null;
    if (locked) {
      showTip(event, locked.name);
      const [sx, sy] = locked.screen;
      const t = (dx * sx + dy * sy) / (sx * sx + sy * sy);
      place(alongLine(current.position, locked.axis, t, NEAR, far));
    } else if (current.type === "axis") {
      // The axis points at the viewer after orbiting: nothing to drag.
    } else if (current.type === "magnet") {
      showTip(event);
      place(
        add(
          current.position,
          add(scale(right, dx / size), scale(up, -dy / size)),
        ),
      );
    } else if (current.type === "pan")
      setView({
        ...current.view,
        pan: [current.view.pan[0] + dx, current.view.pan[1] + dy],
      });
    else
      setView({
        ...current.view,
        yaw: current.view.yaw - dx * ORBIT_SPEED,
        pitch: clamp(current.view.pitch + dy * ORBIT_SPEED, -85, 85),
      });
  };
  const release = (event) => {
    const pressed = sensorPress.current;
    sensorPress.current = null;
    if (
      pressed &&
      Math.hypot(
        event.clientX - pressed.start[0],
        event.clientY - pressed.start[1],
      ) < 5
    )
      setSensorMenu(svg.current.querySelector("#magnetometer-sensor"));
    touches.current.delete(event.pointerId);
    gesture.current = null;
    setTip(null);
  };
  const zoomBy = (factor) =>
    setView((old) =>
      zoomAround(old, [VIEW_WIDTH / 2, VIEW_HEIGHT / 2], factor),
    );
  // React registers wheel listeners as passive; this one must stop the page
  // from scrolling while it zooms towards the pointer.
  useEffect(() => {
    if (!threeD) return undefined;
    const element = svg.current;
    const wheel = (event) => {
      event.preventDefault();
      const point = element.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const { x, y } = point.matrixTransform(element.getScreenCTM().inverse());
      const factor = Math.exp(-event.deltaY * WHEEL_SPEED);
      setView((old) => zoomAround(old, [x, y], factor));
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [threeD]);
  // Left/Right change the distance, Up/Down slide the magnet up or down,
  // Shift + arrows move it around the sensor, + and − zoom (3D only).
  function keyDown(event) {
    const zoomKeys = { "+": ZOOM_STEP, "=": ZOOM_STEP, "-": 1 / ZOOM_STEP };
    if (threeD && event.key in zoomKeys) {
      event.preventDefault();
      zoomBy(zoomKeys[event.key]);
      return;
    }
    let nextDistance = distance,
      nextDirection = towards;
    if (event.shiftKey && !threeD) {
      // 2D: turn around the sensor in the table plane, clockwise on screen
      // with Right/Down.
      const turn = {
        ArrowRight: ANGLE_STEP,
        ArrowDown: ANGLE_STEP,
        ArrowLeft: -ANGLE_STEP,
        ArrowUp: -ANGLE_STEP,
      }[event.key];
      if (!turn) return;
      const angle = snap(degrees(Math.atan2(towards[2], towards[0]))) + turn;
      nextDirection = [Math.cos(radians(angle)), 0, Math.sin(radians(angle))];
    } else if (event.shiftKey) {
      const { azimuth, elevation } = toSpherical(towards);
      const turn = {
        ArrowRight: [ANGLE_STEP, 0],
        ArrowLeft: [-ANGLE_STEP, 0],
        ArrowUp: [0, ANGLE_STEP],
        ArrowDown: [0, -ANGLE_STEP],
      }[event.key];
      if (!turn) return;
      nextDirection = fromSpherical(
        snap(azimuth) + turn[0],
        clamp(snap(elevation) + turn[1], -90, 90),
      );
    } else {
      // Up/Down slide the magnet up or down (the y arrow's axis).
      const slide = { ArrowUp: MOVE_STEP, ArrowDown: -MOVE_STEP }[event.key];
      if (slide) {
        event.preventDefault();
        const yAxis = threeD ? [0, 1, 0] : [0, 0, -1];
        place(alongLine(centre, yAxis, slide, NEAR, far));
        return;
      }
      const keys = {
        ArrowLeft: distance - STEP,
        ArrowRight: distance + STEP,
        Home: 0,
        End: 1,
      };
      if (!(event.key in keys)) return;
      nextDistance = clampDistance(keys[event.key]);
    }
    event.preventDefault();
    if (threeD) onChange(nextDistance, nextDirection);
    else
      place(
        scale(
          normalizeDirection(nextDirection),
          NEAR + nextDistance * (far - NEAR),
        ),
      );
  }
  // The top view only shows the strip right of the sensor: a magnet outside it
  // (after switching views or resizing) moves into it.
  useEffect(() => {
    if (threeD) return;
    const fitted = fitTop(centre, true);
    if (Math.hypot(...add(fitted, scale(centre, -1))) > 1e-6) place(fitted);
  });
  // The top view's track depends on the scene's aspect ratio.
  useEffect(() => {
    const element = svg.current;
    if (typeof ResizeObserver === "undefined" || !element) return undefined;
    const observer = new ResizeObserver(() => {
      const { width, height } = element.getBoundingClientRect();
      if (width > 0 && height > 0) setAspect(width / height);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Box>
      <Box
        ref={frame}
        id="magnetometer-scene"
        sx={{
          position: "relative",
          bgcolor: "background.grey",
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        <Box
          component="svg"
          ref={svg}
          className="nodrag nopan"
          role="group"
          aria-label={labels.scene}
          viewBox={
            threeD
              ? `${(VIEW_WIDTH - VIEW_HEIGHT * aspect) / 2} 0 ${VIEW_HEIGHT * aspect} ${VIEW_HEIGHT}`
              : `${VIEW_WIDTH / 2 - LEFT_2D} ${VIEW_HEIGHT / 2 - HALF_2D} ${width2D} ${2 * HALF_2D}`
          }
          data-zoom={shown.zoom.toFixed(2)}
          data-view={threeD ? "3d" : "2d"}
          onPointerDown={press}
          onContextMenu={(event) => event.preventDefault()}
          onPointerMove={move}
          onPointerUp={release}
          onPointerCancel={release}
          sx={{
            display: "block",
            width: "100%",
            height,
            ...(threeD && {
              cursor: "grab",
              "&:active": { cursor: "grabbing" },
              touchAction: "none",
            }),
            "& .focus-ring": { display: "none" },
            // Axis handles stay faint until the magnet is hovered or focused.
            "& .axis-handles": { opacity: 0.45, transition: "opacity 0.15s" },
            "& #magnetometer-magnet:hover .axis-handles, & #magnetometer-magnet:focus-visible .axis-handles":
              { opacity: 1 },
            "& #magnetometer-magnet:focus-visible .focus-ring": {
              display: "inline",
            },
          }}
        >
          <defs>
            <marker
              id="magnetometer-fieldlines-arrow"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={lineColour} />
            </marker>
            {[...HANDLES_3D, ...HANDLES_2D].map(({ name, colour }) => (
              <marker
                key={name}
                id={`magnetometer-handle-${name}`}
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={colour} />
              </marker>
            ))}
          </defs>
          <g
            aria-hidden="true"
            stroke={theme.palette.text.secondary}
            strokeWidth="0.75"
            opacity="0.25"
          >
            {grid.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <g aria-hidden="true" stroke={theme.palette.text.secondary}>
            {threeD && (
              <>
                <polygon
                  points={pointList(shadow)}
                  fill={theme.palette.text.secondary}
                  stroke="none"
                  opacity="0.2"
                />
                <path
                  d={pathOf([centre, foot])}
                  strokeDasharray="3 3"
                  opacity="0.6"
                />
              </>
            )}
            <path
              // 2D: from the magnet to the board corner facing it.
              d={
                threeD
                  ? pathOf([[0, 0, 0], centre])
                  : `M ${sensorView.project(corner).join(" ")} L ${project(centre).join(" ")}`
              }
              strokeDasharray="5 4"
              opacity="0.6"
            />
          </g>
          {showFieldLines && (
            <g
              id="magnetometer-fieldlines"
              aria-hidden="true"
              fill="none"
              stroke={lineColour}
              strokeWidth="1.25"
              opacity="0.6"
              pointerEvents="none"
            >
              {fieldLinePaths(centre, axis, sides).map(
                ({ points, arrow }, i) => (
                  <path
                    key={i}
                    d={pathOf(points)}
                    markerEnd={
                      arrow ? "url(#magnetometer-fieldlines-arrow)" : undefined
                    }
                  />
                ),
              )}
            </g>
          )}
          {objects.map(({ node }) => node)}
        </Box>
        {threeD && (
          <Stack
            direction="row"
            className="nodrag nopan"
            sx={{
              position: "absolute",
              top: 6,
              right: 6,
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            {[
              [
                "zoom-in",
                labels.zoomIn,
                faMagnifyingGlassPlus,
                () => zoomBy(ZOOM_STEP),
              ],
              [
                "zoom-out",
                labels.zoomOut,
                faMagnifyingGlassMinus,
                () => zoomBy(1 / ZOOM_STEP),
              ],
              [
                "reset-view",
                labels.resetView,
                faRotateLeft,
                () => setView(DEFAULT_VIEW),
              ],
            ].map(([id, label, icon, action]) => (
              <IconButton
                key={id}
                size="small"
                id={`magnetometer-${id}`}
                aria-label={label}
                title={label}
                onClick={action}
              >
                <FontAwesomeIcon icon={icon} fontSize="0.85em" />
              </IconButton>
            ))}
          </Stack>
        )}
        {onOrientationsChange && (
          <Menu
            id="magnetometer-sensor-menu"
            anchorEl={sensorMenu}
            open={Boolean(sensorMenu)}
            onClose={() => setSensorMenu(null)}
            MenuListProps={{ dense: true }}
          >
            <ListSubheader sx={{ lineHeight: 2.5 }}>
              {labels.sensorMenu.title}
            </ListSubheader>
            {ORIENTATION_CHOICES.map((choice, i) => (
              <MenuItem
                key={choice}
                id={`magnetometer-sensor-orientations-${choice}`}
                selected={count === choice}
                onClick={() => {
                  onOrientationsChange(choice);
                  setSensorMenu(null);
                }}
              >
                {labels.sensorMenu.choices[i]}
              </MenuItem>
            ))}
          </Menu>
        )}
        {controls && (
          <Box
            className="nodrag nopan"
            sx={{
              position: "absolute",
              top: 6,
              left: 6,
              px: 1,
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            {controls}
          </Box>
        )}
        <IconButton
          size="small"
          id="magnetometer-hint"
          className="nodrag nopan"
          aria-label={labels.help.show}
          aria-pressed={helpOpen}
          aria-controls="magnetometer-help"
          title={labels.help.show}
          onClick={() => setHelpOpen((open) => !open)}
          color={helpOpen ? "primary" : "default"}
          sx={{ position: "absolute", left: 4, bottom: 4 }}
        >
          <FontAwesomeIcon icon={faCircleInfo} fontSize="0.9em" />
        </IconButton>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ position: "absolute", right: 8, bottom: 4 }}
        >
          {labels.distance} {Math.round(distance * 100)} % · {labels.angle}{" "}
          {angle}°
        </Typography>
        {tip && (
          <Box
            id="magnetometer-angle-tip"
            aria-hidden="true"
            data-axis={tip.axis ?? undefined}
            sx={{
              position: "absolute",
              // Beside the pointer, flipped to its left near the right edge.
              left: tip.x > tip.width - 70 ? tip.x - 56 : tip.x + 16,
              top: Math.max(4, tip.y - 30),
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
              bgcolor: "grey.800",
              color: "common.white",
              fontSize: 12,
              fontVariantNumeric: "tabular-nums",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            {tip.axis && `${tip.axis} · `}
            {angle}°
          </Box>
        )}
      </Box>
      {helpOpen && (
        <ControlsHelp
          threeD={threeD}
          labels={labels.help}
          onClose={() => setHelpOpen(false)}
        />
      )}
    </Box>
  );
}
