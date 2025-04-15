'use client';

/**
 * ThreeScene - D.U.D.E. Bot Showcase
 * An interactive 3D scene featuring the Dude Box robot characters
 */

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Float, Sparkles, GradientTexture, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Create a simple environment map for reflections
function createSimpleEnvMap() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return null
  
  // Create a more dynamic gradient background for reflection
  const gradient = ctx.createLinearGradient(0, 0, 0, size)
  gradient.addColorStop(0, '#050000') // Very dark sky
  gradient.addColorStop(0.45, '#150500')
  gradient.addColorStop(0.5, '#ff5500') // Sharp, bright horizon
  gradient.addColorStop(0.55, '#331100') // Darker ground
  gradient.addColorStop(1, '#110500')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  
  // Add more varied shapes/colors for reflections
  ctx.fillStyle = '#FFAA55'
  ctx.beginPath();
  ctx.ellipse(size * 0.3, size * 0.3, size * 0.05, size * 0.15, Math.PI / 4, 0, Math.PI * 2); // Skewed ellipse
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(size * 0.7, size * 0.6, size * 0.2, size * 0.02); // Sharper horizontal light streak

  ctx.fillStyle = '#FF5500';
  ctx.beginPath();
  ctx.moveTo(size * 0.1, size * 0.8);
  ctx.lineTo(size * 0.35, size * 0.75); // Different shape
  ctx.lineTo(size * 0.15, size * 0.95);
  ctx.closePath();
  ctx.fill();

  // Add a couple more small, bright spots
  ctx.fillStyle = '#FFFF88';
  ctx.fillRect(size * 0.5, size * 0.2, size * 0.03, size * 0.03);
  ctx.fillRect(size * 0.85, size * 0.85, size * 0.04, size * 0.04);

  const texture = new THREE.CanvasTexture(canvas)
  texture.mapping = THREE.EquirectangularReflectionMapping
  
  return texture
}

