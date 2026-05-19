import type { Post, Region } from "@/types";
import { posts as mockPosts } from "@/data/posts";
import { regions as mockRegions } from "@/data/regions";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

async function strapiRequest<T>(path: string): Promise<T | null> {
  if (!STRAPI_URL) return null;
  try {
    const res = await fetch(`${STRAPI_URL}/api${path}?populate=*`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}

export async function getPosts(): Promise<Post[]> {
  const data = await strapiRequest<Post[]>("/posts");
  return data ?? mockPosts;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const data = await strapiRequest<Post[]>(`/posts?filters[slug][$eq]=${slug}`);
  if (data && data.length > 0) return data[0];
  return mockPosts.find((p) => p.slug === slug);
}

export async function getRegions(): Promise<Region[]> {
  const data = await strapiRequest<Region[]>("/regions");
  return data ?? mockRegions;
}

export async function getPostsByRegion(regionSlug: string): Promise<Post[]> {
  const allPosts = await getPosts();
  return allPosts.filter((p) => p.region.slug === regionSlug);
}
