'use client';

/**
 * ThreeScene - Futuristic Data Visualization
 * Modern network visualization with vibrant colors and dynamic effects
 */

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { 
  Float, 
  Sparkles, 
  PerformanceMonitor,
  OrbitControls,
  Line,
  useTexture,
  Effects,
  MeshDistortMaterial,
  GradientTexture,
  MeshTransmissionMaterial,
  useFBO
} from '@react-three/drei'
import * as THREE from 'three'
import { UnrealBloomPass } from 'three-stdlib'

// Extend Three.js with shader passes
extend({ UnrealBloomPass })

// Define interfaces for our component props
interface GlowingNodeProps {
  position: [number, number, number];
  radius: number;
  color: string;
  intensity?: number;
  speed?: number;
}

interface DataConnectionProps {
  startPoint: [number, number, number];
  endPoint: [number, number, number];
  color: string;
  thickness?: number;
  speed?: number;
  pulseIntensity?: number;
}

interface DataPacketProps {
  points: [number, number, number][];
  color: string;
  speed?: number;
}

interface ConnectionData {
  startPoint: [number, number, number];
  endPoint: [number, number, number];
  color: string;
  thickness: number;
  speed: number;
  pulseIntensity: number;
}

// Glowing Node Component
function GlowingNode({ position, radius, color, intensity = 1.0, speed = 1.0 }: GlowingNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  // Animation
  useFrame((state) => {
    if (!meshRef.current || !haloRef.current || !lightRef.current) return;
    
    const t = state.clock.getElapsedTime() * speed;
    
    // Pulse effect
    const pulse = Math.sin(t) * 0.1 + 0.9;
    haloRef.current.scale.set(pulse, pulse, pulse);
    
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.emissiveIntensity = 0.7 + Math.sin(t * 1.5) * 0.3;
    }
    
    // Subtle light intensity variation
    lightRef.current.intensity = intensity * (0.8 + Math.sin(t * 0.5) * 0.2);
  });
  
  return (
    <group position={position}>
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={1} 
          metalness={0.2}
          roughness={0.3} 
        />
      </mesh>
      
      {/* Outer glow halo */}
      <mesh ref={haloRef} scale={1.2}>
        <sphereGeometry args={[radius, 32, 32]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={1.5}
          chromaticAberration={0.5}
          transmission={1}
          clearcoat={0.1}
          clearcoatRoughness={0.1}
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          distortion={0.2}
          temporalDistortion={0.1}
          distortionScale={0.5}
          reflectivity={0.2}
        />
      </mesh>
      
      {/* Point light */}
      <pointLight 
        ref={lightRef} 
        color={color} 
        intensity={intensity} 
        distance={radius * 10} 
        decay={2} 
      />
    </group>
  );
}

// Data Connection Line
function DataConnection({ startPoint, endPoint, color, thickness = 1.0, speed = 1.0, pulseIntensity = 0.3 }: DataConnectionProps) {
  // Not using ref for Line component since it's causing type issues
  const [lineOpacity, setLineOpacity] = useState(0.7);
  const [points, setPoints] = useState<[number, number, number][]>([]);
  
  // Generate a slightly curved path
  useEffect(() => {
    const curvePoints: [number, number, number][] = [];
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...startPoint),
      new THREE.Vector3(
        (startPoint[0] + endPoint[0]) / 2,
        (startPoint[1] + endPoint[1]) / 2 + (Math.random() - 0.5) * 2,
        (startPoint[2] + endPoint[2]) / 2 + (Math.random() - 0.5) * 2
      ),
      new THREE.Vector3(...endPoint)
    );
    
    const divisions = 20;
    for (let i = 0; i <= divisions; i++) {
      const point = curve.getPoint(i / divisions);
      curvePoints.push([point.x, point.y, point.z] as [number, number, number]);
    }
    
    setPoints(curvePoints);
  }, [startPoint, endPoint]);
  
  // Animation - pulse of light along the line
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    
    // Subtle pulse effect
    setLineOpacity(0.7 + Math.sin(t) * pulseIntensity);
  });
  
  return (
    <group>
      {points.length >= 2 && (
        <Line
          points={points}
          color={color}
          lineWidth={thickness}
          transparent={true}
          opacity={lineOpacity}
        />
      )}
      
      {/* Data packet moving along the line */}
      {points.length >= 2 && (
        <DataPacket 
          points={points} 
          color={color} 
          speed={speed * 0.5} 
        />
      )}
    </group>
  );
}

