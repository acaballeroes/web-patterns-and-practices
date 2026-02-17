import type { BlogPost } from "@/lib/blog-data";
import { ArrowRight } from "lucide-react";

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group border-b border-border py-8 first:pt-0 last:border-b-0">
      <a href={post.href} className="block">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {post.category}
            </span>
            <span className="text-muted-foreground/40">{"/"}</span>
            <time className="text-xs text-muted-foreground">{post.date}</time>
          </div>

          <h2 className="font-serif text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-muted-foreground md:text-2xl">
            {post.title}
          </h2>

          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-medium text-foreground transition-colors group-hover:text-muted-foreground">
              Read article
            </span>
            <ArrowRight
              size={14}
              className="text-foreground transition-transform group-hover:translate-x-1"
            />
            <span className="ml-auto text-xs text-muted-foreground">
              {post.readTime}
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}
