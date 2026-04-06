// components/experience-rack/RackScene.tsx
"use client";

import React, { useRef } from "react";
import { Canvas, useFrame }     from "@react-three/fiber";
import { OrbitControls, ContactShadows, Preload } from "@react-three/drei";
import * as THREE from "three";

import { workExperience }       from "@/data";
import RackFrame, { RACK_HEIGHT } from "./RackFrame";
import DiskDrive, { DRIVE_W, DRIVE_H, DRIVE_D, SLOT_PITCH } from "./DiskDrive";
import type { WorkExperience }  from "./types";

const TOTAL_SLOTS = 8;

// ─── Props ────────────────────────────────────────────────────────────────────
interface RackSceneProps {
  ejectedId: number | null;
  onToggle:  (id: number) => void;
}

// ─── Subtle float ─────────────────────────────────────────────────────────────
function SceneFloat({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.3) * 0.018;
  });
  return <group ref={ref}>{children}</group>;
}

// ─── Inactive drive - red blinking LED ───────────────────────────────────────
function InactiveDrive({ index }: { index: number }) {
  const ledRef = useRef<THREE.Mesh>(null);
  const stackHeight = TOTAL_SLOTS * SLOT_PITCH;
  const restY       = stackHeight / 2 - DRIVE_H / 2 - index * SLOT_PITCH;

  useFrame(({ clock }) => {
    if (!ledRef.current) return;
    const mat = ledRef.current.material as THREE.MeshStandardMaterial;
    const t   = clock.elapsedTime + index * 0.4;
    mat.emissiveIntensity = Math.sin(t * 1.8) > 0.6 ? 1.0 : 0.05;
  });

  return (
    <group position={[0, restY, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[DRIVE_W, DRIVE_H, DRIVE_D]} />
        <meshStandardMaterial color="#131315" metalness={0.52} roughness={0.72} />
      </mesh>
      <mesh position={[0, 0, DRIVE_D / 2 + 0.001]}>
        <planeGeometry args={[DRIVE_W, DRIVE_H]} />
        <meshStandardMaterial color="#0f0f12" metalness={0.4} roughness={0.82} />
      </mesh>
      <mesh ref={ledRef} position={[-DRIVE_W / 2 + 0.12, 0, DRIVE_D / 2 + 0.003]}>
        <circleGeometry args={[0.026, 12]} />
        <meshStandardMaterial color="#ff2020" emissive="#ff2020" emissiveIntensity={0.05} toneMapped={false} />
      </mesh>
      {(
        [
          [-DRIVE_W / 2 + 0.06,  DRIVE_H / 2 - 0.06],
          [ DRIVE_W / 2 - 0.06,  DRIVE_H / 2 - 0.06],
          [-DRIVE_W / 2 + 0.06, -DRIVE_H / 2 + 0.06],
          [ DRIVE_W / 2 - 0.06, -DRIVE_H / 2 + 0.06],
        ] as [number, number][]
      ).map(([x, y], i) => (
        <mesh key={i} position={[x, y, DRIVE_D / 2 + 0.002]}>
          <circleGeometry args={[0.015, 6]} />
          <meshStandardMaterial color="#090909" metalness={0.9} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({ ejectedId, onToggle }: RackSceneProps) {
  const isAnyEjected = ejectedId !== null;

  const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) =>
    (workExperience as unknown as WorkExperience[])[i] ?? null
  );

  return (
    <>
      <ambientLight intensity={0.55} color="#c8d8ea" />

      <directionalLight
        position={[4, 5, 8]}
        intensity={2.2}
        color="#e8f0f8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[0, 0, 10]} intensity={0.9}  color="#d0dcea" />
      <directionalLight position={[-5, 2, 4]} intensity={0.65} color="#6888b0" />
      <directionalLight position={[-3, 6, -5]} intensity={0.8} color="#8aa0b8" />
      <pointLight position={[0, -4, 3]} intensity={0.35} color="#1a2535" distance={14} decay={2} />

      <ContactShadows
        position={[0, -RACK_HEIGHT / 2 - 0.22, 0]}
        opacity={0.55} scale={9} blur={2.5} far={4} color="#000008"
      />

      <SceneFloat>
        <group scale={[0.68, 0.62, 0.62]}>
          <RackFrame />
          {slots.map((exp, index) =>
            exp ? (
              <DiskDrive
                key={exp.id}
                exp={exp}
                index={index}
                totalSlots={TOTAL_SLOTS}
                isEjected={ejectedId === exp.id}
                isAnyEjected={isAnyEjected}
                onToggle={onToggle}
              />
            ) : (
              <InactiveDrive key={`empty-${index}`} index={index} />
            )
          )}
        </group>
      </SceneFloat>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE }}
        minDistance={3.5}
        maxDistance={9}
        minPolarAngle={Math.PI / 3.8}
        maxPolarAngle={Math.PI / 2.05}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 6}
        dampingFactor={0.06}
        enableDamping
        rotateSpeed={0.4}
      />
      <Preload all />
    </>
  );
}

// ─── Canvas wrapper ───────────────────────────────────────────────────────────
export default function RackScene({ ejectedId, onToggle }: RackSceneProps) {
  return (
    <Canvas
      shadows="soft"
      dpr={[1, 2]}
      camera={{
        // Shifted left on X so rack sits in left portion of its canvas
        position: [-0.6, 0.2, 6.8],
        fov:      42,
        near:     0.5,
        far:      50,
      }}
      gl={{
        antialias:           true,
        toneMapping:         THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.4,
        outputColorSpace:    THREE.SRGBColorSpace,
      }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <Scene ejectedId={ejectedId} onToggle={onToggle} />
    </Canvas>
  );
}
