/**
 * BreathingSphere component that renders an animated sphere for breathing exercises.
 * Features:
 * - Smooth expansion/contraction based on breathing phases
 * - Mobile-responsive scaling (max 1.5x on mobile, 2x on desktop)
 * - Dual-layer sphere with distortion and wobble effects
 * - Automatic phase transitions
 * - Smooth reset animation
 * 
 * @component
 * @returns {JSX.Element} The rendered breathing sphere
 */
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import { useBreathingStore } from '../store/breathingStore';
import * as THREE from 'three';

/**
 * Configuration for the breathing sphere materials
 * Defines visual properties for both inner and outer spheres:
 * - Inner sphere: Distorted material with metallic finish
 * - Outer sphere: Wobbling material with lower opacity
 */
const MATERIAL_CONFIG = {
  inner: {
    opacity: 0.8,
    distort: 0.3,
    speed: 2,
    roughness: 0.2,
    metalness: 0.8
  },
  outer: {
    opacity: 0.2,
    factor: 0.2,
    speed: 1
  }
} as const;

/**
 * Configuration for the sphere geometry
 * Defines size and detail level for both spheres:
 * - Inner sphere: Higher detail (64 segments)
 * - Outer sphere: Lower detail (32 segments) with larger scale
 */
const SPHERE_CONFIG = {
  inner: {
    args: [1, 64, 64] as [number, number, number]
  },
  outer: {
    args: [1, 32, 32] as [number, number, number],
    scale: 1.2
  }
} as const;

/**
 * BreathingSphere component that renders an animated sphere for breathing exercises
 * Features:
 * - Smooth expansion/contraction based on breathing phases
 * - Automatic phase transitions (inhale, hold, exhale)
 * - Smooth reset animation when breathing stops
 * - Continuous rotation of outer sphere
 * - Responsive scale limits for mobile screens
 * 
 * @returns {JSX.Element} The rendered breathing sphere
 */
export const BreathingSphere: React.FC = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const outerSphereRef = useRef<THREE.Mesh>(null);
  const startTime = useRef<number>(0);
  const isResetting = useRef(false);
  const resetStartTime = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  const {
    inhaleTime,
    holdTime,
    exhaleTime,
    isBreathing,
    theme,
    setCurrentPhase,
  } = useBreathingStore();

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalCycleTime = inhaleTime + holdTime + exhaleTime;
  const scale = useRef(1);

  // Reset startTime when breathing starts and initiate smooth reset when breathing stops
  useEffect(() => {
    if (isBreathing) {
      startTime.current = Date.now();
      isResetting.current = false;
    } else if (sphereRef.current && outerSphereRef.current) {
      isResetting.current = true;
      resetStartTime.current = Date.now();
    }
  }, [isBreathing]);

  useFrame((_, delta) => {
    if (!sphereRef.current || !outerSphereRef.current) return;

    if (isResetting.current) {
      // Smooth reset animation
      const resetElapsed = (Date.now() - resetStartTime.current) / 1000;
      const resetDuration = 0.5;
      const resetProgress = Math.min(resetElapsed / resetDuration, 1);
      
      scale.current = THREE.MathUtils.lerp(scale.current, 1, resetProgress);
      
      sphereRef.current.scale.set(scale.current, scale.current, scale.current);
      outerSphereRef.current.scale.set(
        scale.current * SPHERE_CONFIG.outer.scale,
        scale.current * SPHERE_CONFIG.outer.scale,
        scale.current * SPHERE_CONFIG.outer.scale
      );

      if (resetProgress === 1) {
        isResetting.current = false;
      }
      return;
    }

    if (!isBreathing) return;

    const elapsedTime = (Date.now() - startTime.current) / 1000;
    const time = elapsedTime % totalCycleTime;
    
    // Calculate scale based on breathing phase with mobile limit
    let targetScale = 1;
    if (time < inhaleTime) {
      setCurrentPhase('inhale');
      const progress = time / inhaleTime;
      targetScale = 1 + progress;
    } else if (time < inhaleTime + holdTime) {
      setCurrentPhase('hold');
      targetScale = 2;
    } else {
      setCurrentPhase('exhale');
      const progress = (time - (inhaleTime + holdTime)) / exhaleTime;
      targetScale = 2 - progress;
    }

    // Apply mobile scale limit
    const maxScale = isMobile ? 1.5 : 2; // Limit expansion on mobile
    scale.current = Math.min(targetScale, maxScale);

    // Apply transformations
    sphereRef.current.scale.set(scale.current, scale.current, scale.current);
    outerSphereRef.current.scale.set(
      scale.current * SPHERE_CONFIG.outer.scale,
      scale.current * SPHERE_CONFIG.outer.scale,
      scale.current * SPHERE_CONFIG.outer.scale
    );
    outerSphereRef.current.rotation.y += delta * 0.2;
  });

  return (
    <group>
      <Sphere ref={sphereRef} args={SPHERE_CONFIG.inner.args}>
        <MeshDistortMaterial
          color={theme.primary}
          transparent
          {...MATERIAL_CONFIG.inner}
        />
      </Sphere>
      <Sphere ref={outerSphereRef} args={SPHERE_CONFIG.outer.args}>
        <MeshWobbleMaterial
          color={theme.secondary}
          transparent
          {...MATERIAL_CONFIG.outer}
        />
      </Sphere>
    </group>
  );
}; 
