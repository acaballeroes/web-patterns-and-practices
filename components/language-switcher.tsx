"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Lang } from "@/lib/blog-data";

export function LanguageSwitcher() {
  const pathname = usePathname();

  // Extract current lang from URL pattern /post/[lang]/...
  const match = pathname.match(/^\/post\/(en|es)\//);
  const currentLang: Lang = (match?.[1] as Lang) ?? "en";

  const switchTo: Lang = currentLang === "en" ? "es" : "en";

  // Build the new URL by swapping the lang segment
  const newPath = pathname.replace(/^\/post\/(en|es)\//, `/post/${switchTo}/`);

  return (
    <Link
      href={newPath}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      title={switchTo === "es" ? "Ver en español" : "View in English"}
    >
      <span className="text-sm">{currentLang === "en" ? "🇪🇸" : "🇺🇸"}</span>
      <span>{switchTo === "es" ? "Español" : "English"}</span>
    </Link>
  );
}
