// components/experience-rack/RackFrame.tsx
"use client";

import React from "react";
import { useRef } from "react";
import * as THREE from "three";

// ─── Constants ────────────────────────────────────────────────────────────────
export const RACK_WIDTH  = 3.2;
export const RACK_HEIGHT = 6.0;
export const RACK_DEPTH  = 1.2;

const FRAME_COLOR   = "#1e1e22";   // dark steel, very slightly blue-shifted
const ACCENT_COLOR  = "#2c2c32";   // slightly lighter for cable-management bars
const RAIL_COLOR    = "#141416";   // deepest dark for vertical rails

// ─── Bar component with tunable material ─────────────────────────────────────
interface BarProps {
  position:   [number, number, number];
  scale:      [number, number, number];
  color?:     string;
  metalness?: number;
  roughness?: number;
}

function Bar({
  position,
  scale,
  color     = FRAME_COLOR,
  metalness = 0.72,
  roughness = 0.50,
}: BarProps) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        envMapIntensity={0.5}
      />
    </mesh>
  );
}

// ─── Mounting rail (the vertical tracks drives slide into) ────────────────────
function MountingRail({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0]}>
      {/* Main rail - brushed steel look */}
      <Bar
        position={[0, 0, 0]}
        scale={[0.06, RACK_HEIGHT - 0.2, 0.08]}
        color={RAIL_COLOR}
        metalness={0.85}
        roughness={0.3}
      />
      {/* Rail slot notches - punched steel */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Bar
          key={i}
          position={[0.04, -RACK_HEIGHT / 2 + 0.5 + i * 0.44, 0.02]}
          scale={[0.04, 0.04, 0.06]}
          color="#0f0f11"
          metalness={0.6}
          roughness={0.7}
        />
      ))}
    </group>
  );
}

// ─── RackFrame ────────────────────────────────────────────────────────────────
export default function RackFrame() {
  const hw = RACK_WIDTH  / 2;
  const hh = RACK_HEIGHT / 2;
  const hd = RACK_DEPTH  / 2;

  return (
    <group>
      {/* Top bar - structural steel */}
      <Bar position={[0,  hh,  0]} scale={[RACK_WIDTH, 0.1, RACK_DEPTH]} color={FRAME_COLOR} metalness={0.75} roughness={0.45} />
      {/* Bottom bar */}
      <Bar position={[0, -hh,  0]} scale={[RACK_WIDTH, 0.1, RACK_DEPTH]} color={FRAME_COLOR} metalness={0.75} roughness={0.45} />

      {/* Left vertical post - front: slightly shinier edge */}
      <Bar position={[-hw, 0,  hd - 0.05]} scale={[0.1, RACK_HEIGHT, 0.1]} color={FRAME_COLOR} metalness={0.78} roughness={0.38} />
      {/* Left vertical post - back */}
      <Bar position={[-hw, 0, -hd + 0.05]} scale={[0.1, RACK_HEIGHT, 0.1]} color={FRAME_COLOR} metalness={0.78} roughness={0.38} />

      {/* Right vertical post - front */}
      <Bar position={[ hw, 0,  hd - 0.05]} scale={[0.1, RACK_HEIGHT, 0.1]} color={FRAME_COLOR} metalness={0.78} roughness={0.38} />
      {/* Right vertical post - back */}
      <Bar position={[ hw, 0, -hd + 0.05]} scale={[0.1, RACK_HEIGHT, 0.1]} color={FRAME_COLOR} metalness={0.78} roughness={0.38} />

      {/* Back panel - flat matte black, nearly non-reflective */}
      <Bar
        position={[0, 0, -hd + 0.02]}
        scale={[RACK_WIDTH - 0.1, RACK_HEIGHT - 0.1, 0.04]}
        color="#111114"
        metalness={0.3}
        roughness={0.88}
      />

      {/* ── Horizontal cable-management bars ── */}
      {[-2, -0.5, 1, 2.5].map((y, i) => (
        <Bar
          key={i}
          position={[0, y, hd - 0.02]}
          scale={[RACK_WIDTH - 0.1, 0.045, 0.065]}
          color={ACCENT_COLOR}
          metalness={0.65}
          roughness={0.55}
        />
      ))}

      {/* ── Mounting rails ── */}
      <MountingRail x={-hw + 0.12} />
      <MountingRail x={ hw - 0.12} />

      {/* ── Floor feet - rubberised, matte ── */}
      {([-hw + 0.2, hw - 0.2] as number[]).flatMap((x) =>
        ([-hd + 0.15, hd - 0.15] as number[]).map((z) => (
          <Bar
            key={`${x}-${z}`}
            position={[x, -hh - 0.08, z]}
            scale={[0.15, 0.16, 0.15]}
            color="#0d0d0f"
            metalness={0.1}
            roughness={0.92}
          />
        ))
      )}

      {/* ── Unit marker strips - anodised aluminium look ── */}
      {Array.from({ length: 10 }).map((_, i) => (
        <Bar
          key={i}
          position={[hw - 0.04, -hh + 0.55 + i * 0.5, hd]}
          scale={[0.04, 0.022, 0.012]}
          color="#2a2a30"
          metalness={0.9}
          roughness={0.25}
        />
      ))}
    </group>
  );
}
