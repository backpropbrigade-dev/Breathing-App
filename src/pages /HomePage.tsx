/**
 * HomePage component that renders the breathing exercise interface.
 * This component sets up the 3D scene with Three.js and manages the overall layout.
 * It includes the breathing sphere visualization, controls, and navigation elements.
 */
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { BreathingSphere } from '../components/BreathingSphere';
import { Controls } from '../components/Controls';
import { StartButton } from '../components/StartButton';
import { BreathingTimer } from '../components/BreathingTimer';
import { useBreathingStore } from '../store/breathingStore';
import { useNavigate } from 'react-router-dom';
import { CustomBreathing } from '../components/CustomBreathing';

/**
 * Scene configuration for the 3D environment
 * Defines camera settings, fog parameters, and star field properties
 * for the Three.js scene
 */
const SCENE_CONFIG = {
  camera: {
    position: [0, 0, 5] as [number, number, number],
    fov: 75
  },
  fog: {
    near: 5,
    far: 20
  },
  stars: {
    radius: 100,
    depth: 50,
    count: 5000,
    factor: 4,
    saturation: 0,
    fade: true,
    speed: 1
  }
} as const;

/**
 * Button style configurations for different UI elements
 * Each style variant includes background, border, shadow, and color properties
 * that adapt to the current theme
 */
const BUTTON_STYLES = {
  base: "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105",
  start: (theme: string) => ({
    background: theme,
    boxShadow: `0 4px 14px ${theme}80`
  }),
  stats: (theme: string) => ({
    background: `${theme}40`,
    border: `1px solid ${theme}40`,
    boxShadow: `0 4px 14px ${theme}40`,
    color: theme
  }),
  about: (theme: string) => ({
    background: `${theme}40`,
    border: `1px solid ${theme}40`,
    boxShadow: `0 4px 14px ${theme}40`,
    color: theme
  }),
  help: (theme: string) => ({
    background: `${theme}40`,
    border: `1px solid ${theme}40`,
    boxShadow: `0 4px 14px ${theme}40`,
    color: theme
  })
} as const;

/**
 * Help instructions content organized into sections
 * Provides structured guidance for users on how to use the application
 */
const HELP_INSTRUCTIONS = [
  {
    title: "Getting Started",
    items: [
      "Choose a breathing pattern from the left panel",
      "Set your desired session duration",
      "Click 'Start' to begin your session",
      "Create your own custom breathing pattern with personalized timings"
    ]
  },
  {
    title: "During Session",
    items: [
      "Follow the expanding and contracting sphere",
      "Breathe in when the sphere expands",
      "Hold when the sphere is at its largest",
      "Breathe out when the sphere contracts",
      "Stay focused on your breath and the visual guide"
    ]
  },
  {
    title: "Tracking Progress",
    items: [
      "View your session history in the Stats page",
      "Track total sessions and duration",
      "Monitor your longest and average sessions",
      "See your recent breathing exercises"
    ]
  }
] as const;

/**
 * HomePage component that renders the main breathing exercise interface
 * @returns {JSX.Element} The rendered application
 */
