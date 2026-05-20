"use client";

import Image from "next/image";
import { useState } from "react";
import type { Region } from "@/types";

// ── SVG region polygons ────────────────────────────────────────────────────
// Coordinates mapped to the 3D Taiwan image (2754 × 1536 image space)
// Perspective: North/Taipei = top-right, South/Kaohsiung = bottom-left
const POLYGONS: Record<string, { pts: string; lx: number; ly: number }> = {
  taipei: {
    pts: "1580,60 2200,110 2430,330 2160,490 1720,430 1400,270",
    lx: 1970, ly: 260,
  },
  hualien: {
    pts: "1720,430 2160,490 2340,730 2110,990 1600,830 1490,620",
    lx: 1890, ly: 660,
  },
  taichung: {
    pts: "860,270 1400,270 1720,430 1490,620 1090,730 760,560 690,370",
    lx: 1130, ly: 480,
  },
  tainan: {
    pts: "360,490 760,560 1090,730 970,930 670,1030 320,820 260,610",
    lx: 660, ly: 750,
  },
  kaohsiung: {
    pts: "260,610 320,820 670,1030 770,1130 560,1250 210,1030 160,800",
    lx: 420, ly: 960,
  },
};

const FILL_COLORS: Record<string, string> = {
  taipei:    "#4ADE80",
  hualien:   "#38BDF8",
  taichung:  "#FACC15",
  tainan:    "#C084FC",
  kaohsiung: "#FB923C",
};

const ICONS: Record<string, string> = {
  taipei:    "🏙",
  hualien:   "🏔",
  taichung:  "🚲",
  tainan:    "🏛",
  kaohsiung: "⚓",
};

interface Props {
  regions: Region[];
  activeSlug: string | null;
  onRegionClick: (slug: string | null) => void;
}

export default function TaiwanMapImage({ regions, activeSlug, onRegionClick }: Props) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full">
      {/* Base 3D map image */}
      <Image
        src="/taiwan-3d-map.png"
        alt="Interactive 3D map of Taiwan"
        fill
        className="object-cover"
        priority
        unoptimized
      />

      {/* SVG click overlay — viewBox matches image dimensions */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 2754 1536"
        preserveAspectRatio="xMidYMid slice"
      >
        {Object.entries(POLYGONS).map(([slug, { pts, lx, ly }]) => {
          const region = regions.find((r) => r.slug === slug);
          const isActive = activeSlug === slug;
          const isHovered = hoveredSlug === slug;
          const fillColor = FILL_COLORS[slug];

          return (
            <g
              key={slug}
              onClick={() => onRegionClick(isActive ? null : slug)}
              onMouseEnter={() => setHoveredSlug(slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              style={{ cursor: "pointer" }}
              role="button"
              aria-label={`${slug} — ${region?.post_count ?? 0} stories`}
            >
              {/* Hover / active fill */}
              <polygon
                points={pts}
                fill={fillColor}
                fillOpacity={isActive ? 0.45 : isHovered ? 0.28 : 0}
                stroke={fillColor}
                strokeWidth={isActive ? 6 : isHovered ? 4 : 0}
                strokeOpacity={isActive ? 0.9 : 0.7}
                strokeLinejoin="round"
                style={{ transition: "fill-opacity 0.2s, stroke-opacity 0.2s" }}
              />

              {/* Label (visible on hover or active) */}
              {(isHovered || isActive) && (
                <>
                  {/* Badge background */}
                  <rect
                    x={lx - 90}
                    y={ly - 42}
                    width={180}
                    height={58}
                    rx={12}
                    fill="white"
                    fillOpacity={0.92}
                  />
                  {/* Icon */}
                  <text
                    x={lx - 52}
                    y={ly - 6}
                    fontSize={32}
                    textAnchor="middle"
                    style={{ userSelect: "none" }}
                  >
                    {ICONS[slug]}
                  </text>
                  {/* City name */}
                  <text
                    x={lx + 28}
                    y={ly - 18}
                    fontSize={22}
                    fontWeight="700"
                    fill="#1C2820"
                    textAnchor="middle"
                    style={{ userSelect: "none" }}
                  >
                    {slug.charAt(0).toUpperCase() + slug.slice(1)}
                  </text>
                  {/* Story count */}
                  <text
                    x={lx + 28}
                    y={ly + 6}
                    fontSize={17}
                    fill="#D97706"
                    fontWeight="600"
                    textAnchor="middle"
                    style={{ userSelect: "none" }}
                  >
                    {region?.post_count ?? 0} stories
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Idle hint */}
      {!activeSlug && !hoveredSlug && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/70 text-xs tracking-widest uppercase pointer-events-none">
          hover a region to explore
        </div>
      )}
    </div>
  );
}
