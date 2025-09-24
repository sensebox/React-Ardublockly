import { useEffect } from "react";

const TaskStep = ({ step }) => {
  useEffect(() => {
    console.log("TaskStep", step);
  }, []);

  return <div>{step.text}</div>;
};
export default TaskStep;
