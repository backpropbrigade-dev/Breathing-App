/**
 * Controls component that manages breathing patterns and displays the current breathing state.
 * Provides a UI for selecting different breathing patterns and shows the current breathing phase.
 * Features:
 * - Predefined breathing patterns with different themes and timing
 * - Real-time breathing phase display
 * - Pattern selection with visual feedback
 * - Theme integration with the main visualization
 * - Mobile-responsive dropdown
 * - Disabled state during active sessions
 */
import React, { useState } from 'react';
import { useBreathingStore } from '../store/breathingStore';
import { InitialCountdown } from './InitialCountdown';

/**
 * Type definition for a breathing pattern
 * Defines the structure of breathing patterns including:
 * - Name and description
 * - Timing for inhale, hold, and exhale phases
 * - Associated theme colors
 */
interface BreathingPattern {
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  theme: {
    name: string;
    primary: string;
    secondary: string;
    background: string;
  };
}

/**
 * Predefined breathing patterns with their associated themes and timing
 * Each pattern is designed for specific purposes:
 * - Calm: Stress relief and relaxation
 * - Focus: Concentration and mental clarity
 * - Balance: Emotional stability and grounding
 * - Deep: Anxiety relief and deep relaxation
 */
const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    name: 'Calm',
    description: 'Used for stress relief and relaxation',
    inhale: 4,
    hold: 4,
    exhale: 6,
    theme: {
      name: 'Ocean',
      primary: '#64b5f6',
      secondary: '#80cbc4',
      background: '#e0f7fa',
    }
  },
  {
    name: 'Focus',
    description: 'Used for concentration and mental clarity',
    inhale: 4,
    hold: 7,
    exhale: 8,
    theme: {
      name: 'Forest',
      primary: '#81c784',
      secondary: '#a5d6a7',
      background: '#c8e6c9',
    }
  },
  {
    name: 'Balance',
    description: 'Used for emotional stability and grounding',
    inhale: 4,
    hold: 4,
    exhale: 4,
    theme: {
      name: 'Lavender',
      primary: '#9575cd',
      secondary: '#b39ddb',
      background: '#e1bee7',
    }
  },
  {
    name: 'Deep',
    description: 'Used for anxiety relief and deep relaxation',
    inhale: 6,
    hold: 2,
    exhale: 7,
    theme: {
      name: 'Sunset',
      primary: '#ff7043',
      secondary: '#ffab91',
      background: '#ffecb3',
    }
  }
];

/**
 * Styles for the controls container and pattern buttons
 * Defines the visual appearance of:
 * - Main controls container with blur effect
 * - Pattern selection buttons with active/inactive states
 * - Disabled state for buttons during active sessions
 */
const CONTAINER_STYLES = {
  base: "fixed md:left-4 md:top-4 p-2 md:p-4 w-[70%] md:w-80 transform transition-all duration-300",
  patternButton: {
    base: "w-full p-2 md:p-3 rounded-xl transition-all duration-300 transform hover:scale-102",
    active: (theme: string) => ({
      background: `${theme}20`,
      border: `2px solid ${theme}`,
      boxShadow: `0 4px 14px ${theme}40`
    }),
    inactive: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      boxShadow: 'none'
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none'
    }
  }
} as const;

/**
 * Controls component that manages breathing patterns and displays the current breathing state
 * Features:
 * - Pattern selection with visual feedback
 * - Real-time breathing phase display
 * - Mobile-responsive dropdown
 * - Theme integration
 * - Disabled state during active sessions
 * 
 * @component
 * @returns {JSX.Element} The rendered controls interface
 */
