import { PostCard } from "@/components/post-card";
import { PostLayout } from "@/components/post-layout";
import { getPostBySlug, getArticlesByPost } from "@/lib/blog-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup Guide - Dev Patterns & Practices",
  description:
    "This guide covers the complete setup for Angular 19 and Next.js 14, including installation, configuration, , ESLint, Prettier and Hysky and best practices to get you up and running quickly.",
};

export default function Page() {
  const post = getPostBySlug("setup-guide");

  if (!post) {
    return <div></div>;
  }

  const articles = getArticlesByPost(post.slug);

  return (
    <PostLayout
      title={post.title}
      date={post.date}
      category={post.category}
      excerpt={post.excerpt}
    >
      <p className="text-base leading-relaxed text-foreground/80">
        Complete setup guides for each tech stack, including linters,
        formatters, Git hooks, and IDE configuration. Get your development
        environment production-ready from day one. Available guides: Node.js
        Installation - Multiple installation methods for Windows and Linux,
        including NVM Angular Development - Complete setup with ESLint,
        Prettier, and best practices React Development - Vite-based setup with
        modern tooling Next.js Development - App Router configuration with
        optimizations Common Tools - ESLint, Prettier, Husky, lint-staged, and
        EditorConfig
      </p>

      <section
        id="articles"
        className="mx-auto max-w-3xl px-6 py-12 md:px-8 lg:px-12"
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mt-1 text-sm text-muted-foreground">
              {articles.length} {articles.length === 1 ? "article" : "articles"}
            </p>
          </div>
        </div>

        <div className="divide-y divide-border">
          {articles.map((article) => (
            <PostCard key={article.title} article={article} />
          ))}
        </div>

        {articles.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">
              No articles found in this category.
            </p>
          </div>
        )}
      </section>
    </PostLayout>
  );
}
