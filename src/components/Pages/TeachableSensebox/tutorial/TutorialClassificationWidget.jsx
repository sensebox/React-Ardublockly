import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import OverviewPage from "./OverviewPage";
import TutorialViewerPanel from "./TutorialViewerPanel";
import {
  buildTutorialUrl,
  getTutorialBasePath,
  getTutorialIdFromUrl,
  normalizeTutorialConfigs,
} from "@/helpers/tutorialUrl";

export default function TutorialClassificationWidget({ tutorials = [], mediaBasePath = "/media/hardware/3dmodels/" }) {
  const normalizedConfigs = useMemo(
    () => normalizeTutorialConfigs(tutorials),
    [tutorials],
  );

  const resolveSelection = useCallback(
    (tutorialId) => {
      if (!tutorialId) return null;
      const config = normalizedConfigs.find((c) => c.id === tutorialId);
      return config
        ? { id: config.id, type: config.type, group: config._group || null }
        : null;
    },
    [normalizedConfigs],
  );

  const [selected, setSelected] = useState(() =>
    resolveSelection(getTutorialIdFromUrl()),
  );

  // Keep the widget in sync with browser back/forward navigation.
  useEffect(() => {
    function handlePopState() {
      setSelected(resolveSelection(getTutorialIdFromUrl()));
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [resolveSelection]);

  const handleSelect = useCallback((tutorial) => {
    setSelected(tutorial);
    window.history.pushState({ tutorialId: tutorial.id }, "", buildTutorialUrl(tutorial.id));
  }, []);

  const handleBack = useCallback(() => {
    setSelected(null);
    window.history.pushState({}, "", getTutorialBasePath());
  }, []);

  if (selected) {
    return (
      <TutorialViewerPanel
        tutorialId={selected.id}
        classificationType={selected.type}
        groupName={selected.group}
        onBack={handleBack}
        mediaBasePath={mediaBasePath}
      />
    );
  }

  return <OverviewPage tutorials={tutorials} onSelect={handleSelect} mediaBasePath={mediaBasePath} />;
}

TutorialClassificationWidget.propTypes = {
  tutorials: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ),
  mediaBasePath: PropTypes.string,
};
