import { useEffect, useState } from "react";

const createInitialSteps = () => [
  {
    id: "intro",
    title: "Einleitung",
    subtitle: "Starte hier!",
    type: "instruction",
  },
  {
    id: "finish",
    title: "Abschluss",
    type: "finish",
    subtitle: "Übersicht & Zusammenfassung",
  },
];

export function useTutorialBuilder({ initialData, creator }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [steps, setSteps] = useState(createInitialSteps());
  const [difficulty, setDifficulty] = useState(3);
  const [selectedHardware, setSelectedHardware] = useState([]);
  const [customHardware, setCustomHardware] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [duration, setDuration] = useState("");
  const [year, setYear] = useState("");
  const [learnings, setLearnings] = useState([{ title: "", description: "" }]);

  /**
   * 🔥 Synchronisation mit bestehendem Tutorial
   */
  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title || "");
    setSubtitle(initialData.subtitle || "");
    setSteps(
      initialData.steps?.length ? initialData.steps : createInitialSteps(),
    );
    setDifficulty(initialData.difficulty ?? 3);
    setSelectedHardware(initialData.hardware || []);
    setCustomHardware(initialData.customHardware || {});
    setSubjects(initialData.subjects || []);
    setTopics(initialData.topics || []);
    setDuration(initialData.duration || "");
    setYear(initialData.year || "");
    setLearnings(
      initialData.learnings?.length
        ? initialData.learnings
        : [{ title: "", description: "" }],
    );
  }, [initialData]);

  return {
    state: {
      title,
      subtitle,
      steps,
      difficulty,
      selectedHardware,
      customHardware,
      subjects,
      topics,
      duration,
      year,
      learnings,
      isPublic: true,
      review: false,
      creator,
    },
    actions: {
      setTitle,
      setSubtitle,
      setSteps,
      setDifficulty,
      setSelectedHardware,
      setCustomHardware,
      setSubjects,
      setTopics,
      setDuration,
      setYear,
      setLearnings,
    },
  };
}
