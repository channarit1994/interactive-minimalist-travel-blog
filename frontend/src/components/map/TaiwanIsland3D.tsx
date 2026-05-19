"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import type { Region } from "@/types";

// ── Coordinate helpers ─────────────────────────────────────────────────────
// SVG viewBox: 0 0 200 360 → 3D XZ plane (island lies flat)
function sv(svgX: number, svgY: number): [number, number] {
  return [(svgX - 100) / 50, -(svgY - 180) / 55];
}

function makeGeo(pts: [number, number][], depth: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const [x0, y0] = sv(...pts[0]);
  shape.moveTo(x0, y0);
  for (let i = 1; i < pts.length; i++) shape.lineTo(...sv(...pts[i]));
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.016,
    bevelSize: 0.016,
    bevelSegments: 2,
  });
}

// ── Region definitions ─────────────────────────────────────────────────────
const RC = {
  taipei: {
    pts: [[93,18],[130,16],[155,30],[162,55],[158,72],[130,95],[95,92],[72,75],[70,52],[82,28]] as [number,number][],
    color: "#8CBF92", depth: 0.38,
    trees: [[108,42],[130,58],[88,66],[148,50],[115,75]] as [number,number][],
  },
  hualien: {
    pts: [[130,16],[155,30],[162,55],[158,72],[165,100],[165,162],[158,200],[138,240],[127,225],[131,172],[138,140],[146,86],[140,44]] as [number,number][],
    color: "#62A872", depth: 0.22,
    trees: [[150,118],[156,162],[148,188]] as [number,number][],
  },
  taichung: {
    pts: [[70,52],[72,75],[95,92],[130,95],[146,86],[138,140],[131,172],[127,225],[118,232],[78,220],[47,172],[54,110],[64,80]] as [number,number][],
    color: "#6AAEC8", depth: 0.28,
    trees: [[68,130],[92,150],[114,170],[74,178],[105,108]] as [number,number][],
  },
  tainan: {
    pts: [[47,172],[78,220],[118,232],[127,225],[138,240],[127,278],[107,285],[72,268],[41,212]] as [number,number][],
    color: "#C8A845", depth: 0.22,
    trees: [[68,248],[96,252],[114,262],[80,270]] as [number,number][],
  },
  kaohsiung: {
    pts: [[41,212],[72,268],[107,285],[127,278],[138,240],[152,244],[140,278],[122,312],[88,320],[50,270]] as [number,number][],
    color: "#BA6A9E", depth: 0.30,
    trees: [[85,296],[108,284],[97,308],[118,300]] as [number,number][],
  },
} as const;

type Slug = keyof typeof RC;

const TSCALE = [0.88, 1.0, 0.92, 0.82, 0.96, 0.87, 1.04, 0.79];

// ── Sub-components ─────────────────────────────────────────────────────────

function CameraLookAt() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

function Tree({ p, i }: { p: [number, number]; i: number }) {
  const [x, z] = sv(...p);
  const sc = TSCALE[i % TSCALE.length];
  return (
    <group position={[x, 0.01, z]}>
      <mesh position={[0, 0.07 * sc, 0]}>
        <cylinderGeometry args={[0.025 * sc, 0.042 * sc, 0.13 * sc, 5, 1]} />
        <meshLambertMaterial color="#6B4423" />
      </mesh>
      <mesh position={[0, 0.22 * sc, 0]}>
        <sphereGeometry args={[0.13 * sc, 7, 6]} />
        <meshLambertMaterial color="#357A38" />
      </mesh>
    </group>
  );
}

function RegionMesh({
  slug, active, hovered, onClick, onOver, onOut,
}: {
  slug: Slug;
  active: boolean;
  hovered: boolean;
  onClick: () => void;
  onOver: () => void;
  onOut: () => void;
}) {
  const cfg = RC[slug];
  const groupRef = useRef<THREE.Group>(null);
  const targetY = active ? 0.24 : hovered ? 0.11 : 0;

  useFrame(() => {
    if (groupRef.current) {
      const cur = groupRef.current.position.y;
      groupRef.current.position.y += (targetY - cur) * 0.11;
    }
  });

  const geo = useMemo(() => makeGeo(cfg.pts as [number, number][], cfg.depth), [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const col = active ? "#D97706" : hovered ? lighten(cfg.color) : cfg.color;

  return (
    <group ref={groupRef}>
      <mesh
        geometry={geo}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); onOver(); }}
        onPointerOut={onOut}
      >
        <meshLambertMaterial color={col} />
      </mesh>

      {/* Floating count badge */}
      {cfg.trees.map((p, i) => (
        <Tree key={i} p={p as [number, number]} i={i} />
      ))}
    </group>
  );
}

function lighten(hex: string): string {
  const c = new THREE.Color(hex);
  c.offsetHSL(0, 0, 0.08);
  return `#${c.getHexString()}`;
}

// ── Ocean decorations ──────────────────────────────────────────────────────
function OceanWaves() {
  return (
    <>
      {/* Main ocean floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshLambertMaterial color="#A8D4E8" />
      </mesh>
      {/* Inner slightly lighter ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.055, 0]}>
        <planeGeometry args={[6, 7]} />
        <meshLambertMaterial color="#B8DCF0" />
      </mesh>
    </>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
interface Props {
  regions: Region[];
  activeSlug: string | null;
  onRegionClick: (slug: string | null) => void;
}

export default function TaiwanIsland3D({ regions: _regions, activeSlug, onRegionClick }: Props) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const onOver = (slug: string) => {
    setHoveredSlug(slug);
    if (typeof document !== "undefined") document.body.style.cursor = "pointer";
  };
  const onOut = () => {
    setHoveredSlug(null);
    if (typeof document !== "undefined") document.body.style.cursor = "default";
  };

  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", minHeight: 520 }}
      onPointerMissed={() => onRegionClick(null)}
    >
      <OrthographicCamera makeDefault position={[5, 7, 5]} zoom={80} near={0.1} far={60} />
      <CameraLookAt />

      {/* Warm sunlight from top-left */}
      <ambientLight intensity={0.6} color="#fff8f0" />
      <directionalLight
        position={[4, 10, 3]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      {/* Cool fill from opposite side */}
      <directionalLight position={[-3, 4, -3]} intensity={0.25} color="#c0dcff" />

      <OceanWaves />

      {(Object.keys(RC) as Slug[]).map((slug) => (
        <RegionMesh
          key={slug}
          slug={slug}
          active={activeSlug === slug}
          hovered={hoveredSlug === slug}
          onClick={() => onRegionClick(activeSlug === slug ? null : slug)}
          onOver={() => onOver(slug)}
          onOut={onOut}
        />
      ))}
    </Canvas>
  );
}
