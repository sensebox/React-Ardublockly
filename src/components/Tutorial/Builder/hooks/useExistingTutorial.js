import { useEffect, useState } from "react";
import { fetchTutorial } from "../../services/tutorial.service";

/**
 * Lädt ein bestehendes Tutorial (falls ID vorhanden)
 * Kapselt:
 *  - Loading State
 *  - Fetch Logik
 *  - Fehlerbehandlung
 */
export function useExistingTutorial({ tutorialId, token }) {
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(Boolean(tutorialId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tutorialId) {
      setTutorial(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchTutorial(tutorialId, token);
        if (!cancelled) {
          setTutorial(res.tutorial ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Tutorial konnte nicht geladen werden:", err);
          setError(err);
          setTutorial(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [tutorialId, token]);

  return {
    tutorial,
    loading,
    error,
  };
}
