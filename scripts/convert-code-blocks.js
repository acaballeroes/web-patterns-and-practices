#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const exts = new Set([".md", ".mdx", ".tsx", ".jsx", ".ts", ".js"]);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".git") continue;
      walk(full);
    } else {
      if (exts.has(path.extname(e.name))) files.push(full);
    }
  }
}

const files = [];
walk(root);

const fenceRegex = /```([a-zA-Z0-9+\-_.]*)?\n([\s\S]*?)\n```/g;

// Normalize <CodeBlock> wrappers that use template literal form {`...`} so
// the opening `{\`` and closing ``}` are on their own lines and the inner
// code is indented consistently relative to the existing indentation.
const codeBlockTemplateRegex =
  /(^[ \t]*)(<CodeBlock[^>]*>)[ \t]*\{`([\s\S]*?)`\}[ \t]*(<\/CodeBlock>)/gm;

function normalizeTemplateBlocks(content) {
  return content.replace(
    codeBlockTemplateRegex,
    (match, indent, openTag, code, closeTag) => {
      // Trim excessive leading/trailing blank lines inside the code
      let trimmed = code.replace(/^\n+|\n+$/g, "");
      const lines = trimmed.split(/\r?\n/);
      // Prefix each code line with four extra spaces plus the existing indent
      const prefixed = lines.map((l) => indent + "    " + l).join("\n");
      // Construct normalized block where the `{` and backtick are alone on their line
      return (
        indent +
        openTag +
        "\n" +
        indent +
        "{`\n" +
        prefixed +
        "\n" +
        indent +
        "`}\n" +
        indent +
        closeTag
      );
    },
  );
}

let updatedCount = 0;
for (const file of files) {
  let content = fs.readFileSync(file, "utf8");

  // First, convert triple-backticks to <CodeBlock> (as before)
  let newContent = content.replace(fenceRegex, (match, lang, code) => {
    lang = lang || "";
    const langAttr = lang ? ' language="' + lang + '"' : "";
    return (
      "<CodeBlock" +
      langAttr +
      ">\n{`" +
      "\n" +
      code +
      "\n" +
      "`}\n</CodeBlock>"
    );
  });

  // Then normalize any {`...`} template blocks so they follow the desired layout
  newContent = normalizeTemplateBlocks(newContent);

  // Also normalize inline {`...`} occurrences where the code is on the same line
  const inlineTemplateRegex = /(^[ \t]*)\{`([^\n]*?)`\}/gm;
  newContent = newContent.replace(
    inlineTemplateRegex,
    (match, indent, codeInline) => {
      const trimmed = codeInline.trim();
      return indent + "{`\n" + indent + "    " + trimmed + "\n" + indent + "`}";
    },
  );

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, "utf8");
    console.log("Updated:", path.relative(root, file));
    updatedCount++;
  }
}

console.log(`Done. Files updated: ${updatedCount}`);
