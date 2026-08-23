/**
 * StartButton component that controls the breathing exercise session.
 * Features:
 * - Start/Stop session control
 * - Initial countdown management
 * - Session data persistence
 * - Mobile-responsive styling
 * - Theme-aware button appearance
 * 
 * @component
 * @param {StartButtonProps} props - Component props for countdown callbacks
 * @returns {JSX.Element} The rendered start/stop button
 */
import React, { useState, useEffect } from 'react';
import { useBreathingStore } from '../store/breathingStore';
import { InitialCountdown } from './InitialCountdown';

/**
 * Styles for the start/stop button
 * Defines the visual appearance of:
 * - Base button styles with hover effects
 * - Start state with theme-based colors
 * - Stop state with red color scheme
 */
const BUTTON_STYLES = {
  base: "absolute right-0 top-2 md:right-8 md:top-8 px-4 md:px-5 py-2 md:py-2.5 md:rounded-full rounded-[20px] text-white text-sm md:text-base font-medium transition-all duration-300 transform hover:scale-105",
  start: (theme: string) => ({
    background: theme,
    boxShadow: `0 4px 14px ${theme}80`
  }),
  stop: {
    background: '#ef4444',
    boxShadow: '0 4px 14px #ef444480'
  }
} as const;

/**
 * Interface for a breathing session
 * Defines the structure of session data stored in localStorage:
 * - Unique identifier
 * - Breathing pattern details
 * - Session duration
 * - Timestamp
 * - Individual phase timings
 */
interface Session {
  id: string;
  pattern: string;
  duration: number;
  date: string;
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
}

/**
 * Props for the StartButton component
 * Optional callbacks for countdown events:
 * - onCountdownStart: Triggered when countdown begins
 * - onCountdownEnd: Triggered when countdown completes
 */
interface StartButtonProps {
  onCountdownStart?: () => void;
  onCountdownEnd?: () => void;
}

/**
 * StartButton component that controls the breathing exercise session
 * Features:
 * - Session start/stop control
 * - Initial countdown management
 * - Session data persistence in localStorage
 * - Theme-aware button styling
 * - Automatic countdown state management
 * 
 * @param {StartButtonProps} props - Component props for countdown callbacks
 * @returns {JSX.Element} The rendered start/stop button
 */
export const StartButton: React.FC<StartButtonProps> = ({ onCountdownStart, onCountdownEnd }) => {
  const { isBreathing, theme, stopBreathing, inhaleTime, holdTime, exhaleTime, elapsedTime } = useBreathingStore();
  const [showInitialCountdown, setShowInitialCountdown] = useState(false);

  // Reset countdown state when breathing starts
  useEffect(() => {
    if (isBreathing) {
      setShowInitialCountdown(false);
      onCountdownEnd?.();
    }
  }, [isBreathing, onCountdownEnd]);

  /**
   * Handles the start button click by showing the initial countdown
   */
  const handleStart = () => {
    setShowInitialCountdown(true);
    onCountdownStart?.();
  };

  /**
   * Handles the stop button click by saving the session and stopping breathing
   */
  const handleStop = () => {
    // Create new session
    const newSession: Session = {
      id: crypto.randomUUID(),
      pattern: `${inhaleTime}-${holdTime}-${exhaleTime}`,
      duration: elapsedTime,
      date: new Date().toISOString(),
      inhaleTime,
      holdTime,
      exhaleTime
    };

    // Get existing sessions from localStorage
    const existingSessions = localStorage.getItem('breathing-sessions');
    const sessions: Session[] = existingSessions ? JSON.parse(existingSessions) : [];

    // Add new session and save to localStorage
    sessions.push(newSession);
    localStorage.setItem('breathing-sessions', JSON.stringify(sessions));

    // Stop breathing
    stopBreathing();
  };

  return (
    <>
      <button
        onClick={isBreathing ? handleStop : handleStart}
        className={BUTTON_STYLES.base}
        style={isBreathing ? BUTTON_STYLES.stop : BUTTON_STYLES.start(theme.primary)}
      >
        {isBreathing ? 'Stop' : 'Start'} Breathing
      </button>
      {showInitialCountdown && <InitialCountdown />}
    </>
  );
}; 
