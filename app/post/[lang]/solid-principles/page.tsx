import { PostCard } from "@/components/post-card";
import { PostLayout } from "@/components/post-layout";
import { getLocalizedPost, Lang } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import { SolidOverviewEn } from "./overview-en";
import { SolidOverviewEs } from "./overview-es";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  return {
    title:
      l === "es"
        ? "Principios SOLID - Dev Patterns & Practices"
        : "Solid Principles - Dev Patterns & Practices",
    description:
      l === "es"
        ? "Guía detallada de cada principio SOLID con explicaciones conceptuales y ejemplos funcionales en C# y TypeScript."
        : "In-depth guide covering each SOLID principle with conceptual explanations and working examples in C# and TypeScript.",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "es") notFound();

  const post = getLocalizedPost("solid-principles", lang);
  if (!post) return <div></div>;

  const articles = post.items;

  return (
    <PostLayout
      title={post.title}
      date={post.date}
      category={post.category}
      excerpt={post.excerpt}
    >
      <div className="space-y-8 text-base leading-relaxed text-foreground/80">
        {lang === "es" ? <SolidOverviewEs /> : <SolidOverviewEn />}
      </div>

      <section
        id="articles"
        className="mx-auto max-w-3xl px-6 py-12 md:px-8 lg:px-12"
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mt-1 text-sm text-muted-foreground">
              {articles.length}{" "}
              {lang === "es"
                ? articles.length === 1
                  ? "artículo"
                  : "artículos"
                : articles.length === 1
                  ? "article"
                  : "articles"}
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
              {lang === "es"
                ? "No se encontraron artículos en esta categoría."
                : "No articles found in this category."}
            </p>
          </div>
        )}
      </section>
    </PostLayout>
  );
}
