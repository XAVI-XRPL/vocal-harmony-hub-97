import { useState, useEffect } from "react";

const ONBOARDING_KEY = "rvmt_onboarding_complete";

export function useOnboarding() {
  const [isComplete, setIsComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(ONBOARDING_KEY);
    setIsComplete(stored === "true");
    setIsLoading(false);
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setIsComplete(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    setIsComplete(false);
  };

  return { isComplete, isLoading, completeOnboarding, resetOnboarding };
}
