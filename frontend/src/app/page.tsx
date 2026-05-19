import TaiwanMap from "@/components/map/TaiwanMap";
import { getRegions, getPosts } from "@/lib/strapi";

export default async function HomePage() {
  const [regions, posts] = await Promise.all([getRegions(), getPosts()]);

  return (
    <section className="min-h-screen flex flex-col items-center px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light tracking-tight text-[#2C302E] mb-4">
          Stories from Taiwan
        </h1>
        <p className="text-base text-[#2C302E]/50 max-w-md mx-auto leading-relaxed">
          Click a city on the map to discover travel stories from that region.
        </p>
      </div>
      <TaiwanMap regions={regions} posts={posts} />
    </section>
  );
}
