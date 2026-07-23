import React, { useState } from "react";
import PropTypes from "prop-types";
import OverviewPage from "./OverviewPage";
import TutorialViewerPanel from "./TutorialViewerPanel";

export default function TutorialClassificationWidget({ tutorials = [] }) {
  const [selected, setSelected] = useState(null);
  // selected: null | { id: string, type: 'image' | 'orientation' }

  if (selected) {
    return (
      <TutorialViewerPanel
        tutorialId={selected.id}
        classificationType={selected.type}
        onBack={() => setSelected(null)}
      />
    );
  }

  return <OverviewPage tutorials={tutorials} onSelect={setSelected} />;
}

TutorialClassificationWidget.propTypes = {
  tutorials: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ),
};
