import TaiwanMap from "@/components/map/TaiwanMap";
import { getRegions, getPosts } from "@/lib/strapi";

export default async function HomePage() {
  const [regions, posts] = await Promise.all([getRegions(), getPosts()]);

  return (
    <section className="min-h-screen flex flex-col px-6 lg:px-16 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-light tracking-tight text-[#2C302E] mb-3">
          Stories from Taiwan
        </h1>
        <p className="text-sm text-[#2C302E]/45 max-w-sm leading-relaxed">
          An interactive map of travel stories — each region hides a collection of places, food, and moments.
        </p>
      </div>
      <TaiwanMap regions={regions} posts={posts} />
    </section>
  );
}
