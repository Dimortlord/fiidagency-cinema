import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("dist");
const entryFile = path.join(outputDirectory, "index.html");
const sourceHtml = await readFile(entryFile, "utf8");
const legalRoutes = ["impressum", "datenschutz"];

const localeMeta = {
  uk: {
    title: "FIID Cinema — ваша історія стає мультфільмом",
    description: "Персональні 3D-мультфільми за вашою справжньою історією — для весілля, річниці та дня народження. Ульм, Баден-Вюртемберг.",
    ogLocale: "uk_UA",
  },
  en: {
    title: "FIID Cinema — your story becomes an animated film",
    description: "Personalised 3D animated films based on your true story — for weddings, anniversaries and birthdays. Ulm, Baden-Württemberg.",
    ogLocale: "en_GB",
  },
  de: {
    title: "FIID Cinema — Ihre Geschichte wird zum Animationsfilm",
    description: "Personalisierte 3D-Animationsfilme nach Ihrer wahren Geschichte — für Hochzeit, Jahrestag und Geburtstag. Ulm, Baden-Württemberg.",
    ogLocale: "de_DE",
  },
};

function localizedHtml(locale, meta) {
  const canonical = `https://cinema.fiidagency.com/${locale}/`;
  return sourceHtml
    .replace('<html lang="ru">', `<html lang="${locale}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${meta.description}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${meta.title}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${meta.description}" />`)
    .replace(/<meta property="og:locale" content="[^"]*" \/>/, `<meta property="og:locale" content="${meta.ogLocale}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${meta.title}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`);
}

function withRouteCanonical(html, route) {
  const canonical = `https://cinema.fiidagency.com/${route.replace(/^\/+|\/+$/g, "")}/`;
  return html
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`);
}

async function writeRoute(route, html) {
  const routeDirectory = path.join(outputDirectory, route);
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(path.join(routeDirectory, "index.html"), html);
}

for (const route of legalRoutes) {
  await writeRoute(route, withRouteCanonical(sourceHtml, route));
}

for (const [locale, meta] of Object.entries(localeMeta)) {
  const html = localizedHtml(locale, meta);
  await writeRoute(locale, html);
  for (const route of legalRoutes) {
    const localizedRoute = `${locale}/${route}`;
    await writeRoute(localizedRoute, withRouteCanonical(html, localizedRoute));
  }
}

const routes = [
  ...legalRoutes,
  ...Object.keys(localeMeta).flatMap((locale) => [locale, ...legalRoutes.map((route) => `${locale}/${route}`)]),
];
console.log(`Created static entries for: ${routes.map((route) => `/${route}/`).join(", ")}`);
