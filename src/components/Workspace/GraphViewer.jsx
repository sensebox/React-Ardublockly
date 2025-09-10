import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import { ScatterChart } from "@mui/x-charts";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Keyboard, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useTheme } from "@mui/material/styles";

const IGNORED = [
  "sensebox_fluoroASM_init",
  "sensebox_fluoroASM_setLED",
  "senseBox_display",
  "senseBox_hdc1080",
];

const labels = {
  sensebox_smt50_moisture: "Bodenfeuchte in % (SMT50)",
  sensebox_smt50_temp: "Temperatur (SMT50)",
  sensebox_light_uv: "UV-Strahlung",
  sensebox_light_lux: "Beleuchtung in Lux",
  sensebox_scd_co2: "CO2 Konzentration (SCD30)",
  sensebox_scd_temp: "Temperatur(SCD30)",
  sensebox_scd_humi: "rel. Luftfeuchte(SCD30)",
  sensebox_tof_dist: "Distanz in mm(ToF)",
  senseBox_hdc1080_temp: "Temperatur (HDC1080)",
  senseBox_hdc1080_humidity: "rel. Luftfeuchte (HDC1080)",
  accelerometer_x: "Beschleunigung(X-Achse)",
  accelerometer_y: "Beschleunigung(Y-Achse)",
  accelerometer_z: "Beschleunigung(Z-Achse)",
  sensebox_sds_pm10: "Feinstaub(PM10)",
  sensebox_sds_pm25: "Feinstaub(PM25)",
  sensebox_sps_pm1: "Feinstaub(PM1)",
  sensebox_sps_pm25: "Feinstaub(PM25)",
  sensebox_sps_pm4: "Feinstaub(PM4)",
  sensebox_sps_pm10: "Feinstaub(PM10)",
  sensebox_rg15_total_rainfall: "Niederschlag(Total)",
  sensebox_rg15_rainfall_intensity: "Niederschlagsintensität",
};

// ———————————————————————————————————————
// History stream + clear function
// ———————————————————————————————————————
const useHistoryStream = (isRunning, moduleValues) => {
  const [history, setHistory] = useState({});
  const latest = useRef(moduleValues);
  useEffect(() => {
    latest.current = moduleValues;
  }, [moduleValues]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setHistory((prev) => {
        const next = { ...prev };
        const mv = latest.current;
        for (const key in mv) {
          if (IGNORED.includes(key)) continue;
          const value = mv[key];
          if (typeof value !== "number") continue;
          const safe = key.toLowerCase();
          const arr = next[safe] || [];
          next[safe] = [...arr, value];
        }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [isRunning]);

  const clearHistory = () => setHistory({});

  return [history, clearHistory];
};

const MetricSlide = ({ title, value, series, theme }) => (
  <Box
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      p: 1.5,
      boxSizing: "border-box",
    }}
  >
    <Box
      sx={{
        background: "#fff",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        flex: 1,
      }}
    >
      <Typography sx={{ fontWeight: 600, color: "text.primary" }}>
        {labels[title]}
      </Typography>
      <Box sx={{ width: "100%", minHeight: 0 }}>
        <ScatterChart
          series={[
            { data: series.map((y, x) => ({ x, y })), label: labels[title] },
          ]}
          height={230}
          hideLegend
          colors={[theme.palette.primary.main]}
          xAxis={[{ disableTicks: false }]}
          yAxis={[{}]}
        />
      </Box>
    </Box>
  </Box>
);

const GraphViewer = () => {
  const moduleValues = useSelector((s) => s.simulator.moduleValues);
  const isRunning = useSelector((s) => s.simulator.isRunning);
  const theme = useTheme();

  const [history, clearHistory] = useHistoryStream(isRunning, moduleValues);
  const [limit, setLimit] = useState(0);

  // Settings dialog state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tempLimit, setTempLimit] = useState(limit);

  const keys = useMemo(
    () => Object.keys(moduleValues).filter((k) => !IGNORED.includes(k)),
    [moduleValues],
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= keys.length) setIndex(Math.max(0, keys.length - 1));
  }, [keys.length, index]);

  const applySettings = () => {
    setLimit(Math.max(0, Number(tempLimit) || 0));
    setSettingsOpen(false);
  };

  const clearData = () => {
    clearHistory(); // wipe all graph data
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      }}
    >
      <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            gap: 8,
          }}
        >
          <Box
            sx={{
              background: "#fff",
              borderRadius: "50%",
              boxShadow: 1,
            }}
          >
            <IconButton
              aria-label="Einstellungen"
              style={{ color: theme.palette.primary.main }}
              onClick={() => {
                setTempLimit(limit);
                setSettingsOpen(true);
              }}
              size="small"
            >
              <SettingsIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              background: "#fff",
              borderRadius: "50%",
              boxShadow: 1,
            }}
          >
            <IconButton
              aria-label="Daten löschen"
              onClick={clearData}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </div>
        {keys.length === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
            }}
          >
            <Typography variant="body2">Keine Daten vorhanden</Typography>
          </Box>
        ) : (
          <Swiper
            modules={[Pagination, Navigation]}
            slidesPerView={1}
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            onSlideChange={(sw) => setIndex(sw.activeIndex)}
            initialSlide={index}
            style={{
              height: "100%",
              "--swiper-pagination-color": theme.palette.primary.main,
            }}
          >
            {keys.map((key) => {
              const safe = key.toLowerCase();
              const data = history[safe] || [];
              const limited = limit > 0 ? data.slice(-limit) : data;
              return (
                <SwiperSlide key={key} style={{ height: "100%" }}>
                  <MetricSlide
                    title={key}
                    value={moduleValues[key]}
                    series={limited}
                    theme={theme}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </Box>
      {/* Settings Dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Graph-Einstellungen</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="History-Limit"
              type="number"
              value={tempLimit}
              onChange={(e) => setTempLimit(e.target.value)}
              inputProps={{ min: 0 }}
            />
            {/* Platz für weitere Optionen (z.B. Zeitfenster, Y-Scale, Linien/Scatter umschalten, etc.) */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Abbrechen</Button>
          <Button variant="contained" onClick={applySettings}>
            Übernehmen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GraphViewer;
