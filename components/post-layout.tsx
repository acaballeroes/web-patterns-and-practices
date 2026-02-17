"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PostLayoutProps {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  children: React.ReactNode;
}

export function PostLayout({
  title,
  date,
  category,
  excerpt,
  children,
}: PostLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header
        className={`fixed top-0 right-0 left-0 z-50 flex items-center border-b border-border bg-background/95 backdrop-blur-sm transition-all duration-300 h-16 px-8`}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Back</span>
        </Link>
        <span
          className={`ml-6 font-serif font-bold tracking-tight text-foreground transition-all duration-300 text-xl`}
        >
          Dev Patterns & Practices
        </span>
      </header>

      <article className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-6 md:px-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {category}
          </span>
          <span className="text-muted-foreground/40">{"/"}</span>
          <time className="text-xs text-muted-foreground">{date}</time>
          <span className="text-muted-foreground/40">{"/"}</span>
        </div>

        <h1 className="mb-8 font-serif text-2xl font-bold leading-tight tracking-tight text-foreground text-balance sm:text-3xl md:text-4xl lg:text-5xl">
          {title}
        </h1>

        <p className="mb-12 border-l-2 border-border pl-5 text-sm leading-relaxed text-muted-foreground italic sm:text-base">
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
    </div>
  );
}
