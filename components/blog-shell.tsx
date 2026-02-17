"use client";

import { useState, useEffect } from "react";
import { TopBar } from "./top-bar";
import { Sidebar } from "./sidebar";
import { HeroBanner } from "./hero-banner";
import { PostCard } from "./post-card";
import { getPostsByCategory } from "@/lib/blog-data";

export function BlogShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredPosts = getPostsByCategory(activeCategory);
  const isScrolled = scrollY > 50;

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        isScrolled={isScrolled}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <Sidebar
        isOpen={sidebarOpen}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <main className="lg:pl-64">
        {/* Top spacing for fixed header */}
        <div className="h-14" />

        {/* Hero Banner */}
        <HeroBanner scrollY={scrollY} />

        {/* Articles section */}
        <section
          id="articles"
          className="mx-auto max-w-3xl px-6 py-12 md:px-8 lg:px-12"
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                {activeCategory === "All" ? "Latest Articles" : activeCategory}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredPosts.length}{" "}
                {filteredPosts.length === 1 ? "article" : "articles"}
              </p>
            </div>
          </div>

          <div className="divide-y divide-border">
            {filteredPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">
                No articles found in this category.
              </p>
            </div>
          )}
        </section>

        {/* About section */}
        <section
          id="about"
          className="mx-auto max-w-3xl border-t border-border px-6 py-16 md:px-8 lg:px-12"
        >
          <h2 className="mb-4 font-serif text-2xl font-semibold text-foreground">
            About
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Dev Patterns & Practices is a space for long-form thinking on
            design, technology, and craft. Every piece is written with care and
            the belief that the best ideas deserve room to breathe.
          </p>
        </section>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-8 md:px-8 lg:px-12">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {"Dev Patterns & Practices, 2026"}
            </span>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                GitHub
              </a>
              <a
                href="#"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                RSS
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
