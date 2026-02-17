"use client";

import React from "react";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PostLayoutProps {
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  children: React.ReactNode;
}

export function PostLayout({
  title,
  date,
  readTime,
  category,
  excerpt,
  children,
}: PostLayoutProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isScrolled = scrollY > 50;

  return (
    <div className="min-h-screen bg-background">
      <header
        className={`fixed top-0 right-0 left-0 z-50 flex items-center border-b border-border bg-background/95 backdrop-blur-sm transition-all duration-300 ${
          isScrolled ? "h-12 px-6" : "h-16 px-8"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Back</span>
        </Link>
        <span
          className={`ml-6 font-serif font-bold tracking-tight text-foreground transition-all duration-300 ${
            isScrolled ? "text-base" : "text-xl"
          }`}
        >
          Dev Patterns & Practices
        </span>
      </header>

      <div
        className={`transition-all duration-300 ${isScrolled ? "h-12" : "h-16"}`}
      />

      <article className="mx-auto max-w-2xl px-6 py-12 md:px-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {category}
          </span>
          <span className="text-muted-foreground/40">{"/"}</span>
          <time className="text-xs text-muted-foreground">{date}</time>
          <span className="text-muted-foreground/40">{"/"}</span>
          <span className="text-xs text-muted-foreground">{readTime}</span>
        </div>

        <h1 className="mb-8 font-serif text-3xl font-bold leading-tight tracking-tight text-foreground text-balance md:text-4xl lg:text-5xl">
          {title}
        </h1>

        <p className="mb-12 border-l-2 border-border pl-5 text-base leading-relaxed text-muted-foreground italic">
          {excerpt}
        </p>

        <div className="space-y-6">{children}</div>

        <div className="mt-16 border-t border-border pt-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Back to all articles
          </Link>
        </div>
      </article>

      <footer className="border-t border-border px-6 py-8 md:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {"Dev Patterns & Practices, 2026"}
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              RSS
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
