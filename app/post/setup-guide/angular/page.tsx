import { CodeBlock } from "@/components/code-block";
import { PostLayout } from "@/components/post-layout";
import { getArticlesByPostAndSlug } from "@/lib/blog-data";
import { Check, X } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup Guide Angular - Dev Patterns & Practices",
  description:
    "Complete setup guide for Angular 19, including installation, configuration, ESLint, Prettier, Husky, and best practices to get your Angular development environment production-ready.",
};

/**
 * Renders the setup guide page for Angular 19, including prerequisites, installation steps,
 * and highlights of new features such as Standalone Components and Signals-based reactivity.
 *
 * ## Important Version Notes
 * - Angular 19 requires **Node.js 18.19+** (recommended: 20.x LTS)
 * - Supports **TypeScript 5.5+**
 * - Uses **Standalone Components** by default
 *
 * @returns The setup guide article content for Angular 19, or an empty div if the article is not found.
 */
export default function Page() {
  const article = getArticlesByPostAndSlug("setup-guide", "angular");

  if (!article) {
    return <div></div>;
  }
  return (
    <PostLayout
      title={article.title}
      date={article.date}
      category={article.category}
      excerpt={article.excerpt}
    >
      <h2>Introduction</h2>
      <p>
        This guide provides a practical, up-to-date walkthrough to set up a
        modern development environment with <strong>Angular 19</strong>. It is
        intended for teams migrating from older versions and for developers
        starting a new project who want to apply best practices from day one.
      </p>
      <p>
        We cover CLI and project setup using{" "}
        <strong>Standalone Components</strong>, the Signals-based reactivity
        model, and essential tooling for code quality (ESLint, Prettier) and
        workflow integration (Husky, lint-staged). The guide also includes
        recommendations on folder structure, testing, accessibility, and
        production optimizations.
      </p>
      <p>
        By the end of this article you will have a reference project ready for
        production: configured for a great developer experience, with robust
        linting and formatting rules, local CI hooks, and scaffolding that
        supports maintainability and scalability.
      </p>
      <h2>TL;DR</h2>
      <p className="font-semibold">Quick summary</p>
      <ul className="list-disc pl-6">
        <li>Create a new Angular 19 project with Standalone Components.</li>
        <li>
          Use ESLint (flat config) + Prettier and hook them with Husky +
          lint-staged.
        </li>
        <li>
          Prefer Signals and the new `input()`/`output()` helpers for modern
          patterns.
        </li>
        <li>
          Verify with `pnpm exec tsc --noEmit`, `pnpm exec eslint` and `pnpm run
          format:check`.
        </li>
      </ul>
      <ul className="list-disc pl-6">
        <li>Angular CLI 19 installation</li>
        <li>
          Creating a new <strong>Standalone Components</strong> project
        </li>
        <li>
          <strong>Signals-based</strong> architecture
        </li>
        <li>ESLint configuration for Angular 19</li>
        <li>Prettier configuration for Angular templates</li>
        <li>Husky and lint-staged integration</li>
      </ul>
      <strong>What is New in Angular 19:</strong>
      <ul className="list-disc pl-6">
        <li>Standalone Components by default (no NgModules)</li>
        <li>Signals-based reactivity</li>
        <li>Improved performance and bundle size</li>
        <li>
          New <code>input()</code> and <code>output()</code> functions
        </li>
        <li>Simplified project structure</li>
      </ul>

      <h2>Prerequisites</h2>
      <p>Before you begin, make sure you have:</p>
      <ul className="list-disc pl-6">
        <li>
          <strong>Node.js</strong> (v18.19+; v20.x LTS recommended) — Angular 19
          requires at least Node 18.19
        </li>
        <li>
          <strong>npm</strong> (included with Node.js) — v9.x or higher
        </li>
        <li>
          A code editor (<strong>VSCode</strong> recommended)
        </li>
      </ul>

      <p>Verify versions</p>

      <CodeBlock language="bash">
        {`
          node --version  # Should be v18.19+ or v20.x+
          npm --version   # Should be 9.x or higher
        `}
      </CodeBlock>

      <h3>Quick verification</h3>
      <p>
        This repository uses <strong>pnpm</strong>. If you prefer{" "}
        <code>npm</code> or <code>yarn</code>, equivalents are shown.
      </p>
      <CodeBlock language="bash">
        {`
          pnpm install               # (npm) npm install
          pnpm dev                   # (npm) npm run dev | (yarn) yarn dev
          pnpm exec tsc --noEmit     # typecheck
          pnpm exec eslint "app/**/*.{ts,tsx,js,jsx}"  # lint
          pnpm exec prettier --check "src/**/*.{ts,tsx,html,scss,json}"  # format check
        `}
      </CodeBlock>

      <h3>Step 1 — Install Angular CLI 19</h3>
      <p>Install Globally</p>
      <CodeBlock language="bash">
        {`
          npm install -g @angular/cli@latest
        `}
      </CodeBlock>
      <p>Verify Installation</p>
      <CodeBlock language="bash">
        {`
          ng version
        `}
      </CodeBlock>
      <p>Expected output:</p>
      <CodeBlock language="bash">
        {`
            Angular CLI: 19.x.x
            Node: 20.x.x (or 18.19+)
            Package Manager: npm 10.x.x
            OS: win32 x64
        `}
      </CodeBlock>

      <h3>Important Version Notes</h3>
      <ul className="list-disc pl-6">
        <li>
          Angular 19 requires <strong>Node.js 18.19+</strong> (recommended: 20.x
          LTS)
          <ul className="list-disc pl-6">
            <li>
              <strong>npm</strong> (included with Node.js) — v9.x or higher
            </li>
          </ul>
        </li>
        <li>
          Uses <strong>Standalone Components</strong> by default
        </li>
      </ul>

      <h3>Step 2 — Create a New Angular 19 Project</h3>
      <h4>Create Project with Standalone Components</h4>
      <CodeBlock language="bash">
        {`
          ng new my-angular-app
        `}
      </CodeBlock>

      <h4>Configuration Options (Angular 19)</h4>
      <p>You will be asked several questions:</p>

      <p>1. Which stylesheet format would you like to use?</p>
      <CodeBlock language="bash">
        {`
            ? Which stylesheet format would you like to use?
            CSS
            ❯ SCSS   [ https://sass-lang.com/documentation/syntax#scss                ]
            Sass   [ https://sass-lang.com/documentation/syntax#the-indented-syntax ]
            Less   [ http://lesscss.org                                             ]
          `}
      </CodeBlock>
      <p>
        <strong>Recommendation:</strong> Select <strong>SCSS</strong> for modern
        styling
      </p>

      <p>
        2. Do you want to enable Server-Side Rendering (SSR) and Static Site
        Generation (SSG/Prerendering)?
      </p>
      <CodeBlock language="bash">
        {`
            ? Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? (y/N)
          `}
      </CodeBlock>
      <ul className="list-disc pl-6">
        <li>
          <strong>Yes</strong>: For better SEO and initial load performance
        </li>
        <li>
          <strong>No</strong>: For client-side only applications
        </li>
      </ul>
      <p>
        <strong>Note:</strong> Angular 19{" "}
        <strong>NO longer asks about routing</strong> - routing is included by
        default via <code>provideRouter()</code> in <code>app.config.ts</code>.
      </p>

      <p>Navigate to Project</p>

      <CodeBlock language="bash">
        {`
          cd my-angular-app
        `}
      </CodeBlock>

      <p>Test the Installation</p>

      <CodeBlock language="bash">
        {`
          ng serve
        `}
      </CodeBlock>

      <p>
        Open browser at <code>http://localhost:4200</code> - you should see the
        Angular welcome page.
      </p>

      <strong>Development server options:</strong>

      <CodeBlock language="bash">
        {`
            ng serve --open          # Opens browser automatically
            ng serve --port 4300     # Use different port
            ng serve --ssl           # Enable HTTPS
          `}
      </CodeBlock>

      <h3>Angular 19 Project Structure (Standalone)</h3>
      <p>
        <strong>Key Difference:</strong> No more <code>app.module.ts</code> -
        Angular 19 uses Standalone Components by default!
      </p>
      <CodeBlock language="bash">
        {`
            my-angular-app/
            ├── public/
            │   └── favicon.ico                # Favicon
            ├── src/
            │   ├── app/
            │   │   ├── app.component.ts       # Root standalone component
            │   │   ├── app.component.html     # Root template
            │   │   ├── app.component.scss     # Root styles
            │   │   ├── app.component.spec.ts  # Unit tests
            │   │   ├── app.config.ts          # App configuration (replaces app.module.ts)
            │   │   └── app.routes.ts          # Routes configuration
            │   ├── index.html                 # Main HTML
            │   ├── main.ts                    # App entry point (uses bootstrapApplication)
            │   └── styles.scss                # Global styles
            ├── angular.json                   # Angular CLI config
            ├── package.json                   # Dependencies
            ├── package-lock.json              # Locked dependencies
            ├── tsconfig.json                  # TypeScript base config
            ├── tsconfig.app.json              # App-specific TypeScript config
            ├── tsconfig.spec.json             # Test-specific TypeScript config
            └── README.md                      # Project documentation
            `}
      </CodeBlock>
      <p>
        <strong>Note:</strong> Angular 19 uses <code>public/</code> folder for
        static files (like favicon) instead of the old <code>src/assets/</code>{" "}
        approach.
      </p>

      <h3>Key Files Explained</h3>

      <p>
        <strong>
          <code>main.ts</code> - Bootstrap with Standalone:
        </strong>
      </p>
      <CodeBlock language="typescript">
        {`
            bootstrapApplication(AppComponent, appConfig).catch((err) =>
                console.error(err)
            );
        `}
      </CodeBlock>

      <p>
        <strong>
          <code>app.config.ts</code> - Application Configuration:
        </strong>
      </p>
      <CodeBlock language="typescript">
        {`
            export const appConfig: ApplicationConfig = {
                providers: [provideRouter(routes)],
            };
        `}
      </CodeBlock>

      <p>
        <strong>
          <code>app.component.ts</code> - Standalone Component:
        </strong>
      </p>
      <CodeBlock language="typescript">
        {`
            @Component({
                selector: "app-root",
                standalone: true, // ← Standalone component
                imports: [RouterOutlet], // ← Import dependencies directly
                templateUrl: "./app.component.html",
                styleUrl: "./app.component.scss",
            })
            export class AppComponent {
                title = "my-angular-app";
            }
        `}
      </CodeBlock>

      <p>
        <strong>
          <code>app.routes.ts</code> - Routes Configuration:
        </strong>
      </p>
      <CodeBlock language="typescript">
        {`
            export const routes: Routes = [];
        `}
      </CodeBlock>

      <h2>Configure ESLint for Angular 19</h2>
      <p>
        ESLint is a widely used open-source static code analysis tool for
        identifying and fixing problems in JavaScript, TypeScript, and related
        languages. It helps developers maintain code quality and consistency by
        enforcing coding standards, detecting syntax errors, and highlighting
        potential bugs or anti-patterns before code is executed. ESLint is
        highly configurable and supports custom rules, plugins, and integrations
        with modern frameworks like Angular, React, and Vue. In Angular
        projects, ESLint can also validate HTML templates and enforce
        Angular-specific best practices, making it an essential tool for
        scalable, maintainable, and secure codebases.
      </p>
      <h3>Why Angular Needs Specific ESLint?</h3>
      <ul className="list-disc pl-6">
        <li>
          Validation of <strong>HTML templates</strong> (directives, pipes,
          binding)
        </li>
        <li>
          Rules for <strong>Standalone Components</strong>
        </li>
        <li>
          Validation of <strong>Signals</strong> and new reactive primitives
        </li>
        <li>
          Rules for new <code>input()</code> and <code>output()</code> functions
        </li>
        <li>
          Detection of Angular <strong>anti-patterns</strong>
        </li>
      </ul>

      <h3>Difference with Generic ESLint</h3>

      <table className="border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-300">Feature</th>
            <th className="px-4 py-2 border border-gray-300">Generic ESLint</th>
            <th className="px-4 py-2 border border-gray-300">
              Angular 19 ESLint
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="odd:bg-white even:bg-gray-50">
            <td className="px-4 py-2 border border-gray-300">
              Validates TypeScript
            </td>
            <td className="px-4 py-2 border border-gray-300">
              <Check />
            </td>
            <td className="px-4 py-2 border border-gray-300">
              <Check />
            </td>
          </tr>
          <tr className="odd:bg-white even:bg-gray-50">
            <td className="px-4 py-2 border border-gray-300">
              Validates HTML templates
            </td>
            <td className="px-4 py-2 border border-gray-300">
              <X className="text-red-500" />
            </td>
            <td className="px-4 py-2 border border-gray-300">
              <Check />
            </td>
          </tr>
          <tr className="odd:bg-white even:bg-gray-50">
            <td className="px-4 py-2 border border-gray-300">
              Standalone component rules
            </td>
            <td className="px-4 py-2 border border-gray-300">
              <X className="text-red-500" />
            </td>
            <td className="px-4 py-2 border border-gray-300">
              <Check />
            </td>
          </tr>
          <tr className="odd:bg-white even:bg-gray-50">
            <td className="px-4 py-2 border border-gray-300">
              Signals validation
            </td>
            <td className="px-4 py-2 border border-gray-300">
              <X className="text-red-500" />
            </td>
            <td className="px-4 py-2 border border-gray-300">
              <Check />
            </td>
          </tr>
          <tr className="odd:bg-white even:bg-gray-50">
            <td className="px-4 py-2 border border-gray-300">
              Modern input/output functions
            </td>
            <td className="px-4 py-2 border border-gray-300">
              <X className="text-red-500" />
            </td>
            <td className="px-4 py-2 border border-gray-300">
              <Check />
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Install — Angular ESLint</h3>

      <CodeBlock language="bash">
        {`
        ng add @angular-eslint
      `}
      </CodeBlock>
      <p>
        <strong>What does this command do?</strong>
      </p>

      <ol className="list-decimal pl-6 space-y-4">
        <li>
          Installs <code>angular-eslint</code> package (v20.5.1) - all-in-one
          package
        </li>
        <li>
          Installs <strong>ESLint 9.x</strong> (v9.38.0+) - latest with flat
          config
        </li>
        <li>
          Installs <code>typescript-eslint</code> (v8.46.2+)
        </li>
        <li>
          Creates <code>eslint.config.js</code> with{" "}
          <strong>flat config format</strong> (ESLint 9+)
        </li>
        <li>
          Updates <code>angular.json</code> with ESLint builder
        </li>
        <li>
          Adds <code>lint</code> script to <code>package.json</code>
        </li>
        <li>Includes rules for Standalone Components and Signals</li>
      </ol>

      <p>
        <strong>Installed packages:</strong>
      </p>

      <ul className="list-disc pl-6">
        <li>
          <code>angular-eslint</code>: 20.5.1 (includes builder, plugin,
          template parser, and schematics)
        </li>
        <li>
          <code>eslint</code>: ^9.38.0
        </li>
        <li>
          <code>typescript-eslint</code>: 8.46.2
        </li>
        <li>
          <code>typescript</code>: ~5.7.2
        </li>
      </ul>

      <p>
        <strong>Note:</strong> <code>angular-eslint</code> is now a unified
        package that includes all necessary Angular ESLint components.
      </p>

      <h3>Verify Installation</h3>

      <CodeBlock language="bash">
        {`
        ng lint
      `}
      </CodeBlock>

      <p>
        Should show: &quot;All files pass linting&quot; or list of errors to
        fix.
      </p>

      <h3>Project Structure After ESLint Installation</h3>

      <p>
        After running <code>ng add @angular-eslint</code>, your project
        structure will look like this:
      </p>

      <CodeBlock language="bash">
        {`
            my-angular-app/
            ├── public/
            │   └── favicon.ico
            ├── src/
            │   ├── app/
            │   │   ├── app.component.ts
            │   │   ├── app.component.html
            │   │   ├── app.component.scss
            │   │   ├── app.component.spec.ts
            │   │   ├── app.config.ts
            │   │   └── app.routes.ts
            │   ├── index.html
            │   ├── main.ts
            │   └── styles.scss
            ├── angular.json                   # ← Updated with ESLint builder
            ├── eslint.config.js               # ← NEW: ESLint 9 flat config
            ├── package.json                   # ← Updated with ESLint dependencies
            ├── package-lock.json              # ← Updated
            ├── tsconfig.json
            ├── tsconfig.app.json
            ├── tsconfig.spec.json
            └── README.md
        `}
      </CodeBlock>

      <p>
        <strong>Files created/modified:</strong>
      </p>

      <ul className="list-disc pl-6">
        <li>
          <strong>
            <code>eslint.config.js</code>
          </strong>{" "}
          - New ESLint 9 flat configuration file
        </li>
        <li>
          <strong>
            <code>angular.json</code>
          </strong>{" "}
          - Updated with <code>@angular-eslint/builder:lint</code>
        </li>
        <li>
          <strong>
            <code>package.json</code>
          </strong>{" "}
          - New dependencies and scripts added
          <ul className="list-disc pl-6">
            <li>angular-eslint (v20.5.1)</li>
            <li>eslint (v^9.38.0)</li>
            <li>typescript-eslint (v8.46.2)</li>
            <li>lint script added to scripts section</li>
          </ul>
        </li>
      </ul>
      <h2>ESLint 9 Flat Config Format (Angular 19)</h2>
      <p>
        <strong>Important:</strong> Angular ESLint 20.x uses{" "}
        <strong>ESLint 9</strong> with the new{" "}
        <strong>flat config format</strong> (<code>eslint.config.js</code>),
        replacing the old <code>.eslintrc.json</code> format.
      </p>
      <h3>
        Configuration — Generated <code>eslint.config.js</code>
      </h3>
      <p>
        The <code>ng add</code> command creates a flat config file optimized for
        Angular 19:
      </p>
      <CodeBlock language="javascript">
        {`
            // @ts-check

            module.exports = tseslint.config(
                {
                    files: ["**/*.ts"],
                    extends: [
                        eslint.configs.recommended,
                        ...tseslint.configs.recommended,
                        ...tseslint.configs.stylistic,
                        ...angular.configs.tsRecommended,
                    ],
                    processor: angular.processInlineTemplates,
                    rules: {
                        "@angular-eslint/directive-selector": [
                            "error",
                            {
                                type: "attribute",
                                prefix: "app",
                                style: "camelCase",
                            },
                        ],
                        "@angular-eslint/component-selector": [
                            "error",
                            {
                                type: "element",
                                prefix: "app",
                                style: "kebab-case",
                            },
                        ],
                    },
                },
                {
                    files: ["**/*.html"],
                    extends: [
                        ...angular.configs.templateRecommended,
                        ...angular.configs.templateAccessibility,
                    ],
                    rules: {},
                }
            );
        `}
      </CodeBlock>

      <h3>Rules — Key Differences: Flat Config vs Old Format</h3>

      <table className="w-full border border-gray-300 text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300">Aspect</th>
            <th className="px-4 py-2 border border-gray-300">
              Old Format (.eslintrc.json)
            </th>
            <th className="px-4 py-2 border border-gray-300">
              New Format (eslint.config.js)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="odd:bg-white even:bg-gray-50">
            <td className="px-4 py-2 border border-gray-300">File name</td>
            <td className="px-4 py-2 border border-gray-300">.eslintrc.json</td>
            <td className="px-4 py-2 border border-gray-300">
              eslint.config.js
            </td>
          </tr>
          <tr className="odd:bg-white even:bg-gray-50">
            <td className="px-4 py-2 border border-gray-300">ESLint version</td>
            <td className="px-4 py-2 border border-gray-300">ESLint 8.x</td>
            <td className="px-4 py-2 border border-gray-300">ESLint 9.x</td>
          </tr>
          <tr className="odd:bg-white even:bg-gray-50">
            <td className="px-4 py-2 border border-gray-300">Format</td>
            <td className="px-4 py-2 border border-gray-300">
              JSON with overrides
            </td>
            <td className="px-4 py-2 border border-gray-300">
              JavaScript with flat arrays
            </td>
          </tr>
          <tr className="odd:bg-white even:bg-gray-50">
            <td className="px-4 py-2 border border-gray-300">
              Config structure
            </td>
            <td className="px-4 py-2 border border-gray-300">
              Nested <code>overrides</code>
            </td>
            <td className="px-4 py-2 border border-gray-300">
              Flat array of config objects
            </td>
          </tr>
          <tr className="odd:bg-white even:bg-gray-50">
            <td className="px-4 py-2 border border-gray-300">
              Extending configs
            </td>
            <td className="px-4 py-2 border border-gray-300">
              <code>extends</code> array
            </td>
            <td className="px-4 py-2 border border-gray-300">
              Spread operator <code>...configs</code>
            </td>
          </tr>
          <tr className="odd:bg-white even:bg-gray-50">
            <td className="px-4 py-2 border border-gray-300">
              TypeScript support
            </td>
            <td className="px-4 py-2 border border-gray-300">
              Separate parser config
            </td>
            <td className="px-4 py-2 border border-gray-300">
              Built-in with <code>typescript-eslint</code>
            </td>
          </tr>
          <tr className="odd:bg-white even:bg-gray-50">
            <td className="px-4 py-2 border border-gray-300">Flexibility</td>
            <td className="px-4 py-2 border border-gray-300">Limited</td>
            <td className="px-4 py-2 border border-gray-300">
              Full JavaScript power
            </td>
          </tr>
        </tbody>
      </table>
      <h3>Configuration — Flat Config Structure Explained</h3>
      <p>
        <strong>1. TypeScript Files Configuration:</strong>
      </p>
      <CodeBlock language="javascript">
        {`
            {
                files: ["**/*.ts"],  // ← Glob pattern for TypeScript files
                extends: [
                    eslint.configs.recommended,              // ← Base ESLint rules
                    ...tseslint.configs.recommended,         // ← TypeScript rules
                    ...tseslint.configs.stylistic,           // ← TypeScript style rules
                    ...angular.configs.tsRecommended,        // ← Angular-specific rules
                ],
                processor: angular.processInlineTemplates, // ← Process inline templates
                rules: {
                    // Custom rules here
                },
            }
            `}
      </CodeBlock>
      <p>
        <strong>2. HTML Template Files Configuration:</strong>
      </p>
      <CodeBlock language="javascript">
        {`
            {
                files: ["**/*.html"],  // ← Glob pattern for HTML templates
                extends: [
                    ...angular.configs.templateRecommended,   // ← Template rules
                    ...angular.configs.templateAccessibility, // ← Accessibility rules
                ],
                rules: {
                    // Custom template rules here
                },
            }
    `}
      </CodeBlock>

      <p>
        <strong>New in Angular 19:</strong>
      </p>
      <ul className="list-disc pl-6">
        <li>
          <code>@angular-eslint/prefer-standalone</code> - Encourages standalone
          components
        </li>
        <li>Better support for Signals and reactive primitives</li>
        <li>Improved template accessibility rules</li>
      </ul>
      <h2>Understanding angular.json ESLint Configuration</h2>
      <p>
        After running <code>ng add @angular-eslint/schematics</code>, your{" "}
        <code>angular.json</code> is updated with:
      </p>
      <CodeBlock language="json">
        {`
          {
            "projects": {
                "my-angular-app": {
                    "architect": {
                        "lint": {
                            "builder": "@angular-eslint/builder:lint",
                            "options": {
                                "lintFilePatterns": ["src/**/*.ts", "src/**/*.html"]
                            }
                        }
                    }
                }
            }
          }
      `}
      </CodeBlock>
      <p>
        <strong>Configuration explained:</strong>
      </p>
      <ul className="list-disc pl-6">
        <li>
          <code>builder</code>: Uses Angular ESLint builder instead of the old
          TSLint builder
        </li>
        <li>
          <code>lintFilePatterns</code>: Defines which files to lint (all{" "}
          <code>.ts</code> and <code>.html</code> files in <code>src/</code>)
        </li>
      </ul>
      <p>
        <strong>Running the linter:</strong>
      </p>
      <CodeBlock language="bash">
        {`
            npm run lint
            # or
            ng lint
        `}
      </CodeBlock>
      <h3>Configuration — Detailed Flat Config Explanation</h3>
      <h4>What is Included in Each Config</h4>
      <ul className="list-disc pl-6">
        <li>
          <strong>eslint.configs.recommended</strong>: Core ESLint rules
          (no-unused-vars, no-undef, etc.)
        </li>
        <li>
          <strong>tseslint.configs.recommended</strong>: TypeScript-specific
          rules, type-aware linting
        </li>
        <li>
          <strong>tseslint.configs.stylistic</strong>: Code style preferences,
          naming conventions
        </li>
        <li>
          <strong>angular.configs.tsRecommended</strong>: Angular selector
          validation, lifecycle method rules, Standalone component preferences
        </li>
        <li>
          <strong>angular.configs.templateRecommended</strong>: Template syntax
          validation, binding syntax, structural directive usage
        </li>
        <li>
          <strong>angular.configs.templateAccessibility</strong>: Accessibility
          rules (ARIA, alt text, labels)
        </li>
      </ul>
      <h3>Selector Rules in Flat Config</h3>
      <p>
        <strong>Directives:</strong>
      </p>
      <CodeBlock language="javascript">
        {`
            "@angular-eslint/directive-selector": [
                "error",
                {
                    type: "attribute",    // ← Directives are attributes
                    prefix: "app",        // ← Your app prefix
                    style: "camelCase"    // ← Style: appMyDirective
                }
            ],
        `}
      </CodeBlock>
      <p>
        <strong>Example:</strong>
      </p>
      <CodeBlock language="typescript">
        {`
            // Correct
            @Directive({
                selector: '[appHighlight]',
                standalone: true
            })

            // Incorrect
            @Directive({
                selector: '[highlight]'  // Missing 'app' prefix
            })
        `}
      </CodeBlock>
      <p>
        <strong>Components:</strong>
      </p>
      <CodeBlock language="javascript">
        {`
            "@angular-eslint/component-selector": [
                "error",
                {
                    type: "element",      // ← Components are elements
                    prefix: "app",        // ← Your app prefix
                    style: "kebab-case"   // ← Style: app-my-component
                }
            ],
        `}
      </CodeBlock>
      <p>
        <strong>Example (Angular 19 Standalone):</strong>
      </p>
      <CodeBlock language="typescript">
        {`
            // Correct - Standalone component
            @Component({
                selector: "app-user-card",
                standalone: true,
                imports: [CommonModule],
            })
            export class UserCardComponent {}

            // Incorrect
            @Component({
                selector: "userCard", // Doesn't use kebab-case or prefix
            })
            export class UserCardComponent {}
        `}
      </CodeBlock>
      <h3>Rules — Useful Angular 19 Rules (Flat Config)</h3>
      <h4>Adding Custom Rules</h4>
      <p>
        You can add custom rules to your <code>eslint.config.js</code>:
      </p>
      <CodeBlock language="javascript">
        {`
            module.exports = tseslint.config(
                {
                    files: ["**/*.ts"],
                    extends: [
                        eslint.configs.recommended,
                        ...tseslint.configs.recommended,
                        ...tseslint.configs.stylistic,
                        ...angular.configs.tsRecommended,
                    ],
                    processor: angular.processInlineTemplates,
                    rules: {
                        "@angular-eslint/directive-selector": [
                            "error",
                            {
                                type: "attribute",
                                prefix: "app",
                                style: "camelCase",
                            },
                        ],
                        "@angular-eslint/component-selector": [
                            "error",
                            {
                                type: "element",
                                prefix: "app",
                                style: "kebab-case",
                            },
                        ],
                        "@angular-eslint/no-output-on-prefix": "error",
                        "@angular-eslint/no-output-native": "error",
                        "@angular-eslint/no-input-rename": "error",
                        "@angular-eslint/use-lifecycle-interface": "error",
                        "@angular-eslint/prefer-on-push-component-change-detection": "warn",

                        // TypeScript Rules
                        "@typescript-eslint/no-explicit-any": "warn",
                        "@typescript-eslint/explicit-function-return-type": "error",
                        "@typescript-eslint/explicit-module-boundary-types": "error",
                        "@typescript-eslint/explicit-member-accessibility": [
                            "error",
                            {
                                accessibility: "explicit",
                                overrides: {
                                    constructors: "no-public",
                                },
                            },
                        ],
                        "no-console": "warn",

                        // Import ordering
                        "sort-imports": [
                            "error",
                            {
                                ignoreCase: false,
                                ignoreDeclarationSort: true,
                                ignoreMemberSort: false,
                                memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
                                allowSeparatedGroups: true,
                            },
                        ],

                        // Naming Convention Rules
                        "@typescript-eslint/naming-convention": [
                            "error",
                            {
                                selector: "variable",
                                format: ["camelCase", "UPPER_CASE"],
                            },
                            {
                                selector: "property",
                                format: ["camelCase"],
                            },
                            {
                                selector: "method",
                                format: ["camelCase"],
                            },
                            {
                                selector: "typeLike",
                                format: ["PascalCase"],
                            },
                        ],
                    },
                },
                {
                    files: ["**/*.html"],
                    extends: [
                        ...angular.configs.templateRecommended,
                        ...angular.configs.templateAccessibility,
                    ],
                    rules: {
                        // Template Rules
                        "@angular-eslint/template/no-negated-async": "error",
                        "@angular-eslint/template/eqeqeq": "error",
                        "@angular-eslint/template/banana-in-box": "error",
                        "@angular-eslint/template/accessibility-alt-text": "warn",
                        "@angular-eslint/template/accessibility-label-for": "warn",
                        "@angular-eslint/template/click-events-have-key-events": "warn",
                    },
                }
            );
        `}
      </CodeBlock>
      <h3>Rule Examples Explained</h3>
      <p>
        <strong>prefer-signals</strong>: Recommend using Signals over
        traditional observables
      </p>
      <CodeBlock language="typescript">
        {`
            // Warning - Old approach
            export class UserComponent {
                userName = "";
                @Input() title = "";
            }

            // Better - Using Signals (Angular 19)
            export class UserComponent {
                userName = signal("");
                title = input<string>(""); // New input() function
            }
        `}
      </CodeBlock>
      <p>
        <strong>no-output-on-prefix</strong>: Do not use &quot;on&quot; prefix
        in Outputs
      </p>
      <CodeBlock language="typescript">
        {`
            // Incorrect - Using decorator
            @Output() onClick = new EventEmitter();

            // Correct - Using new output() function (Angular 19)
            userClick = output<User>();  // New output() function
        `}
      </CodeBlock>
      <p>
        <strong>use-lifecycle-interface</strong>: Implement lifecycle interfaces
      </p>
      <CodeBlock language="typescript">
        {`
            // Incorrect
            export class MyComponent {
                ngOnInit() {}
            }

            // Correct
            export class MyComponent implements OnInit {
                ngOnInit() {}
            }
        `}
      </CodeBlock>

      <p>
        <strong>prefer-on-push-component-change-detection</strong>: Recommends
        OnPush
      </p>
      <CodeBlock language="typescript">
        {`
            // Warning
            @Component({
                selector: 'app-my-component',
                standalone: true,
                templateUrl: './my-component.html'
            })

            // Better performance with Signals
            @Component({
                selector: 'app-my-component',
                standalone: true,
                templateUrl: './my-component.html',
                changeDetection: ChangeDetectionStrategy.OnPush  // Works great with Signals
            })
        `}
      </CodeBlock>

      <h3>HTML Templates</h3>

      <CodeBlock language="json">
        {`
            {
                "@angular-eslint/template/no-negated-async": "error",
                "@angular-eslint/template/eqeqeq": "error",
                "@angular-eslint/template/banana-in-box": "error",
                "@angular-eslint/template/accessibility-alt-text": "warn"
            }
        `}
      </CodeBlock>
      <p>
        <strong>Explanation:</strong>
      </p>
      <p>
        <strong>no-negated-async</strong>: Do not negate async pipes
      </p>

      <CodeBlock language="html">
        {`
            <!-- Incorrect -->
            <div *ngIf="!(user$ | async)">No user</div>

            <!-- Correct -->
            <div *ngIf="(user$ | async) === null">No user</div>
        `}
      </CodeBlock>
      <p>
        <strong>eqeqeq</strong>: Use === in templates
      </p>

      <CodeBlock language="html">
        {`
            <!-- Incorrect -->
            <div *ngIf="status == 'active'">Active</div>

            <!-- Correct -->
            <div *ngIf="status === 'active'">Active</div>
        `}
      </CodeBlock>
      <p>
        <strong>banana-in-box</strong>: Detects common ngModel error
      </p>

      <CodeBlock language="html">
        {`
            <!-- Incorrect (inverted parentheses) -->
            <input ([ngModel])="name" />

            <!-- Correct -->
            <input [(ngModel)]="name" />
        `}
      </CodeBlock>
      <p>
        <strong>accessibility-alt-text</strong>: Requires alt on images
      </p>

      <CodeBlock language="html">
        {`
            <!-- Incorrect -->
            <img [src]="userAvatar" />

            <!-- Correct -->
            <img [src]="userAvatar" [alt]="userName" />
        `}
      </CodeBlock>

      <>
        <h3 id="step-4-configure-prettier-for-angular">
          Step 4 — Configure Prettier for Angular
        </h3>
        <p>
          Prettier is an opinionated code formatter that enforces a consistent
          style across your codebase. It supports TypeScript, HTML, CSS/SCSS,
          and JSON files, making it ideal for Angular projects. By integrating
          Prettier with ESLint, you can ensure that your code is not only free
          of linting errors but also consistently formatted according to your
          preferences. In this step, we will set up Prettier in your Angular 19
          project and configure it to work seamlessly with the new ESLint flat
          config.
        </p>
        <h3>Why Prettier for Angular?</h3>
        <ul className="list-disc pl-6">
          <li>
            TypeScript files (<code>.ts</code>)
          </li>
          <li>
            HTML templates (<code>.html</code>)
          </li>
          <li>
            SCSS/CSS files (<code>.scss</code>, <code>.css</code>)
          </li>
          <li>JSON configuration files</li>
        </ul>
        <h3>Install Prettier</h3>
        <CodeBlock language="bash">
          {`
            npm install --save-dev prettier eslint-config-prettier
          `}
        </CodeBlock>
        <h3>
          Create <code>.prettierrc</code> Configuration
        </h3>
        <p>
          Create <code>.prettierrc</code> at project root:
        </p>
        <CodeBlock language="json">
          {`
            {
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
              "htmlWhitespaceSensitivity": "css",
              "overrides": [
                {
                  "files": "*.html",
                  "options": {
                    "parser": "angular",
                    "printWidth": 120
                  }
                },
                {
                  "files": "*.component.html",
                  "options": {
                    "parser": "angular"
                  }
                }
              ]
            }
          `}
        </CodeBlock>
        <h3>Prettier Configuration Explained</h3>
        <strong>Angular-Specific Options</strong>
        <ul className="list-disc pl-6">
          <li>
            <strong>htmlWhitespaceSensitivity: &quot;css&quot;</strong>
            <ul className="list-disc pl-6">
              <li>
                Respects CSS <code>display</code> property for whitespace
              </li>
              <li>Better for Angular templates with inline styles</li>
            </ul>
          </li>
          <li>
            <strong>Override for HTML Templates:</strong>
            <CodeBlock language="json">
              {`
                {
                  "files": "*.html",
                  "options": {
                      "parser": "angular",
                      "printWidth": 120
                }
              }
          `}
            </CodeBlock>
          </li>
          <li>
            <strong>
              Why <code>printWidth: 120</code> for HTML?
            </strong>
            <ul className="list-disc pl-6">
              <li>Angular templates often have long attribute bindings</li>
              <li>120 chars prevents excessive line breaks</li>
            </ul>
          </li>
        </ul>
        <h4>Examples</h4>
        <strong>
          TypeScript files (<code>.ts</code>) - Angular 19 with Signals:
        </strong>
        <CodeBlock language="typescript">
          {`
            import { Component, signal, input, output } from "@angular/core";

            @Component({
                selector: "app-user",
                standalone: true,
                templateUrl: "./user.component.html",
            })
            export class UserComponent {
                userName = signal("John Doe");
                userId = input.required<string>();
                userSelected = output<string>();

                selectUser() {
                    this.userSelected.emit(this.userId());
                }
            }
        `}
        </CodeBlock>
        <strong>
          HTML templates (<code>.html</code>) - Angular 19 Syntax:
        </strong>
        <CodeBlock language="html">
          {`
            <!-- Uses Angular parser with printWidth: 120 -->
            @if (user(); as user) {
            <div
                class="user-card"
                [class.active]="user.isActive"
                (click)="selectUser(user)"
            >
                <h2>{{ user.name }}</h2>
                <p>{{ user.email }}</p>
            </div>
            }

            <!-- Old syntax still supported -->
            <div class="user-card" *ngIf="user$ | async as user">
                <h2>{{ user.name }}</h2>
            </div>
          `}
        </CodeBlock>
        <h3>
          Create <code>.prettierignore</code>
        </h3>
        <CodeBlock language="bash">
          {`
            # Dependencies
            node_modules/

            # Build outputs
            dist/
            .angular/
            coverage/

            # Cache
            .cache/
            .vscode/

            # Logs
            *.log
        `}
        </CodeBlock>
        <h3>Integration — Integrate Prettier with ESLint Flat Config</h3>
        <p>
          With ESLint 9 flat config, Prettier integration is simpler. Install
          the plugin:
        </p>
        <CodeBlock language="bash">
          {`
            npm install --save-dev eslint-config-prettier
          `}
        </CodeBlock>
        <p>
          Update your <code>eslint.config.js</code> to include Prettier:
        </p>
        <CodeBlock language="javascript">
          {`
            // @ts-check

            module.exports = tseslint.config(
                {
                    files: ["**/*.ts"],
                    extends: [
                        eslint.configs.recommended,
                        ...tseslint.configs.recommended,
                        ...tseslint.configs.stylistic,
                        ...angular.configs.tsRecommended,
                        prettier, // ← Disable conflicting rules with Prettier
                    ],
                    processor: angular.processInlineTemplates,
                    rules: {
                        // Your custom rules
                    },
                },
                {
                    files: ["**/*.html"],
                    extends: [
                        ...angular.configs.templateRecommended,
                        ...angular.configs.templateAccessibility,
                        prettier, // ← Disable conflicting rules for templates too
                    ],
                    rules: {},
                }
            );
`}
        </CodeBlock>
        <p>
          <strong>Important:</strong> Add <code>prettier</code> at the{" "}
          <strong>end</strong> of the <code>extends</code> array to ensure it
          disables any conflicting ESLint rules.
        </p>
        <h3>VSCode Settings for Angular</h3>
        <p>
          Create or update <code>.vscode/settings.json</code>:
        </p>
        <CodeBlock language="json">
          {`
            {
                "editor.defaultFormatter": "esbenp.prettier-vscode",
                "editor.formatOnSave": true,
                "editor.codeActionsOnSave": {
                    "source.fixAll.eslint": "explicit"
                },
                "[typescript]": {
                    "editor.defaultFormatter": "esbenp.prettier-vscode"
                },
                "[html]": {
                    "editor.defaultFormatter": "esbenp.prettier-vscode"
                },
                "[scss]": {
                    "editor.defaultFormatter": "esbenp.prettier-vscode"
                },
                "[json]": {
                    "editor.defaultFormatter": "esbenp.prettier-vscode"
                }
            }
        `}
        </CodeBlock>
        <h3>
          Add Scripts to <code>package.json</code>
        </h3>
        <CodeBlock language="json">
          {`
            {
                "scripts": {
                    "ng": "ng",
                    "start": "ng serve",
                    "build": "ng build",
                    "test": "ng test",
                    "lint": "ng lint",
                    "lint:fix": "ng lint --fix",
                    "format": "prettier --write \\"src/**/*.{ts,html,scss,json}\\"",
                    "format:check": "prettier --check \\"src/**/*.{ts,html,scss,json}\\"
                }
            }
          `}
        </CodeBlock>
        <h3>Test Prettier</h3>
        <strong>Format all files:</strong>
        <CodeBlock language="bash">
          {`
          npm run format
        `}
        </CodeBlock>
        <strong>Check formatting:</strong>
        <CodeBlock language="bash">
          {`
          npm run format:check
        `}
        </CodeBlock>
        <h3 id="step-5-setup-husky-and-lint-staged">
          Step 5 — Setup Husky and lint-staged
        </h3>
        <p>
          Husky and lint-staged allow you to run ESLint and Prettier on staged
          files before they are committed. This ensures that only linted and
          formatted code is committed to your repository, improving code quality
          and consistency across your Angular project. In this step, we will set
          up Husky to create Git hooks and lint-staged to run ESLint and
          Prettier on the files you are trying to commit.
        </p>
        <h3>Why Husky and lint-staged for Angular?</h3>
        <ul className="list-disc pl-6">
          <li>Run ESLint only on staged files (fast)</li>
          <li>Format code with Prettier before commit</li>
          <li>Prevent bad code from entering the repository</li>
          <li>Ensure consistent code quality across the team</li>
        </ul>
        <h3>Install Dependencies</h3>
        <CodeBlock language="bash">
          {`
            npm install --save-dev husky lint-staged
          `}
        </CodeBlock>
        <h3>Initialize Husky</h3>
        <CodeBlock language="bash">
          {`
          npx husky init
        `}
        </CodeBlock>
        <h3>Configure lint-staged</h3>
        <p>
          Add to <code>package.json</code>:
        </p>
        <CodeBlock language="json">
          {`
            {
            "lint-staged": {
                "*.ts": ["eslint --fix --max-warnings=0", "prettier --write"],
                "*.html": ["prettier --write"],
                "*.{scss,css}": ["prettier --write"],
                "*.{json,md}": ["prettier --write"]
            }
            }
          `}
        </CodeBlock>
        <h3>Create Pre-Commit Hook</h3>
        <p>
          Edit <code>.husky/pre-commit</code>:
        </p>
        <CodeBlock language="bash">
          {`
          npx lint-staged
        `}
        </CodeBlock>
        <h3>Update package.json Scripts</h3>
        <CodeBlock language="json">
          {`
            {
                "scripts": {
                    "ng": "ng",
                    "start": "ng serve",
                    "build": "ng build",
                    "test": "ng test",
                    "lint": "ng lint",
                    "lint:fix": "ng lint --fix",
                    "format": "prettier --write \\"src/**/*.{ts,html,scss,json}\\"",
                    "format:check": "prettier --check \\"src/**/*.{ts,html,scss,json}\\"",
                    "prepare": "husky install"
                }
            }
        `}
        </CodeBlock>
        <h3>Test the Setup</h3>
        <ol className="list-decimal pl-6 space-y-4">
          <li>
            <strong>Make a change to a file:</strong>
            <CodeBlock language="bash">
              {`
                echo "console.log('test')" >> src/app/app.component.ts
              `}
            </CodeBlock>
          </li>
          <li>
            <strong>Stage the file:</strong>
            <CodeBlock language="bash">
              {`
                git add src/app/app.component.ts
              `}
            </CodeBlock>
          </li>
          <li>
            <strong>Try to commit:</strong>
            <CodeBlock language="bash">
              {`
                git commit -m "test: verify hooks work"
              `}
            </CodeBlock>
          </li>
        </ol>
        <div>
          <strong>Expected result:</strong>
          <ul className="list-disc pl-6">
            <li>ESLint will check the file</li>
            <li>Prettier will format the file</li>
            <li>If errors exist, commit will be blocked</li>
          </ul>
        </div>
        <h2 id="useful-commands">Useful Commands</h2>
        <h3>Linting Commands</h3>
        <strong>Check all files:</strong>
        <CodeBlock language="bash">
          {`
          ng lint
        `}
        </CodeBlock>
        <strong>Check specific project (workspace):</strong>
        <CodeBlock language="bash">
          {`
          ng lint project-name
        `}
        </CodeBlock>
        <strong>Auto-fix issues:</strong>
        <CodeBlock language="bash">
          {`
          ng lint --fix
        `}
        </CodeBlock>
        <strong>Check only modified files:</strong>
        <CodeBlock language="bash">
          {`
            ng lint --files="src/app/components/**/*.ts"
          `}
        </CodeBlock>
        <h3>Formatting Commands</h3>
        <strong>Format all files:</strong>
        <CodeBlock language="bash">
          {`
          npm run format
        `}
        </CodeBlock>
        <strong>Check formatting (CI/CD):</strong>
        <CodeBlock language="bash">
          {`
          npm run format:check
        `}
        </CodeBlock>
        <strong>Format specific folder:</strong>
        <CodeBlock language="bash">
          {`
            prettier --write "src/app/components/**/*.{ts,html,scss}"
          `}
        </CodeBlock>
        <h2 id="angular-19-new-features-and-syntax">
          Angular 19: New Features and Syntax
        </h2>
        <h3>Signals - Modern Reactive State</h3>
        <strong>Old approach (still works):</strong>
        <CodeBlock language="typescript">
          {`
            export class UserComponent {
                userName = "John";

                updateName(newName: string) {
                    this.userName = newName; // Manual change detection
                }
            }
        `}
        </CodeBlock>
        <strong>New approach with Signals (Angular 19 recommended):</strong>
        <CodeBlock language="typescript">
          {`
          import { Component, signal, computed } from "@angular/core";

          export class UserComponent {
            userName = signal("John");
            userNameUpper = computed(() => this.userName().toUpperCase());

            updateName(newName: string) {
              this.userName.set(newName); // Automatic reactive updates
            }
          }
        `}
        </CodeBlock>
        <h3>Modern Input/Output Functions</h3>
        <strong>Old approach with decorators:</strong>
        <CodeBlock language="typescript">
          {`
            export class UserCardComponent {
                @Input() userId!: string;
                @Input() userName = "";
                @Output() userSelected = new EventEmitter<string>();
            }
        `}
        </CodeBlock>
        <strong>New approach with functions (Angular 19):</strong>
        <CodeBlock language="typescript">
          {`
            import { Component, input, output } from "@angular/core";

            export class UserCardComponent {
                userId = input.required<string>(); // Required input
                userName = input<string>(""); // Optional with default
                userSelected = output<string>(); // Output event

                selectUser() {
                    this.userSelected.emit(this.userId());
                }
            }
        `}
        </CodeBlock>
        <h3>New Control Flow Syntax</h3>
        <strong>
          Old syntax (<code>*ngIf</code>, <code>*ngFor</code>):
        </strong>
        <CodeBlock language="html">
          {`
            <div *ngIf="user">
        <h2>{{ user.name }}</h2>
    </div>

    <ul className="list-disc pl-6">
        <li *ngFor="let item of items">{{ item }}</li>
    </ul>
`}
        </CodeBlock>
        <strong>New syntax (Angular 17+, optimized in 19):</strong>
        <CodeBlock language="html">
          {`
            @if (user) {
    <div>
        <h2>{{ user.name }}</h2>
    </div>
    } @for (item of items; track item.id) {
    <li>{{ item }}</li>
    } @switch (status) { @case ('active') {
    <span>Active</span>
    } @case ('inactive') {
    <span>Inactive</span>
    } @default {
    <span>Unknown</span>
    } }
`}
        </CodeBlock>
        <h3>Generating Components in Angular 19</h3>
        <strong>Generate standalone component (default):</strong>
        <CodeBlock language="bash">
          {`
            ng generate component user-profile
            # or short form
            ng g c user-profile
        `}
        </CodeBlock>
        <strong>Generated component (Angular 19):</strong>
        <CodeBlock language="typescript">
          {`
    import { Component } from "@angular/core";

    @Component({
        selector: "app-user-profile",
        standalone: true,
        imports: [CommonModule],
        templateUrl: "./user-profile.component.html",
        styleUrl: "./user-profile.component.scss",
    })
    export class UserProfileComponent {}
`}
        </CodeBlock>
        <strong>Generate with inline template:</strong>
        <CodeBlock language="bash">
          {`
            ng g c user-card --inline-template --inline-style
          `}
        </CodeBlock>
        <h2 id="migration-from-older-angular-versions">
          Migration from Older Angular Versions
        </h2>
        <h3>Step 1 — Update to Angular 19</h3>
        <CodeBlock language="bash">
          {`
            ng update @angular/core@19 @angular/cli@19
          `}
        </CodeBlock>
        <h3>Step 2 — Migrate to Standalone Components</h3>
        <CodeBlock language="bash">
          {`
            ng generate @angular/core:standalone
          `}
        </CodeBlock>
        <ul className="list-disc pl-6">
          <li>Converts components to standalone</li>
          <li>Updates imports and providers</li>
          <li>Removes NgModules</li>
          <li>Updates routing configuration</li>
        </ul>
        <h3>Step 3 — Adopt Signals (Optional but Recommended)</h3>
        <p>
          Manual migration of <code>@Input()</code> to <code>input()</code>:
        </p>
        <CodeBlock language="typescript">
          {`
            // Before
            @Input() userName = '';

            // After
            userName = input<string>('');
        `}
        </CodeBlock>
        <p>
          Manual migration of <code>@Output()</code> to <code>output()</code>:
        </p>
        <CodeBlock language="typescript">
          {`
            // Before
            @Output() userClick = new EventEmitter<User>();

            // After
            userClick = output<User>();
            `}
        </CodeBlock>
        <h2 id="recommended-complete-configuration-for-angular-19-flat-config">
          Recommended Complete Configuration for Angular 19 (Flat Config)
        </h2>

        <p>
          Here is the complete <code>eslint.config.js</code> with all
          recommended rules:
        </p>

        <CodeBlock language="javascript">
          {`
            // @ts-check

            module.exports = tseslint.config({
                files: ["**/*.ts"],
                extends: [
                    eslint.configs.recommended,
                    ...tseslint.configs.recommended,
                    ...tseslint.configs.stylistic,
                    ...angular.configs.tsRecommended,
                    prettier,
                ],
                processor: angular.processInlineTemplates,
                rules: {
                    "@angular-eslint/directive-selector": [
                        "error",
                        { type: "attribute", prefix: "app", style: "camelCase" },
                    ],
                    "@angular-eslint/component-selector": [
                        "error",
                        { type: "element", prefix: "app", style: "kebab-case" },
                    ],
                    "@angular-eslint/no-output-on-prefix": "error",
                    "@angular-eslint/no-output-native": "error",
                    "@angular-eslint/no-input-rename": "error",
                    "@angular-eslint/use-lifecycle-interface": "error",
                    "@angular-eslint/prefer-on-push-component-change-detection": "warn",
                    "@typescript-eslint/no-explicit-any": "warn",
                    "@typescript-eslint/explicit-function-return-type": "off",
                    "no-console": "warn",
                },
            },
            {
                files: ["**/*.html"],
                extends: [
                    ...angular.configs.templateRecommended,
                    ...angular.configs.templateAccessibility,
                    prettier,
                ],
                rules: {
                    "@angular-eslint/template/no-negated-async": "error",
                    "@angular-eslint/template/eqeqeq": "error",
                    "@angular-eslint/template/banana-in-box": "error",
                    "@angular-eslint/template/accessibility-alt-text": "warn",
                    "@angular-eslint/template/accessibility-label-for": "warn",
                    "@angular-eslint/template/accessibility-elements-content": "warn",
                    "@angular-eslint/template/click-events-have-key-events": "warn",
                },
            });
        `}
        </CodeBlock>
        <h3>
          <code>package.json</code> (Complete Example)
        </h3>
        <strong>Dependencies (Angular 19.2.x):</strong>
        <CodeBlock language="json">
          {`
        {
          "name": "my-angular-app",
          "version": "0.0.0",
          "private": true,
          "dependencies": {
            "@angular/common": "^19.2.0",
            "@angular/compiler": "^19.2.0",
            "@angular/core": "^19.2.0",
            "@angular/forms": "^19.2.0",
            "@angular/platform-browser": "^19.2.0",
            "@angular/platform-browser-dynamic": "^19.2.0",
            "@angular/router": "^19.2.0",
            "rxjs": "~7.8.0",
            "tslib": "^2.3.0",
            "zone.js": "~0.15.0"
          }
        }
          `}
        </CodeBlock>
        <strong>DevDependencies (after ESLint + Prettier + Husky):</strong>
        <CodeBlock language="json">
          {`
        {
          "devDependencies": {
            "@angular-devkit/build-angular": "^19.2.17",
            "@angular/cli": "^19.2.17",
            "@angular/compiler-cli": "^19.2.0",
            "@types/jasmine": "~5.1.0",
            "angular-eslint": "20.5.1",
            "eslint": "^9.38.0",
            "eslint-config-prettier": "^9.1.0",
            "husky": "^9.0.11",
            "jasmine-core": "~5.6.0",
            "karma": "~6.4.0",
            "karma-chrome-launcher": "~3.2.0",
            "karma-coverage": "~2.2.0",
            "karma-jasmine": "~5.1.0",
            "karma-jasmine-html-reporter": "~2.1.0",
            "lint-staged": "^15.2.2",
            "prettier": "^3.2.5",
            "typescript": "~5.7.2",
            "typescript-eslint": "8.46.2"
          }
        }
          `}
        </CodeBlock>
        <strong>Scripts:</strong>
        <CodeBlock language="json">
          {`
        {
          "scripts": {
            "ng": "ng",
            "start": "ng serve",
            "build": "ng build",
            "watch": "ng build --watch --configuration development",
            "test": "ng test",
            "lint": "ng lint",
            "lint:fix": "ng lint --fix",
            "format": "prettier --write \\"src/**/*.{ts,html,scss,json}\\"",
            "format:check": "prettier --check \\"src/**/*.{ts,html,scss,json}\\"",
            "prepare": "husky install"
          }
        }
          `}
        </CodeBlock>
        <strong>Key observations:</strong>
        <ul className="list-disc pl-6">
          <li>
            <code>angular-eslint</code> is a{" "}
            <strong>single unified package</strong>
          </li>
          <li>
            Angular 19.2.x uses <strong>RxJS 7.8</strong> and{" "}
            <strong>zone.js 0.15</strong>
          </li>
          <li>
            Testing setup includes <strong>Jasmine 5.1</strong> and{" "}
            <strong>Karma 6.4</strong>
          </li>
          <li>
            TypeScript <strong>5.7.2</strong> is the current version for Angular
            19
          </li>
          <li>
            <code>watch</code> script included by default for continuous builds
          </li>
        </ul>
        <h3>
          <code>.prettierrc</code>
        </h3>
        <CodeBlock language="json">
          {`
            {
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
                "htmlWhitespaceSensitivity": "css",
                "overrides": [
                    {
                        "files": "*.html",
                        "options": {
                            "parser": "angular",
                            "printWidth": 120
                        }
                    }
                ]
            }
        `}
        </CodeBlock>
        <h3>
          <code>lint-staged</code> Configuration (add to package.json)
        </h3>
        <CodeBlock language="json">
          {`
            {
                "lint-staged": {
                "*.ts": ["eslint --fix --max-warnings=0", "prettier --write"],
                "*.html": ["prettier --write"],
                "*.{scss,css}": ["prettier --write"],
                "*.{json,md}": ["prettier --write"]
                }
            }
        `}
        </CodeBlock>
        <h3>
          <code>.husky/pre-commit</code>
        </h3>
        <CodeBlock language="bash">
          {`
          npx lint-staged
        `}
        </CodeBlock>
        <h3>
          <code>.vscode/settings.json</code>
        </h3>
        <CodeBlock language="json">
          {`
        {
          "editor.defaultFormatter": "esbenp.prettier-vscode",
          "editor.formatOnSave": true,
          "editor.codeActionsOnSave": {
            "source.fixAll.eslint": "explicit"
          },
          "[typescript]": {
            "editor.defaultFormatter": "esbenp.prettier-vscode"
          },
          "[html]": {
            "editor.defaultFormatter": "esbenp.prettier-vscode"
          },
          "[scss]": {
            "editor.defaultFormatter": "esbenp.prettier-vscode"
          }
        }
          `}
        </CodeBlock>
        <h2 id="resources">Resources</h2>
        <h3>Angular 19</h3>
        <ul className="list-disc pl-6">
          <li>
            <a href="https://angular.io/docs" target="_blank" rel="noopener">
              Angular Official Docs
            </a>
          </li>
          <li>
            <a href="https://angular.io/cli" target="_blank" rel="noopener">
              Angular CLI
            </a>
          </li>
          <li>
            <a
              href="https://angular.io/guide/styleguide"
              target="_blank"
              rel="noopener"
            >
              Angular Style Guide
            </a>
          </li>
          <li>
            <a
              href="https://angular.io/guide/signals"
              target="_blank"
              rel="noopener"
            >
              Angular Signals Guide
            </a>
          </li>
          <li>
            <a
              href="https://angular.io/guide/standalone-components"
              target="_blank"
              rel="noopener"
            >
              Standalone Components Guide
            </a>
          </li>
          <li>
            <a href="https://blog.angular.io/" target="_blank" rel="noopener">
              Angular 19 Release Notes
            </a>
          </li>
        </ul>
        <h3>New Angular 19 Features</h3>
        <ul className="list-disc pl-6">
          <li>
            <a
              href="https://angular.io/guide/signals"
              target="_blank"
              rel="noopener"
            >
              Signals Documentation
            </a>
          </li>
          <li>
            <a
              href="https://angular.io/api/core/input"
              target="_blank"
              rel="noopener"
            >
              New input() function
            </a>
          </li>
          <li>
            <a
              href="https://angular.io/api/core/output"
              target="_blank"
              rel="noopener"
            >
              New output() function
            </a>
          </li>
          <li>
            <a
              href="https://angular.io/guide/control-flow"
              target="_blank"
              rel="noopener"
            >
              Control Flow Syntax
            </a>
          </li>
          <li>
            <a
              href="https://angular.io/guide/defer"
              target="_blank"
              rel="noopener"
            >
              Deferrable Views
            </a>
          </li>
        </ul>
        <h3>ESLint for Angular</h3>
        <ul className="list-disc pl-6">
          <li>
            <a
              href="https://github.com/angular-eslint/angular-eslint"
              target="_blank"
              rel="noopener"
            >
              Angular ESLint GitHub
            </a>
          </li>
          <li>
            <a
              href="https://github.com/angular-eslint/angular-eslint/tree/main/packages/eslint-plugin"
              target="_blank"
              rel="noopener"
            >
              Angular ESLint Rules
            </a>
          </li>
          <li>
            <a
              href="https://github.com/angular-eslint/angular-eslint/tree/main/packages/eslint-plugin-template"
              target="_blank"
              rel="noopener"
            >
              Template Rules
            </a>
          </li>
          <li>
            <a
              href="https://angular.io/guide/standalone-migration"
              target="_blank"
              rel="noopener"
            >
              Standalone Migration Guide
            </a>
          </li>
        </ul>
        <h3>Prettier</h3>
        <ul className="list-disc pl-6">
          <li>
            <a href="https://prettier.io/" target="_blank" rel="noopener">
              Prettier Official Docs
            </a>
          </li>
          <li>
            <a
              href="https://github.com/prettier/plugin-angular"
              target="_blank"
              rel="noopener"
            >
              Prettier Angular Parser
            </a>
          </li>
        </ul>
        <h3>Development Tools</h3>
        <ul className="list-disc pl-6">
          <li>
            <a
              href="https://typicode.github.io/husky/"
              target="_blank"
              rel="noopener"
            >
              Husky
            </a>
          </li>
          <li>
            <a
              href="https://github.com/okonet/lint-staged"
              target="_blank"
              rel="noopener"
            >
              lint-staged
            </a>
          </li>
        </ul>
        <h2 id="next-steps">Next Steps</h2>
        <h3>Ready For Production Checklist</h3>
        <ul className="list-disc pl-6">
          <li>
            Run typecheck:
            <CodeBlock language="bash">{`pnpm exec tsc --noEmit`}</CodeBlock>
          </li>
          <li>
            Run linter and fix issues:
            <CodeBlock language="bash">{`pnpm exec eslint "app/**/*.{ts,tsx}"`}</CodeBlock>
          </li>
          <li>
            Run formatter check:
            <CodeBlock language="bash">{`pnpm exec prettier --check "src/**/*.{ts,tsx,html,scss,json}"`}</CodeBlock>
          </li>
          <li>
            Build the app:
            <CodeBlock language="bash">{`pnpm exec ng build --configuration production`}</CodeBlock>
          </li>
          <li>Run unit and e2e smoke tests (Jasmine/Karma or Playwright)</li>
          <li>Verify CI passes and pre-commit hooks (Husky) are installed</li>
        </ul>
        <ol className="list-decimal pl-6 space-y-4">
          <li>
            Read the common tool guides for deeper understanding:
            <ul className="list-disc pl-6">
              <li>
                <a href="../common/eslint.md">ESLint</a> - General ESLint
                concepts
              </li>
              <li>
                <a href="../common/prettier.md">Prettier</a> - Advanced Prettier
                configuration
              </li>
              <li>
                <a href="../common/husky.md">Husky</a> - More Git hooks examples
              </li>
              <li>
                <a href="../common/lint-staged.md">lint-staged</a> - Advanced
                configurations
              </li>
            </ul>
          </li>
          <li>
            Learn about Angular 19 best practices:
            <ul className="list-disc pl-6">
              <li>Standalone component architecture</li>
              <li>
                <strong>Signals-based state management</strong> (recommended
                over NgRx for simple cases)
              </li>
              <li>
                New <code>input()</code> and <code>output()</code> functions
              </li>
              <li>
                Reactive programming with RxJS (still important for async
                operations)
              </li>
              <li>
                Deferrable views with <code>@defer</code>
              </li>
              <li>Server-Side Rendering (SSR) with Angular Universal</li>
            </ul>
          </li>
          <li>
            Set up additional tooling:
            <ul className="list-disc pl-6">
              <li>
                Unit testing with Jasmine/Karma or <strong>Jest</strong> (modern
                alternative)
              </li>
              <li>
                E2E testing with <strong>Playwright</strong> (recommended) or
                Cypress
              </li>
              <li>CI/CD pipelines with GitHub Actions or Azure DevOps</li>
            </ul>
          </li>
          <li>
            Explore related setups:
            <ul className="list-disc pl-6">
              <li>
                <a href="../common/editorconfig.md">EditorConfig</a> - Editor
                consistency
              </li>
              <li>Backend integration (.NET, Node.js)</li>
            </ul>
          </li>
        </ol>
      </>
    </PostLayout>
  );
}
