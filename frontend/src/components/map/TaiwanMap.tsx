"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Region, Post } from "@/types";
import PostCard from "@/components/ui/PostCard";

interface Props {
  regions: Region[];
  posts: Post[];
}

// SVG paths — Taiwan island divided into 5 clickable regions (viewBox 0 0 200 360)
const REGION_PATHS: Record<
  string,
  { d: string; labelX: number; labelY: number; nameTh: string }
> = {
  taipei: {
    d: "M 93,16 C 107,10 126,13 141,23 C 156,33 162,52 158,70 C 154,84 143,92 128,96 L 106,98 L 86,93 C 74,87 68,74 71,60 C 74,44 83,22 93,16 Z",
    labelX: 106,
    labelY: 60,
    nameTh: "ไทเป",
  },
  hualien: {
    d: "M 141,23 C 156,33 162,52 158,70 L 164,92 L 166,122 C 167,152 162,180 155,202 C 149,222 140,235 133,240 L 124,226 C 126,200 130,175 134,150 C 138,124 143,98 145,74 L 142,48 Z",
    labelX: 152,
    labelY: 158,
    nameTh: "ฮัวเหลียน",
  },
  taichung: {
    d: "M 71,60 L 86,93 L 106,98 L 128,96 L 145,74 C 143,98 138,124 134,150 C 130,175 126,200 124,226 L 114,232 L 96,229 L 78,222 C 64,212 52,194 48,173 C 44,152 49,128 56,108 L 68,85 Z",
    labelX: 88,
    labelY: 162,
    nameTh: "ไทจง",
  },
  tainan: {
    d: "M 48,173 C 52,194 64,212 78,222 L 96,229 L 114,232 L 124,226 L 133,240 L 126,275 L 110,284 L 92,280 L 74,268 C 58,254 46,234 42,210 Z",
    labelX: 85,
    labelY: 254,
    nameTh: "ไถหนาน",
  },
  kaohsiung: {
    d: "M 42,210 C 46,234 58,254 74,268 L 92,280 L 110,284 L 126,275 L 133,240 C 140,235 149,222 155,202 L 150,240 L 140,275 L 125,308 L 106,322 L 88,319 C 70,310 55,290 48,266 L 40,240 Z",
    labelX: 92,
    labelY: 290,
    nameTh: "เกาสง",
  },
};

const COLORS: Record<string, string> = {
  taipei: "#C8DDCA",
  hualien: "#B8D9C0",
  taichung: "#BDD5E8",
  tainan: "#F5E6B8",
  kaohsiung: "#EDD0E0",
};

const HOVER_COLORS: Record<string, string> = {
  taipei: "#9FC4A3",
  hualien: "#8CC49A",
  taichung: "#90B8D8",
  tainan: "#EDD690",
  kaohsiung: "#E0B5CE",
};

const ICONS: Record<string, string> = {
  taipei: "🏙",
  hualien: "🏔",
  taichung: "🚲",
  tainan: "🏛",
  kaohsiung: "⚓",
};

