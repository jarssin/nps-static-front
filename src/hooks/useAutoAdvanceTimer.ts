import { Step } from '@/Types/Steps';
import { useRef, useState, useCallback } from 'react';

export function useAutoAdvanceTimer(
  onAutoAdvance: (nextStep: Step) => void,
  initialStep: Step,
  duration: number = 20
) {
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<
    number | null
  >(null);
  const [isStepCompleted, setIsStepCompleted] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const startAutoAdvanceTimer = useCallback(
    (nextStep: Step) => {
      clearTimers();
      setAutoAdvanceCountdown(duration);
      setIsStepCompleted(true);

      countdownRef.current = setInterval(() => {
        setAutoAdvanceCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearTimers();
            setAutoAdvanceCountdown(null);
            setIsStepCompleted(false);
            onAutoAdvance(nextStep);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clearTimers, onAutoAdvance, duration]
  );

  const resetAutoAdvanceTimer = useCallback(
    (nextStep: Step) => {
      if (isStepCompleted) {
        clearTimers();
        setAutoAdvanceCountdown(null);
        setIsStepCompleted(false);
        startAutoAdvanceTimer(nextStep);
      }
    },
    [isStepCompleted, clearTimers, startAutoAdvanceTimer]
  );

  // Clean up on unmount
  const cleanup = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  return {
    autoAdvanceCountdown,
    isStepCompleted,
    startAutoAdvanceTimer,
    resetAutoAdvanceTimer,
    cleanup,
  };
}
