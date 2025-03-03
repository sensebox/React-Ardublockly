import { useEffect, useState } from "react";

function useCompileProgress(sketchPath, fqbn) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource(
      `http://localhost:3001/compile-progress?sketchPath=${encodeURIComponent(sketchPath)}&fqbn=${encodeURIComponent(fqbn)}`,
    );

    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.progress !== undefined) {
        setProgress(data.progress);
      }
      if (data.done) {
        eventSource.close();
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [sketchPath, fqbn]);

  return progress;
}

export default useCompileProgress;
