export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  href: string;
}

export const categories = ["All", "Design", "Technology"];

export const posts: BlogPost[] = [
  {
    slug: "the-art-of-simplicity",
    title: "The Art of Simplicity in Modern Design",
    excerpt:
      "Exploring how restraint and intentionality create more impactful experiences. Less is not just more, it is everything.",
    date: "Feb 8, 2026",
    readTime: "6 min read",
    category: "Design",
    href: "/post/the-art-of-simplicity",
  },
  {
    slug: "building-for-the-web",
    title: "Building for the Web in 2026",
    excerpt:
      "The web platform has evolved dramatically. Here is what matters now and what you can safely ignore.",
    date: "Feb 3, 2026",
    readTime: "8 min read",
    category: "Technology",
    href: "/post/building-for-the-web",
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === "All") return posts;
  return posts.filter((post) => post.category === category);
}