export default function TaiwanMap({ regions, posts }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const activeRegion = regions.find((r) => r.slug === activeSlug) ?? null;
  const filteredPosts = activeSlug
    ? posts.filter((p) => p.region.slug === activeSlug)
    : [];

  const getFill = (slug: string) => {
    if (activeSlug === slug) return "#D97706";
    if (hoveredSlug === slug) return HOVER_COLORS[slug] ?? "#ccc";
    return COLORS[slug] ?? "#e2e8f0";
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-12 items-start">
      {/* ===== MAP ===== */}
      <div className="relative w-full lg:w-[420px] shrink-0 select-none">
        <svg
          viewBox="0 0 200 360"
          className="w-full drop-shadow-lg"
          aria-label="Interactive map of Taiwan — click a region to explore stories"
        >
          {/* Ocean */}
          <defs>
            <pattern id="waves" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0,10 Q5,5 10,10 Q15,15 20,10" fill="none" stroke="#C8DEE8" strokeWidth="0.8" opacity="0.5" />
            </pattern>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
            </filter>
          </defs>
          <rect width="200" height="360" fill="#E6F3F8" rx="12" />
          <rect width="200" height="360" fill="url(#waves)" rx="12" />

          {/* Region paths */}
          {Object.entries(REGION_PATHS).map(([slug, { d, labelX, labelY, nameTh }]) => {
            const region = regions.find((r) => r.slug === slug);
            const isActive = activeSlug === slug;
            const isHovered = hoveredSlug === slug;

            return (
              <g
                key={slug}
                onClick={() => setActiveSlug(isActive ? null : slug)}
                onMouseEnter={() => setHoveredSlug(slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                style={{ cursor: "pointer" }}
                role="button"
                aria-label={`${slug} — ${region?.post_count ?? 0} stories`}
                filter="url(#shadow)"
              >
                <motion.path
                  d={d}
                  fill={getFill(slug)}
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  animate={{ fill: getFill(slug) }}
                  transition={{ duration: 0.2 }}
                />

                {/* Icon */}
                <text
                  x={labelX}
                  y={labelY - 9}
                  textAnchor="middle"
                  fontSize="10"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {ICONS[slug]}
                </text>

                {/* City name */}
                <text
                  x={labelX}
                  y={labelY + 4}
                  textAnchor="middle"
                  fontSize="6.5"
                  fontWeight={isActive ? "700" : "500"}
                  fill={isActive ? "white" : "#2C302E"}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {slug.charAt(0).toUpperCase() + slug.slice(1)}
                </text>

                {/* Thai name */}
                <text
                  x={labelX}
                  y={labelY + 13}
                  textAnchor="middle"
                  fontSize="5"
                  fill={isActive ? "rgba(255,255,255,0.8)" : "#2C302E80"}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {nameTh}
                </text>

                {/* Post count badge */}
                {region && (region.post_count ?? 0) > 0 && (
                  <g transform={`translate(${labelX + 14}, ${labelY - 18})`}>
                    <circle r="6" fill={isActive ? "white" : "#D97706"} />
                    <text
                      textAnchor="middle"
                      dy="0.35em"
                      fontSize="5.5"
                      fontWeight="700"
                      fill={isActive ? "#D97706" : "white"}
                      style={{ pointerEvents: "none", userSelect: "none" }}
                    >
                      {region.post_count}
                    </text>
                  </g>
                )}

                {/* Hover ring */}
                {isHovered && !isActive && (
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    strokeLinejoin="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ pointerEvents: "none" }}
                  />
                )}
              </g>
            );
          })}

          {/* Compass */}
          <g transform="translate(178, 18)" opacity="0.5">
            <text fontSize="8" textAnchor="middle" fill="#2C302E" fontWeight="600">N</text>
            <line x1="0" y1="4" x2="0" y2="12" stroke="#2C302E" strokeWidth="0.8" />
            <polygon points="0,-2 2,4 -2,4" fill="#2C302E" transform="translate(0,4)" />
          </g>
        </svg>

        {!activeSlug && (
          <p className="text-center text-xs text-[#2C302E]/35 mt-2 tracking-widest uppercase">
            click a region
          </p>
        )}
      </div>

      {/* ===== POST DRAWER ===== */}
      <div className="flex-1 w-full min-h-[200px]">
        <AnimatePresence mode="wait">
          {activeRegion && filteredPosts.length > 0 ? (
            <motion.div
              key={activeSlug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Region header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{ICONS[activeRegion.slug]}</span>
                    <h2 className="text-2xl font-light text-[#2C302E] tracking-tight">
                      {activeRegion.name_en}
                    </h2>
                  </div>
                  <p className="text-sm text-[#2C302E]/45 ml-9">
                    {activeRegion.name_th} &nbsp;·&nbsp; {filteredPosts.length}{" "}
                    {filteredPosts.length === 1 ? "story" : "stories"}
                  </p>
                </div>
                <button
                  onClick={() => setActiveSlug(null)}
                  className="text-xs text-[#2C302E]/35 hover:text-[#2C302E] transition-colors mt-1 px-2 py-1 border border-[#2C302E]/10 rounded hover:border-[#2C302E]/30"
                >
                  ✕ close
                </button>
              </div>

              {/* Posts */}
              <div className="flex flex-col gap-7">
                {filteredPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : activeSlug ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-[#2C302E]/40 pt-4"
            >
              No stories yet for this region.
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-3 pt-2"
            >
              <p className="text-base text-[#2C302E]/30 font-light">
                Select a region on the map to read stories from that area.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {regions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveSlug(r.slug)}
                    className="flex items-center gap-1.5 text-xs border border-[#2C302E]/12 text-[#2C302E]/50 hover:text-[#D97706] hover:border-[#D97706]/40 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <span>{ICONS[r.slug]}</span>
                    {r.name_en}
                    <span className="text-[#D97706] font-medium">{r.post_count}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Accessible fallback */}
      <nav aria-label="Blog posts by region" className="sr-only">
        {regions.map((r) => (
          <a key={r.id} href={`/blog?region=${r.slug}`}>
            {r.name_en} — {r.post_count} stories
          </a>
        ))}
      </nav>
    </div>
  );
}
