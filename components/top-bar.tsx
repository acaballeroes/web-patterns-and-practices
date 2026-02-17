"use client";

import { Menu, X, Search } from "lucide-react";
import Link from "next/link";

interface TopBarProps {
  isScrolled: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function TopBar({
  isScrolled,
  sidebarOpen,
  onToggleSidebar,
}: TopBarProps) {
  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm transition-all duration-300 ${
        isScrolled ? "h-14 px-6" : "h-16 px-8"
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex items-center justify-center rounded-sm p-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <span
            className={`font-serif font-bold tracking-tight text-foreground transition-all duration-300 ${
              isScrolled ? "text-lg" : "text-xl"
            }`}
          >
            Dev Patterns & Practices
          </span>
        </Link>
      </div>

      <nav
        className="hidden items-center gap-8 md:flex"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
        >
          Home
        </Link>
        <Link
          href="/#articles"
          className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
        >
          Articles
        </Link>
        <Link
          href="/#about"
          className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
        >
          About
        </Link>
      </nav>

      <div className="flex items-center">
        <button
          type="button"
          className="flex items-center justify-center rounded-sm p-2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </div>
    </header>
  );
}
