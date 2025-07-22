import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Sparklines, SparklinesLine } from "react-sparklines";

const GraphViewer = () => {
  const moduleValues = useSelector((state) => state.simulator.moduleValues);
  const [history, setHistory] = useState({});

  const ignoredModules = [
    "sensebox_fluoroASM_init",
    "sensebox_fluoroASM_setLED2",
    "senseBox_display",
    "senseBox_hdc1080",
  ];

  useEffect(() => {
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
  }, [moduleValues]);

  return (
    <div>
      {Object.keys(moduleValues)
        .filter((key) => !ignoredModules.includes(key))
        .map((key) => {
          const safeKey = key.toLowerCase();
          const data = history[safeKey] || [];

          return (
            <div key={key} style={{ marginBottom: "1rem" }}>
              <strong>{key}</strong>: {moduleValues[key]}
              <Sparklines data={data} width={100} height={20}>
                <SparklinesLine color="#00cccc" />
              </Sparklines>
            </div>
          );
        })}
    </div>
  );
};

export default GraphViewer;
