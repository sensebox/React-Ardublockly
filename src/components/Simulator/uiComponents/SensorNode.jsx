import React, { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const SensorNode = ({ title, sensors, imageSrc, width = "300px" }) => {
  // Initial values for all sensors
  const initialValues = sensors.reduce((acc, sensor) => {
    acc[sensor.id] = sensor.initial !== undefined ? sensor.initial : sensor.min;
    return acc;
  }, {});

  const [values, setValues] = useState(initialValues);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (id) => (e) => {
    setValues({ ...values, [id]: Number(e.target.value) });
  };

  return (
    <div
      style={{
        position: "relative",
        width,
        background: "#1b7d1066",
        borderRadius: "10px",
        overflow: "hidden",
        fontSize: "1.2rem",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        transform: isHovered ? "scale(1.03)" : "scale(1)",
        boxShadow: isHovered ? "0 8px 15px rgba(0, 0, 0, 0.3)" : "none",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setShowOverlay(!showOverlay)}
    >
      {/* Title */}
      <span
        style={{
          textAlign: "center",
          display: "block",
          padding: "15px",
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        {title}
      </span>

      {/* Image that opens the overlay when clicked */}
      <img
        src={imageSrc}
        alt="Sensor Graphic"
        style={{
          width: "100%",
          display: "block",
          pointerEvents: "none",
        }}
      />

      {/* Overlay with the sliders */}
      {showOverlay && (
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            padding: "15px",
            background: "#1b7d10b3", // Transparent background
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "15px",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#ffcc33",
              fontSize: "1.5rem",
              userSelect: "none",
              zIndex: 2,
            }}
            onClick={() => setShowOverlay(false)}
          >
            <FontAwesomeIcon icon={faClose} />
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
                    id={sensor.id + "-slider"}
                    min={sensor.min}
                    max={sensor.max}
                    step={sensor.step ?? 1}
                    value={values[sensor.id]}
                    onChange={handleChange(sensor.id)}
                    style={{
                      width: "100%",
                      accentColor: "#00cccc",
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
