"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Region } from "@/types";
import type { Post } from "@/types";
import PostCard from "@/components/ui/PostCard";

interface Props {
  regions: Region[];
  posts: Post[];
}

// Simplified representative city positions as percentages of the SVG viewport
const CITY_POSITIONS: Record<string, { x: number; y: number }> = {
  taipei: { x: 52, y: 12 },
  taichung: { x: 42, y: 42 },
  tainan: { x: 38, y: 68 },
  kaohsiung: { x: 42, y: 80 },
  hualien: { x: 68, y: 38 },
};

export default function TaiwanMap({ regions, posts }: Props) {
  const [activeRegion, setActiveRegion] = useState<Region | null>(null);
  const filteredPosts = activeRegion
    ? posts.filter((p) => p.region.slug === activeRegion.slug)
    : [];

  return (
    <div className="relative flex flex-col lg:flex-row items-start gap-12 w-full max-w-5xl mx-auto">
      {/* Map Canvas */}
      <div className="relative w-full lg:w-[360px] shrink-0">
        <svg
          viewBox="0 0 200 340"
          className="w-full drop-shadow-sm"
          aria-label="Interactive map of Taiwan"
        >
          {/* Ocean background */}
          <rect width="200" height="340" fill="#EBF3F5" rx="8" />

          {/* Taiwan landmass — simplified outline */}
          <path
            d="M90,20 C95,18 105,20 112,28 C120,36 122,50 118,65 C115,78 118,90 115,105 C112,118 108,130 105,145 C102,160 105,175 100,190 C96,205 88,215 82,230 C76,245 72,255 74,268 C76,278 80,285 78,295 C76,305 68,310 65,300 C62,290 64,278 62,265 C60,252 55,245 54,232 C52,218 56,208 58,195 C60,182 56,170 55,155 C54,142 58,128 60,115 C62,100 58,88 62,75 C66,62 72,50 78,38 Z"
            fill="#E2EDE4"
            stroke="#d4e6d6"
            strokeWidth="1"
          />

          {/* City pins */}
          {regions.map((region) => {
            const pos = CITY_POSITIONS[region.slug];
            if (!pos) return null;
            const isActive = activeRegion?.slug === region.slug;

            return (
              <g
                key={region.id}
                transform={`translate(${pos.x * 2}, ${pos.y * 3.4})`}
                onClick={() =>
                  setActiveRegion(isActive ? null : region)
                }
                className="cursor-pointer"
                role="button"
                aria-label={`${region.name_en} — ${region.post_count} stories`}
              >
                <motion.circle
                  r={isActive ? 7 : 5}
                  fill={isActive ? "#D97706" : "#2C302E"}
                  opacity={isActive ? 1 : 0.7}
                  animate={{ r: isActive ? 7 : 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                {/* Post count badge */}
                {region.post_count && region.post_count > 0 && (
                  <text
                    textAnchor="middle"
                    dy="0.35em"
                    fontSize="5"
                    fill="white"
                    fontWeight="bold"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {region.post_count}
                  </text>
                )}
                <text
                  y={isActive ? -11 : -9}
                  textAnchor="middle"
                  fontSize="6"
                  fill="#2C302E"
                  fontWeight={isActive ? "600" : "400"}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {region.name_en}
                </text>
              </g>
            );
          })}
        </svg>

        {!activeRegion && (
          <p className="text-center text-xs text-[#2C302E]/40 mt-3 tracking-wide">
            click a city to explore
          </p>
        )}
      </div>

      {/* Post drawer */}
      <AnimatePresence>
        {activeRegion && filteredPosts.length > 0 && (
          <motion.div
            key={activeRegion.slug}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 w-full"
          >
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <h2 className="text-xl font-medium text-[#2C302E]">
                  {activeRegion.name_en}
                </h2>
                <p className="text-sm text-[#2C302E]/50 mt-0.5">
                  {activeRegion.name_th} &mdash; {filteredPosts.length} stories
                </p>
              </div>
              <button
                onClick={() => setActiveRegion(null)}
                className="text-xs text-[#2C302E]/40 hover:text-[#2C302E] transition-colors"
              >
                close ×
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessible fallback */}
      <nav aria-label="Blog posts by region" className="sr-only">
        {regions.map((r) => (
          <a key={r.id} href={`/blog?region=${r.slug}`}>
            {r.name_en} stories
          </a>
        ))}
      </nav>
    </div>
  );
}
