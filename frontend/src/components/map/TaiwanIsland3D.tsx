"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Region } from "@/types";

// ── Coordinate helpers ─────────────────────────────────────────────────────
// SVG viewBox 0 0 200 360  →  3D XZ floor plane (rotation -PI/2 on mesh)
// Local X = (svgX - 100) / 50    west-east: -2 to +2
// Local Y = -(svgY - 180) / 55   south-north: -3.3 to +3.3
// After mesh rotation [-PI/2, 0, 0]:
//   Local X → World X   (east-west)
//   Local Y → World -Z  (north= -Z "back", south= +Z "front")
//   Local Z → World +Y  (extrusion goes UP)

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
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
  });
}

// ── Region definitions ─────────────────────────────────────────────────────
const RC = {
  taipei: {
    pts: [[93,18],[130,16],[155,30],[162,55],[158,72],[130,95],[95,92],[72,75],[70,52],[82,28]] as [number,number][],
    color: "#7EB88A", depth: 0.55,
    trees: [[108,42],[132,58],[88,66],[148,50],[116,76]] as [number,number][],
  },
  hualien: {
    pts: [[130,16],[155,30],[162,55],[158,72],[165,100],[165,162],[158,200],[138,240],[127,225],[131,172],[138,140],[146,86],[140,44]] as [number,number][],
    color: "#52A060", depth: 0.35,
    trees: [[150,118],[156,162],[148,188]] as [number,number][],
  },
  taichung: {
    pts: [[70,52],[72,75],[95,92],[130,95],[146,86],[138,140],[131,172],[127,225],[118,232],[78,220],[47,172],[54,110],[64,80]] as [number,number][],
    color: "#5AA0C0", depth: 0.45,
    trees: [[68,130],[92,150],[114,170],[74,178],[105,108]] as [number,number][],
  },
  tainan: {
    pts: [[47,172],[78,220],[118,232],[127,225],[138,240],[127,278],[107,285],[72,268],[41,212]] as [number,number][],
    color: "#C09830", depth: 0.35,
    trees: [[68,248],[96,252],[114,262],[80,270]] as [number,number][],
  },
  kaohsiung: {
    pts: [[41,212],[72,268],[107,285],[127,278],[138,240],[152,244],[140,278],[122,312],[88,320],[50,270]] as [number,number][],
    color: "#A85890", depth: 0.45,
    trees: [[85,296],[108,284],[97,308],[118,300]] as [number,number][],
  },
} as const;

type Slug = keyof typeof RC;

const TSCALE = [0.88, 1.02, 0.93, 0.82, 0.97, 0.87, 1.05, 0.80];

// ── Camera: isometric, always looking at origin ────────────────────────────
const CAM_POS = new THREE.Vector3(5, 6, 5);
const CAM_TARGET = new THREE.Vector3(0, 0, 0);

function IsoCamera() {
  const { camera } = useThree();

  // Apply once on mount
  useEffect(() => {
    camera.position.copy(CAM_POS);
    camera.lookAt(CAM_TARGET);
    camera.updateMatrixWorld();
  }, [camera]);

  // Keep every frame (prevents any override)
  useFrame(({ camera: cam }) => {
    cam.position.copy(CAM_POS);
    cam.lookAt(CAM_TARGET);
  });

  return null;
}

// ── Tree decoration ────────────────────────────────────────────────────────
function Tree({ p, i }: { p: [number, number]; i: number }) {
  const [x, z] = sv(...p);
  const sc = TSCALE[i % TSCALE.length];
  return (
    <group position={[x, 0.01, z]}>
      <mesh position={[0, 0.08 * sc, 0]}>
        <cylinderGeometry args={[0.028 * sc, 0.044 * sc, 0.14 * sc, 5]} />
        <meshLambertMaterial color="#5C3A1E" />
      </mesh>
      <mesh position={[0, 0.26 * sc, 0]}>
        <sphereGeometry args={[0.15 * sc, 7, 6]} />
        <meshLambertMaterial color="#2D6E30" />
      </mesh>
    </group>
  );
}

// ── Single region mesh ─────────────────────────────────────────────────────
function RegionMesh({
  slug, active, hovered, onClick, onOver, onOut,
}: {
  slug: Slug; active: boolean; hovered: boolean;
  onClick: () => void; onOver: () => void; onOut: () => void;
}) {
  const cfg = RC[slug];
  const groupRef = useRef<THREE.Group>(null);
  const targetY = active ? 0.28 : hovered ? 0.12 : 0;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y +=
        (targetY - groupRef.current.position.y) * 0.10;
    }
  });

  const geo = useMemo(
    () => makeGeo(cfg.pts as unknown as [number, number][], cfg.depth),
    [slug] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const col = active ? "#E08800" : hovered ? lightenHex(cfg.color) : cfg.color;

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

      {cfg.trees.map((p, i) => (
        <Tree key={i} p={p as [number, number]} i={i} />
      ))}
    </group>
  );
}

function lightenHex(hex: string): string {
  const c = new THREE.Color(hex);
  c.offsetHSL(0, -0.05, 0.12);
  return `#${c.getHexString()}`;
}

// ── Ocean ──────────────────────────────────────────────────────────────────
function Ocean() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshLambertMaterial color="#7EC0D8" />
      </mesh>
      {/* Shallow water ring around island */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, 0]}>
        <planeGeometry args={[8, 10]} />
        <meshLambertMaterial color="#9ED4E8" />
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

export default function TaiwanIsland3D({
  regions: _r, activeSlug, onRegionClick,
}: Props) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const setOver = (slug: string) => {
    setHoveredSlug(slug);
    if (typeof document !== "undefined") document.body.style.cursor = "pointer";
  };
  const setOut = () => {
    setHoveredSlug(null);
    if (typeof document !== "undefined") document.body.style.cursor = "default";
  };

  return (
    <Canvas
      orthographic
      camera={{ zoom: 48, near: 0.1, far: 80 }}
      shadows={{ type: THREE.PCFShadowMap }}
      gl={{ antialias: true }}
      style={{ width: "100%", height: "100%" }}
      onPointerMissed={() => onRegionClick(null)}
    >
      {/* Sky/ocean background color */}
      <color attach="background" args={["#8BBDD0"]} />

      <IsoCamera />

      {/* Warm sun + cool fill */}
      <ambientLight intensity={0.55} color="#fff5e0" />
      <directionalLight
        position={[6, 12, 4]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-4, 5, -3]} intensity={0.28} color="#b8d8ff" />

      <Ocean />

      {(Object.keys(RC) as Slug[]).map((slug) => (
        <RegionMesh
          key={slug}
          slug={slug}
          active={activeSlug === slug}
          hovered={hoveredSlug === slug}
          onClick={() => onRegionClick(activeSlug === slug ? null : slug)}
          onOver={() => setOver(slug)}
          onOut={setOut}
        />
      ))}
    </Canvas>
  );
}
