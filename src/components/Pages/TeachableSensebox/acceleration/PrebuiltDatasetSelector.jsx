import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import {
  ScreenRotation as ScreenRotationIcon,
  Gesture as GestureIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import {
  getDatasetCatalog,
  loadDatasetClass,
} from "../../../../data/acceleration-datasets";
import { getAccelerationTranslations } from "./translations";

// ─── SampleThumbnail ─────────────────────────────────────────────────────────
const THUMB_SIZE = 48;
const THUMB_COLORS = { x: "#e53935", y: "#43a047", z: "#1e88e5" };

const SampleThumbnail = ({ sample }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const readings = sample.readings;
    if (!readings || readings.length < 2) return;

    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, W, H);

    let minVal = Infinity;
    let maxVal = -Infinity;
    for (const s of readings) {
      minVal = Math.min(minVal, s.x, s.y, s.z);
      maxVal = Math.max(maxVal, s.x, s.y, s.z);
    }
    const range = maxVal - minVal || 1;
    const pad = range * 0.08;
    const lo = minVal - pad;
    const hi = maxVal + pad;
    const toY = (v) => H - ((v - lo) / (hi - lo)) * H;
    const n = readings.length;

    for (const axis of ["x", "y", "z"]) {
      ctx.strokeStyle = THUMB_COLORS[axis];
      ctx.lineWidth = 1;
      ctx.beginPath();
      readings.forEach((s, i) => {
        const px = (i / (n - 1)) * W;
        const py = toY(s[axis]);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }
  }, [sample]);

  return (
    <Box
      sx={{
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: 0.5,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        width={THUMB_SIZE}
        height={THUMB_SIZE}
        style={{ display: "block", width: THUMB_SIZE, height: THUMB_SIZE }}
      />
    </Box>
  );
};

// ─── Icon mapping ────────────────────────────────────────────────────────────
const iconMap = {
  ScreenRotation: ScreenRotationIcon,
  Gesture: GestureIcon,
};

// ─── DatasetClassCard ────────────────────────────────────────────────────────
const DatasetClassCard = ({
  categoryId,
  classInfo,
  language,
  selected,
  onToggle,
}) => {
  const [samples, setSamples] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const data = loadDatasetClass(categoryId, classInfo.id);
    if (data?.samples) {
      setSamples(data.samples);
    }
  }, [categoryId, classInfo.id]);

  const displayName =
    typeof classInfo.name === "object"
      ? classInfo.name[language] || classInfo.name.en
      : classInfo.name;

  const displayDescription =
    typeof classInfo.description === "object"
      ? classInfo.description[language] || classInfo.description.en
      : classInfo.description;

  // Show up to 6 sample thumbnails
  const visibleSamples = samples.slice(0, 6);
  const remainingCount = Math.max(0, samples.length - 6);

  return (
    <Card
      variant="outlined"
      sx={{
        minWidth: 220,
        maxWidth: 280,
        flex: "1 1 220px",
        border: selected ? "2px solid" : "1px solid",
        borderColor: selected ? "primary.main" : "divider",
        bgcolor: selected ? "primary.50" : "background.paper",
        transition: "all 0.2s ease",
        cursor: "pointer",
        "&:hover": {
          borderColor: selected ? "primary.main" : "primary.light",
          boxShadow: 1,
        },
      }}
      onClick={() => onToggle(classInfo.id)}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight="medium">
            {displayName}
          </Typography>
          {selected && (
            <CheckCircleIcon color="primary" sx={{ fontSize: 20 }} />
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1.5, minHeight: 40 }}
        >
          {displayDescription}
        </Typography>

        <Chip size="small" label={`${samples.length} samples`} sx={{ mb: 1 }} />

        {/* Sample thumbnails */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            mt: 1,
          }}
        >
          {visibleSamples.map((sample, idx) => (
            <SampleThumbnail key={sample.id || idx} sample={sample} />
          ))}
          {remainingCount > 0 && (
            <Box
              sx={{
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                borderRadius: 0.5,
                bgcolor: "grey.200",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                +{remainingCount}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

// ─── PrebuiltDatasetSelector ─────────────────────────────────────────────────
const PrebuiltDatasetSelector = ({ onSelectionsChange, disabled }) => {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedClasses, setSelectedClasses] = useState({});

  const t = getAccelerationTranslations();
  const language = (window.localStorage.getItem("locale") || "de_DE").split(
    "_",
  )[0];

  useEffect(() => {
    const catalog = getDatasetCatalog();
    setCategories(catalog);

    // Initialize selected state for each category
    const initial = {};
    catalog.forEach((cat) => {
      initial[cat.id] = [];
    });
    setSelectedClasses(initial);
  }, []);

  const activeCategory = categories[activeTab];

  // Notify parent of current selections whenever they change
  const buildSelections = useCallback(
    (updatedSelectedClasses) => {
      if (!activeCategory) return [];
      return (updatedSelectedClasses[activeCategory.id] || []).map(
        (classId) => ({ categoryId: activeCategory.id, classId }),
      );
    },
    [activeCategory],
  );

  const handleToggleClass = (classId) => {
    if (!activeCategory) return;
    const catId = activeCategory.id;
    const current = selectedClasses[catId] || [];
    const next = current.includes(classId)
      ? current.filter((id) => id !== classId)
      : [...current, classId];
    const updated = { ...selectedClasses, [catId]: next };
    setSelectedClasses(updated);
    onSelectionsChange(buildSelections(updated));
  };

  const handleSelectAll = () => {
    if (!activeCategory) return;
    const catId = activeCategory.id;
    const allIds = activeCategory.classes.map((c) => c.id);
    const updated = { ...selectedClasses, [catId]: allIds };
    setSelectedClasses(updated);
    onSelectionsChange(buildSelections(updated));
  };

  const handleDeselectAll = () => {
    if (!activeCategory) return;
    const catId = activeCategory.id;
    const updated = { ...selectedClasses, [catId]: [] };
    setSelectedClasses(updated);
    onSelectionsChange(buildSelections(updated));
  };

  const totalSelected = useMemo(() => {
    if (!activeCategory) return 0;
    return (selectedClasses[activeCategory.id] || []).length;
  }, [activeCategory, selectedClasses]);

  if (categories.length === 0) {
    return null;
  }

  const getCategoryName = (cat) =>
    typeof cat.name === "object" ? cat.name[language] || cat.name.en : cat.name;

  const getCategoryIcon = (cat) => {
    const IconComponent = iconMap[cat.icon] || GestureIcon;
    return <IconComponent />;
  };

  return (
    <Box>
      {/* Category Tabs */}
      {categories.length > 1 && (
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 2 }}
        >
          {categories.map((cat, idx) => (
            <Tab
              key={cat.id}
              icon={getCategoryIcon(cat)}
              iconPosition="start"
              label={getCategoryName(cat)}
            />
          ))}
        </Tabs>
      )}

      {activeCategory && (
        <>
          {/* Selection Controls */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mb: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Button size="small" onClick={handleSelectAll}>
              {t.prebuiltDatasets?.selectAll || "Select All"}
            </Button>
            <Button size="small" onClick={handleDeselectAll}>
              {t.prebuiltDatasets?.deselectAll || "Deselect All"}
            </Button>
            <Box sx={{ flex: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {totalSelected} / {activeCategory.classes.length}{" "}
              {t.prebuiltDatasets?.selected || "selected"}
            </Typography>
          </Box>

          {/* Class Cards */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mb: 2,
            }}
          >
            {activeCategory.classes.map((classInfo) => (
              <DatasetClassCard
                key={classInfo.id}
                categoryId={activeCategory.id}
                classInfo={classInfo}
                language={language}
                selected={(selectedClasses[activeCategory.id] || []).includes(
                  classInfo.id,
                )}
                onToggle={handleToggleClass}
              />
            ))}
          </Box>

          {/* Validation message */}
          {totalSelected > 0 && totalSelected < 2 && (
            <Alert severity="info" sx={{ mb: 0 }}>
              {t.prebuiltDatasets?.minClassesWarning ||
                "Select at least 2 classes to train a model."}
            </Alert>
          )}
        </>
      )}
    </Box>
  );
};

export default PrebuiltDatasetSelector;
