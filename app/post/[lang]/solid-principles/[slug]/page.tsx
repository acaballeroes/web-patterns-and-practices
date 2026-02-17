import { getLocalizedArticle, Lang } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import { PostLayout } from "@/components/post-layout";

// English content components
import { SrpContentEn } from "./content/srp-en";
import { OcpContentEn } from "./content/ocp-en";
import { LspContentEn } from "./content/lsp-en";
import { IspContentEn } from "./content/isp-en";
import { DipContentEn } from "./content/dip-en";

// Spanish content components
import { SrpContentEs } from "./content/srp-es";
import { OcpContentEs } from "./content/ocp-es";
import { LspContentEs } from "./content/lsp-es";
import { IspContentEs } from "./content/isp-es";
import { DipContentEs } from "./content/dip-es";

const contentMap: Record<string, Record<Lang, React.ComponentType>> = {
  "single-responsibility": { en: SrpContentEn, es: SrpContentEs },
  "open-closed": { en: OcpContentEn, es: OcpContentEs },
  "liskov-substitution": { en: LspContentEn, es: LspContentEs },
  "interface-segregation": { en: IspContentEn, es: IspContentEs },
  "dependency-inversion": { en: DipContentEn, es: DipContentEs },
};

const slugs = [
  "single-responsibility",
  "open-closed",
  "liskov-substitution",
  "interface-segregation",
  "dependency-inversion",
];

export function generateStaticParams() {
  return slugs.flatMap((slug) => [
    { lang: "en", slug },
    { lang: "es", slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const article = getLocalizedArticle("solid-principles", slug, lang as Lang);
  return {
    title: article ? `${article.title} - SOLID Principles` : "SOLID Principles",
    description: article?.excerpt ?? "",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (lang !== "en" && lang !== "es") notFound();
  if (!slugs.includes(slug)) notFound();

  const article = getLocalizedArticle("solid-principles", slug, lang);
  if (!article) notFound();

  const entry = contentMap[slug];
  if (!entry) notFound();

  const Content = entry[lang];

  return (
    <PostLayout
      title={article.title}
      date={article.date}
      category={article.category}
      excerpt={article.excerpt}
    >
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-base leading-relaxed text-foreground/80">
        <Content />
      </div>
    </PostLayout>
  );
}
