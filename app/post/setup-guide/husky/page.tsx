import { CodeBlock } from "@/components/code-block";
import { PostLayout } from "@/components/post-layout";
import { getArticlesByPostAndSlug } from "@/lib/blog-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Husky - Git Hooks Made Easy - Dev Patterns & Practices",
  description:
    "Husky Git hooks: installation, common hooks, commit-msg validation, integration with lint-staged and examples.",
};

export default function Page() {
  const article = getArticlesByPostAndSlug("setup-guide", "husky");

  if (!article) return <div></div>;

  return (
    <PostLayout
      title={article.title}
      date={article.date}
      category={article.category}
      excerpt={article.excerpt}
    >
      <h2>What is Husky?</h2>
      <p>
        Husky is a <strong>Git hooks manager</strong> that automates tasks
        before commits, pushes, or other Git actions. It helps ensure code
        quality by running linters, formatters, tests, and other checks before
        changes enter your repository.
      </p>

      <h3>TL;DR</h3>
      <p>
        Use Husky to run git hooks (pre-commit, pre-push, commit-msg). Combine
        Husky with `lint-staged` for fast, staged-file checks. Add a `prepare`
        script so hooks install automatically for contributors.
      </p>

      <h2>Why Use Husky?</h2>
      <p>
        Use Husky to prevent broken code from being committed, to enforce team
        standards, and to catch issues early in the development workflow.
      </p>

      <h3>Example: checks before commit</h3>
      <CodeBlock language="bash">{`# Before commit, Husky automatically runs:
# ✓ ESLint checks (no errors allowed)
# ✓ Prettier formatting (code must be formatted)
# ✓ Unit tests (all must pass)
# ✓ Type checking (no TypeScript errors)

# If any check fails → Commit is blocked ❌
# If all checks pass → Commit proceeds ✅`}</CodeBlock>

      <h2>Installation</h2>
      <p>Prerequisite: your project must be a Git repository.</p>
      <CodeBlock language="bash">{`# Install Husky
npm install --save-dev husky

# Initialize Husky (creates .husky/ and a sample hook)
npx husky init`}</CodeBlock>

      <h2>Basic Setup</h2>
      <h3>Create a pre-commit hook</h3>
      <p>
        Create or edit the `.husky/pre-commit` hook to run linting and
        formatting:
      </p>
      <CodeBlock language="bash">{`#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run format
npm test`}</CodeBlock>

      <h3>Using lint-staged (recommended)</h3>
      <p>
        For fast commits run only on staged files, call `npx lint-staged` from
        your pre-commit hook. This keeps hooks quick and focused.
      </p>
      <CodeBlock language="bash">{`# Install both tools
npm install --save-dev husky lint-staged

# Initialize Husky
npx husky init

# Create pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"`}</CodeBlock>

      <h2>Common Hooks</h2>
      <h3>pre-commit</h3>
      <p>Run linters, formatters, and quick tests before creating a commit.</p>
      <CodeBlock language="bash">{`#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged`}</CodeBlock>

      <h3>commit-msg</h3>
      <p>
        Validate commit messages (e.g. with commitlint) before accepting the
        commit.
      </p>
      <CodeBlock language="bash">{`#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1`}</CodeBlock>

      <h3>pre-push</h3>
      <p>Run tests and builds before pushing to remote.</p>
      <CodeBlock language="bash">{`#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run test
npm run build`}</CodeBlock>

      <h2>Package.json Scripts</h2>
      <p>Add a `prepare` script so Husky is installed for contributors:</p>
      <CodeBlock language="json">{`{
  "scripts": {
    "prepare": "husky install"
  }
}`}</CodeBlock>

      <h2>Commit Message Validation</h2>
      <p>
        Install commitlint to enforce commit message conventions (Conventional
        Commits):
      </p>
      <CodeBlock language="bash">{`npm install --save-dev @commitlint/cli @commitlint/config-conventional`}</CodeBlock>
      <CodeBlock language="javascript">{`// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};`}</CodeBlock>

      <h2>Bypassing Hooks (Emergency Only)</h2>
      <p>
        Use these only for urgent fixes — document and follow up with a fix.
      </p>
      <CodeBlock language="bash">{`# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Skip pre-push
git push --no-verify`}</CodeBlock>

      <h2>Troubleshooting</h2>
      <ul className="list-disc pl-6">
        <li>
          Run `npm run prepare` or `npx husky install` if hooks are missing.
        </li>
        <li>
          Ensure `.husky/*` scripts are executable on Unix: `chmod +x .husky/*`.
        </li>
        <li>
          On Windows, set the executable bit in Git index: `git update-index
          --chmod=+x .husky/pre-commit`.
        </li>
      </ul>

      <h3>Quick verification</h3>
      <CodeBlock language="bash">{`# Ensure hooks are installed
    pnpm run prepare

    # Test pre-commit (simulate a commit)
    git add .
    git commit -m "test commit" --no-verify  # skip hooks for manual test

    # Run lint-staged manually
    npx lint-staged
    `}</CodeBlock>

      <h2>Ready For Production</h2>
      <ul className="list-disc pl-6">
        <li>Add `prepare` script to `package.json` (husky install)</li>
        <li>Keep hooks fast: use `lint-staged` for staged-file checks</li>
        <li>Document any allowed bypass policies and emergency procedures</li>
      </ul>

      <h2>Resources</h2>
      <ul className="grid gap-3 mt-4">
        <li>
          <a
            href="https://typicode.github.io/husky/#/"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between gap-3 rounded-lg p-3 bg-white/5 hover:bg-sky-500/8 transition-colors border border-white/6 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          >
            <span className="font-medium text-sky-400">Husky Docs</span>
          </a>
        </li>
        <li>
          <a
            href="https://github.com/typicode/husky"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between gap-3 rounded-lg p-3 bg-white/5 hover:bg-sky-500/8 transition-colors border border-white/6 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          >
            <span className="font-medium text-sky-400">Husky GitHub</span>
          </a>
        </li>
      </ul>
    </PostLayout>
  );
}
