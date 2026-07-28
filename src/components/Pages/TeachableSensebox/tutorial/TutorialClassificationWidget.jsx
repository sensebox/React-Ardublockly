import React, { useState } from "react";
import PropTypes from "prop-types";
import OverviewPage from "./OverviewPage";
import TutorialViewerPanel from "./TutorialViewerPanel";

export default function TutorialClassificationWidget({ tutorials = [] }) {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <TutorialViewerPanel
        tutorialId={selected.id}
        classificationType={selected.type}
        groupName={selected.group}
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
    }),
  ),
};
