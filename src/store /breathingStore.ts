/**
 * Global state management for the breathing exercise application.
 * Uses Zustand for state management and provides a centralized store for:
 * - Breathing pattern configuration
 * - Session state management
 * - Theme customization
 * - UI state synchronization
 */

import { create } from 'zustand';

/**
 * Interface defining the shape of the breathing exercise state
 * Includes:
 * - Breathing pattern timing (inhale, hold, exhale)
 * - Session state (isBreathing, currentPhase)
 * - Session tracking (elapsedTime)
 * - Theme configuration
 * - State modification methods
 */
interface BreathingState {
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  isBreathing: boolean;
  currentPhase: 'inhale' | 'hold' | 'exhale' | 'rest';
  elapsedTime: number;
  theme: {
    primary: string;
    secondary: string;
    background: string;
  };
  setBreathingPattern: (inhale: number, hold: number, exhale: number) => void;
  setTheme: (theme: { primary: string; secondary: string; background: string }) => void;
  startBreathing: () => void;
  stopBreathing: () => void;
  setCurrentPhase: (phase: 'inhale' | 'hold' | 'exhale' | 'rest') => void;
  setInhaleTime: (time: number) => void;
  setHoldTime: (time: number) => void;
  setExhaleTime: (time: number) => void;
  setElapsedTime: (time: number) => void;
}

/**
 * Updates the scrollbar colors based on the primary theme color
 * Converts hex color to RGB and applies with opacity for thumb and hover states
 * 
 * @param {string} primary - The primary theme color in hex format
 */
const updateScrollbarColors = (primary: string) => {
  const root = document.documentElement;
  const primaryColor = primary.replace('#', '');
  const r = parseInt(primaryColor.slice(0, 2), 16);
  const g = parseInt(primaryColor.slice(2, 4), 16);
  const b = parseInt(primaryColor.slice(4, 6), 16);
  
  root.style.setProperty('--scrollbar-thumb', `rgba(${r}, ${g}, ${b}, 0.5)`);
  root.style.setProperty('--scrollbar-thumb-hover', `rgba(${r}, ${g}, ${b}, 0.7)`);
};

/**
 * Zustand store for managing breathing exercise state
 * Provides:
 * - Default breathing pattern (4-4-6)
 * - Default theme (blue/teal)
 * - State modification methods
 * - Theme synchronization with UI elements
 */
export const useBreathingStore = create<BreathingState>((set, _) => ({
  inhaleTime: 4,
  holdTime: 4,
  exhaleTime: 6,
  isBreathing: false,
  currentPhase: 'rest',
  elapsedTime: 0,
  theme: {
    primary: '#64b5f6', // Blue 300
    secondary: '#80cbc4', // Teal 200
    background: '#e0f7fa', // Sky 100
  },
  setBreathingPattern: (inhale, hold, exhale) =>
    set({ inhaleTime: inhale, holdTime: hold, exhaleTime: exhale, currentPhase: 'inhale' }),
  setTheme: (theme: { primary: string; secondary: string; background: string }) => {
    set({ theme });
    updateScrollbarColors(theme.primary);
  },
  startBreathing: () => set({ isBreathing: true, currentPhase: 'inhale' }),
  stopBreathing: () => set({ isBreathing: false, currentPhase: 'rest' }),
  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  setInhaleTime: (time) => set({ inhaleTime: time }),
  setHoldTime: (time) => set({ holdTime: time }),
  setExhaleTime: (time) => set({ exhaleTime: time }),
  setElapsedTime: (time) => set({ elapsedTime: time }),
})); 
