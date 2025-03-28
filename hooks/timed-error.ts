import { useState, useEffect } from "react";

const useTimedError = (duration = 2000) => {
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [error, duration]);

  return [error, setError] as const;
};

export default useTimedError;
