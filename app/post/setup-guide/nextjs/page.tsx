import { CodeBlock } from "@/components/code-block";
import { PostLayout } from "@/components/post-layout";
import { getArticlesByPostAndSlug } from "@/lib/blog-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Development Setup - Complete Guide",
  description:
    "Complete Next.js development setup guide: project, ESLint, Prettier, Husky, TypeScript, and best practices.",
};

export default function Page() {
  const article = getArticlesByPostAndSlug("setup-guide", "nextjs");

  if (!article) return <div></div>;

  return (
    <PostLayout
      title={article.title}
      date={article.date}
      category={article.category}
      excerpt={article.excerpt}
    >
      <h2>Introduction</h2>
      <p>
        This guide covers the complete setup for Next.js development including
        project creation (App Router), ESLint, Prettier, Husky + lint-staged,
        and TypeScript support. Use this as a reference when bootstrapping new
        applications or standardizing team tooling.
      </p>

      <h3>TL;DR</h3>
      <p>
        Bootstrap with the App Router + TypeScript, enable ESLint and Prettier,
        add Husky + lint-staged for pre-commit checks, and use `pnpm` for faster
        installs. CI should run `tsc --noEmit`, `eslint` and `prettier --check`.
      </p>

      <h2>Prerequisites</h2>
      <p>Before starting, make sure you have:</p>
      <ul className="list-disc pl-6">
        <li>
          <strong>Node.js</strong> (v18.17 or higher required)
        </li>
        <li>
          <strong>npm</strong>, <strong>yarn</strong>, or <strong>pnpm</strong>
          (package manager)
        </li>
        <li>A code editor (VSCode recommended)</li>
      </ul>

      <h3>Check Versions</h3>
      <CodeBlock language="bash">
        {`node --version  # Should be v18.17 or higher
npm --version   # Should be 9.x or higher
`}
      </CodeBlock>

      <h3>Step 1 — Create Next.js Project</h3>
      <h4>Create Project with create-next-app</h4>
      <CodeBlock language="bash">{`npx create-next-app@latest my-next-app`}</CodeBlock>

      <h3>Configuration Prompts</h3>
      <p>
        You will be asked several questions (recommendations in parentheses):
      </p>
      <ul className="list-disc pl-6">
        <li>TypeScript: Yes</li>
        <li>ESLint: Yes</li>
        <li>Tailwind CSS: Yes (recommended)</li>
        <li>src/ directory: Yes (recommended)</li>
        <li>App Router: Yes (recommended)</li>
      </ul>

      <h3>Navigate & Test</h3>
      <CodeBlock language="bash">{`cd my-next-app

npm run dev`}</CodeBlock>
      <p>
        Open the app at <code>http://localhost:3000</code>.
      </p>

      <h3>Project Structure (App Router)</h3>
      <CodeBlock language="bash">
        {`my-next-app/
├── public/                   # Static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   ├── globals.css       # Global styles
│   │   └── favicon.ico       # Favicon
├── .eslintrc.json            # ESLint config (auto-generated)
├── next.config.js            # Next.js config
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── tailwind.config.ts        # Tailwind config
`}
      </CodeBlock>

      <h3>Step 2 — Understanding Next.js ESLint Configuration</h3>
      <h3>Auto-Generated ESLint Config</h3>
      <p>Next.js creates a minimal config:</p>
      <CodeBlock language="json">{`{
  "extends": "next/core-web-vitals"
}`}</CodeBlock>

      <h3>Extend with TypeScript and Custom Rules</h3>
      <CodeBlock language="json">
        {`{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": "warn",
    "prefer-const": "error",
    "react/jsx-curly-brace-presence": ["warn", { "props": "never", "children": "never" }],
    "react/self-closing-comp": ["warn", { "component": true, "html": true }]
  }
}`}
      </CodeBlock>

      <h3>Next.js Specific ESLint Rules</h3>
      <p>
        Examples: <code>@next/next/no-html-link-for-pages</code>,
        <code>@next/next/no-img-element</code>, and
        <code>@next/next/no-sync-scripts</code>. Prefer Next.js components
        (`Link`, `Image`, `Script`) where applicable.
      </p>

      <h3>Add ESLint Scripts</h3>
      <CodeBlock language="json">
        {`{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix"
  }
}`}
      </CodeBlock>

      <h3>Test ESLint</h3>
      <CodeBlock language="bash">{`npm run lint`}</CodeBlock>

      <h3>Step 3 — Configure Prettier for Next.js</h3>
      <h3>Install Prettier</h3>
      <CodeBlock language="bash">{`npm install --save-dev prettier eslint-config-prettier`}</CodeBlock>

      <h3>Create .prettierrc</h3>
      <CodeBlock language="json">
        {`{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "jsxSingleQuote": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}`}
      </CodeBlock>

      <h3>Install Tailwind Prettier Plugin</h3>
      <CodeBlock language="bash">{`npm install --save-dev prettier-plugin-tailwindcss`}</CodeBlock>

      <h3>Create .prettierignore</h3>
      <CodeBlock language="bash">
        {`# Dependencies
node_modules/

# Build outputs
.next/
out/
dist/

# Cache
.cache/
.turbo/

# Logs
*.log

# Environment files
.env*.local
`}
      </CodeBlock>

      <h3>Integrate Prettier with ESLint</h3>
      <CodeBlock language="json">
        {`{
  "extends": [
    "next/core-web-vitals",
    "next/typescript",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": "warn",
    "prefer-const": "error"
  }
}`}
      </CodeBlock>

      <h3>VSCode Settings</h3>
      <CodeBlock language="json">
        {`{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}`}
      </CodeBlock>

      <h3>Add Prettier Scripts</h3>
      <CodeBlock language="json">
        {`{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,json}\""
  }
}`}
      </CodeBlock>

      <h3>Step 4 — Setup Husky and lint-staged</h3>
      <h3>Install & Initialize</h3>
      <CodeBlock language="bash">{`npm install --save-dev husky lint-staged

npx husky init`}</CodeBlock>

      <h3>Configure lint-staged</h3>
      <CodeBlock language="json">
        {`{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix --max-warnings=0",
      "prettier --write"
    ],
    "*.{css,json}": [
      "prettier --write"
    ]
  }
}`}
      </CodeBlock>

      <h3>Create Pre-Commit Hook</h3>
      <CodeBlock language="bash">{`#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged`}</CodeBlock>

      <h3>Update package.json Scripts</h3>
      <CodeBlock language="json">
        {`{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,json}\"",
    "prepare": "husky install"
  }
}`}
      </CodeBlock>

      <h2>Next.js Best Practices</h2>
      <h3>App Router File Conventions</h3>
      <p>
        Use `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, and
        `not-found.tsx` in your app route folders. Keep server components by
        default and add <code>use client</code> only when necessary.
      </p>

      <h3>Server vs Client Components</h3>
      <CodeBlock language="typescript">
        {`// Server Component (default)
export default function Page() {
  // runs on the server
  return <div>Server Component</div>
}

// Client Component
'use client'
import { useState } from 'react'
export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}`}
      </CodeBlock>

      <h3>Image Optimization</h3>
      <CodeBlock language="typescript">
        {`import Image from 'next/image'

<Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority />`}
      </CodeBlock>

      <h3>Metadata & SEO</h3>
      <CodeBlock language="typescript">
        {`import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home | My Next.js App',
  description: 'Welcome to my Next.js application'
}`}
      </CodeBlock>

      <h3>Quick verification</h3>
      <CodeBlock language="bash">
        {`# Check node and package manager
    node --version
    pnpm --version

    # Start dev server
    pnpm dev    # (or npm run dev)

    # Lint and format checks
    pnpm exec eslint .
    pnpm exec prettier --check "src/**/*.{ts,tsx,css,json}"
    `}
      </CodeBlock>

      <h2>Complete Setup Checklist</h2>
      <ul className="list-disc pl-6">
        <li>Node.js v18.17+ installed</li>
        <li>Project created with `create-next-app`</li>
        <li>App Router & TypeScript selected</li>
        <li>ESLint and Prettier configured</li>
        <li>Husky + lint-staged installed and tested</li>
      </ul>

      <h2>Useful Commands</h2>
      <CodeBlock language="bash">
        {`# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint
npm run lint

# Format
npm run format`}
      </CodeBlock>

      <h2>Troubleshooting</h2>
      <p>
        Common issues and fixes: missing plugins (run `npm install`), image
        optimization errors (add width/height or configure remote domains in
        `next.config.js`), and hydration mismatches (move browser-only code to
        client components).
      </p>

      <h2>Resources</h2>
      <ul>
        <li>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between gap-3 rounded-lg p-3 bg-white/5 hover:bg-sky-500/8 transition-colors border border-white/6 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          >
            <span className="font-medium text-sky-400">
              Next.js Official Docs
            </span>
          </a>
        </li>
        <li>
          <a
            href="https://nextjs.org/learn"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between gap-3 rounded-lg p-3 bg-white/5 hover:bg-sky-500/8 transition-colors border border-white/6 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          >
            <span className="font-medium text-sky-400">
              Next.js Learn Course
            </span>
          </a>
        </li>
      </ul>
    </PostLayout>
  );
}
