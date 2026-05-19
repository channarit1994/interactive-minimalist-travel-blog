import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/strapi";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Taiwan Stories`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.content
    .split("\n\n")
    .filter((p) => p.trim() && !p.startsWith("#"));

  return (
    <article className="max-w-2xl mx-auto px-6 py-16">
      {/* Region breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#2C302E]/40 mb-8">
        <Link href="/" className="hover:text-[#D97706] transition-colors">
          Map
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-[#D97706] transition-colors">
          Stories
        </Link>
        <span>/</span>
        <span className="text-[#D97706]">{post.region.name_en}</span>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-5">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-[#2C302E]/6 text-[#2C302E]/60 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-medium text-[#2C302E] leading-tight tracking-tight mb-4">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-[#2C302E]/40 mb-10">
        <time>
          {new Date(post.published_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <span>·</span>
        <span>{post.region.name_th}</span>
      </div>

      {/* Hero image */}
      <div className="relative w-full h-72 mb-12 overflow-hidden rounded-sm bg-[#E2EDE4]">
        <Image
          src={post.cover_image}
          alt={post.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      {/* Excerpt */}
      <p className="text-lg text-[#2C302E]/70 leading-relaxed italic mb-10 border-l-2 border-[#D97706]/40 pl-4">
        {post.excerpt}
      </p>

      {/* Body */}
      <div className="flex flex-col gap-6">
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className="text-base text-[#2C302E]/80 leading-8"
          >
            {para.replace(/^#+\s/, "")}
          </p>
        ))}
      </div>

      {/* Footer nav */}
      <div className="mt-16 pt-8 border-t border-[#2C302E]/10">
        <Link
          href="/blog"
          className="text-sm text-[#2C302E]/40 hover:text-[#D97706] transition-colors"
        >
          ← Back to all stories
        </Link>
      </div>
    </article>
  );
}
