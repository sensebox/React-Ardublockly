import { ChevronRight, QuestionMark } from "@mui/icons-material";

const NextButtonIcon = ({ step, isLast, answered }) => {
  if (isLast) return <ChevronRight sx={{ fontSize: 20 }} />;
  if (step.type !== "question" && step.type !== "blockly")
    return <ChevronRight sx={{ fontSize: 20 }} />;

  const answeredCorrect = answered?.[step?.questionData?.[0]?._id] === true;

  if (!answeredCorrect) return <QuestionMark sx={{ fontSize: 20 }} />;

  return <ChevronRight sx={{ fontSize: 20 }} />;
};

export default NextButtonIcon;
