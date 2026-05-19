import Link from "next/link";
import Image from "next/image";
import { getPosts } from "@/lib/strapi";

export const metadata = {
  title: "All Stories — Taiwan Stories",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-light tracking-tight text-[#2C302E] mb-2">
        All Stories
      </h1>
      <p className="text-sm text-[#2C302E]/50 mb-12">
        {posts.length} articles from across Taiwan
      </p>

      <div className="flex flex-col divide-y divide-[#2C302E]/8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group py-8 flex gap-6 items-start"
          >
            <div className="relative w-32 h-32 shrink-0 overflow-hidden rounded-sm bg-[#E2EDE4]">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="128px"
                unoptimized
              />
            </div>
            <div className="flex flex-col gap-2 py-1">
              <div className="flex items-center gap-3 text-xs text-[#2C302E]/40">
                <span className="text-[#D97706]">{post.region.name_en}</span>
                <span>·</span>
                <time>
                  {new Date(post.published_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <h2 className="text-lg font-medium text-[#2C302E] leading-snug group-hover:text-[#D97706] transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-[#2C302E]/60 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex gap-2 mt-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-[#2C302E]/6 text-[#2C302E]/60 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