// Data packet that travels along a line
function DataPacket({ points, color, speed = 1.0 }: DataPacketProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [progress, setProgress] = useState(0);
  
  // Animation - move packet along the path
  useFrame((state, delta) => {
    if (!meshRef.current || points.length < 2) return;
    
    // Update progress
    setProgress((prev) => {
      const newProgress = (prev + delta * speed) % 1;
      
      // Calculate position along the path
      const index = Math.floor(newProgress * (points.length - 1));
      const nextIndex = Math.min(index + 1, points.length - 1);
      const subProgress = (newProgress * (points.length - 1)) % 1;
      
      const currentPos = points[index];
      const nextPos = points[nextIndex];
      
      const newPos: [number, number, number] = [
        currentPos[0] + (nextPos[0] - currentPos[0]) * subProgress,
        currentPos[1] + (nextPos[1] - currentPos[1]) * subProgress,
        currentPos[2] + (nextPos[2] - currentPos[2]) * subProgress
      ];
      
      setPosition(newPos);
      
      return newProgress;
    });
  });
  
  useEffect(() => {
    if (points.length > 0) {
      setPosition(points[0]);
    }
  }, [points]);
  
  // Match rotation to direction of travel
  const rotation = useMemo(() => {
    if (points.length < 2) return [0, 0, 0];
    
    const index = Math.floor(progress * (points.length - 1));
    const nextIndex = Math.min(index + 1, points.length - 1);
    
    const current = points[index];
    const next = points[nextIndex];
    
    // Calculate direction vector
    const dir = {
      x: next[0] - current[0],
      y: next[1] - current[1],
      z: next[2] - current[2]
    };
    
    // Convert to rotation
    const angle = Math.atan2(dir.z, dir.x);
    
    return [0, angle, 0];
  }, [points, progress]);
  
  return (
    <mesh 
      ref={meshRef}
      position={position}
      rotation={rotation as [number, number, number]}
    >
      <coneGeometry args={[0.05, 0.15, 16]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={1}
        metalness={0.5}
        roughness={0.2}
      />
    </mesh>
  );
}

// Digital Rain - Matrix-style falling particles
function DigitalRain({ count = 200, speed = 1 }) {
  // Ensure count is always positive
  const particleCount = Math.max(1, count);
  const rainRef = useRef<THREE.Points>(null);
  
  // Create particles
  const [positions, colors, sizes, speeds] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = Math.random() * 30 - 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      
      // Color - vibrant glowing colors
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        // Bright cyan
        colors[i3] = 0.1;
        colors[i3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i3 + 2] = 0.8 + Math.random() * 0.2;
      } else if (colorChoice < 0.8) {
        // Electric blue
        colors[i3] = 0.1;
        colors[i3 + 1] = 0.4 + Math.random() * 0.2;
        colors[i3 + 2] = 0.9 + Math.random() * 0.1;
      } else {
        // Bright green
        colors[i3] = 0.1;
        colors[i3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i3 + 2] = 0.3 + Math.random() * 0.2;
      }
      
      // Size - varied for parallax effect
      sizes[i] = Math.random() * 0.5 + 0.2;
      
      // Speed - varies by particle
      speeds[i] = (Math.random() * 0.8 + 0.5) * speed;
    }
    
    return [positions, colors, sizes, speeds];
  }, [particleCount, speed]);
  
  // Animation for falling particles
  useFrame((state, delta) => {
    if (!rainRef.current) return;
    
    const geometry = rainRef.current.geometry;
    const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;
    
    // Make sure attribute exists and has the expected size
    if (!positionAttribute || positionAttribute.count < particleCount) return;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Make sure we don't go out of bounds
      if (i3 + 2 >= positionAttribute.array.length) continue;
      
      // Move down based on speed
      positionAttribute.array[i3 + 1] -= speeds[i] * delta * 5;
      
      // Reset if out of view
      if (positionAttribute.array[i3 + 1] < -15) {
        positionAttribute.array[i3 + 1] = 15;
        positionAttribute.array[i3] = (Math.random() - 0.5) * 20;
        positionAttribute.array[i3 + 2] = (Math.random() - 0.5) * 20;
      }
    }
    
    positionAttribute.needsUpdate = true;
  });
  
  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particleCount}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={particleCount}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={sizes}
          count={particleCount}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Network Grid - sleek modern grid structure
