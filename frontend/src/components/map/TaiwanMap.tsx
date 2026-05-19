"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Region, Post } from "@/types";
import PostCard from "@/components/ui/PostCard";

// Load 3D canvas only in browser (no SSR)
const TaiwanIsland3D = dynamic(() => import("./TaiwanIsland3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-2xl bg-gradient-to-br from-[#A8D4E8] to-[#B8DCF0] animate-pulse flex items-center justify-center">
      <span className="text-xs text-white/50 tracking-widest uppercase">Loading map…</span>
    </div>
  ),
});

const ICONS: Record<string, string> = {
  taipei: "🏙",
  hualien: "🏔",
  taichung: "🚲",
  tainan: "🏛",
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
      {/* ── 3D Map ── */}
      <div className="w-full xl:w-[480px] shrink-0 rounded-2xl overflow-hidden shadow-xl border border-white/60">
        <TaiwanIsland3D
          regions={regions}
          activeSlug={activeSlug}
          onRegionClick={setActiveSlug}
        />
      </div>

      {/* ── Info Panel ── */}
      <div className="flex-1 w-full">
        <AnimatePresence mode="wait">
          {/* Active region + posts */}
          {activeRegion ? (
            <motion.div
              key={activeSlug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-3xl leading-none">
                      {ICONS[activeRegion.slug]}
                    </span>
                    <h2 className="text-2xl font-light tracking-tight text-[#2C302E]">
                      {activeRegion.name_en}
                    </h2>
                  </div>
                  <p className="text-sm text-[#2C302E]/40 ml-12">
                    {activeRegion.name_th}&nbsp;·&nbsp;
                    {filteredPosts.length}{" "}
                    {filteredPosts.length === 1 ? "story" : "stories"}
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
            /* Idle — region pills */
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-4 pt-2"
            >
              <p className="text-base text-[#2C302E]/30 font-light leading-relaxed">
                Click a region on the 3D map to explore its stories.
              </p>

              <div className="flex flex-wrap gap-2 mt-1">
                {regions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveSlug(r.slug)}
                    className="flex items-center gap-2 text-sm border border-[#2C302E]/10 text-[#2C302E]/50 hover:text-[#D97706] hover:border-[#D97706]/40 px-4 py-2 rounded-full transition-all hover:shadow-sm"
                  >
                    <span>{ICONS[r.slug]}</span>
                    <span>{r.name_en}</span>
                    <span className="text-[#D97706] font-semibold text-xs">
                      {r.post_count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-8 text-xs text-[#2C302E]/20 tracking-wide leading-relaxed max-w-xs">
                Hover over a region to lift it.
                <br />
                Click to reveal stories from that area.
              </div>
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
