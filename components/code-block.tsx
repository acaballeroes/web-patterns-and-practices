// ...existing code...
"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
}

function dedentString(raw: string) {
  // eliminar solo un salto de línea inicial y final si existen
  const trimmed = raw.replace(/^\n/, "").replace(/\n\s*$/, "");
  const lines = trimmed.split("\n");
  const indents = lines
    .filter((l) => l.trim().length > 0)
    .map((l) => l.match(/^(\s*)/)![1].length);
  const minIndent = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(minIndent)).join("\n");
}

export function CodeBlock({ children, language = "bash" }: CodeBlockProps) {
  const code = React.Children.toArray(children)
    .map((c) =>
      typeof c === "string" || typeof c === "number" ? String(c) : "",
    )
    .join("");
  const dedented = dedentString(code);

  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(dedented);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silencioso en fallo; se podría mejorar mostrando un error
    }
  };

  return (
    <div style={{ position: "relative", margin: "1rem 0" }}>
      <button
        onClick={handleCopy}
        aria-label={copied ? "Copiado" : "Copiar código"}
        title={copied ? "Copiado" : "Copiar"}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: "transparent",
          border: "none",
          padding: 6,
          borderRadius: 6,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "none",
        }}
      >
        {copied ? (
          <Check size={16} className="text-zinc-400 dark:text-zinc-300" />
        ) : (
          <Copy size={16} className="text-zinc-400 dark:text-zinc-300" />
        )}
      </button>

      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          padding: "1rem",
          paddingTop: "1.5rem", // dejar espacio para el botón
          margin: 0,
        }}
        showLineNumbers={true}
        lineNumberStyle={{
          color: "#6B7280",
          fontSize: "0.75rem",
        }}
      >
        {dedented}
      </SyntaxHighlighter>
    </div>
  );
}
// ...existing code...
