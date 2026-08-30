import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("dist");
const entryFile = path.join(outputDirectory, "index.html");
const routes = ["impressum", "datenschutz"];

for (const route of routes) {
  const routeDirectory = path.join(outputDirectory, route);
  await mkdir(routeDirectory, { recursive: true });
  await copyFile(entryFile, path.join(routeDirectory, "index.html"));
}

console.log(`Created static entries for: ${routes.map((route) => `/${route}/`).join(", ")}`);
