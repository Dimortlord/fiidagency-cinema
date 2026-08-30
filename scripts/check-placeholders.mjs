import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

const outputDir = join(process.cwd(), "dist");
const textExtensions = new Set([".css", ".html", ".js", ".json", ".svg", ".txt", ".xml"]);
const unresolved = [];

function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      inspect(path);
      continue;
    }
    if (!textExtensions.has(extname(entry.name).toLowerCase())) continue;
    if (readFileSync(path, "utf8").includes("{{")) {
      unresolved.push(relative(outputDir, path));
    }
  }
}

inspect(outputDir);

if (unresolved.length > 0) {
  console.error(`Unresolved template placeholders found in: ${unresolved.join(", ")}`);
  process.exit(1);
}

console.log("No unresolved template placeholders found in dist.");
