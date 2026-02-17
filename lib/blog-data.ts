import { BookOpen, Code2 } from "lucide-react";

export const categories = [
  "All",
  "Setup",
  "Solid Principles",
  "Design",
  "Technology",
  "Development",
  "Thoughts",
  "Craft",
];

export interface PostItem {
  slug: string;
  title: string;
  category: string;
  date: string;
  url: string;
  excerpt: string;
  isActive?: boolean;
}

export interface Post {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  items: PostItem[];
}

const posts: Post[] = [
  {
    slug: "setup-guide",
    title: "Setup Guide",
    url: "/post/setup-guide",
    icon: BookOpen,
    excerpt:
      "Step-by-step setup for Angular 19 and Next.js 14: installation, configuration, linting, formatting, commit hooks, and practical best practices to get projects production-ready.",
    date: "Feb 8, 2026",
    category: "Setup",
    items: [
      {
        slug: "nodejs",
        title: "Node.js Development Setup",
        category: "Setup",
        url: "/post/setup-guide/nodejs",
        date: "Feb 8, 2026",
        excerpt:
          "Practical Node.js development setup: install Node, choose a package manager, and configure ESLint, Prettier, Husky and lint-staged for a reliable developer workflow.",
        isActive: false,
      },
      {
        slug: "angular",
        title: "Angular 19 Development Setup",
        category: "Setup",
        url: "/post/setup-guide/angular",
        date: "Feb 8, 2026",
        excerpt:
          "Practical Angular 19 setup: CLI and workspace configuration, TypeScript tips, ESLint and Prettier integration, plus commit-hook examples to maintain a robust workflow.",
        isActive: true,
      },
      {
        slug: "nextjs",
        title: "Next js Development Setup",
        category: "Setup",
        url: "/post/setup-guide/nextjs",
        date: "Feb 8, 2026",
        excerpt:
          "Next.js 14 setup: app-dir conventions, TypeScript, ESLint and Prettier configuration, dev vs production builds, and deployment best practices.",
        isActive: false,
      },
      {
        slug: "eslint",
        title: "ESLint Configuration",
        category: "Setup",
        url: "/post/setup-guide/eslint",
        date: "Feb 8, 2026",
        excerpt:
          "Comprehensive ESLint guide for Angular and Next.js: install, configure rules and plugins, and integrate with Prettier to enforce consistent code quality.",
        isActive: false,
      },
      {
        slug: "prettier",
        title: "Prettier Configuration",
        category: "Setup",
        url: "/post/setup-guide/prettier",
        date: "Feb 8, 2026",
        excerpt:
          "Configure Prettier for Angular and Next.js with recommended options and examples for seamless integration with ESLint and your editor.",
        isActive: false,
      },
      {
        slug: "husky",
        title: "Husky Configuration",
        category: "Setup",
        url: "/post/setup-guide/husky",
        date: "Feb 8, 2026",
        excerpt:
          "Set up Husky to run git hooks that enforce linting, formatting and tests on commit—examples and integration with lint-staged included.",
        isActive: false,
      },
      {
        slug: "lint-staged",
        title: "Lint-Staged Configuration",
        category: "Setup",
        url: "/post/setup-guide/lint-staged",
        date: "Feb 8, 2026",
        excerpt:
          "Configure lint-staged to run linters and formatters only on staged files, keeping commits fast and code clean with practical examples.",
        isActive: false,
      },
    ],
  },
  {
    slug: "solid-principles",
    title: "Solid Principles",
    url: "/post/solid-principles",
    icon: Code2,
    excerpt:
      "A practical series on the SOLID principles with examples and patterns to help you write maintainable, testable, and scalable TypeScript applications (Angular & Next.js).",
    date: "Feb 8, 2026",
    category: "Solid Principles",
    items: [
      {
        slug: "single-responsibility",
        title: "Single Responsibility Principle",
        category: "Solid Principles",
        date: "Feb 8, 2026",
        url: "/post/solid-principles/single-responsibility",
        excerpt:
          "Explains the Single Responsibility Principle with examples that split responsibilities into focused, testable units for clearer, maintainable code.",
        isActive: false,
      },
      {
        slug: "open-closed",
        title: "Open/Closed Principle",
        category: "Solid Principles",
        date: "Feb 8, 2026",
        url: "/post/solid-principles/open-closed",
        excerpt:
          "Shows how to design components and modules that are open for extension but closed for modification using practical TypeScript patterns.",
        isActive: false,
      },
      {
        slug: "liskov-substitution",
        title: "Liskov Substitution Principle",
        category: "Solid Principles",
        date: "Feb 8, 2026",
        url: "/post/solid-principles/liskov-substitution",
        excerpt:
          "Demonstrates Liskov Substitution with examples that ensure subclasses can safely replace base types without breaking system behavior.",
        isActive: false,
      },
      {
        slug: "interface-segregation",
        title: "Interface Segregation Principle",
        category: "Solid Principles",
        date: "Feb 8, 2026",
        url: "/post/solid-principles/interface-segregation",
        excerpt:
          "Guides you to create focused interfaces so clients depend only on what they use—reducing coupling and improving flexibility.",
        isActive: false,
      },
      {
        slug: "dependency-inversion",
        title: "Dependency Inversion Principle",
        category: "Solid Principles",
        date: "Feb 8, 2026",
        url: "/post/solid-principles/dependency-inversion",
        excerpt:
          "Explains Dependency Inversion with DI examples and abstractions to decouple modules, making code easier to test and evolve.",
        isActive: false,
      },
    ],
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getAllPosts(): Post[] {
  return posts;
}

export function getArticlesByPost(slug: string): PostItem[] {
  const post = getPostBySlug(slug);
  return post ? post.items : [];
}

export function getArticlesByPostAndSlug(
  postSlug: string,
  articleSlug: string,
): PostItem | undefined {
  const post = getPostBySlug(postSlug);
  return post
    ? post.items.find((item) => item.slug === articleSlug)
    : undefined;
}
