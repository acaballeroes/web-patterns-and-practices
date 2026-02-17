"use client";

import React from "react"

import { categories } from "@/lib/blog-data";
import {
  BookOpen,
  Pen,
  Monitor,
  Code,
  Lightbulb,
  Hammer,
  Layers,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  All: <Layers size={16} />,
  Design: <Pen size={16} />,
  Technology: <Monitor size={16} />,
  Development: <Code size={16} />,
  Thoughts: <Lightbulb size={16} />,
  Craft: <Hammer size={16} />,
};

interface SidebarProps {
  isOpen: boolean;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onClose: () => void;
}

export function Sidebar({
  isOpen,
  activeCategory,
  onCategoryChange,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-64 border-r border-border bg-sidebar transition-transform duration-300 lg:top-14 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar navigation"
      >
        <div className="flex h-full flex-col px-4 py-6">
          <div className="mb-6 flex items-center gap-2 px-3">
            <BookOpen size={16} className="text-muted-foreground" />
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Categories
            </span>
          </div>

          <nav className="flex flex-col gap-1">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  onCategoryChange(category);
                  onClose();
                }}
                className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
                  activeCategory === category
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <span className="text-muted-foreground">
                  {categoryIcons[category]}
                </span>
                {category}
              </button>
            ))}
          </nav>

          <div className="mt-auto border-t border-border pt-6">
            <div className="px-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                About
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Thoughts on design, technology, and the craft of building for
                the web.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
