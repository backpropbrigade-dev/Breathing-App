/**
 * CustomBreathing component that allows users to create and apply custom breathing patterns.
 * Features:
 * - Customizable inhale, hold, and exhale durations
 * - Collapsible form interface
 * - Input validation and constraints
 * - Theme-aware styling
 * - Disabled state during active sessions
 */

import React, { useState } from 'react';
import { useBreathingStore } from '../store/breathingStore';

/**
 * Styles for the custom breathing interface
 * Defines the visual appearance of:
 * - Main container with blur effect
 * - Form layout and spacing
 * - Input fields and labels
 * - Checkbox and button styles
 * - Collapsed state appearance
 */
const CUSTOM_STYLES = {
  container: "md:fixed md:left-8 md:top-[calc(4rem+24rem)] p-3 w-48 md:w-48 transform transition-all duration-300",
  form: "space-y-2",
  inputGroup: "flex items-center justify-between",
  input: "w-12 p-1 rounded bg-white/10 border border-white/20 text-sm text-center",
  label: "text-xs font-medium",
  checkbox: "w-3 h-3 rounded border border-current",
  button: "w-full p-1.5 rounded text-xs font-medium transition-all duration-300",
  collapsed: "flex items-center justify-between cursor-pointer"
} as const;

/**
 * CustomBreathing component that allows users to create and apply custom breathing patterns
 * Features:
 * - Customizable breathing pattern creation
 * - Input validation (1-10 seconds for inhale/exhale, 0-10 for hold)
 * - Collapsible form interface
 * - Theme-aware styling with blur effects
 * - Disabled state during active sessions
 * - Neutral theme when custom pattern is active
 * 
 * @returns {JSX.Element} The rendered custom breathing interface
 */
export const CustomBreathing: React.FC = () => {
  const { theme, setBreathingPattern, isBreathing, inhaleTime, holdTime, exhaleTime, setTheme } = useBreathingStore();
  const [isCustomActive, setIsCustomActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [customPattern, setCustomPattern] = useState({
    inhale: 4,
    hold: 4,
    exhale: 6
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBreathing) return;
    
    // Validate inputs
    const inhale = Math.max(1, Math.min(10, customPattern.inhale));
    const hold = Math.max(0, Math.min(10, customPattern.hold));
    const exhale = Math.max(1, Math.min(10, customPattern.exhale));
    
    setBreathingPattern(inhale, hold, exhale);
    setIsExpanded(false); // Collapse the form after applying
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setIsCustomActive(e.target.checked);
    if (e.target.checked) {
      // Set a neutral theme when custom is active
      setTheme({
        primary: '#6B7280',
        secondary: '#9CA3AF',
        background: '#F3F4F6'
      });
    }
  };

  const isCustomPatternActive = 
    inhaleTime === customPattern.inhale &&
    holdTime === customPattern.hold &&
    exhaleTime === customPattern.exhale;

  return (
    <div 
      className={CUSTOM_STYLES.container}
      style={{ 
        background: `${theme.background}99`,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${theme.primary}40`,
        borderRadius: '0.75rem'
      }}
      
    >
      {!isExpanded ? (
        <div 
          className={CUSTOM_STYLES.collapsed}
          onClick={() => !isBreathing && setIsExpanded(true)}
          style={{
            opacity: isBreathing ? 0.5 : 1,
            pointerEvents: isBreathing ? 'none' : 'auto'
          }}
        >
          <label className={CUSTOM_STYLES.label} style={{ color: theme.primary }}>
            Custom {isCustomPatternActive ? `(${customPattern.inhale}-${customPattern.hold}-${customPattern.exhale})` : ''}
          </label>
          <input
            type="checkbox"
            checked={isCustomActive}
            onChange={handleCheckboxChange}
            className={CUSTOM_STYLES.checkbox}
            style={{ color: theme.primary }}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={CUSTOM_STYLES.form}>
          <div className="flex items-center justify-between mb-1">
            <label className={CUSTOM_STYLES.label} style={{ color: theme.primary }}>
              Custom
            </label>
            <input
              type="checkbox"
              checked={isCustomActive}
              onChange={handleCheckboxChange}
              className={CUSTOM_STYLES.checkbox}
              style={{ color: theme.primary }}
            />
          </div>
          
          {isCustomActive && (
            <>
              <div className={CUSTOM_STYLES.inputGroup}>
                <label className={CUSTOM_STYLES.label} style={{ color: theme.primary }}>
                  In:
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={customPattern.inhale}
                  onChange={(e) => setCustomPattern(prev => ({
                    ...prev,
                    inhale: parseInt(e.target.value) || 1
                  }))}
                  className={CUSTOM_STYLES.input}
                  style={{ 
                    color: theme.primary,
                    borderColor: `${theme.primary}40`,
                    background: `${theme.primary}10`
                  }}
                  disabled={isBreathing}
                />
              </div>
              <div className={CUSTOM_STYLES.inputGroup}>
                <label className={CUSTOM_STYLES.label} style={{ color: theme.primary }}>
                  Hold:
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={customPattern.hold}
                  onChange={(e) => setCustomPattern(prev => ({
                    ...prev,
                    hold: parseInt(e.target.value) || 0
                  }))}
                  className={CUSTOM_STYLES.input}
                  style={{ 
                    color: theme.primary,
                    borderColor: `${theme.primary}40`,
                    background: `${theme.primary}10`
                  }}
                  disabled={isBreathing}
                />
              </div>
              <div className={CUSTOM_STYLES.inputGroup}>
                <label className={CUSTOM_STYLES.label} style={{ color: theme.primary }}>
                  Out:
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={customPattern.exhale}
                  onChange={(e) => setCustomPattern(prev => ({
                    ...prev,
                    exhale: parseInt(e.target.value) || 1
                  }))}
                  className={CUSTOM_STYLES.input}
                  style={{ 
                    color: theme.primary,
                    borderColor: `${theme.primary}40`,
                    background: `${theme.primary}10`
                  }}
                  disabled={isBreathing}
                />
              </div>
              <button
                type="submit"
                className={CUSTOM_STYLES.button}
                style={{
                  background: theme.primary,
                  color: '#fff',
                  boxShadow: `0 2px 8px ${theme.primary}80`,
                  opacity: isBreathing ? 0.5 : 1,
                  pointerEvents: isBreathing ? 'none' : 'auto'
                }}
              >
                Apply
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}; 
