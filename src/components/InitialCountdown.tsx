/**
 * InitialCountdown component that displays a countdown before starting the breathing exercise.
 * Shows a 3-2-1 countdown with a "Go!" message at the end.
 * Features:
 * - Animated countdown display
 * - Blur effect background
 * - Theme-aware styling
 * - Automatic breathing session start
 */
import React, { useEffect, useState } from 'react';
import { useBreathingStore } from '../store/breathingStore';

/**
 * Configuration for the countdown display and behavior
 * Defines:
 * - Initial countdown value
 * - Timer interval
 * - Visual styles for container and numbers
 * - Blur effects for background and text
 */
const COUNTDOWN_CONFIG = {
  initialCount: 3,
  interval: 1000, // 1 second
  styles: {
    container: "fixed inset-0 flex items-center justify-center pointer-events-none",
    content: "text-center transform transition-all duration-300",
    number: "text-9xl font-bold mb-4 animate-pulse",
    blur: {
      backdrop: 'blur(8px)',
      text: 'blur(0.5px)'
    }
  }
} as const;

/**
 * InitialCountdown component that displays a countdown before starting the breathing exercise
 * Features:
 * - Animated countdown from 3 to 1
 * - "Go!" message at countdown end
 * - Blur effect background
 * - Theme-aware styling with glow effects
 * - Automatic breathing session start
 * 
 * @returns {JSX.Element | null} The rendered countdown interface or null when finished
 */
export const InitialCountdown: React.FC = () => {
  const { theme, startBreathing } = useBreathingStore();
  const [count, setCount] = useState<number>(COUNTDOWN_CONFIG.initialCount);
  const [isVisible, setIsVisible] = useState(true);

  /**
   * Effect to handle the countdown timer and start breathing when countdown ends
   */
  useEffect(() => {
    if (count === 0) {
      startBreathing();
      // Add a small delay before hiding to show "Go!"
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 500);
      return () => clearTimeout(hideTimer);
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, COUNTDOWN_CONFIG.interval);

    return () => clearTimeout(timer);
  }, [count, startBreathing]);

  if (!isVisible) return null;

  return (
    <div 
      className={COUNTDOWN_CONFIG.styles.container}
      style={{ backdropFilter: COUNTDOWN_CONFIG.styles.blur.backdrop }}
    >
      <div 
        className={COUNTDOWN_CONFIG.styles.content}
        style={{ 
          textShadow: `0 0 20px ${theme.primary}40`,
          filter: COUNTDOWN_CONFIG.styles.blur.text
        }}
      >
        <div 
          className={COUNTDOWN_CONFIG.styles.number}
          style={{ color: theme.primary }}
        >
          {count === 0 ? 'Go!' : count}
        </div>
      </div>
    </div>
  );
}; 
