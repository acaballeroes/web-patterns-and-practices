import { CodeBlock } from "@/components/code-block";
import { PostLayout } from "@/components/post-layout";
import { getArticlesByPostAndSlug } from "@/lib/blog-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ESLint - Code Quality Guide - Dev Patterns & Practices",
  description:
    "ESLint setup and best practices: installation, TypeScript integration, rules, and editor setup.",
};

export default function Page() {
  const article = getArticlesByPostAndSlug("setup-guide", "eslint");

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
        ESLint is a static analysis tool that finds problematic patterns in
        JavaScript and TypeScript code. This page shows how to install ESLint,
        integrate it with TypeScript and Prettier, add useful rules, and wire it
        into editor and CI workflows.
      </p>

      <h3>TL;DR</h3>
      <p>
        Install ESLint with TypeScript support, enable recommended rules, and
        integrate with Prettier. Add `eslint` to CI and
        `editor.codeActionsOnSave` for automatic fixes on save. Prefer `pnpm` in
        this repo.
      </p>

      <h2>Installation</h2>
      <p>Install ESLint in your project:</p>
      <CodeBlock language="bash">{"npm install --save-dev eslint"}</CodeBlock>

      <h3>TypeScript support</h3>
      <CodeBlock language="bash">
        {
          "npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin"
        }
      </CodeBlock>

      <h3>Prettier integration</h3>
      <CodeBlock language="bash">
        {"npm install --save-dev eslint-config-prettier"}
      </CodeBlock>

      <h2>Basic `.eslintrc.json`</h2>
      <p>Example starter config for TypeScript + Prettier:</p>
      <CodeBlock language="json">{`{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "rules": {
    "semi": ["error", "always"],
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}`}</CodeBlock>

      <h2>Useful CLI Commands</h2>
      <CodeBlock language="bash">
        {
          "# Check all files\nnpx eslint .\n\n# Fix auto-fixable problems\nnpx eslint . --fix\n\n# Check specific files\nnpx eslint src/**/*.ts"
        }
      </CodeBlock>

      <h2>VSCode Integration</h2>
      <p>Install the ESLint extension and enable auto-fix on save:</p>
      <CodeBlock language="json">{`{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}`}</CodeBlock>

      <h2>CI Integration</h2>
      <p>Add a lint check to CI pipelines or package scripts:</p>
      <CodeBlock language="json">{`{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}`}</CodeBlock>

      <h3>Quick verification</h3>
      <CodeBlock language="bash">
        {`# Install deps
pnpm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier

# Run lint
pnpm exec eslint .

# Auto-fix
pnpm exec eslint . --fix
`}
      </CodeBlock>

      <h2>Ready For Production</h2>
      <ul className="list-disc pl-6">
        <li>Add `"lint"` and `"lint:fix"` scripts to `package.json`</li>
        <li>Run `tsc --noEmit` and `eslint` in CI</li>
        <li>Enable `editor.codeActionsOnSave` in shared VSCode settings</li>
      </ul>

      <h2>Troubleshooting</h2>
      <ul className="list-disc pl-6">
        <li>
          Parsing errors: ensure `parserOptions.project` points to your tsconfig
          when using type-aware rules.
        </li>
        <li>
          Plugin not found: install the missing plugin as a dev dependency.
        </li>
        <li>
          Conflicts with Prettier: add `prettier` to `extends` last to disable
          formatting rules.
        </li>
      </ul>

      <h2>Resources</h2>
      <ul className="grid gap-3 mt-4">
        <li>
          <a
            href="https://eslint.org/docs/latest/"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between gap-3 rounded-lg p-3 bg-white/5 hover:bg-sky-500/8 transition-colors border border-white/6 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          >
            <span className="font-medium text-sky-400">ESLint Docs</span>
          </a>
        </li>
        <li>
          <a
            href="https://github.com/typescript-eslint/typescript-eslint"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between gap-3 rounded-lg p-3 bg-white/5 hover:bg-sky-500/8 transition-colors border border-white/6 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          >
            <span className="font-medium text-sky-400">typescript-eslint</span>
          </a>
        </li>
      </ul>
    </PostLayout>
  );
}
