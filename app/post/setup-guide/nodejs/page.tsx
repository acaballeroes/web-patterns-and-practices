import { CodeBlock } from "@/components/code-block";
import { PostLayout } from "@/components/post-layout";
import { getArticlesByPostAndSlug } from "@/lib/blog-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Node.js Installation Guide - Dev Patterns & Practices",
  description:
    "Node.js installation and environment setup: installers, NVM, NodeSource, and best practices for development.",
};

export default function Page() {
  const article = getArticlesByPostAndSlug("setup-guide", "nodejs");
  console.log("Article data:", article); // Debug log to check article data

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
        Node.js is the JavaScript runtime required for modern web development.
        This guide covers multiple installation methods, including the official
        installers, the NodeSource repository, and using NVM (Node Version
        Manager). It also explains common commands and recommended versions for
        production and development.
      </p>

      <h3>TL;DR</h3>
      <p>
        Install an LTS Node.js version (use NVM for local development). Prefer
        `pnpm` for monorepos and faster installs; use `nvm` or `.nvmrc` to pin
        project versions. Verify with `node --version` and your package
        manager's version.
      </p>

      <h2>What is Node.js?</h2>
      <p>
        <strong>Node.js</strong> is a JavaScript runtime built on Chrome&apos;s
        V8 engine. It allows you to run JavaScript on the server, use npm to
        manage packages, and run development tools such as ESLint, Prettier, and
        build systems used by frameworks like Next.js, Angular, and React.
      </p>

      <h2>Recommended Node.js Version</h2>
      <p>Always prefer LTS versions for production. Current recommendations:</p>
      <ul className="list-disc pl-6">
        <li>
          <strong>20.x (LTS)</strong> — Recommended for most production projects
        </li>
        <li>
          <strong>18.x (LTS)</strong> — Use for legacy projects with older
          dependencies
        </li>
        <li>
          <strong>21.x+</strong> — Experimental; use only for testing new
          features
        </li>
      </ul>

      <h3>Quick Version Check</h3>
      <CodeBlock language="bash">{"node --version\n npm --version"}</CodeBlock>

      <h2>Installation Methods Overview</h2>
      <p>Common installation methods and trade-offs:</p>
      <ul className="list-disc pl-6">
        <li>
          <strong>Official installer</strong> — Simple, single version
        </li>
        <li>
          <strong>NVM</strong> — Recommended for developers; easy multiple
          versions and per-project switching
        </li>
        <li>
          <strong>NodeSource / distro packages</strong> — Good for servers and
          system package management
        </li>
      </ul>

      <h2>Method 1 — Official Installer (Windows & Linux)</h2>
      <p>
        Download the LTS installer from{" "}
        <a href="https://nodejs.org">nodejs.org</a>.
      </p>

      <h3>Windows (Installer)</h3>
      <p>
        Run the downloaded <code>.msi</code> and follow the prompts. After
        installation verify with:
      </p>
      <CodeBlock language="powershell">
        {"node --version  # e.g. v20.x.x\n npm --version   # e.g. 10.x.x"}
      </CodeBlock>

      <h3>Linux (binary / installer)</h3>
      <p>
        On some distributions you can download the binary or use the official
        installer. Example (manual binary):
      </p>
      <CodeBlock language="bash">
        {
          "# Download Node.js tarball (example)\ncd /tmp\nwget https://nodejs.org/dist/v20.11.0/node-v20.11.0-linux-x64.tar.xz\n\n# Extract and install (example)\ntar -xf node-v20.11.0-linux-x64.tar.xz\nsudo mv node-v20.11.0-linux-x64 /usr/local/nodejs\nsudo ln -s /usr/local/nodejs/bin/node /usr/local/bin/node\nsudo ln -s /usr/local/nodejs/bin/npm /usr/local/bin/npm\n\n# Verify\nnode --version\nnpm --version"
        }
      </CodeBlock>

      <h2>Method 2 — NodeSource (Debian/Ubuntu / RHEL/Fedora)</h2>
      <p>
        The NodeSource repository provides up-to-date Node.js packages for many
        Linux distributions. Example for Debian/Ubuntu:
      </p>
      <CodeBlock language="bash">
        {
          "# Update\nsudo apt update\n\n# Install curl if needed\nsudo apt install -y curl\n\n# Add NodeSource setup for Node 20.x\ncurl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\n\n# Install Node.js\nsudo apt install -y nodejs\n\n# Verify\nnode --version\nnpm --version"
        }
      </CodeBlock>

      <p>For Fedora/RHEL use the NodeSource RPM script:</p>
      <CodeBlock language="bash">
        {
          "curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -\nsudo dnf install -y nodejs"
        }
      </CodeBlock>

      <h2>Method 3 — NVM (Recommended for Developers)</h2>
      <p>
        NVM (Node Version Manager) lets you install and switch between multiple
        Node.js versions without sudo. It is the recommended approach for local
        development and per-project versioning.
      </p>

      <h3>Install NVM (Linux / macOS)</h3>
      <CodeBlock language="bash">
        {
          '# Install script (recommended)\ncurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash\n\n# Then load nvm (example for Bash)\nexport NVM_DIR="$HOME/.nvm"\n[ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"\n\n# Verify\nnvm --version'
        }
      </CodeBlock>

      <h3>Using NVM</h3>
      <CodeBlock language="bash">
        {
          "# List remote versions\nnvm ls-remote\n\n# Install LTS\nnvm install --lts\n\n# Use a specific version\nnvm use 20.11.0\n\n# Set default\nnvm alias default 20.11.0\n\n# Verify\nnode --version\nnpm --version"
        }
      </CodeBlock>

      <h3>Windows</h3>
      <p>
        Use the nvm-windows project for a similar workflow on Windows. Download
        the installer from the project releases and follow the installer
        prompts.
      </p>

      <h2>Using .nvmrc for Project-Specific Versions</h2>
      <p>
        Add a <code>.nvmrc</code> file to your project root containing the
        desired Node version (for example <code>20.11.0</code> or
        <code>lts/*</code>). Use <code>nvm use</code> to switch to the version
        specified in the file.
      </p>
      <CodeBlock language="bash">
        {"# .nvmrc example\n20.11.0\n\n# Use the version in project\nnvm use"}
      </CodeBlock>

      <h2>Package Manager Notes</h2>
      <p>
        npm is included with Node.js. If you prefer other package managers,
        install them globally after installing Node.js (for example
        <code>pnpm</code> or <code>yarn</code>).
      </p>
      <CodeBlock language="bash">
        {
          "# Install pnpm\nnpm install -g pnpm\n\n# Install yarn\nnpm install -g yarn"
        }
      </CodeBlock>

      <h2>Troubleshooting</h2>
      <ul className="list-disc pl-6">
        <li>
          <strong>Command not found:</strong> Make sure the Node binary is on
          your PATH. Re-open your terminal after an installer or NVM install.
        </li>
        <li>
          <strong>Permissions errors:</strong> Prefer NVM to avoid sudo for
          global installs, or configure a user-level npm prefix.
        </li>
        <li>
          <strong>node-gyp build errors:</strong> Install system build tools
          (build-essential on Linux, or Visual Studio Build Tools on Windows).
        </li>
      </ul>

      <h2>Quick Verification Checklist</h2>
      <CodeBlock language="bash">
        {
          "# Check Node & npm\nnode --version\nnpm --version\n\n# pnpm equivalents\npnpm --version\n\n# Test a quick script\nnode -e \"console.log('hello node')\"\n\n# Create test project (npm)\nmkdir test-node && cd test-node\nnpm init -y\nnpm install lodash\nnode -e \"const _ = require('lodash'); console.log(_.VERSION)\"\n\n# Create test project (pnpm)\nmkdir pnpm-test && cd pnpm-test\npnpm init -y\npnpm add lodash\nnode -e \"const _ = require('lodash'); console.log(_.VERSION)\""
        }
      </CodeBlock>

      <h2>Ready For Production</h2>
      <ul className="list-disc pl-6">
        <li>Pin Node version with `.nvmrc` and document it in README</li>
        <li>Use a lockfile (`pnpm-lock.yaml` / `package-lock.json`)</li>
        <li>Add `tsc --noEmit`, `eslint`, and `prettier --check` to CI</li>
        <li>Run integration tests and build before release</li>
        <li>Ensure devs use NVM or the documented installer process</li>
      </ul>

      <h2>Resources</h2>
      <ul>
        <li>
          <a
            href="https://nodejs.org/"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between gap-3 rounded-lg p-3 bg-white/5 hover:bg-sky-500/8 transition-colors border border-white/6 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          >
            <span className="font-medium text-sky-400">
              Node.js Official Site
            </span>
          </a>
        </li>
        <li>
          <a
            href="https://github.com/nvm-sh/nvm"
            target="_blank"
            rel="noopener"
            className="flex items-center justify-between gap-3 rounded-lg p-3 bg-white/5 hover:bg-sky-500/8 transition-colors border border-white/6 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          >
            <span className="font-medium text-sky-400">
              nvm (Node Version Manager)
            </span>
          </a>
        </li>
      </ul>
    </PostLayout>
  );
}
