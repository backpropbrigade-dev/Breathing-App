/**
 * CountdownTimer component that displays the remaining time for each breathing phase.
 * Shows a countdown timer and the current breathing phase name.
 */
import React, { useEffect, useState } from 'react';
import { useBreathingStore } from '../store/breathingStore';

/**
 * Configuration for the countdown timer
 */
const TIMER_CONFIG = {
  updateInterval: 100, // Update every 100ms for smooth countdown
  styles: {
    container: "fixed inset-0 flex items-center justify-center pointer-events-none",
    content: "text-center transform transition-all duration-300",
    timer: "text-8xl font-bold mb-4",
    phase: "text-3xl font-medium",
    blur: {
      backdrop: 'blur(8px)',
      text: 'blur(0.5px)'
    }
  }
} as const;

/**
 * Type definition for breathing phases
 */
type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

/**
 * CountdownTimer component that displays the remaining time for each breathing phase
 * @returns {JSX.Element | null} The rendered countdown timer or null if not breathing
 */
export const CountdownTimer: React.FC = () => {
  const { isBreathing, currentPhase, inhaleTime, holdTime, exhaleTime, theme } = useBreathingStore();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  /**
   * Effect to handle the countdown timer for each breathing phase
   */
  useEffect(() => {
    if (!isBreathing) {
      setTimeLeft(0);
      return;
    }

    let interval: number;
    const startTime = Date.now();
    const totalTime = getPhaseDuration(currentPhase, inhaleTime, holdTime, exhaleTime);

    interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.ceil((totalTime - elapsed) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, TIMER_CONFIG.updateInterval);

    return () => clearInterval(interval);
  }, [isBreathing, currentPhase, inhaleTime, holdTime, exhaleTime]);

  if (!isBreathing) return null;

  return (
    <div 
      className={TIMER_CONFIG.styles.container}
      style={{ backdropFilter: TIMER_CONFIG.styles.blur.backdrop }}
    >
      <div 
        className={TIMER_CONFIG.styles.content}
        style={{ 
          textShadow: `0 0 20px ${theme.primary}40`,
          filter: TIMER_CONFIG.styles.blur.text
        }}
      >
        <div 
          className={TIMER_CONFIG.styles.timer}
          style={{ color: theme.primary }}
        >
          {timeLeft}
        </div>
        <div 
          className={TIMER_CONFIG.styles.phase}
          style={{ color: theme.primary }}
        >
          {capitalizeFirstLetter(currentPhase)}
        </div>
      </div>
    </div>
  );
};

/**
 * Gets the duration in milliseconds for the current breathing phase
 * @param phase - The current breathing phase
 * @param inhaleTime - Duration of inhale phase in seconds
 * @param holdTime - Duration of hold phase in seconds
 * @param exhaleTime - Duration of exhale phase in seconds
 * @returns {number} The duration in milliseconds
 */
const getPhaseDuration = (
  phase: BreathingPhase,
  inhaleTime: number,
  holdTime: number,
  exhaleTime: number
): number => {
  switch (phase) {
    case 'inhale':
      return inhaleTime * 1000;
    case 'hold':
      return holdTime * 1000;
    case 'exhale':
      return exhaleTime * 1000;
    case 'rest':
      return 0;
  }
};

/**
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns {string} The capitalized string
 */
const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}; 
