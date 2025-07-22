import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Sparklines, SparklinesLine } from "react-sparklines";

const GraphViewer = () => {
  const moduleValues = useSelector((state) => state.simulator.moduleValues);
  const isSimlatorRunning = useSelector((state) => state.simulator.isRunning);
  const [history, setHistory] = useState({});

  const ignoredModules = [
    "sensebox_fluoroASM_init",
    "sensebox_fluoroASM_setLED2",
    "senseBox_display",
    "senseBox_hdc1080",
  ];

  useEffect(() => {
    if (!isSimlatorRunning) return;
    setHistory((prev) => {
      const updated = { ...prev };

      for (const key in moduleValues) {
        if (ignoredModules.includes(key)) continue;

        const value = moduleValues[key];
        if (typeof value !== "number") continue;

        const safeKey = key.toLowerCase();
        const prevList = updated[safeKey] || [];

        updated[safeKey] = [...prevList, value]; // max 20 Werte
      }

      return updated;
    });
  }, [moduleValues, isSimlatorRunning]);

  const formatLabel = (key) =>
    key.replace("sensebox_", "").replace("senseBox_", "").replace(/_/g, " ");

  return (
    <div>
      <h2>📈 Live Modul-Daten</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {Object.keys(moduleValues)
          .filter((key) => !ignoredModules.includes(key))
          .map((key) => {
            const safeKey = key.toLowerCase();
            const data = history[safeKey] || [];

            return (
              <div
                key={key}
                style={{
                  background: "#ffffff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  padding: "1rem",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                    color: "#333",
                    fontSize: "1rem",
                  }}
                >
                  {formatLabel(key)}
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    marginBottom: "0.5rem",
                    color: "#666",
                  }}
                >
                  {moduleValues[key]}
                </div>
                <Sparklines data={data} width={180} height={30}>
                  <SparklinesLine
                    color="#00cccc"
                    style={{ strokeWidth: 3, fill: "none" }}
                  />
                </Sparklines>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default GraphViewer;
