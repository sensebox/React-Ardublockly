import { Label } from "@mui/icons-material";
import { Box, Button, Input } from "@mui/material";
import { ScatterChart, SparkLineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Sparklines, SparklinesLine } from "react-sparklines";

const GraphViewer = () => {
  const moduleValues = useSelector((state) => state.simulator.moduleValues);
  const isSimlatorRunning = useSelector((state) => state.simulator.isRunning);
  const [limitNumbers, setLimitNumbers] = useState(0);
  const [limitNumberSet, setLimitNumberSet] = useState(0);
  const [history, setHistory] = useState({});

  const ignoredModules = [
    "sensebox_fluoroASM_init",
    "sensebox_fluoroASM_setLED2",
    "senseBox_display",
    "senseBox_hdc1080",
  ];

  useEffect(() => {
    let intervalId;
    if (isSimlatorRunning) {
      intervalId = setInterval(() => {
        setHistory((prev) => {
          const updated = { ...prev };
          for (const key in moduleValues) {
            if (ignoredModules.includes(key)) continue;
            const value = moduleValues[key];
            if (typeof value !== "number") continue;
            const safeKey = key.toLowerCase();
            const prevList = updated[safeKey] || [];
            updated[safeKey] = [...prevList, value];
          }
          return updated;
        });
      }, 100);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSimlatorRunning, moduleValues]);

  const formatLabel = (key) =>
    key.replace("sensebox_", "").replace("senseBox_", "").replace(/_/g, " ");

  return (
    <div>
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
            if (limitNumberSet > 0) {
              data.splice(0, data.length - limitNumberSet);
            }
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
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Label
                    htmlFor={`limit-input-${key}`}
                    style={{ fontSize: "0.95rem", color: "#555" }}
                  >
                    Set history limit:
                  </Label>
                  <Input
                    id={`limit-input-${key}`}
                    type="number"
                    value={limitNumbers}
                    onChange={(e) => setLimitNumbers(e.target.value)}
                    placeholder="Limit"
                    sx={{ width: "80px" }}
                  />
                  <Button
                    onClick={() => setLimitNumberSet(limitNumbers)}
                    variant="contained"
                    size="small"
                  >
                    Reset Limit
                  </Button>
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
                <Box
                  sx={{
                    width: "100%",
                    height: "200px",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  }}
                >
                  <ScatterChart
                    series={[
                      {
                        data: data.map((item, index) => {
                          return { x: index, y: item };
                        }),
                        label: formatLabel(key),
                        id: key,
                      },
                    ]}
                  />
                </Box>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default GraphViewer;
