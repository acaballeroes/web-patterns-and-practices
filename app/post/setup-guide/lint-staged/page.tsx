import { CodeBlock } from "@/components/code-block";
import { PostLayout } from "@/components/post-layout";
import { getArticlesByPostAndSlug } from "@/lib/blog-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "lint-staged - Optimized Linting - Dev Patterns & Practices",
  description:
    "lint-staged configuration and usage: run linters/formatters only on staged files, performance patterns and integration with Husky.",
};

export default function Page() {
  const article = getArticlesByPostAndSlug("setup-guide", "lint-staged");

  if (!article) return <div></div>;

  return (
    <PostLayout
      title={article.title}
      date={article.date}
      category={article.category}
      excerpt={article.excerpt}
    >
      <h2>What is lint-staged?</h2>
      <p>
        <strong>lint-staged</strong> runs linters and formatters only on files
        that are staged for commit. That makes Git hooks fast and avoids running
        checks on the whole repository.
      </p>

      <h3>TL;DR</h3>
      <p>
        Configure `lint-staged` to run linters and formatters only on staged
        files. Combine with Husky to call `npx lint-staged` from a pre-commit
        hook so commits remain fast and reliable.
      </p>

      <h2>Why Use lint-staged?</h2>
      <p>
        It significantly reduces the time spent on pre-commit checks by limiting
        work to the files you changed — making commits fast and developer
        workflows more efficient.
      </p>

      <h3>Example: performance difference</h3>
      <CodeBlock language="bash">
        {`
          # Without lint-staged (slow)
          # Checks ALL project files
          npm run lint  # Takes 45 seconds

          # With lint-staged (fast)
          # Checks only staged files
          npx lint-staged  # Takes ~2 seconds
        `}
      </CodeBlock>

      <h2>Installation</h2>
      <CodeBlock language="bash">{`npm install --save-dev lint-staged`}</CodeBlock>
      <p>
        Recommended: install together with Husky and create the pre-commit hook:
      </p>

      <CodeBlock language="bash">
        {`
          npm install --save-dev husky lint-staged
          npx husky init
          npx husky add .husky/pre-commit "npx lint-staged"
        `}
      </CodeBlock>

      <h2>Basic Configuration</h2>
      <h3>Method 1: `package.json`</h3>
      <CodeBlock language="json">
        {`
          {
            "lint-staged": {
              "*.{js,ts,jsx,tsx}": [
                "eslint --fix",
                "prettier --write"
              ]
            }
          }
        `}
      </CodeBlock>

      <h3>Method 2: `.lintstagedrc.json`</h3>
      <CodeBlock language="json">
        {`
          {
            "*.{js,ts,jsx,tsx}": [
              "eslint --fix",
              "prettier --write"
            ],
            "*.{json,md}": [
              "prettier --write"
            ]
          }
      `}
      </CodeBlock>

      <h3>Method 3: `lint-staged.config.js`</h3>
      <CodeBlock language="javascript">
        {`
          module.exports = {
            '*.{js,ts,jsx,tsx}': [
              'eslint --fix',
              'prettier --write',
            ],
            '*.{json,md,html,css}': [
              'prettier --write',
            ],
          };
        `}
      </CodeBlock>

      <h2>Detailed Patterns</h2>
      <p>
        Examples for different project types (JS/TS, React, Angular, Full
        stack).
      </p>
      <CodeBlock language="json">
        {`
          {
            "lint-staged": {
              "*.{js,ts}": [
                "eslint --fix --max-warnings=0",
                "prettier --write"
              ],
              "*.{json,md}": [
                "prettier --write"
              ]
            }
          }
        `}
      </CodeBlock>

      <h2>Pattern Matching</h2>
      <p>Use globs to target files precisely.</p>
      <CodeBlock language="javascript">
        {`
          {
            "scripts": {},
            "lint-staged": {
              "src/**/*.ts": ["eslint --fix"],
              "*.{json,md}": ["prettier --write"]
            }
          }
        `}
      </CodeBlock>

      <h2>Commands Explained</h2>
      <h3>`eslint --fix`</h3>
      <p>Auto-fixes problems in staged files (modifies files).</p>
      <CodeBlock language="bash">{`eslint --fix`}</CodeBlock>

      <h3>`eslint --fix --max-warnings=0`</h3>
      <p>Fail if any warnings exist, enforcing a zero-warning policy.</p>
      <CodeBlock language="bash">{`eslint --fix --max-warnings=0`}</CodeBlock>

      <h3>`prettier --write`</h3>
      <p>Format staged files in place.</p>
      <CodeBlock language="bash">{`prettier --write`}</CodeBlock>

      <h3>`jest --bail --findRelatedTests`</h3>
      <p>Run only tests related to the staged files.</p>
      <CodeBlock language="bash">{`jest --bail --findRelatedTests`}</CodeBlock>

      <h2>Advanced Configurations</h2>
      <h3>With Type Checking</h3>
      <CodeBlock language="javascript">{`module.exports = {
  '*.{ts,tsx}': [
    () => 'tsc --noEmit',
    'eslint --fix',
    'prettier --write',
  ],
};`}</CodeBlock>

      <h3>Conditional Commands</h3>
      <p>Run tests only if test files changed:</p>
      <CodeBlock language="javascript">{`module.exports = {
  '*.{ts,tsx}': (filenames) => {
    const commands = ['eslint --fix', 'prettier --write'];
    const hasTests = filenames.some(f => f.includes('.test.') || f.includes('.spec.'));
    if (hasTests) commands.push('jest --bail --findRelatedTests');
    return commands;
  }
};`}</CodeBlock>

      <h2>Integration with Husky</h2>
      <p>
        Typical setup uses Husky to call `npx lint-staged` from
        `.husky/pre-commit`.
      </p>
      <CodeBlock language="bash">
        {`
          # .husky/pre-commit
          #!/usr/bin/env sh
          . "$(dirname -- "$0")/_/husky.sh"

          npx lint-staged`}
      </CodeBlock>

      <h3>Quick verification</h3>
      <CodeBlock language="bash">
        {`
          # Install deps
          pnpm install --save-dev lint-staged husky

          # Run lint-staged manually
          npx lint-staged

          # Debug mode
          npx lint-staged --debug
        `}
      </CodeBlock>

      <h2>Ready For Production</h2>
      <ul className="list-disc pl-6">
        <li>Keep `lint-staged` config simple and focused on staged files</li>
        <li>Ensure pre-commit hook delegates to `npx lint-staged`</li>
        <li>Document the expected developer workflow (how to fix failures)</li>
      </ul>

      <h2>Run Manually</h2>
      <CodeBlock language="bash">{`npx lint-staged`}</CodeBlock>

      <h2>Debugging</h2>
      <p>
        If you need to inspect what lint-staged is doing, run it in verbose or
        debug mode and stage a sample file to reproduce the hook locally.
      </p>

      <h2>Resources</h2>
      <ul className="grid gap-3 mt-4">
        <li>
          <a
            href="https://github.com/okonet/lint-staged"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between gap-3 rounded-lg p-3 bg-white/5 hover:bg-sky-500/8 transition-colors border border-white/6 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          >
            <span className="font-medium text-sky-400">lint-staged GitHub</span>
          </a>
        </li>
      </ul>
    </PostLayout>
  );
}
