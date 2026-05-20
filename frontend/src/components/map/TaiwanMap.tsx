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
    // Full-screen container — fills the fixed section from page.tsx
    <div className="relative w-full h-full overflow-hidden">

      {/* ── Full-screen map ── */}
      <TaiwanMapImage
        regions={regions}
        activeSlug={activeSlug}
        onRegionClick={setActiveSlug}
      />

      {/* ── Floating post drawer (slides in from right) ── */}
      <AnimatePresence>
        {activeRegion && (
          <motion.aside
            key={activeSlug}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            className="absolute top-0 right-0 h-full w-[360px] max-w-[85vw] bg-white/90 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Drawer header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#2C302E]/8">
              <div>
                <div className="flex items-center gap-2.5 mb-0.5">
                  <span className="text-3xl leading-none">{ICONS[activeRegion.slug]}</span>
                  <h2 className="text-xl font-light tracking-tight text-[#2C302E]">
                    {activeRegion.name_en}
                  </h2>
                </div>
                <p className="text-xs text-[#2C302E]/40 ml-11">
                  {activeRegion.name_th}&nbsp;·&nbsp;
                  {filteredPosts.length} {filteredPosts.length === 1 ? "story" : "stories"}
                </p>
              </div>
              <button
                onClick={() => setActiveSlug(null)}
                className="text-xs border border-[#2C302E]/12 text-[#2C302E]/35 hover:text-[#2C302E] hover:border-[#2C302E]/30 transition-colors px-3 py-1.5 rounded-full mt-0.5 shrink-0"
              >
                ✕ close
              </button>
            </div>

            {/* Post list */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
              {filteredPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

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