function NetworkGrid() {
  const gridRef = useRef<THREE.Group>(null);
  
  // Grid size parameters
  const gridSize = 20;
  const cellSize = 5;
  
  // Define node type
  interface NodeData {
    position: [number, number, number];
    radius: number;
    color: string;
    intensity: number;
    speed: number;
  }
  
  // Nodes to place throughout the grid
  const nodes = useMemo<NodeData[]>(() => {
    const items: NodeData[] = [];
    
    // Create nodes at key intersections
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * gridSize;
      const y = (Math.random() - 0.5) * (gridSize * 0.5);
      const z = (Math.random() - 0.5) * gridSize;
      
      // Random radius
      const radius = Math.random() * 0.2 + 0.1;
      
      // Random color - bright neons
      const colors = [
        "#00ffff", // Cyan
        "#00ff88", // Bright green
        "#0088ff", // Electric blue
        "#5500ff", // Violet
        "#ff00ff"  // Magenta
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      items.push({
        position: [x, y, z] as [number, number, number],
        radius,
        color,
        intensity: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 1.5 + 0.5
      });
    }
    
    return items;
  }, []);
  
  // Create connections between nodes
  const connections = useMemo<ConnectionData[]>(() => {
    const lines: ConnectionData[] = [];
    
    // Connect nodes with probability
    nodes.forEach((nodeA, i) => {
      nodes.forEach((nodeB, j) => {
        if (i !== j && Math.random() < 0.2) {
          // Only connect some nodes
          lines.push({
            startPoint: nodeA.position,
            endPoint: nodeB.position,
            color: Math.random() > 0.5 ? nodeA.color : nodeB.color,
            thickness: Math.random() * 2 + 1,
            speed: Math.random() * 1.5 + 0.5,
            pulseIntensity: Math.random() * 0.3 + 0.1
          });
        }
      });
    });
    
    return lines;
  }, [nodes]);
  
  // Subtle animation for the whole grid
  useFrame((state) => {
    if (!gridRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Very subtle movement
    gridRef.current.rotation.y = Math.sin(t * 0.05) * 0.05;
    gridRef.current.rotation.x = Math.sin(t * 0.04) * 0.03;
  });
  
  return (
    <group ref={gridRef}>
      {/* Nodes */}
      {nodes.map((node, i) => (
        <GlowingNode
          key={`node-${i}`}
          position={node.position}
          radius={node.radius}
          color={node.color}
          intensity={node.intensity}
          speed={node.speed}
        />
      ))}
      
      {/* Connections */}
      {connections.map((conn, i) => (
        <DataConnection
          key={`conn-${i}`}
          startPoint={conn.startPoint}
          endPoint={conn.endPoint}
          color={conn.color}
          thickness={conn.thickness}
          speed={conn.speed}
          pulseIntensity={conn.pulseIntensity}
        />
      ))}
    </group>
  );
}

// Floating Data Cubes
function DataCubes({ count = 20 }) {
  const cubeRefs = useRef<THREE.Group[]>([]);
  
  // Generate cube positions and properties
  const cubes = useMemo(() => {
    const items = [];
    
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 0.5 + 0.1;
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 20;
      
      items.push({
        position: [x, y, z] as [number, number, number],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        size,
        speed: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? "#00ffaa" : "#00aaff"
      });
    }
    
    return items;
  }, [count]);
  
  // Animation
  useFrame((state) => {
    cubeRefs.current.forEach((cube, i) => {
      if (!cube) return;
      
      const t = state.clock.getElapsedTime() * cubes[i].speed;
      
      // Rotate cubes
      cube.rotation.x += 0.002 * cubes[i].speed;
      cube.rotation.y += 0.003 * cubes[i].speed;
      
      // Subtle floating motion
      cube.position.y += Math.sin(t) * 0.003;
    });
  });
  
  return (
    <group>
      {cubes.map((cube, i) => (
        <group 
          key={`cube-${i}`}
          position={cube.position}
          rotation={cube.rotation as [number, number, number]}
          ref={(el) => { if (el) cubeRefs.current[i] = el; }}
        >
          <mesh>
            <boxGeometry args={[cube.size, cube.size, cube.size]} />
            <meshStandardMaterial 
              color={cube.color}
              emissive={cube.color}
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
              transparent={true}
              opacity={0.7}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Post-processing effects
function BloomEffect({ intensity = 1.5 }) {
  return (
    <Effects disableGamma>
      {/* @ts-ignore - UnrealBloomPass is extended but TypeScript doesn't recognize it */}
      <unrealBloomPass 
        threshold={0.1} 
        strength={intensity} 
        radius={1} 
      />
    </Effects>
  );
}

// Main Scene Component
function DataNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Track mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Responsive camera movement based on mouse position
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const { x: mouseX, y: mouseY } = mousePos;
    
    // Apply smooth rotation based on mouse
    groupRef.current.rotation.y += (mouseX * 0.2 - groupRef.current.rotation.y) * delta * 2;
    groupRef.current.rotation.x += (mouseY * 0.2 - groupRef.current.rotation.x) * delta * 2;
  });
  
  // Use error boundary to prevent entire scene from crashing
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <group>
        {/* Fallback simple visualization */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#00aaff" />
        </mesh>
      </group>
    );
  }
  
  return (
    <group ref={groupRef}>
      <NetworkGrid />
      <DigitalRain count={200} speed={1.5} />
      <DataCubes count={30} />
      
      {/* Ambient volume particles */}
      <Sparkles
        count={1000}
        scale={25}
        size={0.2}
        speed={0.3}
        opacity={0.2}
        color="#00ffff"
      />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 5]} intensity={0.5} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#00ffff" />
    </group>
  );
}

// Main ThreeScene component
interface ThreeSceneProps {
  className?: string;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ className = "" }) => {
  const [perfLevel, setPerfLevel] = useState<number>(1);
  
  return (
    <div className={`w-full h-[600px] ${className}`} style={{ background: 'transparent' }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, perfLevel > 0.75 ? 2 : 1.5]}
        gl={{ 
          antialias: true, 
          alpha: true,
          preserveDrawingBuffer: true,
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5
        }}
        style={{ background: 'transparent' }}
      >
        {/* Performance monitoring */}
        <PerformanceMonitor 
          onDecline={() => setPerfLevel(0.5)} 
          onIncline={() => setPerfLevel(1)}
        >
          {/* Scene content */}
          <DataNetwork />
          
          {/* Post-processing effects */}
          <BloomEffect intensity={1.5} />
          
          {/* Camera controls */}
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.3}
            minPolarAngle={Math.PI * 0.4}
            maxPolarAngle={Math.PI * 0.6}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
};

export default ThreeScene;