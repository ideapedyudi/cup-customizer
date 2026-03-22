'use client';

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useTexture, Decal, useCursor } from '@react-three/drei';
import * as THREE from 'three';

interface CupProps {
  textureUrl?: string | null;
  onTextureLoaded?: () => void;
}

function TexturedMaterial({ 
  url, 
  onTextureLoaded 
}: { 
  url: string; 
  onTextureLoaded?: () => void 
}) {
  const texture = useTexture(url);
  
  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  useEffect(() => {
    if (onTextureLoaded) {
      const timer = setTimeout(() => {
        onTextureLoaded();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [url, onTextureLoaded]);

  return (
    <Decal 
      position={[0, 0, 1.75]} 
      rotation={[0, 0, 0]} 
      scale={[2.5, 2.5, 3]} 
    >
      <meshStandardMaterial 
        map={texture}
        polygonOffset
        polygonOffsetFactor={-1}
        transparent={true}
        // alphaTest={0.01} prevents the transparent parts from blocking other meshes 
        // while allowing true PNG alpha to shine through without darkening from MultiplyBlending
        alphaTest={0.01}
        roughness={0.4}
        metalness={0.1}
        depthTest={true}
      />
    </Decal>
  );
}

function Cup({ textureUrl, onTextureLoaded }: CupProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, 'pointer', 'auto');

  return (
    <group 
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* --- Cup Body --- */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[2, 1.5, 5, 32]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          roughness={0.2}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
        
        {textureUrl && (
          <TexturedMaterial url={textureUrl} onTextureLoaded={onTextureLoaded} />
        )}
      </mesh>

      {/* --- Cup Lid --- */}
      <mesh castShadow receiveShadow position={[0, 2.6, 0]}>
        <cylinderGeometry args={[2.05, 2.05, 0.4, 32]} />
        <meshStandardMaterial 
          color="#111111" 
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      
      <mesh castShadow receiveShadow position={[0, 2.85, 0]}>
        <cylinderGeometry args={[1.7, 1.9, 0.3, 32]} />
        <meshStandardMaterial 
          color="#111111" 
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      
      <mesh castShadow receiveShadow position={[0, 3.0, 1.2]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.3]} />
        <meshStandardMaterial 
          color="#000000" 
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}

export default function CupScene({ textureUrl, onTextureLoaded }: CupProps) {
  const controlsRef = useRef<any>(null);

  // Return to the front view whenever the user uploads a new design
  useEffect(() => {
    if (controlsRef.current && textureUrl) {
      controlsRef.current.reset();
    }
  }, [textureUrl]);

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-transparent">
      {/* gl={{ preserveDrawingBuffer: true }} is CRITICAL to allow taking screenshots */}
      <Canvas 
        shadows 
        camera={{ position: [0, 1.5, 12], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, alpha: true }}
      >
        <ambientLight intensity={0.4} color="#0f172a" />
        
        {/* Neon Orange Light from top right */}
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.4} 
          penumbra={1} 
          intensity={50} 
          color="#ff7b00" 
          castShadow 
        />
        
        {/* Neon Yellow Light from bottom left */}
        <spotLight 
          position={[-10, 5, -10]} 
          angle={0.4} 
          penumbra={1} 
          intensity={30} 
          color="#ffcc00" 
        />
        
        {/* Fill Light directly in front for bright sticker clarity */}
        <directionalLight position={[0, 0, 5]} intensity={1.5} color="#ffffff" />
        
        <Suspense fallback={null}>
          <Cup textureUrl={textureUrl} onTextureLoaded={onTextureLoaded} />
        </Suspense>
        
        <OrbitControls 
          ref={controlsRef}
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 1.5} 
          enableDamping={true}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
