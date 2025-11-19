// StepIcon.jsx
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  QuestionMark,
} from "@mui/icons-material";
import { isStepQuestion, isStepCorrect } from "../useStepStatus";

const StepIcon = ({ step, isCompleted, isCurrent, theme }) => {
  const isQuestion = isStepQuestion(step);

  if (isStepCorrect(step)) {
    return (
      <CheckCircleIcon
        sx={{ color: theme.palette.success.main, flexShrink: 0 }}
      />
    );
  }

  if (isQuestion) {
    return (
      <QuestionMark
        sx={{
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "feedback.warning",
          color: "white",
        }}
      />
    );
  }

  if (isCompleted) {
    return (
      <CheckCircleIcon
        sx={{ color: theme.palette.success.main, flexShrink: 0 }}
      />
    );
  }

  return (
    <RadioButtonUncheckedIcon
      sx={{
        color: isCurrent
          ? theme.palette.primary.contrastText
          : theme.palette.text.secondary,
        flexShrink: 0,
      }}
    />
  );
};

export default StepIcon;
