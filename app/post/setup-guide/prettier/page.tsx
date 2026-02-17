import { CodeBlock } from "@/components/code-block";
import { PostLayout } from "@/components/post-layout";
import { getArticlesByPostAndSlug } from "@/lib/blog-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prettier - Code Formatting Guide - Dev Patterns & Practices",
  description:
    "Prettier configuration and usage: installing, configuring .prettierrc, editor integration, and CLI commands.",
};

export default function Page() {
  const article = getArticlesByPostAndSlug("setup-guide", "prettier");

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
        Prettier is an opinionated code formatter that enforces a consistent
        code style across languages and file types. This guide explains how to
        install Prettier, configure `.prettierrc`, and integrate it with your
        editor and CI.
      </p>

      <h3>TL;DR</h3>
      <p>
        Install Prettier with a shared `.prettierrc`, enable `formatOnSave` in
        editors, and run `prettier --check` in CI. Integrate with ESLint using
        `eslint-config-prettier` to avoid formatting rule conflicts.
      </p>

      <h2>Installation</h2>
      <CodeBlock language="bash">{"npm install --save-dev prettier"}</CodeBlock>
      <p>For ESLint integration:</p>
      <CodeBlock language="bash">
        {"npm install --save-dev eslint-config-prettier"}
      </CodeBlock>

      <h2>Basic `.prettierrc`</h2>
      <p>Example configuration:</p>
      <CodeBlock language="json">{`{
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
}`}</CodeBlock>

      <h2>Command Line Usage</h2>
      <CodeBlock language="bash">
        {
          '# Format all files\nnpx prettier . --write\n\n# Check formatting\nnpx prettier . --check\n\n# Format specific files\nnpx prettier "src/**/*.{js,ts,jsx,tsx}" --write'
        }
      </CodeBlock>

      <h2>VSCode Integration</h2>
      <p>
        Install the Prettier extension (`esbenp.prettier-vscode`) and set as
        default formatter:
      </p>
      <CodeBlock language="json">{`{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}`}</CodeBlock>

      <h2>Integrating with ESLint</h2>
      <p>
        Add `prettier` to `extends` last in your ESLint config to avoid
        conflicts.
      </p>

      <h2>Troubleshooting</h2>
      <ul className="list-disc pl-6">
        <li>
          If Prettier does not run on save, ensure the extension is installed
          and the file type is supported.
        </li>
        <li>
          Use `npx prettier --check` in CI to fail builds on formatting issues.
        </li>
      </ul>

      <h3>Quick verification</h3>
      <CodeBlock language="bash">
        {`# Install deps
pnpm install --save-dev prettier eslint-config-prettier

# Check formatting
pnpm exec prettier --check .

# Fix formatting
pnpm exec prettier --write .
`}
      </CodeBlock>

      <h2>Ready For Production</h2>
      <ul className="list-disc pl-6">
        <li>Use a shared `.prettierrc` and `.prettierignore`</li>
        <li>
          Run `prettier --check` in CI and fail builds on formatting issues
        </li>
        <li>Integrate with `eslint-config-prettier` and editor settings</li>
      </ul>

      <h2>Resources</h2>
      <ul className="grid gap-3 mt-4">
        <li>
          <a
            href="https://prettier.io/docs/en/index.html"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between gap-3 rounded-lg p-3 bg-white/5 hover:bg-sky-500/8 transition-colors border border-white/6 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          >
            <span className="font-medium text-sky-400">Prettier Docs</span>
          </a>
        </li>
        <li>
          <a
            href="https://github.com/prettier/prettier"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between gap-3 rounded-lg p-3 bg-white/5 hover:bg-sky-500/8 transition-colors border border-white/6 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          >
            <span className="font-medium text-sky-400">Prettier GitHub</span>
          </a>
        </li>
      </ul>
    </PostLayout>
  );
}
