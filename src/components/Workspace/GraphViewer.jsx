import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import * as Blockly from "blockly/core";
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
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useTheme } from "@mui/material/styles";
import { valueLabelWithSensor } from "@/components/Simulator/values";

// Values are sampled every 100 ms while the simulation runs.
const SAMPLE_INTERVAL_MS = 100;
// Keep the last 2 minutes per value.
const MAX_HISTORY = 1200;

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
          const value = mv[key];
          if (typeof value !== "number") continue;
          const arr = next[key] || [];
          next[key] = [...arr, value].slice(-MAX_HISTORY);
        }
        return next;
      });
    }, SAMPLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isRunning]);

  const clearHistory = () => setHistory({});

  return [history, clearHistory];
};

// A failing chart must not take down the editor. Retries on another slide.
class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

const MetricSlide = ({ title, series, theme }) => (
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
        {title}
      </Typography>
      <Box sx={{ width: "100%", minHeight: 0 }}>
        {/* The chart fails without points (@mui/x-charts 8.x) */}
        {series.length === 0 ? (
          <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
            {Blockly.Msg.simulator_graph_empty}
          </Typography>
        ) : (
          <ChartErrorBoundary resetKey={title}>
            <ScatterChart
              series={[
                { data: series.map((y, x) => ({ x, y })), label: title },
              ]}
              height={180}
              hideLegend
              colors={[theme.palette.primary.main]}
              xAxis={[{ disableTicks: false }]}
              yAxis={[{}]}
            />
          </ChartErrorBoundary>
        )}
      </Box>
    </Box>
  </Box>
);

const GraphViewer = () => {
  // Texts come from Blockly.Msg: re-render when the language changes.
  useSelector((s) => s.general.language);
  const moduleValues = useSelector((s) => s.simulator.moduleValues);
  const isRunning = useSelector((s) => s.simulator.isRunning);
  const theme = useTheme();

  const [history, clearHistory] = useHistoryStream(isRunning, moduleValues);
  const [limit, setLimit] = useState(0);

  // Settings dialog state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tempLimit, setTempLimit] = useState(limit);

  const keys = useMemo(() => Object.keys(moduleValues), [moduleValues]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= keys.length) setIndex(Math.max(0, keys.length - 1));
  }, [keys.length, index]);

  const applySettings = () => {
    setLimit(Math.max(0, Number(tempLimit) || 0));
    setSettingsOpen(false);
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
              aria-label={Blockly.Msg.simulator_graph_settings}
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
              aria-label={Blockly.Msg.simulator_graph_clear}
              onClick={clearHistory}
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
            <Typography variant="body2">
              {Blockly.Msg.simulator_graph_empty}
            </Typography>
          </Box>
        ) : (
          <Swiper
            modules={[Pagination, Navigation]}
            slidesPerView={1}
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            // The graph tab may be hidden while Swiper starts.
            observer
            observeParents
            onSlideChange={(sw) => setIndex(sw.activeIndex)}
            initialSlide={index}
            style={{
              height: "100%",
              "--swiper-pagination-color": theme.palette.primary.main,
            }}
          >
            {keys.map((key, i) => {
              const data = history[key] || [];
              const limited = limit > 0 ? data.slice(-limit) : data;
              return (
                <SwiperSlide key={key} style={{ height: "100%" }}>
                  {/* Only the visible chart is drawn */}
                  {i === index && (
                    <MetricSlide
                      title={valueLabelWithSensor(key)}
                      series={limited}
                      theme={theme}
                    />
                  )}
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
        <DialogTitle>{Blockly.Msg.simulator_graph_settings_title}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label={Blockly.Msg.simulator_graph_history_limit}
              type="number"
              value={tempLimit}
              onChange={(e) => setTempLimit(e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>
            {Blockly.Msg.button_cancel}
          </Button>
          <Button variant="contained" onClick={applySettings}>
            {Blockly.Msg.simulator_graph_apply}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GraphViewer;
