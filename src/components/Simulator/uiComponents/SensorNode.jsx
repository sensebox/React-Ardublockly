import React, { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";

const SensorNode = ({ title, sensors, imageSrc, maxWidth = "300px" }) => {
  // Initialwerte für alle Sensoren festlegen
  const initialValues = sensors.reduce((acc, sensor) => {
    acc[sensor.id] = sensor.initial !== undefined ? sensor.initial : sensor.min;
    return acc;
  }, {});

  const [values, setValues] = useState(initialValues);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleChange = (id) => (e) => {
    setValues({ ...values, [id]: Number(e.target.value) });
  };

  return (
    <div
      style={{
        position: "relative",
        maxWidth,
        background: "#1b7d1066", // Transparenter Hintergrund (#669933)
        borderRadius: "10px",
        overflow: "hidden",
        fontSize: "1.2rem",

      }}
      onClick={() => setShowOverlay(!showOverlay)}

    >
      {/* Titel */}
      <span
        style={{
          textAlign: "center",
          display: "block",
          padding: "15px",
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#333",
        }}
        
      >
        {title}
      </span>
      {/* Bild, das bei Klick das Overlay öffnet */}
      <img
        src={imageSrc}
        alt="Sensor Graphic"
        style={{
          width: "100%",
          display: "block",
          cursor: !showOverlay ? "pointer" : "default",
        }}
        onClick={() => {
          if (!showOverlay) setShowOverlay(true);
        }}
      />
      {/* Overlay mit den Slidern */}
      {showOverlay && (
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            padding: "15px",
            background: "#1b7d10b3", // Transparenter Hintergrund (#669933)
            backdropFilter: "blur(5px)",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Schließen-Button */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#ffcc33", // Farbe für den Schließen-Button
              fontSize: "1.5rem",
              userSelect: "none",
              zIndex: 2,
            }}
            onClick={() => setShowOverlay(false)}
          >
            X
          </div>
          {sensors.map((sensor) => (
            <div
              key={sensor.id}
              style={{
                display: "flex",
                alignItems: "center",
              }}
              className="nodrag"
            >
              <span style={{ fontSize: "2rem", marginRight: "10px" }}>
                {sensor.emoji}
              </span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "6px",
                    color: "#ffcc33",
                  }}
                >
                  {sensor.label}
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="range"
                    id={sensor.id + "-slider" } 
                    min={sensor.min}
                    max={sensor.max}
                    step={sensor.step ?? 1}
                    value={values[sensor.id]}
                    onChange={handleChange(sensor.id)}
                    style={{
                      width: "100%",
                      accentColor: "#00cccc", // Slider-Farbe
                    }}
                  />
                  <span
                    style={{
                      marginLeft: "10px",
                      minWidth: "50px",
                      textAlign: "right",
                      color: "#fff",
                    }}
                  >
                    {values[sensor.id]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Handles (zum Beispiel für Verbindungen in einem Graph-Editor) */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: "1.5rem",
          height: "1.5rem",
          backgroundColor: "#ffcc33",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: "1.5rem",
          height: "1.5rem",
          backgroundColor: "#ffcc33",
        }}
      />
    </div>
  );
};

export default memo(SensorNode);
