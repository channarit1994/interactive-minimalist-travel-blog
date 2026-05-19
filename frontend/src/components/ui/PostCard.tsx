import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types";

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-4 items-start"
    >
      <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-sm bg-[#E2EDE4]">
        <Image
          src={post.cover_image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="96px"
          unoptimized
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#D97706] tracking-wide">
          {post.tags.join(" · ")}
        </span>
        <h3 className="text-base font-medium text-[#2C302E] leading-snug group-hover:text-[#D97706] transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-[#2C302E]/60 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
        <time className="text-xs text-[#2C302E]/40 mt-1">
          {new Date(post.published_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>
    </Link>
  );
}
