#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const baseUrl = process.env.FLORATRACK_BASE_URL || "http://localhost:3000";

const requiredRoutes = [
  "/",
  "/command-center",
  "/dashboard-clasico",
  "/estado-app",
  "/bho",
  "/live-rosin",
  "/bubble-hash",
  "/post-extraccion",
  "/ica",
  "/invima",
  "/peas",
  "/minjusticia",
  "/fne",
  "/dian",
  "/reportes-programados",
  "/riesgos",
  "/cambios",
  "/workflows",
  "/regulatoria-api",
  "/regulatorio",
  "/documentos",
  "/firmas",
  "/part11",
  "/backups",
  "/integraciones",
  "/calidad",
  "/desviaciones",
  "/inventario",
  "/recepcion",
  "/cultivos",
  "/propagacion",
  "/cosecha",
  "/geneticas",
  "/predios",
  "/empresas",
  "/gis",
  "/reportes",
  "/notificaciones",
  "/csv",
  "/usuarios",
  "/recall",
  "/retencion",
  "/residuos",
  "/saneamiento",
  "/plagas",
  "/proveedores",
  "/equipos",
  "/entrenamiento"
];

const errorPatterns = [
  [/This page could not be found/i, "Página 404 detectada"],
  [/Module not found/i, "Module not found"],
  [/Build Error/i, "Build Error"],
  [/Hydration failed/i, "Hydration failed"],
  [/Recoverable Error/i, "Recoverable Error"],
  [/ReferenceError/i, "ReferenceError"],
  [/SyntaxError/i, "SyntaxError"],
  [/TypeError:\s/i, "TypeError"],
  [/Cannot find module/i, "Cannot find module"],
  [/Unhandled Runtime Error/i, "Unhandled Runtime Error"],
  [/Failed to compile/i, "Failed to compile"]
];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readText(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

function normalizeRoute(route) {
  if (!route || route === "") return "/";
  if (!route.startsWith("/")) return `/${route}`;
  return route;
}

function routeToPagePath(route) {
  const normalized = normalizeRoute(route);

  if (normalized === "/") {
    return path.join(root, "src", "app", "page.tsx");
  }

  const segments = normalized.split("/").filter(Boolean);
  return path.join(root, "src", "app", ...segments, "page.tsx");
}

function unique(values) {
  return Array.from(new Set(values));
}

function extractHrefs(source) {
  const hrefs = [];
  const regex = /href:\s*["'`]([^"'`]+)["'`]/g;
  let match;

  while ((match = regex.exec(source)) !== null) {
    const href = normalizeRoute(match[1]);

    if (
      href.startsWith("/") &&
      !href.startsWith("/api") &&
      !href.startsWith("/_next")
    ) {
      hrefs.push(href);
    }
  }

  return hrefs;
}

async function getRoutesFromCommandRegistry(errors) {
  const registryPath = path.join(root, "src", "lib", "floratrackCommandModules.ts");

  if (!(await exists(registryPath))) {
    errors.push("No existe src/lib/floratrackCommandModules.ts");
    return [];
  }

  const source = await readText(registryPath);
  const hrefs = extractHrefs(source);

  if (hrefs.length === 0) {
    errors.push("No se encontraron rutas href en src/lib/floratrackCommandModules.ts");
  }

  const duplicates = hrefs.filter((href, index) => hrefs.indexOf(href) !== index);

  for (const duplicated of unique(duplicates)) {
    errors.push(`Ruta duplicada en Command Center: ${duplicated}`);
  }

  return unique(hrefs);
}

async function checkNextConfig(errors) {
  const nextConfigPath = path.join(root, "next.config.ts");
  const source = await readText(nextConfigPath);

  if (!source) {
    errors.push("No existe next.config.ts");
    return;
  }

  if (!/devIndicators\s*:\s*false/.test(source)) {
    errors.push("next.config.ts no tiene devIndicators: false. El indicador flotante puede seguir apareciendo.");
  }
}

async function checkRouteFiles(routes, errors) {
  for (const route of routes) {
    const pagePath = routeToPagePath(route);

    if (!(await exists(pagePath))) {
      errors.push(`Falta archivo page.tsx para ruta ${route}: ${path.relative(root, pagePath)}`);
    }
  }
}

async function checkDangerousImports(errors) {
  const filesToCheck = [
    path.join(root, "src", "app", "dashboard-clasico", "page.tsx"),
    path.join(root, "src", "app", "page.tsx"),
    path.join(root, "src", "app", "command-center", "page.tsx")
  ];

  for (const filePath of filesToCheck) {
    const source = await readText(filePath);
    if (!source) continue;

    if (source.includes("../components/floratrack/PremiumUI")) {
      errors.push(`Import incorrecto detectado en ${path.relative(root, filePath)}: ../components/floratrack/PremiumUI`);
    }

    if (source.includes("./components/floratrack/PremiumUI")) {
      errors.push(`Import incorrecto detectado en ${path.relative(root, filePath)}: ./components/floratrack/PremiumUI`);
    }
  }
}

async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "floratrack-functional-check"
      }
    });

    const text = await response.text();

    return {
      ok: response.ok,
      status: response.status,
      text
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function waitForServer(errors) {
  const url = `${baseUrl}/`;

  for (let attempt = 1; attempt <= 20; attempt += 1) {
    try {
      const result = await fetchWithTimeout(url, 5000);

      if (result.status >= 200 && result.status < 500) {
        return true;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  errors.push(`Servidor no disponible en ${baseUrl}. Verifica que npm run dev esté corriendo.`);
  return false;
}

async function checkHttpRoutes(routes, errors) {
  for (const route of routes) {
    const url = `${baseUrl}${route}`;

    try {
      const result = await fetchWithTimeout(url);

      if (!result.ok) {
        errors.push(`Ruta ${route} respondió HTTP ${result.status}`);
        continue;
      }

      for (const [pattern, label] of errorPatterns) {
        if (pattern.test(result.text)) {
          errors.push(`Ruta ${route} contiene error: ${label}`);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`Ruta ${route} no pudo probarse: ${message}`);
    }
  }
}

async function main() {
  const errors = [];

  const commandRoutes = await getRoutesFromCommandRegistry(errors);
  const routes = unique([...requiredRoutes, ...commandRoutes]).sort();

  await checkNextConfig(errors);
  await checkRouteFiles(routes, errors);
  await checkDangerousImports(errors);

  const serverReady = await waitForServer(errors);

  if (serverReady) {
    await checkHttpRoutes(routes, errors);
  }

  if (errors.length > 0) {
    console.error("");
    console.error("FLORATRACK FUNCTIONAL CHECK - ERRORES DETECTADOS");
    console.error("================================================");
    console.error(`Base URL: ${baseUrl}`);
    console.error(`Proyecto: ${root}`);
    console.error("");

    for (const error of errors) {
      console.error(`- ${error}`);
    }

    console.error("");
    process.exit(1);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("");
  console.error("FLORATRACK FUNCTIONAL CHECK - ERROR INESPERADO");
  console.error("==============================================");
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  console.error("");
  process.exit(1);
});
