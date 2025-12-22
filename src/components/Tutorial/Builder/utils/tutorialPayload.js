export function buildTutorialPayload(state) {
  const {
    title,
    subtitle,
    difficulty,
    learnings,
    selectedHardware,
    steps,
    isPublic,
    review,
    creator,
    subjects,
    topics,
    duration,
    year,
  } = state;

  return {
    public: isPublic,
    review,
    creator,
    title,
    subtitle,
    difficulty,
    learnings,
    hardware: selectedHardware,
    subjects,
    topics,
    duration,
    year,
    steps: steps.map((step) => ({
      id: step.id,
      title: step.title,
      subtitle: step.subtitle || "",
      text: step.text || "",
      type: step.type,
      questionData: step.questionData || null,
      xml: step.xml || null,
      svg: step.svg || null,
      h5psrc: step.h5psrc || null,
    })),
  };
}
