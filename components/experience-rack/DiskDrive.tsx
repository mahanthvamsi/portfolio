// components/experience-rack/DiskDrive.tsx
"use client";

import React, { useRef, useState, useMemo } from "react";
import { useFrame }   from "@react-three/fiber";
import { Text }       from "@react-three/drei";
import * as THREE     from "three";

import { RACK_WIDTH, RACK_HEIGHT } from "./RackFrame";
import type { DiskDriveProps }     from "./types";

// ─── Layout constants (exported for RackScene) ────────────────────────────────
export const DRIVE_W    = RACK_WIDTH  - 0.32;
export const DRIVE_H    = 0.38;
export const DRIVE_D    = 0.96;
export const DRIVE_GAP  = 0.06;
export const SLOT_PITCH = DRIVE_H + DRIVE_GAP;

const EJECT_Z    = 1.2;   // reduced - drive only partially ejects (panel is DOM now)
const EJECT_DUR  = 0.35;

const BASE_COLOR  = "#222228";
const HOVER_COLOR = "#2c2c34";
const EJECT_COLOR = "#28283a";

// ─── LED - always visible green, pulses on active ─────────────────────────────
function LED({ active, hovered }: { active: boolean; hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    if (active) {
      // Pulsing bright green when ejected/selected
      mat.emissiveIntensity = 0.8 + 0.2 * Math.sin(clock.elapsedTime * 3.5);
      mat.color.set("#4ade80");
      mat.emissive.set("#4ade80");
    } else if (hovered) {
      mat.emissiveIntensity = 0.75;
      mat.color.set("#22c55e");
      mat.emissive.set("#22c55e");
    } else {
      // Always-on dim green - clearly visible at rest
      mat.emissiveIntensity = 0.55;
      mat.color.set("#16a34a");
      mat.emissive.set("#16a34a");
    }
  });

  return (
    <mesh ref={meshRef} position={[-DRIVE_W / 2 + 0.12, 0, DRIVE_D / 2 + 0.002]}>
      <circleGeometry args={[0.03, 12]} />
      <meshStandardMaterial
        color="#16a34a"
        emissive="#16a34a"
        emissiveIntensity={0.55}
        toneMapped={false}
      />
    </mesh>
  );
}

// ─── Drive face ───────────────────────────────────────────────────────────────
function DriveFace({
  company,
  hovered,
  ejected,
}: {
  company: string;
  hovered: boolean;
  ejected: boolean;
}) {
  return (
    <group position={[0, 0, DRIVE_D / 2]}>
      <mesh>
        <planeGeometry args={[DRIVE_W, DRIVE_H]} />
        <meshStandardMaterial
          color={ejected ? "#26262e" : hovered ? "#232330" : "#1e1e26"}
          metalness={0.55}
          roughness={0.38}
          envMapIntensity={0.7}
        />
      </mesh>

      {/* Handle groove */}
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[DRIVE_W * 0.7, 0.03]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Handle nub */}
      <mesh position={[0.05, 0, 0.004]}>
        <boxGeometry args={[0.18, 0.05, 0.006]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Company label */}
      <Text
        position={[0.16, 0, 0.012]}
        fontSize={0.07}
        color={ejected ? "#e2e8f0" : hovered ? "#94a3b8" : "#64748b"}
        anchorX="center"
        anchorY="middle"
        maxWidth={DRIVE_W * 0.55}
        letterSpacing={0.08}
        font={undefined}
        renderOrder={1}
        depthOffset={-1}
      >
        {company.toUpperCase()}
      </Text>

      {/* Corner screws */}
      {(
        [
          [-DRIVE_W / 2 + 0.06,  DRIVE_H / 2 - 0.06],
          [ DRIVE_W / 2 - 0.06,  DRIVE_H / 2 - 0.06],
          [-DRIVE_W / 2 + 0.06, -DRIVE_H / 2 + 0.06],
          [ DRIVE_W / 2 - 0.06, -DRIVE_H / 2 + 0.06],
        ] as [number, number][]
      ).map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.002]}>
          <circleGeometry args={[0.018, 6]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// ─── DiskDrive ────────────────────────────────────────────────────────────────
export default function DiskDrive({
  exp,
  index,
  totalSlots,
  isEjected,
  isAnyEjected,
  onToggle,
}: DiskDriveProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const stackHeight = totalSlots * SLOT_PITCH;
  const restY       = stackHeight / 2 - DRIVE_H / 2 - index * SLOT_PITCH;
  const targetZ     = isEjected ? EJECT_Z : 0;
  const targetY     = isEjected ? restY : hovered && !isAnyEjected ? restY + 0.04 : restY;

  const bodyGeo = useMemo(() => new THREE.BoxGeometry(DRIVE_W, DRIVE_H, DRIVE_D), []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const t = 1 - Math.pow(0.01, delta / EJECT_DUR);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, t);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, t);
  });

  return (
    <group
      ref={groupRef}
      position={[0, restY, 0]}
      onPointerEnter={(e) => { e.stopPropagation(); setHovered(true);  document.body.style.cursor = "pointer"; }}
      onPointerLeave={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = "default";  }}
      onClick={(e)         => { e.stopPropagation(); onToggle(exp.id); }}
    >
      <mesh geometry={bodyGeo} castShadow receiveShadow>
        <meshStandardMaterial
          color={isEjected ? EJECT_COLOR : hovered ? HOVER_COLOR : BASE_COLOR}
          metalness={0.65}
          roughness={0.42}
          envMapIntensity={0.6}
        />
      </mesh>

      {[-0.12, 0, 0.12].map((y, i) => (
        <mesh key={i} position={[DRIVE_W / 2 - 0.001, y, 0]}>
          <planeGeometry args={[0.001, DRIVE_H * 0.6]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}

      <LED active={isEjected} hovered={hovered} />
      <DriveFace company={exp.company} hovered={hovered} ejected={isEjected} />
    </group>
  );
}
