import TaiwanMap from "@/components/map/TaiwanMap";
import { getRegions, getPosts } from "@/lib/strapi";

export default async function HomePage() {
  const [regions, posts] = await Promise.all([getRegions(), getPosts()]);

  return (
    // Fill viewport below the fixed navbar (80px)
    <section className="fixed inset-0 top-[80px]">
      <TaiwanMap regions={regions} posts={posts} />
    </section>
  );
}