const HomePage: React.FC = () => {
  const { theme, isBreathing } = useBreathingStore();
  const navigate = useNavigate();
  const [isCountdownVisible, setIsCountdownVisible] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  /**
   * Toggles the application between fullscreen and normal windowed mode
   */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Determine if buttons should be disabled
  const isButtonsDisabled = isCountdownVisible || isBreathing;

  // Get current phase text


  return (
    <div
      className="w-screen h-screen relative overflow-hidden"
      style={{ background: theme.background }}
    >
      <Canvas
        camera={SCENE_CONFIG.camera}
        className="absolute inset-0"
      >
        <color attach="background" args={[theme.background]} />
        <fog
          attach="fog"
          args={[theme.background, SCENE_CONFIG.fog.near, SCENE_CONFIG.fog.far]}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars {...SCENE_CONFIG.stars} />
        <BreathingSphere />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col items-center">
        {/* Top Bar with Start Button and Controls */}
        <div className="absolute top-4 px-2 left-0 right-0 flex items-center gap-3 justify-between">
          <div className="w-[50%]">
            <Controls />
          </div>
          <div className="relative right-0 scale-80 flex items-center gap-2">

            <StartButton
              onCountdownStart={() => setIsCountdownVisible(true)}
              onCountdownEnd={() => setIsCountdownVisible(false)}
            />
          </div>
        </div>

        {/* Breathing Timer - Only visible during breathing */}
        {isBreathing && (
          <div className="absolute top-20 left-0 right-0 flex justify-center">
            <BreathingTimer />
          </div>
        )}

        {/* Custom Breathing - Centered above menu */}
        <div className="absolute bottom-24 w-screen left-0 right-0 flex justify-center">
          <div className="w-[90%] max-w-[300px] flex justify-center">
            <CustomBreathing />
          </div>
        </div>

        {/* Bottom Menu */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
          <button
            onClick={() => setShowHelp(true)}
            className={`${BUTTON_STYLES.base} text-sm px-3 py-1.5`}
            style={{
              ...BUTTON_STYLES.help(theme.primary),
              filter: isButtonsDisabled ? 'blur(8px)' : 'none',
              pointerEvents: isButtonsDisabled ? 'none' : 'auto',
              opacity: isButtonsDisabled ? 0.5 : 1
            }}
          >
            Help
          </button>
          <button
            onClick={toggleFullscreen}
            className={`${BUTTON_STYLES.base} text-sm px-3 py-1.5`}
            style={{
              ...BUTTON_STYLES.help(theme.primary),
              filter: isButtonsDisabled ? 'blur(8px)' : 'none',
              pointerEvents: isButtonsDisabled ? 'none' : 'auto',
              opacity: isButtonsDisabled ? 0.5 : 1
            }}
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
          <button
            onClick={() => navigate('/stats')}
            className={`${BUTTON_STYLES.base} text-sm px-3 py-1.5`}
            style={{
              ...BUTTON_STYLES.stats(theme.primary),
              filter: isButtonsDisabled ? 'blur(8px)' : 'none',
              pointerEvents: isButtonsDisabled ? 'none' : 'auto',
              opacity: isButtonsDisabled ? 0.5 : 1
            }}
          >
            Stats
          </button>
          <button
            onClick={() => navigate('/about')}
            className={`${BUTTON_STYLES.base} text-sm px-3 py-1.5`}
            style={{
              ...BUTTON_STYLES.about(theme.primary),
              filter: isButtonsDisabled ? 'blur(8px)' : 'none',
              pointerEvents: isButtonsDisabled ? 'none' : 'auto',
              opacity: isButtonsDisabled ? 0.5 : 1
            }}
          >
            About
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <Controls />
        <CustomBreathing />
        <StartButton
          onCountdownStart={() => setIsCountdownVisible(true)}
          onCountdownEnd={() => setIsCountdownVisible(false)}
        />
        <BreathingTimer />
        <div className="absolute bottom-6 right-6 flex gap-4">
          <button
            onClick={() => setShowHelp(true)}
            className={`${BUTTON_STYLES.base}`}
            style={{
              ...BUTTON_STYLES.help(theme.primary),
              filter: isButtonsDisabled ? 'blur(8px)' : 'none',
              pointerEvents: isButtonsDisabled ? 'none' : 'auto',
              opacity: isButtonsDisabled ? 0.5 : 1
            }}
          >
            Help
          </button>
          <button
            onClick={toggleFullscreen}
            className={`${BUTTON_STYLES.base}`}
            style={{
              ...BUTTON_STYLES.help(theme.primary),
              filter: isButtonsDisabled ? 'blur(8px)' : 'none',
              pointerEvents: isButtonsDisabled ? 'none' : 'auto',
              opacity: isButtonsDisabled ? 0.5 : 1
            }}
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
          <button
            onClick={() => navigate('/stats')}
            className={`${BUTTON_STYLES.base}`}
            style={{
              ...BUTTON_STYLES.stats(theme.primary),
              filter: isButtonsDisabled ? 'blur(8px)' : 'none',
              pointerEvents: isButtonsDisabled ? 'none' : 'auto',
              opacity: isButtonsDisabled ? 0.5 : 1
            }}
          >
            Stats
          </button>
          <button
            onClick={() => navigate('/about')}
            className={`${BUTTON_STYLES.base}`}
            style={{
              ...BUTTON_STYLES.about(theme.primary),
              filter: isButtonsDisabled ? 'blur(8px)' : 'none',
              pointerEvents: isButtonsDisabled ? 'none' : 'auto',
              opacity: isButtonsDisabled ? 0.5 : 1
            }}
          >
            About
          </button>
        </div>
      </div>

      {/* Help Popup */}
      {showHelp && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backdropFilter: 'blur(8px)' }}
          onClick={() => setShowHelp(false)}
        >
          <div
            className="w-[90%] md:w-96 p-4 md:p-6 rounded-2xl transform transition-all duration-300"
            style={{
              background: `${theme.background}ee`,
              border: `2px solid ${theme.primary}40`,
              boxShadow: `0 8px 32px ${theme.primary}40`
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold" style={{ color: theme.primary }}>How to Use</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                style={{ color: theme.primary }}
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 md:space-y-6">
              {HELP_INSTRUCTIONS.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium text-sm md:text-base" style={{ color: theme.primary }}>{section.title}</h3>
                  <ul className="space-y-1.5">
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-xs md:text-sm opacity-80 flex items-start"
                        style={{ color: theme.primary }}
                      >
                        <span className="mr-2 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage; 