// Face component that includes all TV screen elements and effects
function DudeBoxFace() {
  // Refs and state for animation - properly typed for THREE.js objects
  const groupRef = useRef<THREE.Group>(null)
  const leftEyeRef = useRef<THREE.Group>(null)
  const rightEyeRef = useRef<THREE.Group>(null)
  const mouthRef = useRef<THREE.Group>(null)
  const [glowIntensity, setGlowIntensity] = useState(0.5)
  const [flicker, setFlicker] = useState(1.0)
  
  // Common shader setup
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  
  // TV static shader (for X eye)
  const staticShader = useMemo(() => ({
    uniforms: { time: { value: 0 } },
    vertexShader,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      void main() {
        // Dense TV static
        float noise = random(vUv * 300.0 + time * 2.0);
        float staticMask = step(0.6, noise);
        
        // Occasional glitches
        if (random(vec2(time * 0.5, 0.0)) < 0.05) {
          staticMask = random(vUv * 200.0 + time * 5.0);
        }
        
        gl_FragColor = vec4(vec3(staticMask), 1.0);
      }
    `
  }), [])
  
  // 404 error message shader (green eye)
  const errorShader = useMemo(() => ({
    uniforms: { time: { value: 0 } },
    vertexShader,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      // Binary pattern function
      float binaryPattern(vec2 st, float scale, float t) {
        vec2 grid = fract(st * scale);
        float cell = random(floor(st * scale) + floor(t * 2.0));
        return step(0.6, cell);
      }
      
      void main() {
        vec2 p = vUv;
        // Dark green background
        vec3 color = vec3(0.0, 0.15, 0.05);
        
        // Draw "404" text and binary patterns
        if ((p.y > 0.7 && p.y < 0.9 && p.x > 0.1 && p.x < 0.9 && 
            ((p.x > 0.1 && p.x < 0.3) || // 4
             (p.x > 0.4 && p.x < 0.6) || // 0
             (p.x > 0.7 && p.x < 0.9)))) { // 4
          color = vec3(0.0, 0.8, 0.2) * (0.7 + 0.3 * sin(time * 3.0));
        }
        
        // ERROR text in middle
        if (p.y > 0.45 && p.y < 0.55 && p.x > 0.2 && p.x < 0.8) {
          color = vec3(0.0, 0.9, 0.25) * (0.8 + 0.2 * sin(time * 2.0 + p.x * 5.0));
        }
        
        // Binary in bottom
        if (p.y < 0.4) {
          float binary = binaryPattern(p, 20.0, time * 0.2);
          if (binary > 0.5) color = vec3(0.0, 0.7, 0.2);
        }
        
        // Occasional red glitch
        if (random(vec2(floor(time * 2.0), 23.45)) < 0.03) {
          color = vec3(0.9, 0.2, 0.1);
        }
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  }), [])

  // Wavelength visualization shader (mouth)
  const wavelengthShader = useMemo(() => ({
    uniforms: { time: { value: 0 } },
    vertexShader,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      // Create wave pattern
      float wave(float x, float freq, float speed, float amp, float phase) {
        // Add some noise to amplitude and frequency
        float noise = random(vec2(x * 0.1, time * 0.1));
        float noisyAmp = amp * (0.8 + noise * 0.4);
        float noisyFreq = freq * (0.9 + noise * 0.2);
        return sin(x * noisyFreq + time * speed + phase) * noisyAmp;
      }
      
      void main() {
        vec2 uv = vUv;
        float y = uv.y * 2.0 - 1.0;
        
        // Multiple overlapping waves - Increased Amplitudes
        float wave1 = wave(uv.x, 8.0, 2.0, 0.6, 0.0); // Amp 0.4 -> 0.6
        float wave2 = wave(uv.x, 12.0, -1.5, 0.25, 1.5); // Amp 0.15 -> 0.25
        float wave3 = wave(uv.x, 4.0, 3.0, 0.35, 2.0); // Amp 0.25 -> 0.35
        float wave4 = wave(uv.x, 20.0, 1.0, 0.1, 3.0); // Added a faster, smaller wave
        
        float combinedWave = wave1 + wave2 + wave3 + wave4;
        float dist = abs(y - combinedWave * 0.5); // Scale combined effect slightly more
        float mask = smoothstep(0.12, 0.0, dist); // Make the line thicker
        
        // Pulse effect
        float pulse = 0.7 + 0.3 * sin(time * 3.0);
        
        // Mix colors from dark red to bright orange
        vec3 color = mix(vec3(0.7, 0.0, 0.0), vec3(1.0, 0.2, 0.0), mask * pulse);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  }), [])
  
  // Materials instances
  const materials = useMemo(() => ({
    static: new THREE.ShaderMaterial(staticShader),
    error: new THREE.ShaderMaterial(errorShader),
    waveform: new THREE.ShaderMaterial(wavelengthShader),
    feature: new THREE.MeshStandardMaterial({
      color: '#000000',
      roughness: 0.3,
      metalness: 0.7,
      emissive: new THREE.Color('#330000').multiplyScalar(flicker),
      emissiveIntensity: glowIntensity * 2.5
    })
  }), [staticShader, errorShader, wavelengthShader, flicker, glowIntensity])
  
  // Animation loop
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    
    // Update shader times
    Object.values(materials).forEach(material => {
      if ('uniforms' in material && material.uniforms && 'time' in material.uniforms) {
        material.uniforms.time.value = t
      }
    })
    
    // Random flickering effect - more pronounced
    if (Math.random() > 0.95) {
      const newFlicker = Math.random() * 0.7 + 0.3
      setFlicker(newFlicker)
      
      if (materials.feature.emissiveIntensity !== undefined) {
        materials.feature.emissiveIntensity = glowIntensity * 2.5 * newFlicker
        materials.feature.emissive.setRGB(0.05 * newFlicker, 0, 0)
      }
    }
    
    // Glow pulsation
    setGlowIntensity((Math.sin(t * 2) * 0.2 + 0.8) * flicker)
    
    // Eye sizing - now with proper null checks and random jitters
    if (leftEyeRef.current) {
      // Add some random jitter
      const jitterX = Math.random() > 0.98 ? (Math.random() - 0.5) * 0.1 : 0
      const jitterY = Math.random() > 0.98 ? (Math.random() - 0.5) * 0.1 : 0
      leftEyeRef.current.scale.set(0.85 + jitterX, 0.85 + jitterY, 1)
    }
    
    if (rightEyeRef.current) {
      // Different jitter pattern
      const jitterX = Math.random() > 0.97 ? (Math.random() - 0.5) * 0.15 : 0
      const jitterY = Math.random() > 0.97 ? (Math.random() - 0.5) * 0.15 : 0
      rightEyeRef.current.scale.set(0.75 + jitterX, 0.75 + jitterY, 1)
    }
    
    // Mouth subtle animation with occasional glitches
    if (mouthRef.current) {
      // Base animation
      let scaleX = 1.0 + Math.sin(t * 0.5) * 0.02
      let scaleY = 1.0 + Math.cos(t * 0.7) * 0.02
      
      // Occasional glitch
      if (Math.random() > 0.99) {
        scaleX *= Math.random() * 0.3 + 0.85
        scaleY *= Math.random() * 0.3 + 0.85
      }
      
      mouthRef.current.scale.x = scaleX
      mouthRef.current.scale.y = scaleY
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* Left eye - 404 error screen */}
      <group position={[-0.4, 0.3, 1.02]} ref={leftEyeRef}>
        <mesh>
          <planeGeometry args={[0.8, 0.8]} />
          <primitive object={materials.error} attach="material" />
        </mesh>
        
        {/* Green glow */}
        <pointLight position={[0, 0, 0.1]} color="#00ff77" 
                  intensity={1.8 * flicker} distance={1.2} />
        
        {/* Plus shape */}
        <mesh>
          <boxGeometry args={[0.65, 0.12, 0.01]} />
          <primitive object={materials.feature} attach="material" />
        </mesh>
        
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.65, 0.12, 0.01]} />
          <primitive object={materials.feature} attach="material" />
        </mesh>
      </group>
      
      {/* Right eye - Static with X */}
      <group position={[0.4, 0.3, 1.02]} ref={rightEyeRef}>
        <mesh>
          <circleGeometry args={[0.35, 32]} />
          <primitive object={materials.static} attach="material" />
        </mesh>
        
        {/* Reduced static around the X */}
        <mesh position={[0, 0, -0.01]}>
          <circleGeometry args={[0.42, 32]} />
          <primitive object={materials.static} attach="material" transparent opacity={0.4} />
        </mesh>
        
        {/* Red glow */}
        <pointLight position={[0, 0, 0.1]} color="#ff0022" 
                  intensity={2.0 * flicker} distance={1.2} />
        
        {/* X shape */}
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.65, 0.12, 0.01]} />
          <primitive object={materials.feature} attach="material" />
        </mesh>
        
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.65, 0.12, 0.01]} />
          <primitive object={materials.feature} attach="material" />
        </mesh>
      </group>
      
      {/* Mouth with wavelength visualization INSIDE the rectangle */}
      <group position={[0, -0.3, 1.02]} ref={mouthRef}>
        {/* Red rectangle background - WIDER */} 
        <RoundedBox args={[1.0, 0.1, 0.02]} radius={0.02} smoothness={4}>
          <meshBasicMaterial color="#6b0000" />
        </RoundedBox>
        
        {/* Wavelength inside the red rectangle - WIDER */} 
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.95, 0.08]} />
          <primitive object={materials.waveform} attach="material" />
        </mesh>
        
        {/* Glow effects */}
        <pointLight position={[0, 0, 0.2]} color="#ff2200" 
                  intensity={1.2 * flicker} distance={1.0} />
      </group>
    </group>
  );
}

// Chrome box with face - positioned so the face always faces the camera
function ChromeBox() {
  const boxRef = useRef<THREE.Group>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  // Track mouse movement globally, not just within the canvas
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert screen coordinates to normalized -1 to 1 range
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1
      setMousePos({ x, y })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  
  // Animation with glitching and tracking global mouse position
  useFrame((state) => {
    if (!boxRef.current) return
    const t = state.clock.getElapsedTime()
    
    // More strictly limited rotation (20 degrees maximum)
    const maxRotation = Math.PI / 9 // About 20 degrees
    
    // Get normalized mouse position (now from our state, not Three.js)
    const { x: mouseX, y: mouseY } = mousePos
    
    // Base rotation from mouse with stricter limits
    let targetX = Math.max(Math.min(mouseY * -maxRotation, maxRotation), -maxRotation)
    let targetY = Math.max(Math.min(mouseX * maxRotation, maxRotation), -maxRotation)
    
    // Add occasional glitches with random jerky movements (smaller amplitude)
    if (Math.random() > 0.99) {
      targetX += (Math.random() - 0.5) * 0.2 // Smaller random jerk
      targetY += (Math.random() - 0.5) * 0.2
    }
    
    // Apply rotation with damping for smoother movement
    if (boxRef.current) {
      // Faster response when moving toward mouse
      const damping = 0.15
      boxRef.current.rotation.x += (targetX - boxRef.current.rotation.x) * damping
      boxRef.current.rotation.y += (targetY - boxRef.current.rotation.y) * damping
      
      // Add a subtle floating motion with occasional glitchy positional shifts
      boxRef.current.position.y = Math.sin(t * 0.5) * 0.05
      
      // Random position glitches
      if (Math.random() > 0.995) {
        boxRef.current.position.x += (Math.random() - 0.5) * 0.03
        boxRef.current.position.y += (Math.random() - 0.5) * 0.03
      }
    }
  })
  
  // Chrome material with reflection
  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: '#D8D8D8',
    roughness: 0.03,
    metalness: 1.0,
    envMapIntensity: 2.5
  })
  
  return (
    <group ref={boxRef} scale={[2, 2, 2]}>
      {/* Make the cube face the camera */}
      <group rotation={[0, 0, 0]}> 
        {/* Chrome cube with TV face on front */}
        <RoundedBox args={[2, 2, 2]} radius={0.3} smoothness={16}>
          <meshStandardMaterial attach="material-0" {...chromeMaterial} />
          <meshStandardMaterial attach="material-1" {...chromeMaterial} />
          <meshStandardMaterial attach="material-2" {...chromeMaterial} />
          <meshStandardMaterial attach="material-3" {...chromeMaterial} />
          <meshStandardMaterial attach="material-4" {...chromeMaterial} />
          {/* Face on the front side */}
          <meshBasicMaterial attach="material-5" color="#000000" />
        </RoundedBox>
        
        {/* Face components */}
        <DudeBoxFace />
      </group>
    </group>
  )
}

// Modify this to be the actual component in your page.tsx file
// This replaces the existing ThreeScene component
interface ThreeSceneProps {
  className?: string;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ className = "" }) => {
  return (
    <div className={`w-full h-[600px] ${className}`} style={{ background: 'transparent' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, outputColorSpace: THREE.SRGBColorSpace }}
        style={{ background: 'transparent' }}
      >
        {/* Environment for nuclear explosion reflections */}
        <Environment files="/Nuclear-Explosion.jpg" background={false} />
        
        {/* Basic lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffcc99" />
        <directionalLight position={[-5, 5, 5]} intensity={0.5} color="#ff5500" />
        <pointLight position={[0, 3, 3]} intensity={1.0} color="#ff3300" />
        
        {/* Atmosphere particles */}
        <Sparkles count={250} scale={15} size={0.6} speed={0.3} opacity={0.3} color="#553333" />
        
        {/* Floating chrome box - with glitchy movements */}
        <Float 
          speed={2}
          rotationIntensity={0.1} 
          floatIntensity={0.3} 
          floatingRange={[-0.1, 0.1]}
        >
          <ChromeBox />
        </Float>
      </Canvas>
    </div>
  )
}

export default ThreeScene;