export const Controls: React.FC = () => {
  const {
    inhaleTime,
    holdTime,
    exhaleTime,
    isBreathing,
    currentPhase,
    theme,
    setBreathingPattern,
    setTheme,
  } = useBreathingStore();

  const [showInitialCountdown, setShowInitialCountdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Handles the selection of a breathing pattern
   * @param pattern - The selected breathing pattern
   */
  const handlePatternSelect = (pattern: BreathingPattern) => {
    if (isBreathing) return; // Prevent pattern change during active session
    setBreathingPattern(pattern.inhale, pattern.hold, pattern.exhale);
    setTheme(pattern.theme);
    setShowInitialCountdown(prev => prev);
    setIsExpanded(false); // Collapse the dropdown after selection on mobile
  };

  /**
   * Renders the current breathing phase information
   */
  const renderBreathingPhase = () => {
    if (!isBreathing) return null;

    const phaseText = {
      inhale: `${inhaleTime}s to inhale`,
      hold: `${holdTime}s to hold`,
      exhale: `${exhaleTime}s to exhale`,
      rest: 'Rest'
    }[currentPhase];

    return (
      <div 
        className="text-center py-2 px-3 rounded-lg"
        style={{ 
          background: `${theme.primary}20`,
          color: theme.primary
        }}
      >
        <div className="font-medium text-sm">
          {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
        </div>
        <div className="text-xs opacity-80">{phaseText}</div>
      </div>
    );
  };

  // Check if current pattern matches any predefined pattern
  const isCustomPatternActive = !BREATHING_PATTERNS.some(pattern => 
    pattern.inhale === inhaleTime && 
    pattern.hold === holdTime && 
    pattern.exhale === exhaleTime
  );

  // Find the currently active pattern
  const activePattern = BREATHING_PATTERNS.find(pattern => 
    pattern.inhale === inhaleTime && 
    pattern.hold === holdTime && 
    pattern.exhale === exhaleTime
  );

  return (
    <div 
      className={CONTAINER_STYLES.base}
      style={{ 
        background: `${theme.background}99`,
        backdropFilter: 'blur(8px)',
        borderRadius: '1rem'
      }}
    >
      {/* Mobile Dropdown Header */}
      <div className="md:hidden">
        {renderBreathingPhase()}
        {!isBreathing && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-2 rounded-xl flex justify-between items-center"
            style={{
              background: `${theme.primary}20`,
              border: `2px solid ${theme.primary}`,
              color: theme.primary
            }}
          >
            <div className="text-left">
              <h3 className="font-semibold text-sm">
                {activePattern ? activePattern.name : 'Custom Pattern'}
              </h3>
              <p className="text-xs opacity-70">
                {activePattern ? activePattern.description : 'Custom breathing pattern'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium">
                {inhaleTime}-{holdTime}-{exhaleTime}
              </div>
              <div className="text-xs mt-0.5">
                {isExpanded ? '▲' : '▼'}
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Patterns List - Hidden on mobile unless expanded */}
      <div className={`space-y-3 md:space-y-6 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        <div className="space-y-2">
          {BREATHING_PATTERNS.map((pattern) => (
            <button
              key={pattern.name}
              onClick={() => handlePatternSelect(pattern)}
              className={CONTAINER_STYLES.patternButton.base}
              style={{
                ...(theme.primary === pattern.theme.primary && !isCustomPatternActive
                  ? CONTAINER_STYLES.patternButton.active(pattern.theme.primary)
                  : CONTAINER_STYLES.patternButton.inactive),
                ...(isBreathing ? CONTAINER_STYLES.patternButton.disabled : {})
              }}
            >
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <h3 
                    className="font-semibold mb-0.5 text-sm md:text-base"
                    style={{ color: theme.primary === pattern.theme.primary && !isCustomPatternActive
                      ? pattern.theme.primary 
                      : '#374151' }}
                  >
                    {pattern.name}
                  </h3>
                  <p 
                    className="text-xs opacity-70"
                    style={{ color: theme.primary === pattern.theme.primary && !isCustomPatternActive
                      ? `${pattern.theme.primary}CC`
                      : '#6B7280' }}
                  >
                    {pattern.description}
                  </p>
                </div>
                <div className="text-right">
                  <div 
                    className="text-xs md:text-sm font-medium"
                    style={{ color: theme.primary === pattern.theme.primary && !isCustomPatternActive
                      ? pattern.theme.primary 
                      : '#4B5563' }}
                  >
                    {pattern.inhale}-{pattern.hold}-{pattern.exhale}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        {renderBreathingPhase()}
      </div>
      {showInitialCountdown && <InitialCountdown />}
    </div>
  );
}; 
