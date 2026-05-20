"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Region, Post } from "@/types";
import PostCard from "@/components/ui/PostCard";
import TaiwanMapImage from "./TaiwanMapImage";

const ICONS: Record<string, string> = {
  taipei:    "🏙",
  hualien:   "🏔",
  taichung:  "🚲",
  tainan:    "🏛",
  kaohsiung: "⚓",
};

interface Props {
  regions: Region[];
  posts: Post[];
}

export default function TaiwanMap({ regions, posts }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const activeRegion = regions.find((r) => r.slug === activeSlug) ?? null;
  const filteredPosts = activeSlug
    ? posts.filter((p) => p.region.slug === activeSlug)
    : [];

  return (
    <div className="w-full flex flex-col xl:flex-row gap-10 items-start">

      {/* ── Map image with SVG overlay ── */}
      <div className="w-full xl:w-[600px] shrink-0">
        <TaiwanMapImage
          regions={regions}
          activeSlug={activeSlug}
          onRegionClick={setActiveSlug}
        />
        {/* Region pill buttons below map */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {regions.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveSlug(activeSlug === r.slug ? null : r.slug)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
                activeSlug === r.slug
                  ? "bg-[#D97706] border-[#D97706] text-white"
                  : "border-[#2C302E]/12 text-[#2C302E]/50 hover:border-[#D97706]/50 hover:text-[#D97706]"
              }`}
            >
              <span>{ICONS[r.slug]}</span>
              <span>{r.name_en}</span>
              <span className={activeSlug === r.slug ? "text-white/80" : "text-[#D97706]"}>
                {r.post_count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Post panel ── */}
      <div className="flex-1 w-full min-h-[200px]">
        <AnimatePresence mode="wait">
          {activeRegion ? (
            <motion.div
              key={activeSlug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-3xl leading-none">{ICONS[activeRegion.slug]}</span>
                    <h2 className="text-2xl font-light tracking-tight text-[#2C302E]">
                      {activeRegion.name_en}
                    </h2>
                  </div>
                  <p className="text-sm text-[#2C302E]/40 ml-12">
                    {activeRegion.name_th}&nbsp;·&nbsp;
                    {filteredPosts.length} {filteredPosts.length === 1 ? "story" : "stories"}
                  </p>
                </div>
                <button
                  onClick={() => setActiveSlug(null)}
                  className="text-xs border border-[#2C302E]/12 text-[#2C302E]/35 hover:text-[#2C302E] hover:border-[#2C302E]/30 transition-colors px-3 py-1.5 rounded-full mt-1"
                >
                  ✕ close
                </button>
              </div>

              <div className="flex flex-col gap-7">
                {filteredPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-3 pt-2"
            >
              <p className="text-base text-[#2C302E]/30 font-light leading-relaxed">
                Hover or click a region on the map to explore travel stories from that area.
              </p>
              <p className="text-xs text-[#2C302E]/20 mt-4 leading-relaxed max-w-xs">
                Each region holds a collection of stories — food, temples, nature, and city life.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SEO fallback */}
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
