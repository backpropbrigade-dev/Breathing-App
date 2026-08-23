/**
 * BreathingCanvas component that sets up the 3D scene for the breathing exercise.
 * Renders the breathing sphere and background elements in a Three.js canvas.
 */
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { BreathingSphere } from './BreathingSphere';
import { useBreathingStore } from '../store/breathingStore';

/**
 * Configuration for the 3D scene
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
  lights: {
    ambient: {
      intensity: 0.5
    },
    point: {
      position: [10, 10, 10] as [number, number, number],
      intensity: 1
    }
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
 * BreathingCanvas component that sets up the 3D scene for the breathing exercise
 * @returns {JSX.Element} The rendered 3D canvas
 */
export const BreathingCanvas: React.FC = () => {
  const { theme } = useBreathingStore();

  return (
    <Canvas 
      camera={SCENE_CONFIG.camera}
      className="absolute inset-0"
    >
      <color attach="background" args={[theme.background]} />
      <fog 
        attach="fog" 
        args={[theme.background, SCENE_CONFIG.fog.near, SCENE_CONFIG.fog.far]} 
      />
      <ambientLight intensity={SCENE_CONFIG.lights.ambient.intensity} />
      <pointLight 
        position={SCENE_CONFIG.lights.point.position}
        intensity={SCENE_CONFIG.lights.point.intensity}
      />
      <Stars {...SCENE_CONFIG.stars} />
      <BreathingSphere />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}; 
