/**
 * BreathingTimer component that displays the current breathing pattern and timer.
 * Features:
 * - Real-time session duration tracking
 * - Pattern name display
 * - Mobile-responsive positioning
 * - Theme-aware styling
 * - Automatic pattern name detection
 * 
 * @component
 * @returns {JSX.Element | null} The rendered timer or null if not breathing
 */
import React, { useEffect } from 'react';
import { useBreathingStore } from '../store/breathingStore';

/**
 * List of predefined breathing patterns for pattern name matching
 * Used to display friendly pattern names instead of raw timing values
 * Matches the patterns defined in the Controls component
 */
const BREATHING_PATTERNS = [
  {
    name: 'Calm',
    inhale: 4,
    hold: 4,
    exhale: 6,
  },
  {
    name: 'Focus',
    inhale: 4,
    hold: 7,
    exhale: 8,
  },
  {
    name: 'Balance',
    inhale: 4,
    hold: 4,
    exhale: 4,
  },
  {
    name: 'Deep',
    inhale: 6,
    hold: 2,
    exhale: 7,
  }
];

/**
 * Styles for the breathing timer display
 * Defines the visual appearance of:
 * - Main container with blur effect and border
 * - Timer display with large font
 * - Pattern name display with smaller font
 */
const TIMER_STYLES = {
  container: "fixed left-4 bottom-4 md:left-4 md:bottom-4 p-2 rounded-lg transform transition-all duration-300 min-w-[60px] min-h-[40px] flex flex-col items-center justify-center",
  pattern: "text-xs font-medium mb-0.5 leading-none",
  timer: "text-lg font-bold leading-none"
} as const;

/**
 * BreathingTimer component that displays the current breathing pattern and timer
 * Features:
 * - Real-time session duration tracking
 * - Automatic pattern name detection
 * - Theme-aware styling with blur effect
 * - Clean display of minutes and seconds
 * 
 * @returns {JSX.Element | null} The rendered timer or null if not breathing
 */
export const BreathingTimer: React.FC = () => {
  const { isBreathing, inhaleTime, holdTime, exhaleTime, theme, elapsedTime, setElapsedTime } = useBreathingStore();

  useEffect(() => {
    if (!isBreathing) {
      setElapsedTime(0);
      return;
    }
    const timer = setInterval(() => {
      setElapsedTime(elapsedTime + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isBreathing, setElapsedTime, elapsedTime]);

  if (!isBreathing) return null;

  // Find the pattern name by matching inhale/hold/exhale
  const pattern = BREATHING_PATTERNS.find(
    p => p.inhale === inhaleTime && p.hold === holdTime && p.exhale === exhaleTime
  );
  const patternText = pattern ? pattern.name : `${inhaleTime}-${holdTime}-${exhaleTime}`;

  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const timeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div 
      className={TIMER_STYLES.container}
      style={{ 
        background: `${theme.background}99`,
        backdropFilter: 'blur(8px)',
        border: `2px solid ${theme.primary}40`,
        boxShadow: `0 4px 12px ${theme.primary}20`
      }}
    >
      <div className={TIMER_STYLES.timer} style={{ color: theme.primary }}>{timeText}</div>
      <div className={TIMER_STYLES.pattern} style={{ color: theme.primary }}>{patternText}</div>
    </div>
  );
}; 
