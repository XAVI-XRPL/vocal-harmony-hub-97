import { useState, useEffect } from "react";

const DEMO_MODE_KEY = "rvmt_demo_mode";

export function useDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(DEMO_MODE_KEY);
    setIsDemoMode(stored === "true");
    setIsLoading(false);
  }, []);

  const enableDemoMode = () => {
    localStorage.setItem(DEMO_MODE_KEY, "true");
    setIsDemoMode(true);
  };

  const disableDemoMode = () => {
    localStorage.removeItem(DEMO_MODE_KEY);
    setIsDemoMode(false);
  };

  return { isDemoMode, isLoading, enableDemoMode, disableDemoMode };
}
